import { useEffect, useRef } from "react"
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

    const rightTop = useRef<SVGSVGElement>(null)
    useEffect(() => {
        const svg = rightTop.current;
        if (!svg) return;

        const lines = Array.from(svg.children) as SVGLineElement[];

        const onEnter = () => {
            lines.forEach((line) => {
                gsap.to(line, {
                    strokeDashoffset: 145,
                    duration: 1,
                    ease: 'power2.out',
                    overwrite: 'auto',
                    stroke: '#00FF00',
                    onComplete: () => {
                        dispatch(resize({ scale: 5 }))
                        dispatch(move({ x: 2, y: 1 }))
                        gsap.to(svg, {
                            transformOrigin: '0 100%',
                            scale: 10,
                            opacity: 0,
                            duration: 1,
                            x: -0.5 * window.innerWidth,
                            y: 0.5 * window.innerHeight,
                            ease: 'power3.Out'
                        })
                    }
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
                tl.to(line, {
                    strokeDashoffset: 0,
                    duration: 1,
                    ease: 'power2.in',
                    overwrite: 'auto',
                    stroke: 'white',
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


    return (
        <div className="w-screen h-screen shrink-0 relative opacity-0" ref={biggestContainer}>
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

        </div>
    )
}
