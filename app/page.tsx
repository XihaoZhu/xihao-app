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

  const windowHeightRef = useRef(0);
  const windowWidthRef = useRef(0);

  const hasMovedtoAbout = useRef(false)

  const biggestContainerRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const movementX = useRef(0);

  useEffect(() => {
    if (!window) return;
    windowHeightRef.current = window.innerHeight;
    windowWidthRef.current = window.innerWidth;
  }, []);

  const dispatch = useDispatch();

  // update ball position function
  const handleBallMove = (duration?: number, ease?: string) => {
    gsap.to(ballRef.current, {
      transformOrigin: "50% 50%",
      x: ballLocationRef.current.x * windowWidthRef.current - 2.5 * windowWidthRef.current / 100,
      y: ballLocationRef.current.y * windowHeightRef.current - (pageCurrentSection == 1 ? 5 : 2.5) * windowWidthRef.current / 100,
      duration: duration || 1,
      ease: ease || "power3.Out",
    });
  }

  // when move to about section the viewport moves
  useEffect(() => {
    if (pageCurrentSection == 1) {
      gsap.to(biggestContainerRef.current, {
        x: -windowWidthRef.current,
        duration: 2,
        ease: "power2.inOut",
      })
    }
  }, [pageCurrentSection]);


  // when move to about section the ball moves
  useEffect(() => {
    if (pageCurrentSection === 1) {
      const tl = gsap.timeline()
      tl.to(ballRef.current, { x: ballLocationRef.current.x * windowWidthRef.current, duration: 3, ease: 'power2.out' })
      tl.to(ballRef.current, {
        y: 0.65 * windowHeightRef.current - 0.05 * windowWidthRef.current,
        duration: 2,
        ease: "bounce.out"
      }, '<')
      tl.to(ballRef.current, {
        y: 0.5 * windowHeightRef.current - 0.05 * windowWidthRef.current,
        duration: 1,
        ease: "power2.out", onComplete: () => {
          hasMovedtoAbout.current = true
          dispatch(
            move({
              y: 0.5,
              x: ballLocationRef.current.x + 0.025,
            })
          );
        },
      }, '>')
    }
  }, [pageCurrentSection]);

  // handle resizing of window
  useEffect(() => {
    const handleResize = () => {
      windowHeightRef.current = window.innerHeight;
      windowWidthRef.current = window.innerWidth;

      if (!biggestContainerRef.current) return;
      if (!ballRef.current) return;

      if (pageCurrentSection == 1) {
        gsap.to(biggestContainerRef.current, {
          x: -windowWidthRef.current,
        });
      };

      handleBallMove();
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pageCurrentSection, windowHeightRef, windowWidthRef]);

  //Set initial ball position
  const hasInitiate = useRef(false);
  useEffect(() => {
    if (hasInitiate.current) return;
    if (!ballRef.current) return;
    handleBallMove();

    if (ballLocationRef.current.y != 0) hasInitiate.current = true;
  }, [y]);

  //Move the ball on scroll in intro page only
  const listenersReady = useRef(false);
  useEffect(() => {
    if (!ballRef.current) return;
    if (pageCurrentSection != 0) return;

    const ball = ballRef.current;

    const handleWheel = (e: WheelEvent) => {
      movementX.current = e.deltaY * 0.35;
      let newX = ballLocationRef.current.x + movementX.current / windowWidthRef.current;
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
        x: newX * windowWidthRef.current - 2.5 * windowWidthRef.current / 100,
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

  // ballMove in about page
  useEffect(() => {
    if (pageCurrentSection !== 1) return;
    if (!hasMovedtoAbout.current) return
    handleBallMove();
  }, [x, y, pageCurrentSection, hasMovedtoAbout.current]);

  return (
    <div className="bg-black h-screen flex overflow-hidden w-screen relative" >
      <div
        className="flex h-auto w-auto p-0 relative"
        ref={biggestContainerRef}
      >
        <div
          ref={ballRef}
          className="
                          absolute
                          inline-block
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
