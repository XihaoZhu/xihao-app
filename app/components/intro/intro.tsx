import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { getAssetAsBlob } from "node:sea";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useDispatch } from "react-redux";
import { nextSection } from "@/store/pageControl";

export default function Intro() {


    const containerRef = React.useRef<HTMLDivElement>(null);
    const line1Ref = React.useRef<HTMLDivElement>(null);
    const line2Ref = React.useRef<HTMLDivElement>(null);
    const ballRef = React.useRef<HTMLDivElement>(null);
    const outerContainerRef = React.useRef<HTMLDivElement>(null);
    const ballX = useRef(0);
    const listenersReady = useRef(false);
    const pageCurrentSection = useSelector((state: RootState) => state.currentPage.currentSection);
    const dispatch = useDispatch();

    //Animate characters based on ball position
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

                const originX = ballCenter.x < r.left + r.width / 2 ? r.width : 0;
                const originY = ballCenter.y < r.top + r.height / 2 ? r.height : 0;

                gsap.set(char, {
                    transformOrigin: `${originX}px ${originY}px`,
                });

                const maxDist = 300;
                const influence = 1 - Math.min(dist / maxDist, 1);
                const angle = gsap.utils.clamp(-20, 20, dx * 0.2);

                gsap.to(char, {
                    scale: 1 - influence * 0.6,
                    x: (dx / dist) * influence * 10,
                    y: (dy / dist) * influence * 10,
                    duration: 0.3,
                    rotateZ: angle * influence,
                    ease: "power3.Out",
                    overwrite: true,
                });
            });
        };

        gsap.ticker.add(updateChars);

        return () => gsap.ticker.remove(updateChars);
    }, []);


    //Move the ball on scroll
    useEffect(() => {
        const ball = ballRef.current;
        if (!ball) return;

        const handleWheel = (e: WheelEvent) => {
            if (pageCurrentSection != 0) return;
            ballX.current += e.deltaY * 0.35;
            if (ballX.current < -window.innerWidth / 2) {
                ballX.current = -window.innerWidth / 2;
            }
            if (ballX.current > window.innerWidth / 2) {
                ballX.current = window.innerWidth / 2
                dispatch(nextSection());
            }
            gsap.to(ball, {
                x: ballX.current,
                duration: 0.5,
                ease: "power3.Out",
                onUpdate: () => {
                    updateBallCenter();
                },
            });
        };

        const updateBallCenter = () => {
            const rect = ball.getBoundingClientRect();
            const center = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
            };
        };

        if (!listenersReady.current) {
            window.addEventListener("wheel", handleWheel, { passive: true });
            listenersReady.current = true;
        }

        return () => {
            window.removeEventListener("wheel", handleWheel);
        };
    }, []);

    const renderText = (list: Array<{ char: string; color?: string; stroke?: boolean }>) =>
        list.map((item, i) => (
            <span
                key={i}
                className={`inline-block whitespace-pre ${item.stroke ? "stroke-text" : ""}`}
                style={{
                    color: item.color ?? "rgba(255, 255, 255, 0.9)",
                }}
            >
                {item.char}
            </span>
        ));
    const text1 = [{ char: "F" }, { char: "o" }, { char: "l" }, { char: "l" }, { char: "o" }, { char: "w" }, { char: " " }, { char: "t" }, { char: "h" }, { char: "e" }, { char: " " }, { char: "B", color: 'transparent', stroke: true }, { char: "a", color: 'transparent', stroke: true }, { char: "l", color: 'transparent', stroke: true }, { char: "l", color: 'transparent', stroke: true }];
    const text2 = [{ char: "I" }, { char: "t" }, { char: " " }, { char: "t" }, { char: "e" }, { char: "l" }, { char: "l" }, { char: "s" }, { char: " " }, { char: "y" }, { char: "o" }, { char: "u" }, { char: " " }, { char: "a" }, { char: "b" }, { char: "o" }, { char: "u" }, { char: "t" }];

    return (
        <div className="relative w-screen h-screen flex flex-col items-center shrink-0" ref={outerContainerRef}>
            <div
                ref={containerRef}
                className="relative text-[calc(100vw*1.05/10)] leading-tight text-center"
            >
                <div className="relative inline-block">
                    <div ref={line1Ref}>
                        {renderText(text1)}
                    </div>

                    <div
                        ref={ballRef}
                        className="
                          absolute left-1/2 top-1/2
                          -translate-x-1/2 -translate-y-1/2
                          w-[5vw] h-[5vw]
                          rounded-full pointer-events-none
                          shadow-[0_0_40px_10px_rgba(255,255,255,0.45),0_0_60px_25px_rgba(200,204,208,0.35),inset_0_0_18px_8px_rgba(255,255,255,0.35),inset_0_0_30px_16px_rgba(40,40,40,0.55)]
                         "
                    ></div>

                    <div ref={line2Ref}>
                        {renderText(text2)}
                    </div>
                </div>
            </div>
            <div
                className="
                  absolute bottom-[-12vw] left-[-5vw]
                  text-[calc(100vw*1.05/4)]
                  whitespace-nowrap
                  tracking-[-0.15em]
                  font-inter
                  text-white/95
                  drop-shadow-[0_0_8px_rgba(255,255,255,1)]
                "
            >
                XIHAO ZHU
            </div>
        </div>
    );
}
