"use client"

import { useState } from "react"
import { useMascot } from "@/app/context/MascotContext"

export function useQuestionFeedback() {
  const [showFeedback, setShowFeedback] = useState(false)
  const { showMessage } = useMascot()

  const showCorrectFeedback = () => {
    setShowFeedback(true)

    // Solo mostrar la mascota ocasionalmente (20% de probabilidad)
    if (Math.random() < 0.05) {
      showMessage({
        text: "¡Muy bien! Estás aprendiendo rápido.",
        duration: 4000,
        position: "right",
      })
    }
  }

  const showIncorrectFeedback = () => {
    setShowFeedback(true)

    // Solo mostrar la mascota ocasionalmente (30% de probabilidad)
    if (Math.random() < 0.07) {
      showMessage({
        text: "No te preocupes, sigue intentando. ¡Tú puedes!",
        duration: 4000,
        position: "right",
      })
    }
  }

  return {
    showFeedback,
    setShowFeedback,
    showCorrectFeedback,
    showIncorrectFeedback,
  }
}


