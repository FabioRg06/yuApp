"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Question } from "@/app/utils/interfaces/interfaces"

export function useTranslation(question: Question, onAnswer: (answer: string) => void) {
  // Estado para la respuesta del usuario
  const [answer, setAnswer] = useState("")
  // Decidir aleatoriamente si traducimos a wayuunaiki o a español
  const [translateToWayuunaiki, setTranslateToWayuunaiki] = useState(false)
  // Estado para mostrar la traducción al pasar el cursor
  const [showTranslation, setShowTranslation] = useState(false)
  // Estado para indicar si el usuario ha enviado una respuesta
  const [hasSubmitted, setHasSubmitted] = useState(false)
  // Estado para indicar si la respuesta es correcta
  const [isCorrect, setIsCorrect] = useState(false)
  // Obtener la respuesta correcta
  const correctAnswer = question.question_option[0].word_phrase

  // Establecer la dirección de traducción solo una vez al montar el componente
  useEffect(() => {
    setTranslateToWayuunaiki(Math.random() > 0.5)
  }, [])

  // Manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // No permitir envíos múltiples
    if (hasSubmitted) return

    // Comparar la respuesta del usuario con la respuesta correcta
    const userAnswer = answer.trim().toLowerCase()
    const correctText = translateToWayuunaiki
      ? correctAnswer.text_wayuunaiki.toLowerCase()
      : correctAnswer.text_spanish.toLowerCase()

    const isAnswerCorrect = userAnswer === correctText
    setIsCorrect(isAnswerCorrect)
    setHasSubmitted(true)

    // Notificar al componente padre
    onAnswer(userAnswer)
  }

  // Función para continuar después de una respuesta incorrecta
  const handleContinue = () => {
    // Notificar al componente padre con la respuesta correcta
    onAnswer(translateToWayuunaiki ? correctAnswer.text_wayuunaiki : correctAnswer.text_spanish)
  }

  // Manejar cambios en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value)
  }

  // Manejar eventos de mouse/touch para mostrar traducción
  const handleMouseEnter = () => setShowTranslation(true)
  const handleMouseLeave = () => setShowTranslation(false)
  const handleTouchStart = () => setShowTranslation(!showTranslation)

  return {
    answer,
    translateToWayuunaiki,
    showTranslation,
    hasSubmitted,
    isCorrect,
    correctAnswer,
    handleSubmit,
    handleContinue,
    handleInputChange,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
  }
}

