import { useEffect, useRef } from "react"

interface LessonPathSVGProps {
  pathPoints: { x: number; y: number }[]
}

export default function LessonPathSVG({ pathPoints }: LessonPathSVGProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || pathPoints.length < 2) return

    const path = svgRef.current.querySelector("path")
    if (!path) return

    let pathData = `M ${pathPoints[0].x} ${pathPoints[0].y}`
    
    for (let i = 0; i < pathPoints.length - 1; i++) {
      const current = pathPoints[i]
      const next = pathPoints[i + 1]
      const distance = next.y - current.y
      const controlPoint1Y = current.y + distance * 0.25
      const controlPoint2Y = next.y - distance * 0.25

      pathData += ` C ${current.x} ${controlPoint1Y}, ${next.x} ${controlPoint2Y}, ${next.x} ${next.y}`
    }

    path.setAttribute("d", pathData)
  }, [pathPoints])

  return (
    <svg ref={svgRef} className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <path d="" className="stroke-wayuu-teal dark:stroke-wayuu-red" strokeWidth="6" strokeLinecap="round" fill="none" />
    </svg>
  )
}
