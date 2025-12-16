'use client';

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { getAssetAsBlob } from "node:sea";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useDispatch } from "react-redux";
import { move } from "@/store/ballControl";
import { useLayoutEffect } from "react";

export default function Intro() {


    const containerRef = React.useRef<HTMLDivElement>(null);
    const line1Ref = React.useRef<HTMLDivElement>(null);
    const line2Ref = React.useRef<HTMLDivElement>(null);
    const outerContainerRef = React.useRef<HTMLDivElement>(null);

    const x = useSelector((state: RootState) => state.ballInfo.x);
    const y = useSelector((state: RootState) => state.ballInfo.y);
    const dispatch = useDispatch();

    // Initiate ball position in the middle of two lines    
    useLayoutEffect(() => {
        if (!containerRef.current) return;
        const containerSize = containerRef.current.getBoundingClientRect()
        const mid = (containerSize.top + containerSize.bottom) / 2;
        dispatch(move({ x, y: mid / window.innerHeight }));
    }, []);

    //Animate characters based on ball position
    useEffect(() => {

        const updateChars = () => {
            if (!line1Ref.current || !line2Ref.current) return;

            const ballCenter = {
                x: x * window.innerWidth, y: y * window.innerHeight
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

                const maxDist = window.innerWidth / 5;
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
    }, [x, y]);


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
        <div className="relative w-screen h-screen flex flex-col items-center shrink-0 mt-0 overflow-hidden" ref={outerContainerRef}>
            <div
                ref={containerRef}
                className="relative text-[10vw] leading-tight text-center"
            >
                <div className="relative inline-block">
                    <div ref={line1Ref}>
                        {renderText(text1)}
                    </div>

                    <div ref={line2Ref}>
                        {renderText(text2)}
                    </div>
                </div>
            </div>
            <div
                className="
                  absolute bottom-[-12vw] left-[-5vw]
                  text-[26vw]
                  whitespace-nowrap
                  tracking-[-0.15em]
                  font-inter
                  text-white
                  drop-shadow-[0_0_8px_rgba(255,255,255,1)]
                "
            >
                XIHAO ZHU
            </div>
        </div>
    );
}
