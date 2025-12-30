import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { move } from "@/store/ballControl";
import { nextSection } from "@/store/pageControl";
import { Flip } from "gsap/all";

gsap.registerPlugin(Flip)

export default function About() {

    const pageCurrentSection = useSelector((state: RootState) => state.currentPage.currentSection);
    const whitePart = useRef<HTMLDivElement>(null);
    const { x, y } = useSelector((state: RootState) => state.ballInfo);

    const introDoneRef = useRef(false);
    const arrivedStart = useRef(false)

    const ballLocationRef = useRef({ x: 0, y: 0 });
    useEffect(() => {
        ballLocationRef.current = { x, y };
    }, [x, y]);

    const dispatch = useDispatch();

    const currentAngleRef = useRef(0);
    const deltaXRef = useRef(0);

    const greenLineRef = useRef<HTMLDivElement>(null);
    const blueLineRef = useRef<HTMLDivElement>(null);
    const yearLineRef = useRef<HTMLDivElement>(null);
    const [arrivedTheEnd, setArrivedTheEnd] = useState<boolean>(false)

    // animate white part when entering about section
    useEffect(() => {
        if (!whitePart.current) return;
        if (introDoneRef.current) return;
        if (pageCurrentSection == 1) {
            gsap.fromTo(whitePart.current, {
                y: '15vh',
            }, {
                y: 0,
                ease: "power2.out",
                duration: 1,
                delay: 2,
                onComplete: () => {
                    introDoneRef.current = true
                }
            })
            gsap.fromTo(greenLineRef.current, {
                opacity: 0,
                scaleX: 0
            },
                {
                    scaleX: 0.025,
                    ease: "power2.out",
                    duration: 2,
                    delay: 1,
                    opacity: 1,
                })
        }
    }, [pageCurrentSection]);


    // logic about the rotation of white part
    const handleRotate = (e: MouseEvent) => {
        if (pageCurrentSection !== 1) return;
        if (!introDoneRef.current) return;
        if (arrivedStart.current) return

        const deltaX = e.clientX / window.innerWidth - 0.5;
        const angle = deltaX * 5
        currentAngleRef.current = angle;

        gsap.to(whitePart.current, {
            rotationZ: angle,
            ease: "power3.out",
            duration: 0.25,
        });
    };
    useEffect(() => {
        if (!whitePart.current) return;

        window.addEventListener("mousemove", handleRotate);
        return () => window.removeEventListener("mousemove", handleRotate);
    }, [pageCurrentSection]);

    // logic about the ball rolling and location update
    useEffect(() => {
        if (pageCurrentSection !== 1) return;
        if (arrivedStart.current) return

        let rafId: number;
        let frame = 0

        const tick = () => {
            if (!introDoneRef.current) {
                rafId = requestAnimationFrame(tick);
                return;
            }

            frame++;

            const angleDeg = currentAngleRef.current;

            deltaXRef.current += angleDeg * 0.0004;
            deltaXRef.current = Math.max(0.025, Math.min(0.975, deltaXRef.current));

            const x = deltaXRef.current;
            const slope = Math.tan(angleDeg * Math.PI / 180);
            const aspectRatio = window.innerWidth / window.innerHeight;
            const y = 0.5 + (x - 0.5) * slope * aspectRatio;

            if (frame % 3 == 0) {
                dispatch(move({ x: x + 1, y }));
            }

            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(rafId);
    }, [pageCurrentSection]);
    // green line extending
    useEffect(() => {
        if (!greenLineRef.current || !introDoneRef.current) return;
        if (x > 1.97) setArrivedTheEnd(true)
        const progress = Math.min((x - 1) / 0.9, 1)
        if (arrivedTheEnd) {
            gsap.to(greenLineRef.current, {
                x: Math.sin(currentAngleRef.current * Math.PI / 180) * window.innerHeight * 1 / 5,
                transformOrigin: 'left center',
                duration: 0.1,
                ease: 'power2.out',
                overwrite: "auto",

            });
        } else {
            gsap.to(greenLineRef.current, {
                scaleX: progress,
                scaleY: 0.5 + progress * 0.5,
                x: Math.sin(currentAngleRef.current * Math.PI / 180) * window.innerHeight * 1 / 5,
                transformOrigin: 'left center',
                duration: 0.1,
                ease: 'power2.out',
                overwrite: "auto",

            });
        }
    }, [x, arrivedTheEnd]);
    // blue line extending
    useEffect(() => {
        if (!blueLineRef.current || !introDoneRef.current || !arrivedTheEnd) return;
        const progress = Math.min((2 - x) / 0.7, 1)
        gsap.to(blueLineRef.current, {
            scaleX: progress,
            scaleY: 0.5 + progress * 0.5,
            x: Math.sin(currentAngleRef.current * Math.PI / 180) * window.innerHeight * 1 / 10,
            transformOrigin: 'right center',
            duration: 0.1,
            ease: 'power2.out',
            overwrite: "auto",
        });
    }, [x, arrivedTheEnd]);
    // year showing
    useEffect(() => {
        if (!yearLineRef.current || !introDoneRef.current) return;

        const years = Array.from(yearLineRef.current.children) as HTMLElement[];
        let count = 0.125;

        years.forEach((el) => {
            const dx = (x - 1) - count;

            let opacity = 0;
            if (arrivedTheEnd || dx > 0) {
                opacity = 1;
            } else if (dx > -0.1 && dx <= 0) {
                opacity = 1 + dx / 0.15;
            }

            gsap.set(el, {
                scale: Math.max(2 - Math.abs(dx) * 7, 1),
                opacity,
                transformOrigin: 'center center',
            });

            count += 0.25;
        });
    }, [x, arrivedTheEnd]);
    // text change
    const textRefs = useRef<Map<number, HTMLSpanElement>>(new Map());
    const texts: string[] = [
        "I graduated from the University of Nottingham with a Bachelor’s degree in Aerospace Engineering.",
        "I graduated from the University of Manchester with a Master’s degree in Aerospace Engineering.",
        "I worked part-time in a restaurant.",
        "Then I worked full-time at another restaurant.",
        "I also taught A-level physics in an extracurricular class for 6 months as a part time job.",
        "I became the supervisor at the restaurant.",
        "I saved some money and quit to focus on coding.",
        "I began self-learning coding back to the end of 2023, and although the time and effort I could dedicate varied across different periods, I have never stopped moving forward in this direction."
    ];
    const intervals: number[][] = [
        [0.075, 0.2],
        [0.225, 0.425],
        [0.4, 0.5],
        [0.5, 0.85],
        [0.5, 0.7],
        [0.75, 0.85],
        [0.85, 0.95],
        [1, 1]
    ]
    const [prevTexts, setPrevTexts] = useState(new Set<number>)
    useEffect(() => {
        const showTexts = new Set<number>
        const elements = Array.from(
            document.querySelector('.text-lists')?.children ?? []
        ) as HTMLElement[];
        if (!arrivedTheEnd) {
            intervals.forEach((el, idx) => {
                if (x - 1 > el[0] && x - 1 < el[1]) {
                    if (!showTexts.has(idx)) {
                        showTexts.add(idx)
                    }
                }
            })
        } else {
            if (x - 1 < 0.9 && x - 1 > 0.2) {
                showTexts.add(texts.length - 1)
            }
        }
        const newAddTexts = new Set<number>();
        const newDeleteTexts = new Set<number>();
        for (const item of showTexts) {
            if (!prevTexts.has(item)) newAddTexts.add(item);
        }
        for (const item of prevTexts) {
            if (!showTexts.has(item)) newDeleteTexts.add(item);
        }

        const state = Flip.getState(elements);

        for (const el of newAddTexts) {
            const node = elements[el];
            node.style.display = 'block';
            gsap.fromTo(node,
                { opacity: 0, x: 20, scaleY: 0 },
                { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', scaleY: 1 }
            );
        }
        for (const el of newDeleteTexts) {
            const node = elements[el];
            gsap.fromTo(node,
                { opacity: 1, x: 0, scaleY: 1 },
                { opacity: 0, x: -20, scaleY: 0, duration: 0.5, ease: 'power2.out', onComplete: () => { node.style.display = 'none' } }
            );
        }

        setPrevTexts(showTexts);

    }, [x, arrivedTheEnd])

    // logic and animation about move to next page
    useEffect(() => {
        if (arrivedTheEnd && x <= 1.025) {
            arrivedStart.current = true
            dispatch(nextSection())
            const tl = gsap.timeline()
            tl.to('.content-target', {
                opacity: 0,
                duration: 0.5,
            })
            tl.to('.rotation-wrapper', {
                rotateZ: -90,
                duration: 1,
                transformOrigin: 'top center',
                ease: 'power2.out'
            })
            tl.to(whitePart.current, {
                scaleY: 0,
                duration: 1,
                transformOrigin: '50% 100%',
            })
        }

    }, [x, arrivedTheEnd])

    return (
        <div className="relative w-screen h-screen flex flex-col items-center shrink-0 overflow-hidden pointer-events-none">
            {/* text */}
            <div className="w-[100vw] h-[50vh] shrink-0 flex flex-col items-center justify-center content-target">
                <div className="w-[100vw] h-[50vh] flex items-center justify-center">
                    <div
                        className="
                          w-[75vw] text-[2vw] relative
                          font-inter font-medium
                          text-[#eaeaea]
                          justify-center
                          items-center
                          flex
                          flex-col
                          tracking-[-0.015em]
                          drop-shadow-[0.15vw_0_0_rgba(180,220,255,0.75)]
                          text-lists
                        "
                    >
                        {texts.map((text, idx) => {
                            return (
                                <div
                                    key={idx}
                                    className="hidden"
                                >
                                    {text}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className="content-target absolute w-screen h-screen">
                {/* green line */}
                <div
                    ref={greenLineRef}
                    className="absolute left-0 bottom-[30vh] w-[90vw] origin-left scale-x-0 scale-y-0"
                >
                    <div
                        className="
                      h-[0.8vw] rounded-full
                      bg-gradient-to-r from-[#2FE91A] via-[#6CFF62] to-[#2FE91A]
                      shadow-[0_0.4vw_1vw_rgba(47,233,26,0.35)]
                    "
                    />
                    <div
                        className="
                      absolute top-[15%] left-0
                      h-[20%] w-full
                      rounded-full
                      bg-white/50
                      blur-[0.15vw]
                      pointer-events-none
                    "
                    />
                </div>
                {/* years */}
                <div className="text-black absolute bottom-[17.5vh] flex text-[3vw] justify-around w-[100vw]" ref={yearLineRef}>
                    <div className="opacity-0">2022</div>
                    <div className="opacity-0">2023</div>
                    <div className="opacity-0">2024</div>
                    <div className="opacity-0">2025</div>
                </div>
                {/* blue line */}
                <div
                    ref={blueLineRef}
                    className="absolute right-0 bottom-[10vh] w-[70vw] h-[1vw] origin-right scale-x-0 scale-y-0"
                >
                    <div
                        className="
                      h-[0.8vw] rounded-full
                      bg-gradient-to-r 
                        from-[#1A93E9] 
                        via-[#6FC6FF] 
                        to-[#1A93E9]
                      shadow-[0_0.4vw_1vw_rgba(26,147,233,0.35)]
                    "
                    />
                    <div
                        className="
                      absolute top-[15%] left-0
                      h-[20%] w-full
                      rounded-full
                      bg-white/55
                      blur-[0.15vw]
                      pointer-events-none
                    "
                    />
                </div>
            </div>
            {/* white background */}
            <div className="rotation-wrapper z-[-1]">
                <div className="w-[100vw] h-[50vw] bg-white/95 drop-shadow-[0_0_8px_rgba(255,255,255,1)] shrink-0" ref={whitePart}>
                </div>
            </div>
        </div>
    );
}
