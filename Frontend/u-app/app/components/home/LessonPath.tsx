"use client"

import { useRef, useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { CheckCircle, Lock, Star } from "lucide-react"
import Link from "next/link"
import { PassThrough } from "stream"

interface Lesson {
  id: number
  title: string
  description: string
  icon: string
  completed: boolean
  progress: number
}

interface LessonPathProps {
  lessons: Lesson[]
  chapterTitle?: string
}

export default function LessonPath({ lessons, chapterTitle }: LessonPathProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [pathPoints, setPathPoints] = useState<{ x: number; y: number }[]>([])
  const [containerWidth, setContainerWidth] = useState(0)

  // Actualizar el ancho del contenedor cuando cambia el tamaño de la ventana
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth)
      }
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  // Calcular los puntos de la curva sinusoidal
  useEffect(() => {
    if (!containerWidth || containerWidth === 0) return

    // Ajustar la amplitud según el ancho de la pantalla
    const getAmplitude = () => {
      if (containerWidth < 400) return containerWidth * 0.15
      if (containerWidth < 768) return containerWidth * 0.2
      return containerWidth * 0.25
    }

    const amplitude = getAmplitude()
    const centerX = containerWidth / 2

    // Calcular puntos para una curva sinusoidal
    const points: { x: number; y: number }[] = []
    const totalLessons = lessons.length

    // Ajustar el espaciado vertical según el tamaño de la pantalla
    const verticalSpacing = containerWidth < 768 ? 120 : 140

    for (let i = 0; i < totalLessons; i++) {
      // Posición vertical (y) distribuida uniformemente
      const y = 80 + i * verticalSpacing

      // Posición horizontal (x) siguiendo una curva sinusoidal
      // Usamos una función seno más natural
      const t = i / (totalLessons > 1 ? totalLessons - 1 : 1)
      const x = centerX + amplitude * Math.sin(t * Math.PI * 2 - Math.PI / 2)

      points.push({ x, y })
    }

    setPathPoints(points)
  }, [lessons, containerWidth])

  // Dibujar el camino SVG
  useEffect(() => {
    if (!svgRef.current || pathPoints.length < 2) return

    const path = svgRef.current.querySelector("path")
    if (!path) return

    // Generar un camino suave que pase por todos los puntos
    let pathData = `M ${pathPoints[0].x} ${pathPoints[0].y}`

    // Usar curvas de Bézier para un camino más suave
    for (let i = 0; i < pathPoints.length - 1; i++) {
      const current = pathPoints[i]
      const next = pathPoints[i + 1]
      const distance = next.y - current.y

      // Puntos de control para la curva de Bézier
      const controlPoint1X = current.x
      const controlPoint1Y = current.y + distance * 0.25
      const controlPoint2X = next.x
      const controlPoint2Y = next.y - distance * 0.25

      // Curva cúbica de Bézier
      pathData += ` C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${next.x} ${next.y}`
    }

    path.setAttribute("d", pathData)
  }, [pathPoints])

  return (
    <div
      className="relative w-full"
      style={{ height: `${pathPoints.length * (containerWidth < 768 ? 120 : 140) + 50}px` }}
      ref={containerRef}
    >
      {/* SVG para el camino */}
      <svg ref={svgRef} className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <path
          d=""
          className="stroke-wayuu-teal dark:stroke-wayuu-red"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray="0"
        />
      </svg>

      {/* Lecciones posicionadas sobre la curva */}
      {pathPoints.map((point, index) => (
        <div
          key={lessons[index].id}
          className="lesson-node absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${point.x}px`,
            top: `${point.y}px`,
          }}
        >
          <LessonNode
            lesson={lessons[index]}
            index={index}
            isFirst={index === 0}
            isLast={index === lessons.length - 1}
          />
        </div>
      ))}
    </div>
  )
}

function LessonNode({
  lesson,
  index,
  isFirst,
  isLast,
}: {
  lesson: Lesson
  index: number
  isFirst: boolean
  isLast: boolean
}) {
  return (
    <Link
      href={lesson.id ? `/pages/lesson/${lesson.id}`:"#" }
      // className={`relative ${lesson ? "cursor-not-allowed" : ""}`}
    >
      <div className="relative">
        {/* Número de lección */}
        <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-6 h-6 md:w-8 md:h-8 rounded-full bg-wayuu-red text-white flex items-center justify-center text-xs md:text-sm font-bold z-10">
          {index + 1}
        </div>

        {/* Indicador de estado */}
        {lesson.completed ? (
          <div className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-500 text-white flex items-center justify-center z-10">
            <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        ) : lesson.progress > 0 ? (
          <div className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-wayuu-teal dark:bg-wayuu-red text-white flex items-center justify-center z-10">
            <Star className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        ) : null}

        {/* Tarjeta de lección - tamaño aumentado para móvil */}
        <Card
          className={`
          w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 
          flex flex-col items-center justify-center 
          transition-all duration-200 
           ${
          //  lesson.isLocked
          //   ? "bg-gray-100 dark:bg-gray-800 opacity-70"
          //    : "hover:scale-110 hover:shadow-lg bg-white dark:bg-wayuu-dark-card"
          PassThrough
          }
          ${lesson.completed ? "border-green-500 border-2" : ""}
          overflow-hidden
        `}
        >
          <div className="text-2xl sm:text-2xl md:text-3xl mb-1">{lesson.icon}</div>
          <p className="text-xs font-medium text-center text-wayuu-navy dark:text-wayuu-dark-text px-1">
            {lesson.title}
          </p>

          {/* Indicador de progreso no invasivo - ahora en verde */}
          { !lesson.completed && lesson.progress > 0 && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700">
              <div className="h-full bg-green-500 dark:bg-green-500" style={{ width: `${lesson.progress}%` }}></div>
            </div>
          )}
        </Card>
      </div>
    </Link>
  )
}

