"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Question {
  id: number
  type: "multiple" | "translation" | "matching"
  text: string
  options: {
    id: number
    textWayuunaiki: string
    textSpanish: string
    isCorrect: boolean
  }[]
}

export default function QuestionsPage({ params }: { params: { id: string } }) {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      type: "multiple",
      text: "¿Cómo se dice 'hola' en Wayuunaiki?",
      options: [
        {
          id: 1,
          textWayuunaiki: "Jamaya",
          textSpanish: "Hola",
          isCorrect: true,
        },
        {
          id: 2,
          textWayuunaiki: "Anaayawatchi",
          textSpanish: "Gracias",
          isCorrect: false,
        },
      ],
    },
  ])

  const [isOpen, setIsOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const type = formData.get("type") as Question["type"]
    const text = formData.get("text") as string

    // Process options based on type
    const options:any[] = []
    const optionCount = type === "matching" ? 3 : type === "translation" ? 1 : 4

    for (let i = 0; i < optionCount; i++) {
      options.push({
        id: i + 1,
        textWayuunaiki: formData.get(`wayuunaiki${i}`) as string,
        textSpanish: formData.get(`spanish${i}`) as string,
        isCorrect: formData.get(`correct`) === i.toString(),
      })
    }

    if (editingQuestion) {
      setQuestions(questions.map((q) => (q.id === editingQuestion.id ? { ...q, type, text, options } : q)))
    } else {
      setQuestions([
        ...questions,
        {
          id: questions.length + 1,
          type,
          text,
          options,
        },
      ])
    }

    setIsOpen(false)
    setEditingQuestion(null)
  }

  const handleEdit = (question: Question) => {
    setEditingQuestion(question)
    setIsOpen(true)
  }

  const handleDelete = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-wayuu-red">Gestión de Preguntas</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-wayuu-red hover:bg-wayuu-red/80">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Pregunta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingQuestion ? "Editar Pregunta" : "Crear Nueva Pregunta"}</DialogTitle>
              <DialogDescription>Complete los detalles de la pregunta a continuación.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Pregunta</Label>
                  <Select name="type" defaultValue={editingQuestion?.type || "multiple"} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple">Selección Múltiple</SelectItem>
                      <SelectItem value="translation">Traducción</SelectItem>
                      <SelectItem value="matching">Emparejamiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="text">Texto de la Pregunta</Label>
                  <Input
                    id="text"
                    name="text"
                    defaultValue={editingQuestion?.text}
                    placeholder="Ej: ¿Cómo se dice 'hola' en Wayuunaiki?"
                    required
                  />
                </div>
                <Tabs defaultValue="options" className="w-full">
                  <TabsList>
                    <TabsTrigger value="options">Opciones</TabsTrigger>
                    <TabsTrigger value="preview">Vista Previa</TabsTrigger>
                  </TabsList>
                  <TabsContent value="options" className="space-y-4">
                    {/* Opciones dinámicas basadas en el tipo de pregunta */}
                    <div className="grid gap-4">
                      {[0, 1, 2, 3].map((index) => (
                        <div key={index} className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`wayuunaiki${index}`}>Texto en Wayuunaiki</Label>
                            <Input
                              id={`wayuunaiki${index}`}
                              name={`wayuunaiki${index}`}
                              placeholder="Ej: Jamaya"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`spanish${index}`}>Texto en Español</Label>
                            <Input id={`spanish${index}`} name={`spanish${index}`} placeholder="Ej: Hola" required />
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="preview">
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-muted-foreground">Vista previa de la pregunta...</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-wayuu-red hover:bg-wayuu-red/80">
                  {editingQuestion ? "Guardar Cambios" : "Crear Pregunta"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {questions.map((question) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle>{question.text}</CardTitle>
              <CardDescription>
                Tipo:{" "}
                {question.type === "multiple"
                  ? "Selección Múltiple"
                  : question.type === "translation"
                    ? "Traducción"
                    : "Emparejamiento"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  {question.options.map((option, index) => (
                    <div key={option.id} className="flex justify-between items-center p-2 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{option.textWayuunaiki}</p>
                        <p className="text-sm text-muted-foreground">{option.textSpanish}</p>
                      </div>
                      {option.isCorrect && <span className="text-green-500 text-sm">Correcta</span>}
                    </div>
                  ))}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(question)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(question.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

