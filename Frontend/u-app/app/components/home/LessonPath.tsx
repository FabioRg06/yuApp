"use client"

import { useRef, useEffect, useState } from "react"
import useWindowWidth from "@/app/hooks/useWindowWidth"
import LessonNode from "./LessonNode"
import LessonPathSVG from "./LessonPathSVG"
import { Lesson } from "@/app/utils/interfaces/interfaces"

interface LessonPathProps {
  lessons: Lesson[]
}

export default function LessonPath({ lessons }: LessonPathProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const windowWidth = useWindowWidth()
  const [pathPoints, setPathPoints] = useState<{ x: number; y: number }[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const containerWidth = containerRef.current.clientWidth

    const getAmplitude = () => {
      if (containerWidth < 400) return containerWidth * 0.15
      if (containerWidth < 768) return containerWidth * 0.2
      return containerWidth * 0.25
    }

    const amplitude = getAmplitude()
    const centerX = containerWidth / 2
    const totalLessons = lessons.length
    const verticalSpacing = containerWidth < 768 ? 120 : 140

    const points = lessons.map((_, i) => {
      const y = 80 + i * verticalSpacing
      const t = i / (totalLessons > 1 ? totalLessons - 1 : 1)
      const x = centerX + amplitude * Math.sin(t * Math.PI * 2 - Math.PI / 2)
      return { x, y }
    })

    setPathPoints(points)
  }, [lessons, windowWidth]) // Ahora se recalcula al cambiar el ancho de la ventana

  return (
    <div className="relative w-full" style={{ height: `${pathPoints.length * 140 + 50}px` }} ref={containerRef}>
      <LessonPathSVG pathPoints={pathPoints} />

      {pathPoints.map((point, index) => (
        <div
          key={lessons[index].id}
          className="lesson-node absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${point.x}px`, top: `${point.y}px` }}
        >
          <LessonNode lesson={lessons[index]} index={index} />
        </div>
      ))}
    </div>
  )
}
