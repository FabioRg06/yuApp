"use client"

import type React from "react"

import { useState,useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Question } from "../utils/interfaces/interfaces"

interface TranslationQuestionProps {
    question: Question
    onAnswer: (answer: string) => void
  }
  
  export default function TranslationQuestion({ question, onAnswer }: TranslationQuestionProps) {
    const [answer, setAnswer] = useState("")
    const [translateToWayuunaiki, setTranslateToWayuunaiki] = useState(false)
    const correctAnswer = question.question_option[0].word_phrase
  
    // Set translation direction only once when component mounts
    useEffect(() => {
      setTranslateToWayuunaiki(Math.random() > 0.5)
    }, [])
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onAnswer(answer.trim().toLowerCase())
    }
  
    return (
      <div>
        <h3 className="text-lg font-medium mb-4">
          {question.text}{" "}
          <span className="font-bold">
            {translateToWayuunaiki ? correctAnswer.text_spanish : correctAnswer.text_wayuunaiki}
          </span>
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={`Escribe la traducción en ${translateToWayuunaiki ? "wayuunaiki" : "español"}`}
            className="bg-white dark:bg-wayuu-dark-bg"
          />
          <Button
            type="submit"
            className="bg-wayuu-teal text-wayuu-navy hover:bg-wayuu-blue hover:text-wayuu-sand dark:bg-wayuu-red dark:text-wayuu-dark-text dark:hover:bg-wayuu-red/80"
          >
            Comprobar
          </Button>
        </form>
      </div>
    )
  }
  
  