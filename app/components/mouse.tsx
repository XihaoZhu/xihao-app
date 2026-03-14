import { useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import gsap from "gsap"



export const MouseLogo = ({ xJustify }: { xJustify: number }) => {

    const mouseRef = useRef<HTMLDivElement>(null)
    const baseRef = useRef<HTMLImageElement>(null)
    const redRef = useRef<HTMLImageElement>(null)
    const blueRef = useRef<HTMLImageElement>(null)
    const greenRef = useRef<HTMLImageElement>(null)

    const { layers } = useSelector((state: RootState) => state.mouseControlSlice)


    // color layer control
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

            gsap.to(el, {
                autoAlpha: visible ? 1 : 0,
                duration: 0.5,
                ease: "power2.out",
                overwrite: "auto"
            })

        })

    }, [layers])

    const lastMousePos = useRef({ x: 0, y: 0 })
    const beingControlledBymoving = useRef(false)
    useEffect(() => {
        if (!mouseRef.current) return

        // 鼠标位置保存在 ref 中
        const x = lastMousePos.current.x
        const y = lastMousePos.current.y
        beingControlledBymoving.current = true
        gsap.set(mouseRef.current, {
            x: x - xJustify,
            y,
            onComplete: () => {
                beingControlledBymoving.current = false
            }
        })
    }, [xJustify])

    useEffect(() => {
        const move = (e: MouseEvent) => {
            if (beingControlledBymoving.current) return
            lastMousePos.current = { x: e.clientX, y: e.clientY }
            if (!mouseRef.current) return
            gsap.set(mouseRef.current, {
                x: e.clientX - xJustify,
                y: e.clientY
            })
        }
        window.addEventListener("mousemove", move)
        return () => window.removeEventListener("mousemove", move)
    }, [xJustify])

    return (
        <div className="fixed w-[5vw] h-[5vw] -translate-x-1/2 -translate-y-1/2 z-[999] pointer-events-none" ref={mouseRef}>
            <img draggable={false} src="/assets/PlainMouse.png" alt="base" ref={baseRef} className="absolute w-full h-full" />
            <img draggable={false} src="/assets/Red.png" alt="Click" ref={redRef} className="absolute w-full h-full opacity-0" />
            <img draggable={false} src="/assets/Blue.png" alt="Hover" ref={blueRef} className="absolute w-full h-full opacity-0" />
            <img draggable={false} src="/assets/Green.png" alt="Active" ref={greenRef} className="absolute w-full h-full opacity-0" />
        </div>
    )
}