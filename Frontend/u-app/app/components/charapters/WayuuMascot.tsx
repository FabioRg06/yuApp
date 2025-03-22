"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WayuuMascotProps {
  message?: string
  position?: "left" | "right"
  autoHide?: boolean
  hideDelay?: number
  onClose?: () => void
}
export const mascotMessages = [
    "¡Bienvenido a esta lección! Vamos a aprender palabras nuevas en Wayuunaiki.",
    "¡Recuerda que puedes pasar el cursor sobre las palabras para ver su traducción!",
    "¡Muy bien! Estás avanzando rápidamente.",
    "Si te equivocas, no te preocupes. ¡Aprender un idioma es un proceso!",
    "¿Sabías que el Wayuunaiki es hablado por más de 400,000 personas?",
    "Intenta practicar estas palabras en voz alta para mejorar tu pronunciación.",
    "¡Estás haciendo un gran trabajo! Sigue así.",
    "Recuerda que cada palabra que aprendes te conecta más con la cultura Wayuu.",
  ]

export default function WayuuMascot({
  message = "¡Vamos a aprender Wayuunaiki!",
  position = "right",
  autoHide = false,
  hideDelay = 8000,
  onClose,
}: WayuuMascotProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        if (onClose) onClose()
      }, hideDelay)

      return () => clearTimeout(timer)
    }
  }, [autoHide, hideDelay, onClose])

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) onClose()
  }

  if (!isVisible) return null

  return (
    <div className={`flex items-end gap-4 ${position === "right" ? "flex-row" : "flex-row-reverse"} animate-fadeIn`}>
      {/* Burbuja de mensaje */}
      <div className="relative bg-white dark:bg-wayuu-dark-card p-4 rounded-xl shadow-md max-w-xs">
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-wayuu-red text-white hover:bg-wayuu-red/80"
          onClick={handleClose}
        >
          <X className="h-3 w-3" />
        </Button>
        <p className="text-wayuu-navy dark:text-wayuu-dark-text text-sm">{message}</p>
        {/* Triángulo para la burbuja */}
        <div
          className={`absolute bottom-4 ${position === "right" ? "-right-2" : "-left-2"} w-4 h-4 bg-white dark:bg-wayuu-dark-card transform rotate-45`}
        ></div>
      </div>

      {/* Mascota */}
      <div className="relative w-24 h-24">
        <Image src="/images/mascot.png" alt="Mascota Wayuu" width={96} height={96} className="object-contain" />
      </div>
    </div>
  )
}

