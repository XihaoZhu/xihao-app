interface WheelProps {

}

import { FC, useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

export const Wheel: FC<WheelProps> = ({

}) => {

    const text1Ref = useRef<SVGTextElement>(null);
    const text2Ref = useRef<SVGTextElement>(null);
    const svgArea = useRef<SVGSVGElement>(null);
    const tl = useRef<gsap.core.Timeline>(null);

    useEffect(() => {
        if (!text1Ref.current || !text2Ref.current) return;

        if (tl.current) {
            tl.current.kill()
        }

        const timeline = gsap.timeline({
            repeat: -1,
        });
        tl.current = timeline;
        timeline.to(text1Ref.current, {
            rotate: '-=360',
            transformOrigin: "50% 50%",
            duration: 10,
            ease: 'none'
        });
        timeline.to(text2Ref.current, {
            rotate: '+=360',
            transformOrigin: "50% 50%",
            duration: 10,
            ease: 'none'
        }, '<');

        const handleMouseEnter = () => {
            timeline.timeScale(0.4);
        };
        const handleMouseLeave = () => {
            timeline.timeScale(1);
        };

        const svg = svgArea.current;
        if (svg) {
            svg.addEventListener('mouseenter', handleMouseEnter);
            svg.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            timeline.kill();
            if (svg) {
                svg.removeEventListener('mouseenter', handleMouseEnter);
                svg.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [text1Ref.current, text2Ref.current]);



    return (
        <svg viewBox="0 0 200 200" ref={svgArea} className="w-full h-full">
            <path id="circlePath1" d="M50,100a50,50 0 1,1 100,0a50,50 0 1,1 -100,0"
                fill="none" />
            <text className="font-bold fill-current cursor-default" textLength={300} ref={text1Ref}>
                <textPath href="#circlePath1" startOffset="0%">
                    Python JavaScrip PHP(very little :P)
                </textPath>
            </text>
            <path id="circlePath2" d="M20,100a80,80 0 1,1 160,0a80,80 0 1,1 -160,0"
                fill="none" />
            <text className="text-[0.5vw] font-bold fill-current cursor-default" textLength={480} ref={text2Ref}>
                <textPath href="#circlePath2" startOffset="0%">
                    React Vue Next.js ReactNative Tailwind GSAP THREE.js TypeScript ...
                </textPath>
            </text>
        </svg>
    )
}
