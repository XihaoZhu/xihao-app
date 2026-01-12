import { use, useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useDispatch, useSelector } from "react-redux";
import { move, resize } from "@/store/ballControl";
import type { RootState } from "@/store";
import { on } from "@/tool/BallEvenBus";
import { RadialMesh } from "./radiaMesh/RadiaMesh";
import { TextReveal } from "./textReveal/TextReveal";

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
    const radiaMesh = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!radiaMesh.current) return

        gsap.to(radiaMesh.current, {
            opacity: aboutActive ? 1 : 0,
            duration: 0.4,
            ease: 'power2.out',
        })
    }, [aboutActive])

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
    const hoverTl = useRef<gsap.core.Timeline | null>(null)
    const isHoveringTl = useRef(false)
    const isActivated = useRef(false)
    useEffect(() => {
        const svg = rightTop.current
        if (!svg) return

        const lines = Array.from(svg.children) as SVGLineElement[]

        const onEnter = () => {
            isHoveringTl.current = true
            hoverTl.current?.kill()

            const tl = gsap.timeline()
            hoverTl.current = tl

            tl.to(lines, {
                strokeDashoffset: 145,
                stroke: '#00FF00',
                duration: 0.8,
                ease: 'power2.out',
                stagger: 0.05,
                onComplete: () => {
                    if (!isHoveringTl.current) return
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
                    isActivated.current = true
                    svg.style.pointerEvents = 'none'
                    setAboutActive(true)
                }
            })
        }

        const onLeave = () => {
            isHoveringTl.current = false
            hoverTl.current?.kill()

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
                    isActivated.current = false

                }
            })
        }

        on('BALL_CLICK', () => {
            if (isActivated.current) {
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

    // bottom box
    const bottom = useRef<SVGSVGElement>(null)
    const hoverB = useRef<gsap.core.Timeline | null>(null)
    const isHoveringB = useRef(false)
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
                stagger: 0.05
            })

            tl.add(() => {
                if (!isHoveringB.current) return
                startSecondPhase(tl)
            })
        }

        const startSecondPhase = (tl: gsap.core.Timeline) => {
            tl.to([rightTop.current, leftTop.current], {
                opacity: 0,
                pointerEvents: 'none',
                duration: 1,
                onComplete: () => {
                    dispatch(resize({ scale: 10 }))
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

            gsap.to(svg, {
                scale: 1,
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power2.out'
            })

            gsap.to([rightTop.current, leftTop.current], {
                opacity: 1,
                pointerEvents: 'auto',
                duration: 0.3,
                onComplete: () => {
                    setVisitedCount((visitedBottom.current ? 1 : 0) + (visitedRight.current ? 1 : 0))
                }
            })

            dispatch(resize({ scale: 3 }))
            dispatch(move({ x: 2.5, y: 0.5 }))
        }

        svg.addEventListener('mouseenter', onEnter)
        svg.addEventListener('mouseleave', onLeave)

        return () => {
            svg.removeEventListener('mouseenter', onEnter)
            svg.removeEventListener('mouseleave', onLeave)
        }
    }, [])


    // leftTop box
    const leftTop = useRef<SVGSVGElement>(null)
    const topLeftLine = useRef<SVGPathElement>(null)
    const visitedRight = useRef<boolean>(false)
    const visitedBottom = useRef<boolean>(false)
    const [visitedCount, setVisitedCount] = useState(0);
    useEffect(() => {
        const el = topLeftLine.current;
        if (!el) return;

        const tl = gsap.timeline();

        tl.to(el, {
            strokeDashoffset: 270 - visitedCount * 130,
            duration: 1,
            ease: 'power1.inOut',
        });
        if (visitedCount == 2) {
            tl.to(el, {
                transformOrigin: '50% 50%',
                opacity: 0.5,
                scale: 0.9,
                duration: 0.75,
                ease: 'power1.inOut',
                yoyo: true,
                repeat: -1
            })
        }
    }, [visitedCount]);

    return (
        <div className="w-screen h-screen shrink-0 relative opacity-0" ref={biggestContainer}>
            {/* top left heart */}
            <svg
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[10vw] h-[10vw] bottom-[50%] right-[50%] absolute z-11"
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
                <path
                    d="
                      M50 92
                      C35 78, 10 60, 10 38
                      C10 18, 28 12, 40 22
                      C46 27, 48 32, 50 36
                      C52 32, 54 27, 60 22
                      C72 12, 90 18, 90 38
                      C90 60, 65 78, 50 92
                      Z
                    "
                    fill="none"
                    stroke="red"
                    strokeDasharray={'270'}
                    strokeDashoffset={'270'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    ref={topLeftLine}
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
                <div className="absolute w-screen h-screen">
                    <RadialMesh
                        collapseCenter={collapseCenter}
                        mouseEnabled={mouseEnabled}
                        onMouseMove={p => {
                            if (source === 'mouse') {
                                setCollapseCenter(p)
                            }
                        }}
                    />
                </div>
                <div>
                    <TextReveal
                        text="I’m not an expert, but I can contribute to UI design. In this project, for instance, I used Figma to create the basic layouts. I can also work with Photoshop, After Effects, and 3D software like Blender to create assets. You can see practical examples later in another section."
                        active={aboutActive}
                        onCenterChange={(p) => {
                            if (source === 'text') {
                                setCollapseCenter(p)
                            }
                        }}
                        onComplete={() => {
                            setMouseEnabled(true)
                            setSource('mouse')
                        }}
                    />
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
