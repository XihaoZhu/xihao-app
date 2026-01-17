import { FC, useState } from 'react'
import { useEffect } from 'react'


// parameters

export const RadialLines: FC = () => {

    const [viewport, setViewport] = useState<{
        width: number
        height: number
    } | null>({ width: window.innerWidth, height: window.innerHeight })


    const LINES_COUNT = 20
    const BASE_RADIUS = viewport!.width * 3 / 10
    const LINE_LENGTH = viewport!.width * 1 / 20
    const extraLenth = viewport!.width * 1 / 20

    // handle viewport resize   
    useEffect(() => {
        const update = () => {
            setViewport({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }
        update()
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [])

    const cx = viewport!.width / 2
    const cy = 0

    const lines: {
        x1: number,
        y1: number,
        x2: number,
        y2: number
    }[] = []
    for (let i = 0; i < LINES_COUNT; i++) {
        const angle = (2 * Math.PI / LINES_COUNT) * i
        lines.push({
            x1: BASE_RADIUS * Math.sin(angle),
            y1: BASE_RADIUS * Math.cos(angle),
            x2: (BASE_RADIUS + LINE_LENGTH + (i % 2 == 0 ? extraLenth : 0)) * Math.sin(angle),
            y2: (BASE_RADIUS + LINE_LENGTH + (i % 2 == 0 ? extraLenth : 0)) * Math.cos(angle),
        })
    }


    return (
        <div className='w-screen h-screen'>
            <svg
                className='w-screen h-screen'
                viewBox={`0 0 ${viewport?.width} ${viewport?.height}`}>
                {lines.map((line, index) => (
                    <path
                        key={index}
                        d={`M ${cx + line.x1} ${cy - line.y1} L ${cx + line.x2} ${cy - line.y2}`}
                        stroke="white"
                        strokeWidth={2}
                        fill="none"
                    />))}
            </svg>
        </div>
    )
}
