import { use, useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useDispatch, useSelector } from "react-redux";
import { move, resize } from "@/store/ballControl";
import type { RootState } from "@/store";
import { on } from "@/tool/BallEvenBus";
import { RadialMesh } from "./radiaMesh/RadiaMesh";
import { TextReveal } from "./textReveal/TextReveal";
import { RadialLines } from "./RadialLines/RadialLines";
import { Wheel } from "./Wheel/Wheel";
import { nextSection } from "@/store/pageControl";
import { useCallback } from "react";
import { setCursorLayers } from "@/store/mouseControl";

type CollapseSource = 'text' | 'mouse'

export default function Current() {

    const dispatch = useDispatch()
    const { currentSection } = useSelector((state: RootState) => state.currentPage)
    const biggestContainer = useRef<HTMLDivElement>(null)


    // design page
    const [collapseCenter, setCollapseCenter] = useState<{ x: number; y: number } | null>(null)
    const [source, setSource] = useState<CollapseSource>('text')
    const [mouseEnabled, setMouseEnabled] = useState(false)
    const [aboutActive, setAboutActive] = useState(false)
    const [frontendActive, setFrontendActive] = useState(false)
    const radiaMesh = useRef<HTMLDivElement>(null)
    const radialLines = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!radiaMesh.current) return

        gsap.to(radiaMesh.current, {
            opacity: aboutActive ? 1 : 0,
            duration: 0.4,
            ease: 'power2.out',
        })
    }, [aboutActive])

    useEffect(() => {
        if (!radialLines.current) return

        gsap.to(radialLines.current, {
            opacity: frontendActive ? 1 : 0,
            duration: 0.4,
            ease: 'power2.out',
        })
    }, [frontendActive])

    // move in ani
    useEffect(() => {
        if (!biggestContainer.current) return
        if (currentSection != 2) return
        gsap.to(biggestContainer.current, {
            opacity: 1,
            duration: 1,
            delay: 4.5,
            ease: 'power1.out'
        })
    })

    // right top box
    const rightTop = useRef<SVGSVGElement>(null)
    const hoverTR = useRef<gsap.core.Timeline | null>(null)
    const isHoveringTR = useRef(false)
    const topRightActivated = useRef(false)
    useEffect(() => {
        const svg = rightTop.current
        if (!svg) return

        const lines = Array.from(svg.children) as SVGLineElement[]

        const onEnter = () => {
            isHoveringTR.current = true
            hoverTR.current?.kill()

            const tl = gsap.timeline()
            hoverTR.current = tl

            tl.to(lines, {
                strokeDashoffset: 145,
                stroke: '#00FF00',
                duration: 0.8,
                ease: 'power2.out',
                stagger: 0.05,
                onComplete: () => {
                    if (!isHoveringTR.current) return
                    startSecondPhase(tl)
                }
            })

        }

        const startSecondPhase = (tl: gsap.core.Timeline) => {
            tl.to([bottom.current, leftTop.current], {
                opacity: 0,
                pointerEvents: 'none',
                duration: 1,
                onComplete: () => {
                    dispatch(resize({ scale: 10 }))
                    dispatch(move({ x: 2, y: 1 }))
                }
            })

            tl.to(svg, {
                transformOrigin: '0 100%',
                scale: 10,
                opacity: 0,
                x: -0.5 * window.innerWidth,
                y: 0.5 * window.innerHeight,
                duration: 1,
                ease: 'power3.out',
                onComplete: () => {
                    visitedRight.current = true
                    topRightActivated.current = true
                    svg.style.pointerEvents = 'none'
                    setAboutActive(true)
                    dispatch(setCursorLayers(["red"]))
                }
            })
        }

        const onLeave = () => {
            isHoveringTR.current = false
            hoverTR.current?.kill()

            gsap.to(lines, {
                strokeDashoffset: 0,
                stroke: 'white',
                duration: 1,
                ease: 'power2.inOut',
            })
        }

        const onBallClick = () => {
            dispatch(resize({ scale: 3 }))
            dispatch(move({ x: 2.5, y: 0.5 }))
            setAboutActive(false)
            gsap.to(svg, {
                scale: 1,
                opacity: 1,
                x: 0,
                y: 0,
                duration: 1,
                pointerEvents: 'auto',
                ease: 'power2.out'
            })

            gsap.to([bottom.current, leftTop.current], {
                opacity: 1,
                pointerEvents: 'auto',
                duration: 1,
                onComplete: () => {
                    setVisitedCount(
                        (visitedBottom.current ? 1 : 0) +
                        (visitedRight.current ? 1 : 0)
                    )
                    topRightActivated.current = false
                    dispatch(setCursorLayers(["green"]))

                }
            })
        }

        on('BALL_CLICK', () => {
            if (topRightActivated.current) {
                setSource('mouse')
                setMouseEnabled(true)
                onBallClick()
            }
        })

        svg.addEventListener('mouseenter', onEnter)
        svg.addEventListener('mouseleave', onLeave)

        return () => {
            svg.removeEventListener('mouseenter', onEnter)
            svg.removeEventListener('mouseleave', onLeave)
        }
    }, [])
    const handleMouseMove = useCallback((p: { x: number; y: number }) => {
        if (source === 'mouse') {
            setCollapseCenter(prev => {
                if (!prev) return p

                const dx = Math.abs(prev.x - p.x)
                const dy = Math.abs(prev.y - p.y)

                if (dx < 1 && dy < 1) {
                    return prev
                }

                return p
            })
        }
    }, [source]);

    // bottom box
    const bottom = useRef<SVGSVGElement>(null)
    const hoverB = useRef<gsap.core.Timeline | null>(null)
    const isHoveringB = useRef(false)
    const Bactivated = useRef(false)
    useEffect(() => {
        const svg = bottom.current
        if (!svg) return

        const lines = Array.from(svg.children) as SVGLineElement[]

        const onEnter = () => {
            isHoveringB.current = true
            hoverB.current?.kill()

            const tl = gsap.timeline()
            hoverB.current = tl

            tl.to(lines, {
                strokeDashoffset: (i) => (i % 2 === 0 ? 295 : 145),
                stroke: '#00FF00',
                duration: 0.8,
                ease: 'power2.out',
                stagger: 0.05,
                onComplete: () => {
                    if (!isHoveringB.current) return
                    startSecondPhase(tl)
                }
            })


        }

        const startSecondPhase = (tl: gsap.core.Timeline) => {
            tl.to([rightTop.current, leftTop.current], {
                opacity: 0,
                pointerEvents: 'none',
                duration: 1,
                onComplete: () => {
                    dispatch(resize({ scale: 5 }))
                    dispatch(move({ x: 2.5, y: 0 }))
                }
            })

            tl.to(svg, {
                transformOrigin: '50% 0%',
                scale: 10,
                opacity: 0,
                y: -0.5 * window.innerHeight,
                duration: 1,
                ease: 'power3.out',
                onComplete: () => {
                    visitedBottom.current = true
                    Bactivated.current = true
                    svg.style.pointerEvents = 'none'
                    setFrontendActive(true)
                    dispatch(setCursorLayers(["red"]))
                }
            })
        }

        const onLeave = () => {
            isHoveringB.current = false
            hoverB.current?.kill()

            gsap.to(lines, {
                strokeDashoffset: 0,
                stroke: 'white',
                duration: 1,
                ease: 'power2.inOut'
            })

        }


        const onBallClick = () => {
            dispatch(resize({ scale: 3 }))
            dispatch(move({ x: 2.5, y: 0.5 }))
            setFrontendActive(false)
            gsap.to(svg, {
                scale: 1,
                opacity: 1,
                x: 0,
                y: 0,
                duration: 1,
                pointerEvents: 'auto',
                ease: 'power2.out'
            })

            gsap.to([rightTop.current, leftTop.current], {
                opacity: 1,
                pointerEvents: 'auto',
                duration: 1,
                onComplete: () => {
                    setVisitedCount(
                        (visitedBottom.current ? 1 : 0) +
                        (visitedRight.current ? 1 : 0)
                    )
                    Bactivated.current = false
                    dispatch(setCursorLayers(["green"]))
                }
            })
        }

        on('BALL_CLICK', () => {
            if (Bactivated.current) {
                onBallClick()
            }
        })

        svg.addEventListener('mouseenter', onEnter)
        svg.addEventListener('mouseleave', onLeave)

        return () => {
            svg.removeEventListener('mouseenter', onEnter)
            svg.removeEventListener('mouseleave', onLeave)
        }

    }, [])


    // leftTop box
    const leftTop = useRef<SVGSVGElement>(null)
    const topLeftLine = useRef<SVGCircleElement>(null)
    const visitedRight = useRef<boolean>(false)
    const visitedBottom = useRef<boolean>(false)
    const [visitedCount, setVisitedCount] = useState(0);
    const [shouldStopRef, setShouldStopRef] = useState(false);
    useEffect(() => {
        const el = topLeftLine.current;
        if (!el || !rightTop.current) return;

        const tl = gsap.timeline();

        tl.to(el, {
            strokeDashoffset: 62.8 - visitedCount * 31.4,
            duration: 1,
            ease: 'power1.inOut',
        });

        if (visitedCount == 2) {
            tl.to(el, {
                fill: "#58ff77",
            })
            dispatch(setCursorLayers(["red", "green"]))
            let isReturningToStart = false
            const tween = gsap.to(el, {
                transformOrigin: '50% 50%',
                opacity: 0.75,
                scale: 0.9,
                duration: 0.75,
                ease: 'power1.inOut',
                repeat: -1,
                yoyo: true,
                delay: 0.2,
                onRepeat: () => {
                    if (isReturningToStart) {
                        if (shouldStopRef) {
                            tween.pause();
                            return;
                        }
                    }
                    isReturningToStart = !isReturningToStart;
                }
            });

            tl.add(tween, '<');
        }

        const moveToHistory = () => {
            if (visitedCount < 2) return

            setShouldStopRef(true)
            gsap.killTweensOf([rightTop.current, bottom.current])
            tl.to([rightTop.current, bottom.current], {
                alpha: 0,
                pointerEvents: 'none',
                ease: 'power1.inOut',
                duration: 1,
            })
            setTimeout(() => {
                gsap.killTweensOf([el, leftTop.current])
                tl.clear()
                tl.to(leftTop.current, {
                    opacity: 0,
                    ease: 'power1.inOut',
                    duration: 1,
                    onComplete: () => {
                        dispatch(nextSection())
                    },

                })
                tl.restart()
            }, 1000)
        }

        el.addEventListener('click', moveToHistory)

        return () => {
            el.removeEventListener('click', moveToHistory)
        }

    }, [visitedCount, shouldStopRef]);

    return (
        <div className="w-screen h-screen shrink-0 relative opacity-0 overflow-visible" ref={biggestContainer}>
            {/* top left circle */}
            <svg
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[10vw] h-[10vw] bottom-[50.5%] right-[50.5%] absolute z-11 overflow-visible"
                ref={leftTop}
            >
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <circle
                    ref={topLeftLine}
                    cx="50"
                    cy="50"
                    r="10"
                    fill="none"
                    stroke="#58ff77"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="62.8"
                    strokeDashoffset="62.8"
                    filter="url(#glow)"
                />
            </svg>

            {/* top right square */}
            <svg
                className="w-[10vw] absolute bottom-[50%] left-[50%] z-11"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                ref={rightTop}
            >
                {/* top */}
                <line
                    x1="1"
                    y1="1"
                    x2="99"
                    y2="1"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={'10 80 100'}
                />
                {/* right */}
                <line
                    x1="99"
                    y1="1"
                    x2="99"
                    y2="99"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={'10 80 100'}
                />
                {/* bottom */}
                <line
                    x1="99"
                    y1="99"
                    x2="1"
                    y2="99"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={'10 80 100'}
                />
                {/* left */}
                <line
                    x1="1"
                    y1="99"
                    x2="1"
                    y2="1"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={'10 80 100'}
                />
            </svg>

            {/* radia mesh */}
            <div ref={radiaMesh}>
                <div className="absolute w-screen h-screen top-0 left-0">
                    <RadialMesh
                        collapseCenter={collapseCenter}
                        mouseEnabled={mouseEnabled}
                        onMouseMove={handleMouseMove}
                    />
                </div>
                <div>
                    <TextReveal
                        text="I’m not an expert, but I can contribute to UI design. In this project, for instance, I used Figma to create the basic layouts. I can also work with Photoshop, After Effects, and 3D software like Blender to create assets. You can see practical examples later in another section."
                        active={aboutActive}
                        onCenterChange={(p) => {
                            if (source === 'text') {
                                setCollapseCenter(prev => {
                                    if (!prev) return p

                                    const dx = Math.abs(prev.x - p.x)
                                    const dy = Math.abs(prev.y - p.y)

                                    if (dx < 1 && dy < 1) {
                                        return prev
                                    }

                                    return p
                                })
                            }
                        }}
                        onComplete={() => {
                            setMouseEnabled(true)
                            setSource('mouse')
                        }}
                    />
                </div>
            </div>

            {/* RadialLines */}
            <div ref={radialLines}>
                <div className="w-screen h-screen absolute top-0 left-0 cursor-events-none">
                    <RadialLines active={frontendActive} />
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-white w-[80vh] h-[80vh]">
                    <Wheel />
                </div>
            </div>

            {/* bottom rectangular */}
            <svg
                className="w-[30vw] h-[10vw] absolute top-[50%] left-[35vw] z-11"
                viewBox="0 0 200 100"
                xmlns="http://www.w3.org/2000/svg"
                ref={bottom}
            >
                {/* top */}
                <line
                    x1="1"
                    y1="1"
                    x2="199"
                    y2="1"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={'10 180 200'}
                />
                {/* right */}
                <line
                    x1="199"
                    y1="1"
                    x2="199"
                    y2="99"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={'10 80 100'}
                />
                {/* bottom */}
                <line
                    x1="199"
                    y1="99"
                    x2="1"
                    y2="99"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={'10 180 200'}
                />
                {/* left */}
                <line
                    x1="1"
                    y1="99"
                    x2="1"
                    y2="1"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={'10 80 100'}
                />
            </svg>

        </div>
    )
}
