window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);
    let player;
    let playerSkeleton;
    let walkAnim;
    let idleAnim;
    const otherPlayers = {};
    let isMoving = false;
    let playerId;
    let buildingMesh;
    let moveToPosition = null;
    const moveSpeed = 0.05;
    const walkAnimSpeed = 1.0;
    const positionThreshold = 0.1; // 목표 위치에 도달했는지 확인하는 임계값

    const createScene = () => {
        const scene = new BABYLON.Scene(engine);

        // 카메라 생성
        const camera = new BABYLON.FollowCamera("camera", new BABYLON.Vector3(0, 5, -10), scene);
        camera.lockedTarget = player;
        camera.radius = 10;
        camera.heightOffset = 5;
        camera.rotationOffset = -180;
        camera.cameraAcceleration = 0.01;
        camera.maxCameraSpeed = 20;
        camera.position = new BABYLON.Vector3(0, 2, -10);

        // 기본 조명
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

        // 맵 로드
        const assetsManager = new BABYLON.AssetsManager(scene);
        const meshTask = assetsManager.addMeshTask("map task", "", "/assets/", "realmap.glb");
        meshTask.onSuccess = (task) => {
            task.loadedMeshes.forEach((mesh) => {
                mesh.position = new BABYLON.Vector3(0, 0, 0);
                mesh.scaling = new BABYLON.Vector3(1, 1, 1);

                if (mesh.id === "Stylised low poly building.001") {
                    buildingMesh = mesh;
                }
            });
        };
        meshTask.onError = (task, message, exception) => {
            console.error("Error loading .glb file:", message, exception);
        };

        assetsManager.load();

        // 플레이어 로드
        BABYLON.SceneLoader.ImportMesh("", "/assets/", "boy4.glb", scene, (meshes, particleSystems, skeletons, animationGroups) => {
            if (!player) {
                player = meshes[0];
                playerSkeleton = skeletons[0];
                player.position = new BABYLON.Vector3(0, 0.6, 0);
                player.scaling = new BABYLON.Vector3(1, 1, 1);

                walkAnim = animationGroups.find(animGroup => animGroup.name === "Walking");
                idleAnim = animationGroups.find(animGroup => animGroup.name === "Idle");

                if (walkAnim && idleAnim) {
                    idleAnim.start(true, 1.0, idleAnim.from, idleAnim.to, true);
                } else {
                    console.warn("Animations not found.");
                }

                camera.lockedTarget = player;

                engine.runRenderLoop(() => {
                    if (moveToPosition) {
                        // 목표 위치까지 부드럽게 이동
                        const direction = moveToPosition.subtract(player.position).normalize();
                        const distance = BABYLON.Vector3.Distance(player.position, moveToPosition);

                        if (distance > positionThreshold) {
                            player.position.addInPlace(direction.scale(moveSpeed));
                        } else {
                            player.position.copyFrom(moveToPosition);
                            moveToPosition = null;

                            if (playerSkeleton && walkAnim) {
                                walkAnim.stop();
                                if (idleAnim) {
                                    idleAnim.start(true, 1.0, idleAnim.from, idleAnim.to, true);
                                }
                            }
                        }
                    }

                    scene.render();
                });
            }
        });

        return scene;
    };

    const scene = createScene();

    window.addEventListener('resize', () => {
        engine.resize();
    });

    const socket = new WebSocket("wss://localhost:8443/ws/player");

    socket.onopen = () => {
        console.log("Connected to WebSocket server");
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
        console.log("Disconnected from WebSocket server");
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'clientId') {
            playerId = data.playerId;
            console.log("Player ID received:", playerId);
        } else if (data.type === 'updatePosition') {
            const updateId = data.playerId;
            if (updateId === playerId) {
                if (player) {
                    player.position.x = data.position.x;
                    player.position.y = data.position.y;
                    player.position.z = data.position.z;
                }
            } else {
                if (!otherPlayers[updateId]) {
                    BABYLON.SceneLoader.ImportMesh("", "/assets/", "boy4.glb", scene, (meshes, particleSystems, skeletons, animationGroups) => {
                        const newPlayer = meshes[0];
                        newPlayer.position = new BABYLON.Vector3(data.position.x, data.position.y, data.position.z);
                        newPlayer.scaling = new BABYLON.Vector3(1, 1, 1);
                        const newPlayerSkeleton = skeletons[0];
                        const newWalkAnim = animationGroups.find(animGroup => animGroup.name === "Walking");
                        const newIdleAnim = animationGroups.find(animGroup => animGroup.name === "Idle");

                        if (newWalkAnim && newIdleAnim) {
                            newIdleAnim.start(true, 1.0, newIdleAnim.from, newIdleAnim.to, true);
                        }

                        otherPlayers[updateId] = {
                            mesh: newPlayer,
                            skeleton: newPlayerSkeleton,
                            walkAnim: newWalkAnim,
                            idleAnim: newIdleAnim,
                            previousPosition: newPlayer.position.clone(),
                            lastUpdateTime: Date.now()
                        };
                        console.log("Loaded new player:", updateId);
                    });
                } else {
                    const otherPlayer = otherPlayers[updateId];
                    const playerMesh = otherPlayer.mesh;
                    const now = Date.now();
                    const previousPosition = otherPlayer.previousPosition;
                    const elapsedTime = (now - otherPlayer.lastUpdateTime) / 1000;
                    const speed = moveSpeed * elapsedTime;

                    const currentPosition = new BABYLON.Vector3(data.position.x, data.position.y, data.position.z);
                    const direction = currentPosition.subtract(previousPosition).normalize();
                    const distance = BABYLON.Vector3.Distance(previousPosition, currentPosition);
                    const moveAmount = Math.min(distance, speed);

                    if (moveAmount > 0) {
                        playerMesh.position.addInPlace(direction.scale(moveAmount));
                        if (distance < moveAmount) {
                            playerMesh.position.copyFrom(currentPosition);
                        }
                    }

                    if (playerMesh.position.equals(currentPosition)) {
                        if (playerMesh.skeleton && otherPlayer.walkAnim) {
                            otherPlayer.walkAnim.stop();
                            if (otherPlayer.idleAnim) {
                                otherPlayer.idleAnim.start(true, 1.0, otherPlayer.idleAnim.from, otherPlayer.idleAnim.to, true);
                            }
                        }
                    } else {
                        if (playerMesh.skeleton && otherPlayer.idleAnim) {
                            otherPlayer.idleAnim.stop();
                            if (otherPlayer.walkAnim) {
                                otherPlayer.walkAnim.start(true, 1.0, otherPlayer.walkAnim.from, otherPlayer.walkAnim.to, true);
                            }
                        }
                    }

                    otherPlayer.previousPosition.copyFrom(currentPosition);
                    otherPlayer.lastUpdateTime = now;
                }
            }
        } else if (data.type === 'removePlayer') {
            const removeId = data.playerId;
            if (otherPlayers[removeId]) {
                otherPlayers[removeId].mesh.dispose();
                delete otherPlayers[removeId];
                console.log("Removed player:", removeId);
            }
        }
    };

    const checkCollision = () => {
        if (player && buildingMesh) {
            const playerPosition = player.position;
            const buildingPosition = buildingMesh.position;
            const distance = BABYLON.Vector3.Distance(playerPosition, buildingPosition);

            if (distance < 1.0) {
                console.log("Collision detected with building!");
            }
        }
    };

    canvas.addEventListener('pointerdown', (event) => {
        if (!player) return;

        const pickResult = scene.pick(scene.pointerX, scene.pointerY);
        if (pickResult.hit) {
            moveToPosition = pickResult.pickedPoint;
            if (playerSkeleton && walkAnim) {
                if (idleAnim) {
                    idleAnim.stop();
                }
                walkAnim.start(true, walkAnimSpeed, walkAnim.from, walkAnim.to, true);
            }

            player.lookAt(moveToPosition);

            socket.send(JSON.stringify({
                type: 'updatePosition',
                playerId: playerId,
                position: {
                    x: player.position.x,
                    y: player.position.y,
                    z: player.position.z
                }
            }));
        }
    });

    window.addEventListener('keydown', (event) => {
        let moved = false;
        let targetPosition = player.position.clone();

        switch(event.key) {
            case 'w':
                player.position.z += moveSpeed;
                targetPosition.z += 1;
                moved = true;
                break;
            case 's':
                player.position.z -= moveSpeed;
                targetPosition.z -= 1;
                moved = true;
                break;
            case 'a':
                player.position.x -= moveSpeed;
                targetPosition.x -= 1;
                moved = true;
                break;
            case 'd':
                player.position.x += moveSpeed;
                targetPosition.x += 1;
                moved = true;
                break;
        }

        if (moved) {
            if (checkCollision()) {
                console.log("Collision detected! Moving to a new link...");
                window.location.href = "https://naver.com";
                return;
            }

            if (!isMoving) {
                isMoving = true;
                if (playerSkeleton && walkAnim) {
                    if (idleAnim) {
                        idleAnim.stop();
                    }
                    walkAnim.start(true, walkAnimSpeed, walkAnim.from, walkAnim.to, true);
                }
            }

            player.lookAt(targetPosition);

            socket.send(JSON.stringify({
                type: 'updatePosition',
                playerId: playerId,
                position: {
                    x: player.position.x,
                    y: player.position.y,
                    z: player.position.z
                }
            }));
        }
    });

    window.addEventListener('keyup', () => {
        if (isMoving) {
            isMoving = false;
            if (playerSkeleton && walkAnim) {
                walkAnim.stop();
                if (idleAnim) {
                    idleAnim.start(true, 1.0, idleAnim.from, idleAnim.to, true);
                }
            }
        }
    });
});