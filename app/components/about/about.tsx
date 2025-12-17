import gsap from "gsap";
import { useEffect, useRef } from "react";
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
    const rafRef = useRef<number | null>(null);


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
        }
    }, [pageCurrentSection]);


    // logic about the rotation of white part
    const handleRotate = (e: MouseEvent) => {
        if (pageCurrentSection !== 1) return;
        if (!introDoneRef.current) return;

        const deltaX = e.clientX / window.innerWidth - 0.5;
        const angle = deltaX * 10
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

    useEffect(() => {
        if (pageCurrentSection !== 1) return;

        let rafId: number;

        const tick = () => {
            if (!introDoneRef.current) {
                rafId = requestAnimationFrame(tick);
                return;
            }

            const angleDeg = currentAngleRef.current;

            deltaXRef.current += angleDeg * 0.001;
            deltaXRef.current = Math.max(0.025, Math.min(0.975, deltaXRef.current));

            const x = deltaXRef.current;
            const slope = Math.tan(angleDeg * Math.PI / 180);
            const aspectRatio = window.innerHeight / window.innerWidth;
            const y = 0.5 + (x - 0.5) * slope * aspectRatio;

            dispatch(move({ x: x + 1, y }));

            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(rafId);
    }, [pageCurrentSection]);


    return (
        <div className="relative w-screen h-screen flex flex-col items-center shrink-0 overflow-hidden">
            <div className="w-[100vw] h-[50vh]"></div>
            <div className="w-[100vw] h-[50vh] bg-white/95 drop-shadow-[0_0_8px_rgba(255,255,255,1)]" ref={whitePart}></div>
        </div>
    );
}
