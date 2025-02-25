"use client"

import { Button } from "@/components/ui/button"
import type { Question } from "../utils/interfaces/interfaces"

interface MultipleChoiceQuestionProps {
  question: Question
  onAnswer: (answerId: number) => void
}

export default function MultipleChoiceQuestion({ question, onAnswer }: MultipleChoiceQuestionProps) {
  // Randomly decide if we show Spanish or Wayuunaiki as options
  const showSpanishOptions = Math.random() > 0.5

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">
        {question.text}{" "}
        <span className="font-bold">
          {showSpanishOptions
            ? question.question_option.find((opt) => opt.is_correct)?.word_phrase.text_wayuunaiki
            : question.question_option.find((opt) => opt.is_correct)?.word_phrase.text_spanish}
        </span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.question_option.map((option) => (
          <Button
            key={option.id}
            onClick={() => onAnswer(option.id)}
            className="bg-wayuu-teal text-wayuu-navy hover:bg-wayuu-blue hover:text-wayuu-sand dark:bg-wayuu-red dark:text-wayuu-dark-text dark:hover:bg-wayuu-red/80"
          >
            {showSpanishOptions ? option.word_phrase.text_spanish : option.word_phrase.text_wayuunaiki}
          </Button>
        ))}
      </div>
    </div>
  )
}

