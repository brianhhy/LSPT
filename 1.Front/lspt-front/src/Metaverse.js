import React, { useEffect, useRef } from 'react';
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';



function Metaverse() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
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
        const positionThreshold = 0.1;

        let npc1, npc2, npc3, npc4, doctor;
        let collisionBox, collisionBox2, collisionBox3;
        let isCollisionCheckEnabled = false;
        let hasCollided = false, hasCollided2 = false, hasCollided3 = false;

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
            collisionBox.position = new BABYLON.Vector3(6, 0.3, 9);
            collisionBox.visibility = 0;

            collisionBox2 = BABYLON.MeshBuilder.CreateBox("collisionBox2", { size: 2 }, scene);
            collisionBox2.position = new BABYLON.Vector3(22, 0.3, 21);
            collisionBox2.visibility = 0;

            collisionBox3 = BABYLON.MeshBuilder.CreateBox("collisionBox3", { size: 2 }, scene);
            collisionBox3.position = new BABYLON.Vector3(34, 0.3, 21);
            collisionBox3.visibility = 0;

            // 맵 로드
            const assetsManager = new BABYLON.AssetsManager(scene);
            const meshTask = assetsManager.addMeshTask("map task", "", "./metaverse/", "mapmap.glb");
            meshTask.onSuccess = (task) => {
                task.loadedMeshes.forEach((mesh) => {
                    mesh.position = new BABYLON.Vector3(0, 0.2, 0);
                    mesh.scaling = new BABYLON.Vector3(1, 1, 1);
                });
            };
            meshTask.onError = (task, message, exception) => {
                console.error("Error loading .glb file:", message, exception);
            };

            assetsManager.load();

            // 플레이어 로드
            BABYLON.SceneLoader.ImportMesh("", "./metaverse/", "boy4.glb", scene, (meshes, particleSystems, skeletons, animationGroups) => {
                if (!player) {
                    player = meshes[0];
                    playerSkeleton = skeletons[0];
                    player.position = new BABYLON.Vector3(15, 0.3, 15);
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
                    }, 1000);

                    engine.runRenderLoop(() => {
                        if (moveToPosition) {
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

            // NPC 로드
            BABYLON.SceneLoader.ImportMesh("", "./metaverse/", "npc1.glb", scene, (meshes) => {
                npc1 = meshes[0];
                npc1.position = new BABYLON.Vector3(9.06, 0.3, 11.01);
                npc1.scaling = new BABYLON.Vector3(1, 1, 1);

                if (npc1.rotationQuaternion) {
                    npc1.rotationQuaternion = null;
                }

                npc1.lookAt(new BABYLON.Vector3(15, 0.3, 15));
            });

            BABYLON.SceneLoader.ImportMesh("", "./metaverse/", "npc2.glb", scene, (meshes) => {
                npc2 = meshes[0];
                npc2.position = new BABYLON.Vector3(17.5, 0.3, 10.3);
                npc2.scaling = new BABYLON.Vector3(1, 1, 1);

                if (npc2.rotationQuaternion) {
                    npc2.rotationQuaternion = null;
                }

                npc2.lookAt(new BABYLON.Vector3(15, 0.3, 15));
            });

            BABYLON.SceneLoader.ImportMesh("", "./metaverse/", "npc3.glb", scene, (meshes) => {
                npc3 = meshes[0];
                npc3.position = new BABYLON.Vector3(12.1, 0.3, 12.4);
                npc3.scaling = new BABYLON.Vector3(1, 1, 1);

                if (npc3.rotationQuaternion) {
                    npc3.rotationQuaternion = null;
                }

                npc3.lookAt(new BABYLON.Vector3(15, 0.3, 15));
            });

            BABYLON.SceneLoader.ImportMesh("", "./metaverse/", "npc4.glb", scene, (meshes) => {
                npc4 = meshes[0];
                npc4.position = new BABYLON.Vector3(14.1, 0.3, 11.4);
                npc4.scaling = new BABYLON.Vector3(1, 1, 1);

                if (npc4.rotationQuaternion) {
                    npc4.rotationQuaternion = null;
                }

                npc4.lookAt(new BABYLON.Vector3(15, 0.3, 15));
            });

            BABYLON.SceneLoader.ImportMesh("", "./metaverse/", "doctor.glb", scene, (meshes) => {
                doctor = meshes[0];
                doctor.position = new BABYLON.Vector3(17, 0.3, 13.2);
                doctor.scaling = new BABYLON.Vector3(20, 20, 20);

                if (doctor.rotationQuaternion) {
                    doctor.rotationQuaternion = null;
                }

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

            if (data.type === 'clientId') {
                playerId = data.playerId;
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
                        BABYLON.SceneLoader.ImportMesh("", "./metaverse/", "other.glb", scene, (meshes, _, skeletons, animationGroups) => {
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
                        });
                    } else {
                        const otherPlayer = otherPlayers[updateId];
                        const playerMesh = otherPlayer.mesh;
                        const now = Date.now();
                        const elapsedTime = (now - otherPlayer.lastUpdateTime) / 1000;

                        const targetPosition = new BABYLON.Vector3(data.position.x, data.position.y, data.position.z);
                        playerMesh.lookAt(targetPosition);
                        playerMesh.position.copyFrom(targetPosition);

                        if (playerMesh.skeleton && otherPlayer.walkAnim) {
                            otherPlayer.walkAnim.start(true, walkAnimSpeed, otherPlayer.walkAnim.from, otherPlayer.walkAnim.to, true);
                        }

                        otherPlayer.targetPosition = targetPosition;
                        otherPlayer.lastUpdateTime = now;
                    }
                }
            } else if (data.type === 'removePlayer') {
                const removeId = data.playerId;
                if (otherPlayers[removeId]) {
                    otherPlayers[removeId].mesh.dispose();
                    delete otherPlayers[removeId];
                }
            }
        };

        const checkCollision = (newPosition) => {
            if (hasCollided) return true;

            if (isCollisionCheckEnabled && player && player.isReady()) {
                if (newPosition && collisionBox.intersectsPoint(newPosition)) {
                    hasCollided = true;
                    window.location.href = "https://naver.com";
                    return true;
                }
            }
            return false;
        };

        const checkCollision2 = (newPosition) => {
            if (hasCollided2) return true;

            if (isCollisionCheckEnabled && player && player.isReady()) {
                if (newPosition && collisionBox2.intersectsPoint(newPosition)) {
                    hasCollided2 = true;
                    window.location.href = "https://google.com";
                    return true;
                }
            }
            return false;
        };

        const checkCollision3 = (newPosition) => {
            if (hasCollided3) return true;

            if (isCollisionCheckEnabled && player && player.isReady()) {
                if (newPosition && collisionBox3.intersectsPoint(newPosition)) {
                    hasCollided3 = true;
                    window.location.href = "https://daum.net";
                    return true;
                }
            }
            return false;
        };

        canvas.addEventListener('pointerdown', (event) => {
            if (!player) return;

            const pickResult = scene.pick(scene.pointerX, scene.pointerY);
            if (pickResult.hit) {
                moveToPosition = pickResult.pickedPoint.clone();
                moveToPosition.y = player.position.y;

                if (playerSkeleton && walkAnim) {
                    if (idleAnim) idleAnim.stop();
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

            switch (event.key) {
                case 'w':
                    targetPosition.z += 2;
                    moved = true;
                    break;
                case 's':
                    targetPosition.z -= 2;
                    moved = true;
                    break;
                case 'a':
                    targetPosition.x -= 2;
                    moved = true;
                    break;
                case 'd':
                    targetPosition.x += 2;
                    moved = true;
                    break;
            }

            if (moved) {
                const newPosition = player.position.add(targetPosition.subtract(player.position).normalize().scale(moveSpeed));
                if (!checkCollision(newPosition) && !checkCollision2(newPosition) && !checkCollision3(newPosition)) {
                    player.position = newPosition;
                    if (!isMoving) {
                        isMoving = true;
                        if (playerSkeleton && walkAnim) {
                            if (idleAnim) idleAnim.stop();
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

        return () => {
            engine.dispose();
            socket.close();
        };
    }, []);

    return (
        <canvas id="renderCanvas" ref={canvasRef} style={{ width: '1919px', height: '1297px' }}></canvas>
    );
}

export default Metaverse;
