interface TextRevealProps {
    text: string
    active: boolean
    onCenterChange?: (p: { x: number; y: number }) => void
    onComplete?: () => void
    interval?: number
    sourseChange?: () => void
}

import { FC, useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

export const TextReveal: FC<TextRevealProps> = ({
    text,
    active,
    onCenterChange,
    onComplete,
    interval = 0.2,
}) => {
    const words = text.split(' ')

    const containerRef = useRef<HTMLDivElement | null>(null)
    const wordRefs = useRef<HTMLSpanElement[]>([])

    const hasPlayedRef = useRef(false)
    const tlRef = useRef<gsap.core.Timeline | null>(null)

    useLayoutEffect(() => {
        gsap.set(wordRefs.current, {
            opacity: 0,
            y: 12,
        })
    }, [])


    useEffect(() => {
        if (!active || !containerRef.current) return


        if (hasPlayedRef.current) {
            gsap.set(wordRefs.current, { opacity: 1, y: 0 })
            return
        }

        hasPlayedRef.current = true

        const tl = gsap.timeline({ onComplete })

        wordRefs.current.forEach((el, i) => {
            tl.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: 'power2.out',
                onStart: () => {
                    if (el && onCenterChange) {
                        onCenterChange(getCenter(el))
                    }
                }
            }, i * interval)
        })

        tlRef.current = tl

        return () => {
            tl.kill()
        }
    }, [active, interval])


    return (
        <div
            ref={containerRef}
            className="w-screen h-screen flex items-center justify-center pointer-events-none relative"
        >
            <div className="absolute right-20 top-50 text-white text-3xl md:text-5xl font-medium text-center leading-25 w-3/5 text-right">
                {words.map((word, i) => (
                    <span
                        key={i}
                        ref={el => {
                            if (el) wordRefs.current[i] = el
                        }}
                        style={{
                            display: 'inline-block',
                            marginRight: '0.25em',
                        }}
                    >
                        {word}
                    </span>
                ))}
            </div>
        </div>
    )
}


function getCenter(el: HTMLElement) {
    if (!el) return { x: 0, y: 0 }
    const rect = el.getBoundingClientRect()
    return {
        x: rect.left + rect.width / 2,
        y: window.innerHeight - rect.bottom + rect.height / 2
    }
}
