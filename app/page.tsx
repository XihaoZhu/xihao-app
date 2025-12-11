'use client';

import { useEffect, useRef } from "react";
import About from "./components/about/about";
import Intro from "./components/intro/intro";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { gsap } from "gsap";


export default function Home() {

  const pageCurrentSection = useSelector((state: RootState) => state.currentPage.currentSection);
  const biggestContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pageCurrentSection == 1) {
      gsap.to(biggestContainerRef.current, {
        x: -window.innerWidth,
        duration: 2,
        ease: "power2.inOut",
      })
    }
  }, [pageCurrentSection]);

  return (
    <div className="bg-black h-screen flex overflow-hidden w-screen" >
      <div
        className="flex h-auto w-auto"
        ref={biggestContainerRef}
      >
        <Intro />
        <About />
      </div>
    </div>
  );
}
