"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw, XCircle } from "lucide-react"
import type { Question } from "@/app/utils/interfaces/interfaces"
import { useMatching } from "@/app/hooks/useMatching"
import MatchingOptions from "./matching/MatchingOptions"
import CorrectAnswers from "./matching/CorrectAnswers"

interface MatchingQuestionProps {
  question: Question
  onAnswer: (matches: { [key: number]: number }) => void
}

export default function MatchingQuestion({ question, onAnswer }: MatchingQuestionProps) {
  const {
    selectedLeft,
    matches,
    hasError,
    showCorrectAnswers,
    leftOptions,
    rightOptions,
    hasSubmitted,
    handleLeftClick,
    handleRightClick,
    resetMatches,
    handleContinue,
    isMatched,
    getMatchedRightIds,
  } = useMatching(question, onAnswer)

  return (
    <div>
      {/* Encabezado con título y botón de reinicio */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium relative group cursor-help">
          {question.text}
          <span className="absolute left-0 bottom-full mb-2 w-auto p-2 bg-wayuu-navy dark:bg-wayuu-dark-card text-white dark:text-wayuu-dark-text text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
            Conecta cada palabra en wayuunaiki con su traducción en español
          </span>
        </h3>
        {(hasError || Object.keys(matches).length > 0) && !hasSubmitted && (
          <Button
            onClick={resetMatches}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-wayuu-red hover:text-wayuu-red/80"
          >
            <RefreshCw className="w-4 h-4" />
            Reiniciar
          </Button>
        )}
      </div>

      {/* Mensaje de error */}
      {hasError && !showCorrectAnswers && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-red-500 dark:text-red-400 flex items-center">
            <XCircle className="w-5 h-5 mr-2" />
            Algunas parejas no son correctas. Observa las respuestas correctas abajo.
          </p>
        </div>
      )}

      {/* Opciones de emparejamiento */}
      <MatchingOptions
        leftOptions={leftOptions}
        rightOptions={rightOptions}
        selectedLeft={selectedLeft}
        isMatched={isMatched}
        hasSubmitted={hasSubmitted}
        handleLeftClick={handleLeftClick}
        handleRightClick={handleRightClick}
        matchedRightIds={getMatchedRightIds()}
      />

      {/* Mostrar respuestas correctas después de un intento fallido */}
      {showCorrectAnswers && (
        <CorrectAnswers
          leftOptions={leftOptions}
          rightOptions={rightOptions}
          onContinue={handleContinue}
          onReset={resetMatches}
        />
      )}
    </div>
  )
}

