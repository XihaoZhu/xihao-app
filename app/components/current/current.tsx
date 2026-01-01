import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useDispatch, useSelector } from "react-redux";
import { move, resize } from "@/store/ballControl";
import type { RootState } from "@/store";



export default function Current() {

    const dispatch = useDispatch()
    const { currentSection } = useSelector((state: RootState) => state.currentPage)
    const biggestContainer = useRef<HTMLDivElement>(null)


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
    useEffect(() => {
        const svg = rightTop.current;
        if (!svg) return;

        const lines = Array.from(svg.children) as SVGLineElement[];

        const onEnter = () => {
            lines.forEach((line) => {
                const tl = gsap.timeline()
                tl.to(line, {
                    strokeDashoffset: 145,
                    duration: 1,
                    ease: 'power2.out',
                    overwrite: 'auto',
                    stroke: '#00FF00',
                    onComplete: () => {
                        dispatch(resize({ scale: 5 }))
                        dispatch(move({ x: 2, y: 1 }))
                    }
                })
                tl.to(bottom.current, {
                    opacity: 0,
                    duration: 1,
                }, '<')
                tl.to(leftTop.current, {
                    opacity: 0,
                    duration: 1,
                }, '<')
                tl.to(svg, {
                    transformOrigin: '0 100%',
                    scale: 10,
                    opacity: 0,
                    duration: 1,
                    x: -0.5 * window.innerWidth,
                    y: 0.5 * window.innerHeight,
                    ease: 'power3.Out'
                });
            });
        };

        const onLeave = () => {
            lines.forEach((line) => {
                const tl = gsap.timeline()
                tl.to(svg, {
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power3.Out',
                    onComplete: () => {
                        dispatch(resize({ scale: 3 }))
                        dispatch(move({ x: 2.5, y: 0.5 }))
                    }
                })
                tl.to(svg, {
                    transformOrigin: '0 100%',
                    scale: 1,
                    duration: 1,
                    x: 0,
                    y: 0,
                    ease: 'power3.Out'
                })
                tl.to(bottom.current, {
                    opacity: 1,
                    duration: 1
                })
                tl.to(leftTop.current, {
                    opacity: 1,
                    duration: 1
                }, '<')
                tl.to(line, {
                    strokeDashoffset: 0,
                    duration: 1,
                    ease: 'power2.in',
                    overwrite: 'auto',
                    stroke: 'white',
                    onComplete: () => {
                        if (!visitedRight.current) {
                            visitedRight.current = true
                            setVisitedCount((c) => c + 1)
                        }
                    }
                }, '<');
            });
        };

        svg.addEventListener('mouseenter', onEnter);
        svg.addEventListener('mouseleave', onLeave);

        return () => {
            svg.removeEventListener('mouseenter', onEnter);
            svg.removeEventListener('mouseleave', onLeave);
        };
    }, []);

    // bottom box
    const bottom = useRef<SVGSVGElement>(null)
    useEffect(() => {
        const svg = bottom.current;
        if (!svg) return;

        const lines = Array.from(svg.children) as SVGLineElement[];
        let long = true
        const onEnter = () => {
            lines.forEach((line) => {
                const tl = gsap.timeline()
                tl.to(line, {
                    strokeDashoffset: long ? 295 : 145,
                    duration: 1,
                    ease: 'power2.out',
                    overwrite: 'auto',
                    stroke: '#00FF00',
                    onComplete: () => {
                        dispatch(resize({ scale: 5 }))
                        dispatch(move({ x: 2.5, y: 0 }))
                    }
                })
                tl.to(rightTop.current, {
                    opacity: 0,
                    duration: 1
                }, '<')
                tl.to(leftTop.current, {
                    opacity: 0,
                    duration: 1,
                }, '<')
                tl.to(svg, {
                    transformOrigin: '50% 0%',
                    scale: 10,
                    opacity: 0,
                    duration: 1,
                    y: -0.5 * window.innerHeight,
                    ease: 'power3.Out'
                });
                long = !long
            });
        };

        const onLeave = () => {
            lines.forEach((line) => {
                const tl = gsap.timeline()
                tl.to(svg, {
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power3.Out',
                    onComplete: () => {
                        dispatch(resize({ scale: 3 }))
                        dispatch(move({ x: 2.5, y: 0.5 }))
                    }
                })
                tl.to(svg, {
                    transformOrigin: '50% 0%',
                    scale: 1,
                    duration: 1,
                    y: 0,
                    ease: 'power3.Out'
                })
                tl.to(rightTop.current, {
                    opacity: 1,
                    duration: 1
                })
                tl.to(leftTop.current, {
                    opacity: 1,
                    duration: 1
                }, '<')
                tl.to(line, {
                    strokeDashoffset: 0,
                    duration: 1,
                    ease: 'power2.in',
                    overwrite: 'auto',
                    stroke: 'white',
                    onComplete: () => {
                        if (!visitedBottom.current) {
                            visitedBottom.current = true
                            setVisitedCount((c) => c + 1)
                        }
                    }
                }, '<');
            });
        };

        svg.addEventListener('mouseenter', onEnter);
        svg.addEventListener('mouseleave', onLeave);

        return () => {
            svg.removeEventListener('mouseenter', onEnter);
            svg.removeEventListener('mouseleave', onLeave);
        };
    }, []);

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
            <svg
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[10vw] h-[10vw] bottom-[50%] right-[50%] absolute"
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

            <svg
                className="w-[10vw] absolute bottom-[50%] left-[50%]"
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
            <svg
                className="w-[30vw] h-[10vw] absolute top-[50%] left-[35vw]"
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
