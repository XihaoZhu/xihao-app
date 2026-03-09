"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const cards = [
    { title: "Design System", size: "big", color: "bg-red-400" },
    { title: "Motion Lab", size: "small", color: "bg-green-400" },
    { title: "Interactive Story", size: "wide", color: "bg-blue-400" },
    { title: "Creative Coding", size: "small", color: "bg-yellow-400" },
    { title: "Experiments", size: "big", color: "bg-purple-400" },
    { title: "Visual Research", size: "wide", color: "bg-teal-400" }
]

export default function History() {

    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {

        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top 15%",
            end: "+=2000",
            pin: true,
            scrub: 1
        })

    }, [])

    const sizeMap: Record<string, string> = {
        big: "col-span-6 row-span-2",
        wide: "col-span-8",
        small: "col-span-4"
    }

    return (
        <div className="w-screen h-screen bg-green-500 z-100">

            <div className="min-h-[300vh] bg-neutral-950">

                <div className="w-full flex justify-center">

                    <div className="w-full max-w-6xl">

                        <div className="h-[70vh] mt-[15vh] overflow-hidden">

                            <div
                                ref={containerRef}
                                className="grid grid-cols-12 auto-rows-[180px] gap-6 w-full"
                            >

                                {cards.map((card, i) => (

                                    <div
                                        key={i}
                                        className={`
                    ${sizeMap[card.size]}
                    ${card.color}
                    rounded-2xl
                    p-8
                    text-white
                    shadow-xl
                    flex
                    flex-col
                    justify-center
                    transition
                    hover:scale-[1.02]
                  `}
                                    >

                                        <h2 className="text-2xl font-semibold">
                                            {card.title}
                                        </h2>

                                        <p className="text-sm mt-2 opacity-80">
                                            Lorem ipsum dolor sit amet
                                        </p>

                                    </div>

                                ))}

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </div>

    )

}