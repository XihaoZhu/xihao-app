import { useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import gsap from "gsap"



export const MouseLogo = ({ props }: { props: { xJustify: number, mouseShow: boolean } }) => {
    const { xJustify, mouseShow } = props
    const mouseRef = useRef<HTMLDivElement>(null)
    const baseRef = useRef<HTMLImageElement>(null)
    const redRef = useRef<HTMLImageElement>(null)
    const blueRef = useRef<HTMLImageElement>(null)
    const greenRef = useRef<HTMLImageElement>(null)

    const { layers } = useSelector((state: RootState) => state.mouseControlSlice)


    // color layer control

    const tweens = useRef<Record<string, gsap.core.Tween | null>>({
        red: null,
        blue: null,
        green: null
    })
    useEffect(() => {

        if (
            !mouseRef.current ||
            !baseRef.current ||
            !redRef.current ||
            !blueRef.current ||
            !greenRef.current
        ) return

        const layerMap = {
            red: redRef.current,
            blue: blueRef.current,
            green: greenRef.current
        }

        Object.entries(layerMap).forEach(([key, el]) => {

            const visible = layers[key as keyof typeof layers]

            if (visible) {

                if (!tweens.current[key]) {
                    tweens.current[key] = gsap.to(el, {
                        autoAlpha: 1,
                        duration: 1,
                        delay: key === "red" ? 0.2 : key === "blue" ? 0.4 : 0.6,
                        yoyo: true,
                        repeat: -1
                    })
                }

            } else {

                tweens.current[key]?.kill()
                tweens.current[key] = null

                gsap.set(el, { autoAlpha: 0 })
            }

        })

    }, [layers])

    const lastMousePos = useRef({ x: 0, y: 0 })
    // container 偏移变化 → 更新位置
    useEffect(() => {
        if (!mouseRef.current) return

        const { x, y } = lastMousePos.current

        gsap.set(mouseRef.current, {
            x: x - xJustify,
            y
        })

    }, [xJustify])

    // 鼠标移动
    useEffect(() => {

        const move = (e: MouseEvent) => {
            lastMousePos.current = { x: e.clientX, y: e.clientY }

            if (!mouseRef.current) return

            gsap.set(mouseRef.current, {
                x: e.clientX - xJustify,
                y: e.clientY,
                duration: 0.1,
            })
        }

        window.addEventListener("mousemove", move)

        return () => window.removeEventListener("mousemove", move)

    }, [xJustify])

    // 控制鼠标显示
    useEffect(() => {

        if (!mouseRef.current) return

        gsap.to(mouseRef.current, {
            autoAlpha: mouseShow ? 1 : 0,
            duration: 0.2,
            ease: "power2.out"
        })

    }, [mouseShow])

    return (
        <div className="fixed w-[5vw] h-[5vw] -translate-x-1/2 -translate-y-1/2 z-[999] pointer-events-none" ref={mouseRef}>
            <img draggable={false} src="/assets/PlainMouse.png" alt="base" ref={baseRef} className="absolute w-full h-full" />
            <img draggable={false} src="/assets/Red.png" alt="Click" ref={redRef} className="absolute w-full h-full opacity-0" />
            <img draggable={false} src="/assets/Blue.png" alt="Hover" ref={blueRef} className="absolute w-full h-full opacity-0" />
            <img draggable={false} src="/assets/Green.png" alt="Active" ref={greenRef} className="absolute w-full h-full opacity-0" />
        </div>
    )
}