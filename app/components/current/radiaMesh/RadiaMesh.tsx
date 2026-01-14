import { FC, useEffect, useRef, useState } from 'react'

type Point = {
    baseX: number
    baseY: number
    x: number
    y: number
}

// ===== parameters =====
const ARC_COUNT = 24
const RADIAL_COUNT = 24
const ARC_SEGMENTS = 48
const START = -15 * Math.PI / 180
const END = 105 * Math.PI / 180
const SPAN = END - START
const rInner = 100

interface RadialMeshProps {
    collapseCenter: { x: number; y: number } | null
    mouseEnabled: boolean
    onMouseMove?: (p: { x: number; y: number }) => void
}

const polarToPoint = (r: number, theta: number): Point => {
    const x = r * Math.cos(theta)
    const y = r * Math.sin(theta)
    return { baseX: x, baseY: y, x, y }
}

export const RadialMesh: FC<RadialMeshProps> = ({
    collapseCenter,
    mouseEnabled,
    onMouseMove,
}) => {
    const svgRef = useRef<SVGSVGElement | null>(null)

    const [viewport, setViewport] = useState<{
        width: number
        height: number
    } | null>(null)

    const [, forceUpdate] = useState(0)

    const arcsRef = useRef<Point[][]>([])
    const radialsRef = useRef<Point[][]>([])


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


    // initialize mesh
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


    // handle mouse move
    useEffect(() => {
        const svg = svgRef.current
        if (!svg || !collapseCenter) return


        const allPoints = [
            ...arcsRef.current.flat(),
            ...radialsRef.current.flat(),
        ]
        applyCollapse(allPoints, collapseCenter.x, collapseCenter.y)
        forceUpdate(v => v + 1)

    }, [collapseCenter])


    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!mouseEnabled || !onMouseMove) return
            const svg = svgRef.current
            if (!svg) return

            const rect = svg.getBoundingClientRect()
            onMouseMove({
                x: e.clientX - rect.left,
                y: rect.bottom - e.clientY,
            })
        }

        window.addEventListener('mousemove', onMove)

        return () => window.removeEventListener('mousemove', onMove)
    }, [mouseEnabled, onMouseMove])

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

// ===== animation =====
function applyCollapse(points: Point[], mouseX: number, mouseY: number) {
    const radius = 200
    const strength = 0.7

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
