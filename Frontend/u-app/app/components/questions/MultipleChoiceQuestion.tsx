"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"
import type { Question } from "@/app/utils/interfaces/interfaces"

interface MultipleChoiceQuestionProps {
  question: Question
  onAnswer: (answerId: number) => void
}

// Modificar la función para incluir un botón de continuar después de una respuesta incorrecta
export default function MultipleChoiceQuestion({ question, onAnswer }: MultipleChoiceQuestionProps) {
  // Decidir aleatoriamente si mostramos opciones en español o wayuunaiki
  const [showSpanishOptions] = useState(Math.random() > 0.5)
  // Estado para la opción seleccionada
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  // Estado para mostrar feedback
  const [showFeedback, setShowFeedback] = useState(false)

  // Manejar el clic en una opción
  const handleOptionClick = (optionId: number) => {
    // No permitir seleccionar si ya hay una selección
    if (selectedOption !== null) return

    // Guardar la opción seleccionada
    setSelectedOption(optionId)
    setShowFeedback(true)

    // Notificar al componente padre
    onAnswer(optionId)
  }

  // Obtener la opción correcta
  const correctOption = question.question_option.find((opt) => opt.is_correct)

  // Verificar si la opción seleccionada es correcta
  const isCorrect =
    selectedOption !== null && question.question_option.find((opt) => opt.id === selectedOption)?.is_correct === true

  // Función para continuar después de una respuesta incorrecta
  const handleContinue = () => {
    // Notificar al componente padre con la respuesta correcta
    if (correctOption) {
      onAnswer(correctOption.id)
      
    }
  }

  return (
    <div>
      {/* Texto de la pregunta */}
      <h3 className="text-lg font-medium mb-4">
        {question.text}{" "}
        <span
          className="font-bold relative group cursor-help border-b border-dotted border-wayuu-red"
          title={
            showSpanishOptions
              ? question.question_option.find((opt) => opt.is_correct)?.word_phrase.text_spanish
              : question.question_option.find((opt) => opt.is_correct)?.word_phrase.text_wayuunaiki
          }
        >
          {/* Palabra a traducir */}
          {showSpanishOptions
            ? question.question_option.find((opt) => opt.is_correct)?.word_phrase.text_wayuunaiki
            : question.question_option.find((opt) => opt.is_correct)?.word_phrase.text_spanish}

          {/* Tooltip con la traducción */}
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-auto p-2 bg-wayuu-navy dark:bg-wayuu-dark-card text-white dark:text-wayuu-dark-text text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 whitespace-nowrap">
            {showSpanishOptions
              ? question.question_option.find((opt) => opt.is_correct)?.word_phrase.text_spanish
              : question.question_option.find((opt) => opt.is_correct)?.word_phrase.text_wayuunaiki}
          </span>
        </span>
      </h3>

      {/* Mensaje de feedback - solo se muestra después de seleccionar */}
      {showFeedback && selectedOption !== null && (
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
              {showSpanishOptions
                ? correctOption?.word_phrase.text_spanish
                : correctOption?.word_phrase.text_wayuunaiki}
            </p>
          )}
        </div>
      )}

      {/* Opciones de respuesta */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.question_option.map((option) => (
          <Button
            key={option.id}
            onClick={() => handleOptionClick(option.id)}
            disabled={selectedOption !== null}
            className={`
              ${selectedOption === option.id && isCorrect ? "bg-green-500 hover:bg-green-500 text-white" : ""}
              ${selectedOption === option.id && !isCorrect ? "bg-red-500 hover:bg-red-500 text-white" : ""}
              ${selectedOption !== null && option.is_correct ? "bg-green-500 hover:bg-green-500 text-white" : ""}
              ${selectedOption === null ? "bg-wayuu-teal text-wayuu-navy hover:bg-wayuu-blue hover:text-wayuu-sand dark:bg-wayuu-red dark:text-wayuu-dark-text dark:hover:bg-wayuu-red/80" : ""}
            `}
          >
            {showSpanishOptions ? option.word_phrase.text_spanish : option.word_phrase.text_wayuunaiki}
          </Button>
        ))}
      </div>

      {/* Botón para continuar después de una respuesta incorrecta */}
      {selectedOption !== null && !isCorrect && (
        <div className="mt-4 text-center">
          <Button onClick={handleContinue} className="bg-wayuu-red hover:bg-wayuu-red/80 text-white">
            Continuar
          </Button>
        </div>
      )}
    </div>
  )
}

