'use client'

import React, { useEffect, useRef } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import gsap from "gsap"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { div } from "three/tsl"

export default function Contact() {

    const mountRef = useRef<HTMLDivElement>(null)
    const pageCurrentSection = useSelector((state: RootState) => state.currentPage.currentSection);

    useEffect(() => {


        if (!mountRef.current) return

        const container = mountRef.current

        // Scene
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0x000000)

        // Camera
        const camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        )

        camera.position.set(0, 10, 0)
        camera.lookAt(0, 0, 0)

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true })

        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(window.innerWidth, window.innerHeight)

        container.appendChild(renderer.domElement)

        renderer.domElement.style.cursor = "pointer"

        // Lights
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5)
        hemiLight.position.set(0, 1, 0)
        scene.add(hemiLight)

        const dirLight = new THREE.DirectionalLight(0xffffff, 2)
        dirLight.position.set(3, 3, 3)
        scene.add(dirLight)

        const dirLight2 = new THREE.DirectionalLight(0xffffff, 2)
        dirLight2.position.set(-3, 3, -3)
        scene.add(dirLight2)

        // Mouse
        let mouseX = 0
        let mouseY = 0

        window.addEventListener("mousemove", (e) => {

            mouseX = (e.clientX / window.innerWidth - 0.5) * 2
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2

        })

        // Raycaster (hover detection)
        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2()

        window.addEventListener("mousemove", (event) => {

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

        })

        // Load model
        const loader = new GLTFLoader()

        loader.load("/assets/coin.glb", (gltf) => {

            const coin = gltf.scene

            let meshList: THREE.Mesh[] = []

            coin.traverse((child) => {

                if (child instanceof THREE.Mesh) {

                    const material = new THREE.MeshStandardMaterial({
                        color: 0xd4af37,
                        metalness: 1,
                        roughness: 0.45
                    })

                    child.material = material

                    meshList.push(child)

                }

            })

            scene.add(coin)

            // Click interaction
            renderer.domElement.addEventListener("pointerdown", async (e) => {
                // 获取实际点击到的最上层元素
                const el = document.elementFromPoint(e.clientX, e.clientY)

                // 只有点击在 canvas 才触发
                if (!el || !container.contains(el)) return

                const email = "xihao.zhu@outlook.com"

                gsap.fromTo(
                    coin.scale,
                    { x: 1, y: 1, z: 1 },
                    {
                        x: 1.2,
                        y: 1.2,
                        z: 1.2,
                        duration: 0.15,
                        yoyo: true,
                        repeat: 1,
                    }
                )

                try {
                    if (!navigator.clipboard) throw new Error("Clipboard not supported")

                    await navigator.clipboard.writeText(email)
                    alert("Email copied to clipboard! Email me!")
                } catch (err) {
                    console.error(err)
                    alert("Copy failed, web desn't feel safe for me to command your clip board. Anyway you know my email :P")
                }

            })
            // Animation
            const animate = () => {

                requestAnimationFrame(animate)

                // Auto spin
                coin.rotation.z += 0.01

                // Mouse smooth rotation
                coin.rotation.x += (mouseY * 0.6 - coin.rotation.x) * 0.05
                coin.rotation.y += (mouseX * 0.6 - coin.rotation.y) * 0.05

                // Hover detection
                raycaster.setFromCamera(mouse, camera)

                const intersects = raycaster.intersectObjects(meshList)

                if (intersects.length > 0) {

                    meshList.forEach((mesh) => {

                        const material = mesh.material as THREE.MeshStandardMaterial

                        material.emissive.set(0x222200)

                    })

                } else {

                    meshList.forEach((mesh) => {

                        const material = mesh.material as THREE.MeshStandardMaterial

                        material.emissive.set(0x000000)

                    })

                }

                renderer.render(scene, camera)

            }

            animate()

        })

        // Resize
        const handleResize = () => {

            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()

            renderer.setSize(window.innerWidth, window.innerHeight)

        }

        window.addEventListener("resize", handleResize)

        // Cleanup
        return () => {

            window.removeEventListener("resize", handleResize)

            container.removeChild(renderer.domElement)

            renderer.dispose()

        }

    }, [])

    const outerContainer = useRef<HTMLDivElement | null>(null)
    gsap.set(outerContainer.current, { opacity: 0, scale: 0 })

    useEffect(() => {
        if (pageCurrentSection == 4) {
            gsap.to(outerContainer.current, { opacity: 1, scale: 1, delay: 2, ease: 'power1.inOut' })
        }
    }, [pageCurrentSection])

    return (
        <div ref={outerContainer} className="w-[100vw] h-[100vh] z-[10]">
            <div ref={mountRef} className="w-[100vw] h-[100vh]" />
        </div >
    )
}