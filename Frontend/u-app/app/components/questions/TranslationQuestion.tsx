"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Question } from "@/app/utils/interfaces/interfaces"
import { useTranslation } from "@/app/hooks/useTranslation"
import FeedbackMessage from "./feedback/FeedbackMessage"
import QuestionText from "./common/QuestionText"
import ContinueButton from "./common/ContinueButton"

interface TranslationQuestionProps {
  question: Question
  onAnswer: (answer: string) => void
}

export default function TranslationQuestion({ question, onAnswer }: TranslationQuestionProps) {
  const {
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
  } = useTranslation(question, onAnswer)

  // Obtener el texto de la pregunta y la traducción
  const wordToTranslate = translateToWayuunaiki ? correctAnswer.text_spanish : correctAnswer.text_wayuunaiki

  const translation = translateToWayuunaiki ? correctAnswer.text_wayuunaiki : correctAnswer.text_spanish

  return (
    <div>
      {/* Texto de la pregunta */}
      <QuestionText
        text={question.text}
        wordToTranslate={wordToTranslate}
        translation={translation}
        showTranslation={showTranslation}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
      />

      {/* Mensaje de feedback */}
      {hasSubmitted && (
        <FeedbackMessage
          isCorrect={isCorrect}
          correctAnswer={translateToWayuunaiki ? correctAnswer.text_wayuunaiki : correctAnswer.text_spanish}
        />
      )}

      {/* Formulario de respuesta */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          value={answer}
          onChange={handleInputChange}
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
          <ContinueButton onClick={handleContinue} />
        ) : null}
      </form>
    </div>
  )
}

