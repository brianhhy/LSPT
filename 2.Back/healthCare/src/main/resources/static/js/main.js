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
    let moveToPosition = null;
    const moveSpeed = 0.05;
    const walkAnimSpeed = 1.0;
    const positionThreshold = 0.1; // 목표 위치에 도달했는지 확인하는 임계값

    let npc1; // NPC 캐릭터
    let npc2;
    let npc3;
    let npc4;
    let doctor;

    let collisionBox;  // 충돌 구역 박스git
    let collisionBox2; // 충돌 구역 박스 2
    let collisionBox3; // 충돌 구역 박스 3
    let isCollisionCheckEnabled = false;  // 충돌 검사 활성화 여부
    let hasCollided = false; // 첫 충돌 여부 확인 플래그
    let hasCollided2 = false; // 첫 충돌 여부 확인 플래그 (collisionBox2)
    let hasCollided3 = false; // 첫 충돌 여부 확인 플래그 (collisionBox3)

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



        // 충돌 구역 박스 생성
        collisionBox = BABYLON.MeshBuilder.CreateBox("collisionBox", { size: 2 }, scene);
        collisionBox.position = new BABYLON.Vector3(6, 0.3, 9); // 충돌 박스 위치 설정
        collisionBox.visibility = 0; // 박스를 보이게 하기 위해 투명도를 설정

        // 충돌 구역 박스 2 생성
        collisionBox2 = BABYLON.MeshBuilder.CreateBox("collisionBox2", { size: 2 }, scene);
        collisionBox2.position = new BABYLON.Vector3(22, 0.3, 21); // 충돌 박스 2 위치 설정
        collisionBox2.visibility = 0; // 박스를 보이게 하기 위해 투명도를 설정

        // 충돌 구역 박스 3 생성
        collisionBox3 = BABYLON.MeshBuilder.CreateBox("collisionBox3", { size: 2 }, scene);
        collisionBox3.position = new BABYLON.Vector3(34, 0.3, 21); // 충돌 박스 3 위치 설정
        collisionBox3.visibility = 0; // 박스를 보이게 하기 위해 투명도를 설정



        // 맵 로드
        const assetsManager = new BABYLON.AssetsManager(scene);
        const meshTask = assetsManager.addMeshTask("map task", "", "/assets/", "mapmap.glb");
        meshTask.onSuccess = (task) => {
            task.loadedMeshes.forEach((mesh) => {
                console.log("Loaded Mesh ID:", mesh.id);
                mesh.position = new BABYLON.Vector3(0, 0.2, 0);
                mesh.scaling = new BABYLON.Vector3(1, 1, 1);
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
                player.position = new BABYLON.Vector3(15, 0.3, 15); // 초기 위치를 충돌 박스에서 떨어뜨리기
                player.scaling = new BABYLON.Vector3(1, 1, 1);

                walkAnim = animationGroups.find(animGroup => animGroup.name === "Walking");
                idleAnim = animationGroups.find(animGroup => animGroup.name === "Idle");

                if (walkAnim && idleAnim) {
                    idleAnim.start(true, 1.0, idleAnim.from, idleAnim.to, true);
                } else {
                    console.warn("Animations not found.");
                }

                camera.lockedTarget = player;

                // 일정 시간 후에 충돌 검사 활성화
                setTimeout(() => {
                    isCollisionCheckEnabled = true;
                }, 1000); // 1초 후 충돌 검사 활성화

                engine.runRenderLoop(() => {
                    if (moveToPosition) {
                        // 목표 위치까지 부드럽게 이동
                        const direction = moveToPosition.subtract(player.position).normalize();
                        const distance = BABYLON.Vector3.Distance(player.position, moveToPosition);

                        if (distance > positionThreshold) {
                            const newPosition = player.position.add(direction.scale(moveSpeed));

                            player.position.addInPlace(direction.scale(moveSpeed));
                            player.lookAt(moveToPosition);

                            if (playerSkeleton && walkAnim) {
                                walkAnim.start(true, walkAnimSpeed, walkAnim.from, walkAnim.to, true);
                            }

                            if (!checkCollision(newPosition) && !checkCollision2(newPosition) && !checkCollision3(newPosition)) {
                                player.position = newPosition;
                            }
                        } else {
                            player.position.copyFrom(moveToPosition);const newPosition = player.position.add(direction.scale(moveSpeed));
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


        // NPC 로드
        BABYLON.SceneLoader.ImportMesh("", "/assets/", "npc1.glb", scene, (meshes, particleSystems, skeletons, animationGroups) => {
            npc1 = meshes[0];
            npc1.position = new BABYLON.Vector3(9.062627378820114, 0.3, 11.011470688388643);  // 위치 설정
            npc1.scaling = new BABYLON.Vector3(1, 1, 1);   // 스케일 조정

            // rotationQuaternion이 있을 경우 삭제
            if (npc1.rotationQuaternion) {
                npc1.rotationQuaternion = null;
            }

            // NPC가 캐릭터의 생성위치를 쳐다보게 설정
            npc1.lookAt(new BABYLON.Vector3(15, 0.3, 15));


        });

        BABYLON.SceneLoader.ImportMesh("", "/assets/", "npc2.glb", scene, (meshes, particleSystems, skeletons, animationGroups) => {
            npc2 = meshes[0];
            npc2.position = new BABYLON.Vector3(17.5,0.3, 10.3);  // 위치 설정
            npc2.scaling = new BABYLON.Vector3(1, 1, 1);   // 스케일 조정

            // rotationQuaternion이 있을 경우 삭제
            if (npc2.rotationQuaternion) {
                npc2.rotationQuaternion = null;
            }

            // NPC가 현재 쳐다보는 방향의 반대 방향을 쳐다보게 설정 (Y축 회전)
            npc2.lookAt(new BABYLON.Vector3(15, 0.3, 15));


        });

        BABYLON.SceneLoader.ImportMesh("", "/assets/", "npc3.glb", scene, (meshes, particleSystems, skeletons, animationGroups) => {
            npc3 = meshes[0];
            npc3.position = new BABYLON.Vector3(12.1,0.3,12.4);  // 위치 설정
            npc3.scaling = new BABYLON.Vector3(1, 1, 1);   // 스케일 조정

            // rotationQuaternion이 있을 경우 삭제
            if (npc3.rotationQuaternion) {
                npc3.rotationQuaternion = null;
            }

            // NPC가 현재 쳐다보는 방향의 반대 방향을 쳐다보게 설정 (Y축 회전)
            npc3.lookAt(new BABYLON.Vector3(15, 0.3, 15));


        });

        BABYLON.SceneLoader.ImportMesh("", "/assets/", "npc4.glb", scene, (meshes, particleSystems, skeletons, animationGroups) => {
            npc4 = meshes[0];
            npc4.position = new BABYLON.Vector3(14.1,0.3,11.4);  // 위치 설정
            npc4.scaling = new BABYLON.Vector3(1, 1, 1);   // 스케일 조정

            // rotationQuaternion이 있을 경우 삭제
            if (npc4.rotationQuaternion) {
                npc4.rotationQuaternion = null;
            }

            // NPC가 현재 쳐다보는 방향의 반대 방향을 쳐다보게 설정 (Y축 회전)
            npc4.lookAt(new BABYLON.Vector3(15, 0.3, 15));


        });

        BABYLON.SceneLoader.ImportMesh("", "/assets/", "doctor.glb", scene, (meshes, particleSystems, skeletons, animationGroups) => {
            doctor = meshes[0];
            doctor.position = new BABYLON.Vector3(17.,0.3, 13.2);  // 위치 설정
            doctor.scaling = new BABYLON.Vector3(20, 20, 20);   // 스케일 조정

            // rotationQuaternion이 있을 경우 삭제
            if (doctor.rotationQuaternion) {
                doctor.rotationQuaternion = null;
            }

            // NPC가 현재 쳐다보는 방향의 반대 방향을 쳐다보게 설정 (Y축 회전)
            doctor.lookAt(new BABYLON.Vector3(15, 0.3, 15));


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

        console.log("Received message:", data);

        if (data.type === 'clientId') {
            playerId = data.playerId;
            console.log("Player ID received:", playerId);
        } else if (data.type === 'updatePosition') {

            console.log("Received updatePosition message");

            const updateId = data.playerId;
            console.log("UpdatePlayerId:", updateId);
            console.log("Position data:", data.position);

            if (updateId === playerId) {
                if (player) {
                    player.position.x = data.position.x;
                    player.position.y = data.position.y;
                    player.position.z = data.position.z;
                    console.log("Updated own position:", player.position);
                }
            } else {
                if (!otherPlayers[updateId]) {
                    // 새로운 플레이어 로드
                    BABYLON.SceneLoader.ImportMesh("", "/assets/", "other.glb", scene, (meshes, particleSystems, skeletons, animationGroups) => {
                        const newPlayer = meshes[0];
                        newPlayer.position = new BABYLON.Vector3(data.position.x, data.position.y, data.position.z);
                        newPlayer.scaling = new BABYLON.Vector3(0.8, 0.8, 0.8);
                        const newPlayerSkeleton = skeletons[0];
                        const newWalkAnim = animationGroups.find(animGroup => animGroup.name === "Walking");
                        const newIdleAnim = animationGroups.find(animGroup => animGroup.name === "Idle");

                        if (newWalkAnim && newIdleAnim) {
                            newWalkAnim.start(true, walkAnimSpeed, newWalkAnim.from, newWalkAnim.to, true);
                        } else {
                            console.warn("Animations not found.");
                        }

                        otherPlayers[updateId] = {
                            mesh: newPlayer,
                            skeleton: newPlayerSkeleton,
                            walkAnim: newWalkAnim,
                            idleAnim: newIdleAnim,
                            targetPosition: new BABYLON.Vector3(data.position.x, data.position.y, data.position.z),
                            previousPosition: newPlayer.position.clone(),
                            lastUpdateTime: Date.now()
                        };
                        console.log("Loaded new player:", updateId);
                    });
                } else {
                    // 기존 플레이어 업데이트
                    console.log("updatePosition");
                    const otherPlayer = otherPlayers[updateId];
                    const playerMesh = otherPlayer.mesh;
                    const now = Date.now();
                    const previousPosition = otherPlayer.previousPosition;
                    const elapsedTime = (now - otherPlayer.lastUpdateTime) / 1000;
                    const moveAmount = moveSpeed * elapsedTime;
                    const speed = moveSpeed * elapsedTime;

                    console.log("Elapsed time:", elapsedTime);
                    console.log("Move amount:", moveAmount);

                    const targetPosition = new BABYLON.Vector3(data.position.x, data.position.y, data.position.z);
                    const direction = targetPosition.subtract(playerMesh.position).normalize();
                    const distance = BABYLON.Vector3.Distance(playerMesh.position, targetPosition);

                    console.log("Direction:", direction);
                    console.log("Distance to target:", distance);

                    playerMesh.lookAt(targetPosition);
                    // 목표 위치에 도달
                    playerMesh.position.copyFrom(targetPosition);
                    if (playerMesh.skeleton && otherPlayer.walkAnim) {
                        // 걷기 애니메이션만 항상 실행
                        otherPlayer.walkAnim.start(true, walkAnimSpeed, otherPlayer.walkAnim.from, otherPlayer.walkAnim.to, true);
                    }

                    otherPlayer.targetPosition = targetPosition;
                    otherPlayer.lastUpdateTime = now;
                    console.log("Updated other player position:", playerMesh.position);
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


    const checkCollision = (newPosition) => {
        if (hasCollided) {
            return true; // 이미 충돌이 발생했으면 true 반환하고 더 이상 검사하지 않음
        }

        if (isCollisionCheckEnabled && player && player.isReady()) {  // 충돌 검사 활성화 여부와 로드 완료 확인
            if (newPosition && collisionBox.intersectsPoint(newPosition)) {
                console.log("Collision detected with collision box!"); // 충돌 시 로그 출력
                hasCollided = true; // 충돌이 발생했음을 기록
                window.location.href = "https://naver.com"; // 링크로 이동
                return true; // 충돌 시 true 반환
            }
        }

        return false; // 충돌이 없으면 false 반환
    };

    const checkCollision2 = (newPosition) => {
        if (hasCollided2) {
            return true; // 이미 충돌이 발생했으면 true 반환하고 더 이상 검사하지 않음
        }

        if (isCollisionCheckEnabled && player && player.isReady()) {  // 충돌 검사 활성화 여부와 로드 완료 확인
            if (newPosition && collisionBox2.intersectsPoint(newPosition)) {
                console.log("Collision detected with collision box 2!"); // 충돌 시 로그 출력
                hasCollided2 = true; // 충돌이 발생했음을 기록
                window.location.href = "https://google.com"; // 링크로 이동
                return true; // 충돌 시 true 반환
            }
        }

        return false; // 충돌이 없으면 false 반환
    };

    const checkCollision3 = (newPosition) => {
        if (hasCollided3) {
            return true; // 이미 충돌이 발생했으면 true 반환하고 더 이상 검사하지 않음
        }

        if (isCollisionCheckEnabled && player && player.isReady()) {  // 충돌 검사 활성화 여부와 로드 완료 확인
            if (newPosition && collisionBox3.intersectsPoint(newPosition)) {
                console.log("Collision detected with collision box 3!"); // 충돌 시 로그 출력
                hasCollided3 = true; // 충돌이 발생했음을 기록
                window.location.href = "https://daum.net"; // 링크로 이동
                return true; // 충돌 시 true 반환
            }
        }

        return false; // 충돌이 없으면 false 반환
    };

    canvas.addEventListener('pointerdown', (event) => {
        if (!player) return;

        const pickResult = scene.pick(scene.pointerX, scene.pointerY);
        if (pickResult.hit) {
            moveToPosition = pickResult.pickedPoint.clone();

            // y축 고정: 클릭한 위치의 y를 현재 플레이어의 y로 고정
            moveToPosition.y = player.position.y;

            if (playerSkeleton && walkAnim) {
                if (idleAnim) {
                    idleAnim.stop();
                }
                walkAnim.start(true, walkAnimSpeed, walkAnim.from, walkAnim.to, true);
            }

            player.lookAt(new BABYLON.Vector3(moveToPosition.x, player.position.y, moveToPosition.z));

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
        let moveDelta = new BABYLON.Vector3(0, 0, 0);


        switch(event.key) {
            case 'w':
                player.position.z += moveSpeed;
                targetPosition.z += 2;
                moved = true;
                break;
            case 's':
                player.position.z -= moveSpeed;
                targetPosition.z -= 2;
                moved = true;
                break;
            case 'a':
                player.position.x -= moveSpeed;
                targetPosition.x -= 2;
                moved = true;
                break;
            case 'd':
                player.position.x += moveSpeed;
                targetPosition.x += 2;
                moved = true;
                break;
        }

        if (moved) {
            const newPosition = player.position.add(moveDelta);
            if (!checkCollision(newPosition) && !checkCollision2(newPosition) && !checkCollision3(newPosition)) {
                player.position = newPosition;
                checkCollision(); // 이동할 때 충돌 감지
                checkCollision2(); // 이동할 때 충돌 감지
                checkCollision3();

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
