"use client"

import { useState } from "react"
import type { Question } from "@/app/utils/interfaces/interfaces"
import { useQuestionFeedback } from "./useQuestionFeedback"

export function useMultipleChoice(question: Question, onAnswer: (answerId: number) => void) {
  // Decidir aleatoriamente si mostramos opciones en español o wayuunaiki
  const [showSpanishOptions] = useState(Math.random() > 0.5)
  // Estado para la opción seleccionada
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  // Feedback
  const { showFeedback, setShowFeedback, showCorrectFeedback, showIncorrectFeedback } = useQuestionFeedback()

  // Obtener la opción correcta
  const correctOption = question.question_option.find((opt) => opt.is_correct)

  // Verificar si la opción seleccionada es correcta
  const isCorrect =
    selectedOption !== null && question.question_option.find((opt) => opt.id === selectedOption)?.is_correct === true

  // Manejar el clic en una opción
  const handleOptionClick = (optionId: number) => {
    // No permitir seleccionar si ya hay una selección
    if (selectedOption !== null) return

    // Guardar la opción seleccionada
    setSelectedOption(optionId)
    setShowFeedback(true)

    // Mostrar feedback con mascota
    const isOptionCorrect = question.question_option.find((opt) => opt.id === optionId)?.is_correct === true
    if (isOptionCorrect) {
      showCorrectFeedback()
    } else {
      showIncorrectFeedback()
    }

    // Notificar al componente padre
    onAnswer(optionId)
  }

  // Función para continuar después de una respuesta incorrecta
  const handleContinue = () => {
    // Notificar al componente padre con la respuesta correcta
    if (correctOption) {
      onAnswer(correctOption.id)
    }
  }

  // Obtener textos para la pregunta
  const getQuestionTexts = () => {
    return {
      wordToTranslate: showSpanishOptions
        ? correctOption?.word_phrase.text_wayuunaiki || ""
        : correctOption?.word_phrase.text_spanish || "",
      translation: showSpanishOptions
        ? correctOption?.word_phrase.text_spanish || ""
        : correctOption?.word_phrase.text_wayuunaiki || "",
      correctAnswer: showSpanishOptions
        ? correctOption?.word_phrase.text_spanish || ""
        : correctOption?.word_phrase.text_wayuunaiki || "",
    }
  }

  return {
    showSpanishOptions,
    selectedOption,
    showFeedback,
    correctOption,
    isCorrect,
    handleOptionClick,
    handleContinue,
    getQuestionTexts,
  }
}

