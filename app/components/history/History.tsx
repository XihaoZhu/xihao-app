import React, { useEffect, useRef, useState } from "react"
import SingleCard from "./singleCard/SingleCard"

const ContainerWidth = 60 // 父容器宽度 vw
const ContainerHeightVW = 2 * ContainerWidth // 父容器总高度
const ViewportHeightVW = 80 // 可视区高度 vw

type CardData = {
    id: number
    x: number
    y: number
    width: number
    height: number
    title: string
    hoverText: string
    link: string
    bgColor?: string
}

export default function History() {
    const cards: CardData[] = [
        { id: 1, x: 0, y: 0, width: 0.55, height: 0.5, title: "Card 1", hoverText: "Hover text 1", link: "#", bgColor: "bg-red-400" },
        { id: 2, x: 0.6, y: 0, width: 0.4, height: 0.9, title: "Card 2", hoverText: "Hover text 2", link: "#", bgColor: "bg-blue-400" },
        { id: 3, x: 0, y: 0.55, width: 0.25, height: 0.7, title: "Card 3", hoverText: "Hover text 3", link: "#", bgColor: "bg-green-400" },
        { id: 4, x: 0.3, y: 0.55, width: 0.25, height: 0.7, title: "Card 4", hoverText: "Hover text 4", link: "#", bgColor: "bg-yellow-400" },
        { id: 5, x: 0.6, y: 0.95, width: 0.4, height: 0.3, title: "Card 5", hoverText: "Hover text 5", link: "#", bgColor: "bg-pink-400" },
        { id: 6, x: 0, y: 1.3, width: 1, height: 0.3, title: "Card 6", hoverText: "Hover text 6", link: "#", bgColor: "bg-purple-400" },
        { id: 7, x: 0, y: 1.65, width: 0.3, height: 0.3, title: "Card 7", hoverText: "Hover text 7", link: "#", bgColor: "bg-indigo-400" },
        { id: 8, x: 0.35, y: 1.65, width: 0.3, height: 0.3, title: "Card 8", hoverText: "Hover text 8", link: "#", bgColor: "bg-teal-400" },
        { id: 9, x: 0.7, y: 1.65, width: 0.3, height: 0.3, title: "Card 9", hoverText: "Hover text 9", link: "#", bgColor: "bg-fuchsia-400" },
    ]

    const requestRef = useRef<number>(0)
    const velocityRef = useRef(0)
    const [offset, setOffset] = useState(ContainerHeightVW) // 初始展示第二组
    const groupPositions = useRef([0, ContainerHeightVW, 2 * ContainerHeightVW]) // 三组初始位置

    const maxSpeed = 2 // 最大滚动速度
    const damping = 0.92 // 阻尼系数，值越小阻力越大

    // 监听滚轮
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            velocityRef.current += e.deltaY * 0.03
            // 限制最大速度
            if (velocityRef.current > maxSpeed) velocityRef.current = maxSpeed
            if (velocityRef.current < -maxSpeed) velocityRef.current = -maxSpeed
        }
        window.addEventListener("wheel", handleWheel, { passive: true })
        return () => window.removeEventListener("wheel", handleWheel)
    }, [])

    // 动画循环
    useEffect(() => {
        const animate = () => {
            let newOffset = offset + velocityRef.current

            // 阻尼减速
            velocityRef.current *= damping
            // 当速度非常小的时候直接归零，防止无限抖动
            if (Math.abs(velocityRef.current) < 0.001) velocityRef.current = 0

            // 检查每组是否完全离开可视区，循环移动
            groupPositions.current = groupPositions.current.map(pos => {
                // 向下滚动
                if (velocityRef.current > 0 && pos - newOffset + ContainerHeightVW < 0) {
                    return pos + 3 * ContainerHeightVW
                }
                // 向上滚动
                if (velocityRef.current < 0 && pos - newOffset > ViewportHeightVW) {
                    return pos - 3 * ContainerHeightVW
                }
                return pos
            })

            setOffset(newOffset)
            requestRef.current = requestAnimationFrame(animate)
        }

        requestRef.current = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(requestRef.current!)
    }, [offset])

    return (
        <div className="w-screen h-screen flex items-center justify-center z-10">
            <div
                className="relative h-[80vh] overflow-hidden flex items-center justify-center"
                style={{ width: (ContainerWidth + 2) + "vw" }}
            >
                <div className="relative h-[80vh]"
                    style={{ width: ContainerWidth + "vw" }}>

                    {cards.map(card =>
                        groupPositions.current.map((groupPos, i) => (
                            <SingleCard
                                key={`${card.id}-group-${i}`}
                                width={card.width * ContainerWidth + "vw"}
                                height={card.height * ContainerWidth + "vw"}
                                title={card.title}
                                hoverText={card.hoverText}
                                link={card.link}
                                bgColor={card.bgColor}
                                x={card.x * ContainerWidth + "vw"}
                                y={card.y * ContainerWidth + groupPos - offset + "vw"}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}