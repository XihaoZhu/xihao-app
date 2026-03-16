import React, { use, useEffect, useRef, useState } from "react"
import SingleCard from "./singleCard/SingleCard"
import { cards } from "./cardsContext"
import { gsap } from "gsap"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"

const ContainerWidth = 60
const ContainerHeightVW = 1.65 * ContainerWidth



export default function History() {

    const dispatch = useDispatch()
    const { currentSection } = useSelector((state: RootState) => state.currentPage)

    const requestRef = useRef<number>(0)
    const velocityRef = useRef(0)

    const [offset, setOffset] = useState(ContainerHeightVW)

    const groupPositions = useRef([
        0,
        ContainerHeightVW,
        2 * ContainerHeightVW
    ])

    const [viewportHeightVW, setViewportHeightVW] = useState(0)

    const maxSpeed = 2

    // 把 80vh 转换成 vw
    useEffect(() => {

        const updateVH = () => {
            const vhToVw = window.innerHeight / window.innerWidth
            setViewportHeightVW(80 * vhToVw)
        }

        updateVH()

        window.addEventListener("resize", updateVH)

        return () => window.removeEventListener("resize", updateVH)

    }, [])

    // 滚轮输入
    useEffect(() => {

        const handleWheel = (e: WheelEvent) => {

            velocityRef.current += e.deltaY * 0.003

            if (velocityRef.current > maxSpeed) velocityRef.current = maxSpeed
            if (velocityRef.current < -maxSpeed) velocityRef.current = -maxSpeed
        }

        window.addEventListener("wheel", handleWheel, { passive: true })

        return () => window.removeEventListener("wheel", handleWheel)

    }, [])

    // animation loop
    useEffect(() => {

        const animate = () => {

            const damping = 0.92

            velocityRef.current *= damping

            if (Math.abs(velocityRef.current) < 0.001) {
                velocityRef.current = 0
            }

            setOffset(prev => {

                let newOffset = prev + velocityRef.current




                groupPositions.current = groupPositions.current.map(pos => {

                    if (velocityRef.current > 0 && pos - newOffset + ContainerHeightVW < 0) {
                        return pos + 3 * ContainerHeightVW
                    }

                    if (velocityRef.current < 0 && pos - newOffset > viewportHeightVW) {
                        return pos - 3 * ContainerHeightVW
                    }

                    return pos
                })

                return newOffset
            })

            requestRef.current = requestAnimationFrame(animate)

        }

        requestRef.current = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(requestRef.current)

    }, [viewportHeightVW])

    const biggestContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (currentSection == 3) {
            gsap.to(biggestContainerRef.current, {
                opacity: 1,
                delay: 1,
                duration: 1.5,
                ease: "power3.Out"
            })
        }
    }, [currentSection])

    // fading out ani
    useEffect(() => {
        if (currentSection == 4) {
            gsap.to(biggestContainerRef.current, {
                opacity: 0,
                duration: 0.5,
                ease: "power3.Out"
            })
        }
    }, [currentSection])

    return (

        <div className="w-screen h-screen flex items-center justify-center z-10 opacity-0 " ref={biggestContainerRef}>

            <div className="relative w-full h-[80vh] overflow-hidden flex items-center justify-center">

                <div
                    className="relative h-[80vh]"
                    style={{ width: ContainerWidth + "vw" }}
                >

                    {cards.map(card =>

                        groupPositions.current.map((groupPos, i) => {

                            const cardTop =
                                card.y * ContainerWidth + groupPos - offset

                            const cardHeight =
                                card.height * ContainerWidth

                            const cardBottom =
                                cardTop + cardHeight

                            let topGlowY: number | null = null
                            let bottomGlowY: number | null = null

                            // top edge
                            if (cardTop < 0 && cardBottom > 0) {
                                topGlowY = -cardTop
                            }

                            // bottom edge
                            if (cardTop < viewportHeightVW && cardBottom > viewportHeightVW) {
                                bottomGlowY = viewportHeightVW - cardTop
                            }

                            return (

                                <SingleCard
                                    key={`${card.id}-group-${i}`}
                                    width={card.width * ContainerWidth + "vw"}
                                    height={card.height * ContainerWidth + "vw"}
                                    title={card.title}
                                    hoverText={card.hoverText}
                                    link={card.link}
                                    img={card.img}
                                    x={card.x * ContainerWidth + "vw"}
                                    y={card.y * ContainerWidth + groupPos - offset + "vw"}
                                    topGlowY={topGlowY}
                                    bottomGlowY={bottomGlowY}
                                    filter={card.filter}
                                />

                            )
                        })
                    )}

                </div>
            </div>
        </div>
    )
}