'use client';

import { use, useEffect, useRef } from "react";
import About from "./components/about/about";
import Intro from "./components/intro/intro";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { gsap } from "gsap";
import { nextSection } from "@/store/pageControl";
import { move } from "@/store/ballControl";



export default function Home() {

  const pageCurrentSection = useSelector((state: RootState) => state.currentPage.currentSection);
  const x = useSelector((state: RootState) => state.ballInfo.x);
  const y = useSelector((state: RootState) => state.ballInfo.y);
  const biggestContainerRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const ballX = useRef(0);
  const ballY = useRef(0);
  const dispatch = useDispatch();
  const listenersReady = useRef(false);

  // when move to about section the viewport moves
  useEffect(() => {
    if (pageCurrentSection == 1) {
      gsap.to(biggestContainerRef.current, {
        x: -window.innerWidth,
        duration: 2,
        ease: "power2.inOut",
      })
    }
  }, [pageCurrentSection]);

  //Set initial ball position
  const hasRunRef = useRef(false);
  useEffect(() => {
    if (hasRunRef.current) return;
    if (!ballRef.current) return;

    ballRef.current.style.top = y + 'px';
    ballRef.current.style.left = x + 'px';

    if (y != 0) hasRunRef.current = true;
  }, [y]);

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
        window.removeEventListener("wheel", handleWheel);
        dispatch(nextSection());
      }
      dispatch(move({ x: x + ballX.current }));
      gsap.to(ball, {
        x: ballX.current,
        duration: 0.5,
        ease: "power3.Out",
      });
    };


    if (!listenersReady.current) {
      window.addEventListener("wheel", handleWheel, { passive: true });
      listenersReady.current = true;
    }

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="bg-black h-screen flex overflow-hidden w-screen relative" >
      <div
        className="flex h-auto w-auto"
        ref={biggestContainerRef}
      >
        <div
          ref={ballRef}
          className="
                          absolute
                          -translate-x-1/2 -translate-y-1/2
                          w-[5vw] h-[5vw]
                          rounded-full pointer-events-none
                          shadow-[0_0_40px_10px_rgba(255,255,255,0.45),0_0_60px_25px_rgba(200,204,208,0.35),inset_0_0_18px_8px_rgba(255,255,255,0.35),inset_0_0_30px_16px_rgba(40,40,40,0.55)]
                         "
        ></div>
        <Intro />
        <About />
      </div>
    </div>
  );
}
