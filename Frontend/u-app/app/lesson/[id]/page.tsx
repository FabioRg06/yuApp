"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Exercise from "../../components/Exercise"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LessonPage({ params }: { params: { id: string } }) {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [progress, setProgress] = useState(0)

  const exercises = [
    {
      question: "¿Cómo se dice 'Hola' en Wayuu?",
      options: ["Anashi", "Juyá", "Kepeshii", "Jamaya"],
      correctAnswer: "Jamaya",
    },
    {
      question: "¿Qué significa 'Anashi' en español?",
      options: ["Gracias", "Adiós", "Buenos días", "Buenas noches"],
      correctAnswer: "Adiós",
    },
    // Agrega más ejercicios aquí
  ]

  const handleAnswer = (answer: string) => {
    if (answer === exercises[currentExercise].correctAnswer) {
      if (currentExercise < exercises.length - 1) {
        setCurrentExercise(currentExercise + 1)
      }
      setProgress(progress + 100 / exercises.length)
    } else {
      // Manejar respuesta incorrecta
      alert("Intenta de nuevo")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-200 to-orange-300 dark:from-purple-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-orange-600 dark:text-yellow-300 hover:underline mb-4">
          <ArrowLeft className="mr-2" /> Volver al inicio
        </Link>
        <h1 className="text-3xl font-bold mb-4 text-orange-600 dark:text-yellow-300">
          Lección {params.id}: Saludos básicos
        </h1>
        <Progress value={progress} className="mb-8 bg-orange-200 dark:bg-purple-700" />
        {currentExercise < exercises.length ? (
          <Exercise
            question={exercises[currentExercise].question}
            options={exercises[currentExercise].options}
            onAnswer={handleAnswer}
          />
        ) : (
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-orange-600 dark:text-yellow-300">¡Felicidades!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">Has completado esta lección.</p>
              <Button
                className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => (window.location.href = "/")}
              >
                Volver al inicio
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

