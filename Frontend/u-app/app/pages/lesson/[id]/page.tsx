"use client"

import LessonHeader from "@/app/components/lessons/LessonHeader"
import LessonCompletion from "@/app/components/lessons/LessonCompletion"
import LessonProgress from "@/app/components/lessons/LessonProgress"
import { useLesson } from "@/app/hooks/useLesson"
import MultipleChoiceQuestion from "@/app/components/questions/MultipleChoiceQuestion"
import TranslationQuestion from "@/app/components/questions/TranslationQuestion"
import MatchingQuestion from "@/app/components/questions/MatchingQuestion"
import type { Question } from "@/app/utils/interfaces/interfaces"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function LessonPage({ params }: { params: { id: string } }) {
  const {
    lesson,
    currentQuestionIndex,
    progress,
    lessonCompleted,
    correctAnswers,
    isReviewMode,
    handleMatchingAnswer,
    handleMultipleChoiceAnswer,
    handleTranslationAnswer,
  } = useLesson(params.id)

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando lección...</p>
      </div>
    )
  }

  const renderQuestion = (question: Question, index: number) => {
    switch (question.question_type.name) {
      case "multiple selection":
        return <MultipleChoiceQuestion key={index} question={question} onAnswer={handleMultipleChoiceAnswer} />
      case "translation":
        return <TranslationQuestion key={index} question={question} onAnswer={handleTranslationAnswer} />
      case "matching":
        return <MatchingQuestion key={index} question={question} onAnswer={handleMatchingAnswer} />
      default:
        return <div>Tipo de pregunta no soportado</div>
    }
  }
  

  return (
    <div className="min-h-screen bg-wayuu-sand dark:bg-wayuu-dark-bg">
      <LessonHeader chapter={lesson.chapter} title={lesson.title} />
      <main className="container mx-auto px-4 py-8">
        <Card className="bg-white/80 dark:bg-wayuu-dark-card backdrop-blur-sm mb-8 p-6 rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-wayuu-red">
              <span className="text-3xl mr-2">{lesson.icon}</span>
              {lesson.description}
              {isReviewMode && (
                <span className="ml-2 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Modo Repaso</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LessonProgress value={progress} />
            {!lessonCompleted ? (
              renderQuestion(lesson.questions[currentQuestionIndex], currentQuestionIndex)
            ) : (
              <LessonCompletion correctAnswers={correctAnswers} totalQuestions={lesson.questions.length} />
            )}
          </CardContent>
        </Card>
      </main>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}

export default LessonPage

