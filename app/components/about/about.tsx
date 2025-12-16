import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";

export default function About() {

    const pageCurrentSection = useSelector((state: RootState) => state.currentPage.currentSection);
    const whitePart = useRef<HTMLDivElement>(null);



    useEffect(() => {
        if (pageCurrentSection == 1) {
            // gsap.from(whitePart.current, {
            //     y: '34%',
            //     x: '1%',
            //     duration: 1,
            //     delay: 1.5,
            //     ease: "power2.Out",
            // })
            gsap.set(whitePart.current, {
                y: '15vh',
            })
        }

    }, [pageCurrentSection]);



    return (
        <div className="relative w-screen h-screen flex flex-col items-center shrink-0 overflow-hidden">
            <div className="w-[100vw] h-[50vh]"></div>
            <div className="w-[100vw] h-[50vh] bg-white/95 drop-shadow-[0_0_8px_rgba(255,255,255,1)]" ref={whitePart}></div>
        </div>
    );
}
