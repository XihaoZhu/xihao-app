import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { move } from "@/store/ballControl";

export default function About() {

    const pageCurrentSection = useSelector((state: RootState) => state.currentPage.currentSection);
    const whitePart = useRef<HTMLDivElement>(null);
    const { x, y } = useSelector((state: RootState) => state.ballInfo);

    const introDoneRef = useRef(false);

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

    const texts: string[] = [
        "I graduated from the University of Nottingham with a Bachelor’s degree in Aerospace Engineering.",
        "I graduated from the University of Manchester with a Master’s degree in Aerospace Engineering.",
        "I worked part-time in a restaurant.",
        "Then I worked full-time at another restaurant.",
        "I also taught A-level physics in an extracurricular class for 6 months as a part time job.",
        "I became the supervisor at the restaurant.",
        "I saved some money and quit to focus on coding.",
        "I began self-learning coding at the end of 2023, and although the time and effort I could dedicate varied across different periods, I have never stopped moving forward in this direction."
    ];


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
                scaleX: 0
            },
                {
                    scaleX: 0.025,
                    ease: "power2.out",
                    duration: 3,
                })
        }
    }, [pageCurrentSection]);


    // logic about the rotation of white part
    const handleRotate = (e: MouseEvent) => {
        if (pageCurrentSection !== 1) return;
        if (!introDoneRef.current) return;

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

    // logic about the ball rolling, line extending and year showing
    useEffect(() => {
        if (pageCurrentSection !== 1) return;

        let rafId: number;
        let frame = 0

        const tick = () => {
            if (!introDoneRef.current) {
                rafId = requestAnimationFrame(tick);
                return;
            }

            frame++;

            const angleDeg = currentAngleRef.current;

            deltaXRef.current += angleDeg * 0.0005;
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

    useEffect(() => {
        if (!greenLineRef.current || arrivedTheEnd || !introDoneRef.current) return;
        if (x > 1.9) setArrivedTheEnd(true)
        gsap.to(greenLineRef.current, {
            scaleX: Math.min((x - 1) / 0.9, 1),
            duration: 0.1,
            overwrite: "auto",
        });



    }, [x, arrivedTheEnd]);

    return (
        <div className="relative w-screen h-screen flex flex-col items-center shrink-0 overflow-hidden">
            <div className="w-[100vw] h-[50vh] shrink-0 flex flex-col items-center text-white justify-center">
                <div className="max-w-[75vw] text-[2vw]">
                    {texts[0]}
                </div>
            </div>

            <div
                ref={greenLineRef}
                className="absolute left-0 w-[90vw] h-[1vw] bg-[#2FE91A] bottom-[30vh] rounded-xl origin-left scale-x-0"
            />
            <div className="text-black absolute bottom-[17.5vh] flex text-[3vw] justify-around w-[100vw]" ref={yearLineRef}>
                <div>2022</div>
                <div>2023</div>
                <div>2024</div>
                <div>2025</div>
            </div>
            <div className="absolute right-0 w-[70vw] h-[1vw] bg-[#1A93E9] bottom-[10vh] rounded-xl" ref={blueLineRef}></div>
            <div className="w-[100vw] h-[50vw] bg-white/95 drop-shadow-[0_0_8px_rgba(255,255,255,1)] shrink-0 z-[-1]" ref={whitePart}>
            </div>
        </div>
    );
}
