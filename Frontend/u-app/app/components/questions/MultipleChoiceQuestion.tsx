"use client"

import { Button } from "@/components/ui/button"
import type { Question } from "@/app/utils/interfaces/interfaces"
import { useMultipleChoice } from "@/app/hooks/useMultipleChoice"
import FeedbackMessage from "./feedback/FeedbackMessage"
import QuestionText from "./common/QuestionText"
import ContinueButton from "./common/ContinueButton"

interface MultipleChoiceQuestionProps {
  question: Question
  onAnswer: (answerId: number) => void
}

export default function MultipleChoiceQuestion({ question, onAnswer }: MultipleChoiceQuestionProps) {
  const {
    showSpanishOptions,
    selectedOption,
    showFeedback,
    isCorrect,
    handleOptionClick,
    handleContinue,
    getQuestionTexts,
  } = useMultipleChoice(question, onAnswer)

  const { wordToTranslate, translation, correctAnswer } = getQuestionTexts()

  return (
    <div>
      {/* Texto de la pregunta */}
      <QuestionText text={question.text} wordToTranslate={wordToTranslate} translation={translation} />

      {/* Mensaje de feedback - solo se muestra después de seleccionar */}
      {showFeedback && selectedOption !== null && (
        <FeedbackMessage isCorrect={isCorrect} correctAnswer={correctAnswer} />
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
      {selectedOption !== null && !isCorrect && <ContinueButton onClick={handleContinue} />}
    </div>
  )
}

