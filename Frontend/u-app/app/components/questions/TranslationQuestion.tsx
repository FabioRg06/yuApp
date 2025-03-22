"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle } from "lucide-react"
import type { Question } from "@/app/utils/interfaces/interfaces"

interface TranslationQuestionProps {
  question: Question
  onAnswer: (answer: string) => void
}

export default function TranslationQuestion({ question, onAnswer }: TranslationQuestionProps) {
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

  return (
    <div>
      {/* Texto de la pregunta */}
      <h3 className="text-lg font-medium mb-4">
        {question.text}{" "}
        <span
          className="font-bold relative group cursor-help border-b border-dotted border-wayuu-red"
          onMouseEnter={() => setShowTranslation(true)}
          onMouseLeave={() => setShowTranslation(false)}
          onTouchStart={() => setShowTranslation(!showTranslation)} // Toggle para dispositivos táctiles
        >
          {/* Palabra a traducir */}
          {translateToWayuunaiki ? correctAnswer.text_spanish : correctAnswer.text_wayuunaiki}

          {/* Tooltip con la traducción */}
          <span
            className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-auto p-2 bg-wayuu-navy dark:bg-wayuu-dark-card text-white dark:text-wayuu-dark-text text-sm rounded-md transition-opacity duration-300 pointer-events-none z-10 whitespace-nowrap ${showTranslation ? "opacity-100" : "opacity-0"}`}
          >
            {translateToWayuunaiki ? correctAnswer.text_wayuunaiki : correctAnswer.text_spanish}
          </span>
        </span>
      </h3>

      {/* Mensaje de feedback */}
      {hasSubmitted && (
        <div
          className={`mb-4 p-3 rounded-md ${isCorrect ? "bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800" : "bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800"}`}
        >
          {isCorrect ? (
            <p className="text-green-600 dark:text-green-400 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              ¡Correcto!
            </p>
          ) : (
            <p className="text-red-500 dark:text-red-400 flex items-center">
              <XCircle className="w-5 h-5 mr-2" />
              Incorrecto. La respuesta correcta es:{" "}
              {translateToWayuunaiki ? correctAnswer.text_wayuunaiki : correctAnswer.text_spanish}
            </p>
          )}
        </div>
      )}

      {/* Formulario de respuesta */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={`Escribe la traducción en ${translateToWayuunaiki ? "wayuunaiki" : "español"}`}
          className="bg-white dark:bg-wayuu-dark-bg"
          disabled={hasSubmitted}
        />

        {/* Mostrar botón de comprobar o continuar según el estado */}
        {!hasSubmitted ? (
          <Button
            type="submit"
            className="bg-wayuu-teal text-wayuu-navy hover:bg-wayuu-blue hover:text-wayuu-sand dark:bg-wayuu-red dark:text-wayuu-dark-text dark:hover:bg-wayuu-red/80"
          >
            Comprobar
          </Button>
        ) : !isCorrect ? (
          <Button type="button" onClick={handleContinue} className="bg-wayuu-red hover:bg-wayuu-red/80 text-white">
            Continuar
          </Button>
        ) : null}
      </form>
    </div>
  )
}

