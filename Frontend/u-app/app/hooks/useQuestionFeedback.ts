"use client"

import { useState } from "react"
import { useMascot } from "@/app/context/MascotContext"

export function useQuestionFeedback() {
  const [showFeedback, setShowFeedback] = useState(false)
  const { showMessage } = useMascot()

  const showCorrectFeedback = () => {
    setShowFeedback(true)
    showMessage({
      text: "¡Muy bien! Estás aprendiendo rápido.",
      duration: 3000,
      position: "right",
    })
  }

  const showIncorrectFeedback = () => {
    setShowFeedback(true)
    showMessage({
      text: "No te preocupes, sigue intentando. ¡Tú puedes!",
      duration: 3000,
      position: "right",
    })
  }

  return {
    showFeedback,
    setShowFeedback,
    showCorrectFeedback,
    showIncorrectFeedback,
  }
}

