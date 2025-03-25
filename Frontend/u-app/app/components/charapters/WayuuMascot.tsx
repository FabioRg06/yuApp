"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMascot } from "@/app/context/MascotContext"

export default function WayuuMascot() {
  const { showMascot, currentMessage, hideMascot } = useMascot()
  const [isAnimating, setIsAnimating] = useState(false)

  // Efecto de animación al mostrar/ocultar
  useEffect(() => {
    if (showMascot) {
      setIsAnimating(true)
    }
  }, [showMascot])

  if (!showMascot || !currentMessage) return null

  const position = currentMessage.position || "right"

  return (
    <div
      className={`fixed bottom-4 ${position === "right" ? "right-4" : "left-4"} z-50 flex items-end gap-4 ${position === "right" ? "flex-row" : "flex-row-reverse"} ${isAnimating ? "animate-fadeIn" : ""}`}
    >
      {/* Burbuja de mensaje */}
      <div className="relative bg-white dark:bg-wayuu-dark-card p-4 rounded-xl shadow-md max-w-xs">
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-wayuu-red text-white hover:bg-wayuu-red/80"
          onClick={hideMascot}
        >
          <X className="h-3 w-3" />
        </Button>
        <p className="text-wayuu-navy dark:text-wayuu-dark-text text-sm">{currentMessage.text}</p>
        {/* Triángulo para la burbuja */}
        <div
          className={`absolute bottom-4 ${position === "right" ? "-right-2" : "-left-2"} w-4 h-4 bg-white dark:bg-wayuu-dark-card transform rotate-45`}
        ></div>
      </div>
      {/* Mascota */}
      <div className="relative w-24 h-24">
        <Image src="/images/mascot.PNG" alt="Mascota Wayuu" width={96} height={96} className="object-contain" />
      </div>
    </div>
  )
}

