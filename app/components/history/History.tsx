import React, { useEffect, useRef, useState } from "react"
import SingleCard from "./singleCard/SingleCard"


const ContainerWidth = 60
const ContainerHeightVW = 2 * ContainerWidth

type CardData = {
    id: number
    x: number
    y: number
    width: number
    height: number
    title: string[]
    hoverText: string
    link: string
    img?: string
}

export default function History() {

    const cards: CardData[] = [
        { id: 1, x: 0, y: 0, width: 0.55, height: 0.5, title: ["Card 1"], hoverText: "Hover text 1", link: "#", img: "bg-red-400" },
        {
            id: 2, x: 0.6, y: 0, width: 0.4, height: 0.9, title: ['2023', 'My first project', 'shows detials about the way I self taught coding and some other skills helpful for frontend development'], hoverText: "Hover text 2", link: "#", img: "/assets/FirstP.png"
        },
        { id: 3, x: 0, y: 0.55, width: 0.25, height: 0.7, title: ["Card 3"], hoverText: "Hover text 3", link: "#", img: "bg-green-400" },
        { id: 4, x: 0.3, y: 0.55, width: 0.25, height: 0.7, title: ["Card 4"], hoverText: "Hover text 4", link: "#", img: "bg-yellow-400" },
        { id: 5, x: 0.6, y: 0.95, width: 0.4, height: 0.3, title: ["Card 5"], hoverText: "Hover text 5", link: "#", img: "bg-pink-400" },
        { id: 6, x: 0, y: 1.3, width: 1, height: 0.3, title: ["Card 6"], hoverText: "Hover text 6", link: "#", img: "bg-purple-400" },
        { id: 7, x: 0, y: 1.65, width: 0.3, height: 0.3, title: ["Card 7"], hoverText: "Hover text 7", link: "#", img: "bg-indigo-400" },
        { id: 8, x: 0.35, y: 1.65, width: 0.3, height: 0.3, title: ["Card 8"], hoverText: "Hover text 8", link: "#", img: "bg-teal-400" },
        { id: 9, x: 0.7, y: 1.65, width: 0.3, height: 0.3, title: ["Card 9"], hoverText: "Hover text 9", link: "#", img: "bg-fuchsia-400" },
    ]

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

    return (

        <div className="w-screen h-screen flex items-center justify-center z-10">

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
                                />

                            )
                        })
                    )}

                </div>
            </div>
        </div>
    )
}