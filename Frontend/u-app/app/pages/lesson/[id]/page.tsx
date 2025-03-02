"use client"

import { withAuth } from "@/app/utils/withAuth"
import LessonHeader from "@/app/components/lessons/LessonHeader"
import LessonCompletion from "@/app/components/lessons/LessonCompletion"
import LessonProgress from "@/app/components/lessons/LessonProgress"
import { useLesson } from "@/app/hooks/useLesson"
import MultipleChoiceQuestion from "@/app/components/MultipleChoiceQuestion"
import TranslationQuestion from "@/app/components/TranslationQuestion"
import MatchingQuestion from "@/app/components/MatchingQuestion"
import { Question } from "@/app/utils/interfaces/interfaces"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function LessonPage({ params }: { params: { id: string } }) {
  const { lesson, question, currentQuestionIndex,progress, lessonCompleted, correctAnswers, handleMatchingAnswer,handleMultipleChoiceAnswer,handleTranslationAnswer } = useLesson(params.id)

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando lección...</p>
      </div>
    )
  }

    const renderQuestion = (question: Question ) => {
      switch (question.question_type.name) {
        case "multiple selection":
          return <MultipleChoiceQuestion question={question} onAnswer={handleMultipleChoiceAnswer} />
        case "translation":
          return <TranslationQuestion question={question} onAnswer={handleTranslationAnswer} />
        case "matching":
          return <MatchingQuestion question={question} onAnswer={handleMatchingAnswer} />
        default:
          return <div>Tipo de pregunta no soportado</div>
      }
    }

  return (
    <div className="min-h-screen">
      <LessonHeader chapter={lesson.chapter} title={lesson.title} />
      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8 p-6 rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle>{lesson.description}</CardTitle>
          </CardHeader>
          <CardContent>
            <LessonProgress value={progress} />
            {!lessonCompleted ? renderQuestion(lesson.questions[currentQuestionIndex]) : <LessonCompletion correctAnswers={correctAnswers} totalQuestions={lesson.questions.length} />}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default withAuth(LessonPage)
