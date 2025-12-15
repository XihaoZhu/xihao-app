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
  const { x, y } = useSelector((state: RootState) => state.ballInfo);
  const ballLocationRef = useRef({ x, y });
  useEffect(() => { ballLocationRef.current = { x, y }; }, [x, y]);

  const biggestContainerRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const movementX = useRef(0);
  const movementY = useRef(0);

  const dispatch = useDispatch();

  const originalWindowWidth = useRef(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const originalWindowHeight = useRef(
    typeof window !== "undefined" ? window.innerHeight : 0
  );


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

    gsap.set(ballRef.current, {
      x: ballLocationRef.current.x * window.innerWidth,
      y: ballLocationRef.current.y * window.innerHeight,
    });

    if (ballLocationRef.current.y != 0) hasRunRef.current = true;
  }, [y]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!ballRef.current) return;

      gsap.set(ballRef.current, {
        x: ballLocationRef.current.x * window.innerWidth,
        y: ballLocationRef.current.y * window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //Move the ball on scroll in intro page only
  const listenersReady = useRef(false);
  useEffect(() => {
    if (!ballRef.current) return;
    if (pageCurrentSection != 0) return;

    const ball = ballRef.current;

    const handleWheel = (e: WheelEvent) => {
      movementX.current = e.deltaY * 0.35;
      let newX = ballLocationRef.current.x + movementX.current / window.innerWidth;
      if (newX < 0) {
        newX = 0;
      }
      if (newX > 1) {
        newX = 1;
        window.removeEventListener("wheel", handleWheel);
        dispatch(nextSection());
      }
      dispatch(move({ x: newX }));
      gsap.to(ball, {
        x: newX * window.innerWidth,
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
