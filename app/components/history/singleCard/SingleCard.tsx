
import next from "next"
import React, { use } from "react"
import { useDispatch } from "react-redux"
import { nextSection } from "@/store/pageControl"

type CardProps = {
    img?: string
    width: string
    height: string
    x: string
    y: string
    title: string[]
    hoverText: string[]
    link: string
    topGlowY: number | null
    bottomGlowY: number | null
    filter?: boolean
}

export default function SingleCard({
    img = "/placeholder.jpg",   // 图片占位
    width,
    height,
    x,
    y,
    title,
    hoverText,
    link,
    topGlowY,
    bottomGlowY,
    filter = true,
}: CardProps) {

    const dispatch = useDispatch()
    return (
        <div
            onClick={() => {
                if (link) {window.open(link, "_blank")}else{
                    dispatch(nextSection())
                };
            }}
            className="group absolute block overflow-hidden rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
            rel="noopener noreferrer"
            style={{ width, height, left: x, top: y }}
        >
            {/* Image */}
            <img
                src={img}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                style={{
                    filter: "saturate(0.75) contrast(1.05) brightness(0.9)"
                }}
            />

            {/* color overlay (统一色调) */}
            {filter && <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(rgba(0,0,0,0.25), rgba(20,0,40,0.35))"
                }}
            />}

            {/* title */}
            <div
                className="relative w-full h-full flex flex-col justify-center items-center z-10 text-white font-semibold group-hover:opacity-0 transition-opacity duration-300 px-4 text-center flex-wrap"
                style={{
                    fontSize: "clamp(14px,1.2vw,22px)"
                }}
            >
                {title.map((line, index) => (
                    <p key={index} className="pt-4">{line}</p>
                ))}
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 text-white text-center p-4 flex-wrap"
                style={{
                    fontSize: "clamp(14px,1.2vw,22px)"
                }}>

                {hoverText.map((line, index) => (
                    <p key={index} className="pt-4">{line}</p>
                ))}
            </div>

            {topGlowY !== null && (
                <div
                    className="absolute left-0 w-full h-16 pointer-events-none"
                    style={{
                        top: topGlowY + "vw",
                        transform: "translateY(-50%)",
                        background:
                            "linear-gradient(to bottom, transparent, rgba(255,255,255,0.9), transparent)",
                        filter: "blur(10px)"
                    }}
                />
            )}

            {bottomGlowY !== null && (
                <div
                    className="absolute left-0 w-full h-16 pointer-events-none"
                    style={{
                        top: bottomGlowY + "vw",
                        transform: "translateY(-50%)",
                        background:
                            "linear-gradient(to bottom, transparent, rgba(255,255,255,0.9), transparent)",
                        filter: "blur(10px)"
                    }}
                />
            )}
        </div>
    )
}