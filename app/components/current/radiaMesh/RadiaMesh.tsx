import { FC, useEffect, useRef, useState } from 'react'

type Point = {
    baseX: number
    baseY: number
    x: number
    y: number
}

// ===== 参数 =====
const ARC_COUNT = 12
const RADIAL_COUNT = 12
const ARC_SEGMENTS = 48
const START = -15 * Math.PI / 180
const END = 105 * Math.PI / 180
const SPAN = END - START
const rInner = 100

const polarToPoint = (r: number, theta: number): Point => {
    const x = r * Math.cos(theta)
    const y = r * Math.sin(theta)
    return { baseX: x, baseY: y, x, y }
}

export const RadialMesh: FC = () => {
    const svgRef = useRef<SVGSVGElement | null>(null)

    const [viewport, setViewport] = useState<{
        width: number
        height: number
    } | null>(null)

    const [, forceUpdate] = useState(0)

    const arcsRef = useRef<Point[][]>([])
    const radialsRef = useRef<Point[][]>([])

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

    useEffect(() => {
        if (!viewport) return

        const { width, height } = viewport
        const R = Math.hypot(width, height)

        arcsRef.current = Array.from({ length: ARC_COUNT }, (_, i) => {
            const r = rInner + (i / ARC_COUNT) * (R - rInner)
            const points: Point[] = []

            for (let j = 0; j <= ARC_SEGMENTS; j++) {
                const theta = START + (j / ARC_SEGMENTS) * SPAN
                points.push(polarToPoint(r, theta))
            }

            return points
        })

        radialsRef.current = Array.from({ length: RADIAL_COUNT }, (_, i) => {
            const t = i / (RADIAL_COUNT - 1)
            const theta = START + t * SPAN

            return [
                polarToPoint(rInner, theta),
                polarToPoint(R, theta),
            ]
        })

        forceUpdate(v => v + 1)
    }, [viewport])

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            const svg = svgRef.current
            if (!svg) return

            const rect = svg.getBoundingClientRect()
            const mouseX = e.clientX - rect.left
            const mouseY = rect.bottom - e.clientY

            const allPoints = [
                ...arcsRef.current.flat(),
                ...radialsRef.current.flat(),
            ]

            applyCollapse(allPoints, mouseX, mouseY)
            forceUpdate(v => v + 1)
        }

        window.addEventListener('mousemove', onMove)
        return () => {
            window.removeEventListener('mousemove', onMove)
        }
    }, [])

    if (!viewport) return null

    const { width, height } = viewport

    return (
        <svg
            ref={svgRef}
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            style={{ pointerEvents: 'all' }}
        >
            <rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill="transparent"
                pointerEvents="all"
            />
            {arcsRef.current.map((line, i) => (
                <path
                    key={`arc-${i}`}
                    d={`M ${line.map(p => `${p.x},${height - p.y}`).join(' L ')}`}
                    fill="none"
                    stroke="white"
                    strokeWidth={1}
                    opacity={0.5}
                />
            ))}

            {radialsRef.current.map((line, i) => (
                <path
                    key={`radial-${i}`}
                    d={`M ${line[0].x},${height - line[0].y}
                       L ${line[1].x},${height - line[1].y}`}
                    fill="none"
                    stroke="white"
                    strokeWidth={1}
                    opacity={0.5}
                />
            ))}
        </svg>
    )
}

// ===== 坍缩函数 =====
function applyCollapse(points: Point[], mouseX: number, mouseY: number) {
    const radius = 300
    const strength = 0.5

    points.forEach(p => {
        const dx = p.baseX - mouseX
        const dy = p.baseY - mouseY
        const dist = Math.hypot(dx, dy)

        if (dist > radius) {
            p.x = p.baseX
            p.y = p.baseY
            return
        }

        const t = 1 - dist / radius
        p.x = p.baseX - dx * t * strength
        p.y = p.baseY - dy * t * strength
    })
}
