import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function Contact() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // 1️⃣ 创建场景
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        // 2️⃣ 相机
        const camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        camera.position.set(0, 10, 0); // 高度 + 拉远一点
        camera.lookAt(0, 0, 0);

        // 3️⃣ 渲染器
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        // 4️⃣ 光源
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
        hemiLight.position.set(0, 1, 0);
        scene.add(hemiLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 2);
        dirLight.position.set(3, 3, 3);
        scene.add(dirLight);

        const dirLight2 = new THREE.DirectionalLight(0xffffff, 2);
        dirLight2.position.set(-3, 3, -3);
        scene.add(dirLight2);

        // 5️⃣ 加载金币模型
        const loader = new GLTFLoader();
        loader.load("/assets/coin.glb", (gltf) => {
            const coin = gltf.scene;

            coin.traverse((child) => {
                if (child.isMesh) {
                    // 金属材质
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0xd4af37, // 金色
                        metalness: 1,
                        roughness: 0.5, // 光滑高光
                    });
                }
            });

            scene.add(coin);

            // 6️⃣ 动画：金币缓慢自转
            const animate = () => {
                requestAnimationFrame(animate);
                coin.rotation.z += 0.01; // 绕y轴自转
                renderer.render(scene, camera);
            };
            animate();
        });

        // 7️⃣ 响应式窗口
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", handleResize);

        // 8️⃣ 卸载时清理
        return () => {
            window.removeEventListener("resize", handleResize);
            if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} className="w-[100vw] h-[100vh]" />;
}