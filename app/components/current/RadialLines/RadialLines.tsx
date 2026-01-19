import { FC, useRef, useState } from 'react'
import { useEffect, useLayoutEffect } from 'react'
import gsap from 'gsap'


// parameters



export const RadialLines: FC<{ active: boolean }> =
    ({ active

    }) => {

        const [viewport, setViewport] = useState<{
            width: number
            height: number
        } | null>({ width: 0, height: 0 })


        const LINES_COUNT = 20
        const BASE_RADIUS = viewport!.width * 1.5 / 10
        const LINE_LENGTH = viewport!.width * 1 / 20
        const extraLength = viewport!.width * 1 / 20

        // handle viewport resize   
        useEffect(() => {
            const update = () => {
                setViewport({
                    width: window.innerWidth,
                    height: window.innerHeight,
                })
            }
            update()
            window.addEventListener('resize', update)
            return () => window.removeEventListener('resize', update)
        }, [])

        const cx = viewport!.width / 2
        const cy = 0

        // build basic lines
        const lines: {
            x1: number,
            y1: number,
            x2: number,
            y2: number
        }[] = []
        for (let i = 0; i < LINES_COUNT; i++) {
            const angle = (2 * Math.PI / LINES_COUNT) * i
            lines.push({
                x1: BASE_RADIUS * Math.sin(angle),
                y1: BASE_RADIUS * Math.cos(angle),
                x2: (BASE_RADIUS + LINE_LENGTH + extraLength) * Math.sin(angle),
                y2: (BASE_RADIUS + LINE_LENGTH + extraLength) * Math.cos(angle),
            })
        }

        // animation
        const lineRefs = useRef<SVGPathElement[]>([])
        useEffect(() => {
            if (!active) return

            const tl = gsap.timeline({ repeat: -1, yoyo: true })

            tl.set(lineRefs.current, {
                strokeDashoffset: (i) => i % 2 === 0 ? 0 : extraLength

            })

            tl.to(lineRefs.current, {
                strokeDashoffset: (i) => i % 2 === 0 ? extraLength : 0,
                duration: 2,
                ease: 'none',
                yoyo: true,
            })
        }, [active, extraLength, LINE_LENGTH])


        useEffect(() => {
            if (!active) return
            const tl = gsap.timeline()
            tl.to('.rotatingTarget', {
                rotation: 36,
                transformOrigin: `${cx}px ${cy}px`,
                ease: 'none',
                duration: 4,
                repeat: -1,
            })
        }, [active, cx, cy])

        return (
            <div className='w-screen h-screen'>
                <svg
                    className='w-screen h-screen rotatingTarget overflow-visible'
                    viewBox={`0 0 ${viewport?.width} ${viewport?.height}`}>
                    {lines.map((line, index) => (
                        <path
                            key={index}
                            ref={(el) => {
                                if (el) lineRefs.current[index] = el
                            }}
                            d={`M ${cx + line.x1} ${cy - line.y1} L ${cx + line.x2} ${cy - line.y2}`}
                            strokeDasharray={`${LINE_LENGTH + extraLength}`}
                            stroke="white"
                            strokeWidth={5}
                            fill="none"
                        />))}
                </svg>
            </div>
        )
    }