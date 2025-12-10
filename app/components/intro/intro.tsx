import React, { useEffect } from "react";
import { gsap } from "gsap";

export default function Intro() {


    const containerRef = React.useRef<HTMLDivElement>(null);
    const line1Ref = React.useRef<HTMLDivElement>(null);
    const line2Ref = React.useRef<HTMLDivElement>(null);
    const ballRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateChars = () => {
            if (!ballRef.current || !line1Ref.current || !line2Ref.current) return;

            const ballRect = ballRef.current.getBoundingClientRect();
            const ballCenter = {
                x: ballRect.left + ballRect.width / 2,
                y: ballRect.top + ballRect.height / 2,
            };

            const chars = [
                ...line1Ref.current.querySelectorAll("span"),
                ...line2Ref.current.querySelectorAll("span"),
            ];

            chars.forEach((char) => {
                const r = char.getBoundingClientRect();

                const charCenter = {
                    x: r.left + r.width / 2,
                    y: r.top + r.height / 2,
                };

                const dx = charCenter.x - ballCenter.x;
                const dy = charCenter.y - ballCenter.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // 形变中心（字符内最靠近球的点）
                const originX = Math.max(0, Math.min(ballCenter.x - r.left, r.width));
                const originY = Math.max(0, Math.min(ballCenter.y - r.top, r.height));

                gsap.set(char, {
                    transformOrigin: `${originX}px ${originY}px`,
                });

                // 影响半径
                const maxDist = 250;
                const influence = 1 - Math.min(dist / maxDist, 1);

                gsap.to(char, {
                    scale: 1 + influence * 0.3,
                    duration: 0.2,
                    overwrite: true,
                });
            });
        };

        gsap.ticker.add(updateChars);

        return () => gsap.ticker.remove(updateChars);
    }, []);

    const splitText = (text: string) =>
        text.split("").map((char, i) => (
            <span key={i} className="inline-block">
                {char}
            </span>
        ));

    return (
        <div className="relative w-screen h-screen flex flex-col items-center overflow-hidden">
            <div
                ref={containerRef}
                className="relative text-[calc(100vw*1.05/10)] leading-tight text-center"
            >
                <div className="relative inline-block">
                    <div ref={line1Ref}>
                        {splitText("Follow the Ball")}
                    </div>

                    <div
                        ref={ballRef}
                        className="absolute left-1/2 top-1/2 
                       -translate-x-1/2 -translate-y-1/2 
                       w-[10vw] h-[10vw] bg-white rounded-full pointer-events-none"
                    />

                    <div ref={line2Ref}>
                        {splitText("It tells you about")}
                    </div>
                </div>
            </div>
            <div className="absolute bottom-[-12vw] left-[-5vw] text-[calc(100vw*1.05/4)] whitespace-nowrap tracking-[-0.15em] font-inter">
                XIHAO ZHU
            </div>
        </div>
    );
}
