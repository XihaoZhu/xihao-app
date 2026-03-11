
import React from "react"

type CardProps = {
    bgColor?: string
    width: string
    x: string
    y: string
    height: string
    title: string
    hoverText: string
    link: string
}

export default function SingleCard({
    bgColor = "bg-blue-400",
    width,
    x,
    y,
    height,
    title,
    hoverText,
    link,
}: CardProps) {
    return (
        <a
            href={link}
            className="group absolute block overflow-hidden rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
            style={{ width, height, left: x, top: y }}
        >
            {/* background */}
            <div
                className={`absolute inset-0 ${bgColor} transition-transform duration-500 group-hover:scale-110`}
            />

            {/* title */}
            <div className="absolute bottom-4 left-4 right-4 z-10 text-white font-semibold"
                style={{
                    fontSize: "clamp(14px,1.2vw,22px)"
                }}
            >
                {title}
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p
                    className="text-white text-center px-4"
                    style={{
                        fontSize: "clamp(12px,1vw,18px)"
                    }}
                >
                    {hoverText}
                </p>
            </div>
        </a>
    )
}