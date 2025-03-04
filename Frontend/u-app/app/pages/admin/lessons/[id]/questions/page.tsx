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
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, ArrowLeft, PlusCircle, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"

interface Option {
  id: number
  textWayuunaiki: string
  textSpanish: string
  isCorrect: boolean
}

interface Question {
  id: number
  type: "multiple" | "translation" | "matching"
  text: string
  options: Option[]
}

export default function QuestionsPage({ params }: { params: { id: string } }) {
  const lessonId = Number.parseInt(params.id)
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
        {
          id: 3,
          textWayuunaiki: "Kasaichi",
          textSpanish: "¿Cómo estás?",
          isCorrect: false,
        },
      ],
    },
    {
      id: 2,
      type: "translation",
      text: "Traduce la siguiente palabra",
      options: [
        {
          id: 1,
          textWayuunaiki: "Anaayawatchi",
          textSpanish: "Gracias",
          isCorrect: true,
        },
      ],
    },
  ])

  const [isOpen, setIsOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [questionType, setQuestionType] = useState<"multiple" | "translation" | "matching">("multiple")
  const [options, setOptions] = useState<Option[]>([
    { id: 1, textWayuunaiki: "", textSpanish: "", isCorrect: false },
    { id: 2, textWayuunaiki: "", textSpanish: "", isCorrect: false },
  ])
  const [correctOptionId, setCorrectOptionId] = useState<number | null>(null)

  const handleAddOption = () => {
    setOptions([...options, { id: options.length + 1, textWayuunaiki: "", textSpanish: "", isCorrect: false }])
  }

  const handleRemoveOption = (id: number) => {
    if (options.length <= 2) return // Mantener al menos 2 opciones
    setOptions(options.filter((option) => option.id !== id))
    if (correctOptionId === id) {
      setCorrectOptionId(null)
    }
  }

  const handleOptionChange = (id: number, field: keyof Option, value: string | boolean) => {
    setOptions(options.map((option) => (option.id === id ? { ...option, [field]: value } : option)))
  }

  const handleCorrectOptionChange = (id: number) => {
    setCorrectOptionId(id)
    setOptions(options.map((option) => ({ ...option, isCorrect: option.id === id })))
  }

  const handleTypeChange = (type: "multiple" | "translation" | "matching") => {
    setQuestionType(type)

    // Ajustar opciones según el tipo
    if (type === "translation") {
      setOptions([{ id: 1, textWayuunaiki: "", textSpanish: "", isCorrect: true }])
      setCorrectOptionId(1)
    } else if (type === "multiple" && options.length < 2) {
      setOptions([
        { id: 1, textWayuunaiki: "", textSpanish: "", isCorrect: false },
        { id: 2, textWayuunaiki: "", textSpanish: "", isCorrect: false },
      ])
    } else if (type === "matching" && options.length < 3) {
      setOptions([
        { id: 1, textWayuunaiki: "", textSpanish: "", isCorrect: true },
        { id: 2, textWayuunaiki: "", textSpanish: "", isCorrect: true },
        { id: 3, textWayuunaiki: "", textSpanish: "", isCorrect: true },
      ])
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const text = formData.get("text") as string

    // Validar que haya una opción correcta para multiple choice
    if (questionType === "multiple" && correctOptionId === null) {
      alert("Debes seleccionar una opción correcta")
      return
    }

    // Validar que todas las opciones tengan texto
    const hasEmptyOptions = options.some((opt) => opt.textWayuunaiki.trim() === "" || opt.textSpanish.trim() === "")
    if (hasEmptyOptions) {
      alert("Todas las opciones deben tener texto en ambos idiomas")
      return
    }

    if (editingQuestion) {
      setQuestions(
        questions.map((q) => (q.id === editingQuestion.id ? { ...q, type: questionType, text, options } : q)),
      )
    } else {
      setQuestions([
        ...questions,
        {
          id: questions.length + 1,
          type: questionType,
          text,
          options,
        },
      ])
    }

    setIsOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setEditingQuestion(null)
    setQuestionType("multiple")
    setOptions([
      { id: 1, textWayuunaiki: "", textSpanish: "", isCorrect: false },
      { id: 2, textWayuunaiki: "", textSpanish: "", isCorrect: false },
    ])
    setCorrectOptionId(null)
  }

  const handleEdit = (question: Question) => {
    setEditingQuestion(question)
    setQuestionType(question.type)
    setOptions([...question.options])
    if (question.type === "multiple") {
      const correctOption = question.options.find((opt) => opt.isCorrect)
      setCorrectOptionId(correctOption?.id || null)
    }
    setIsOpen(true)
  }

  const handleDelete = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const renderOptionFields = () => {
    if (questionType === "translation") {
      return (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Respuesta Correcta</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wayuunaiki1">Texto en Wayuunaiki</Label>
              <Input
                id="wayuunaiki1"
                value={options[0]?.textWayuunaiki || ""}
                onChange={(e) => handleOptionChange(1, "textWayuunaiki", e.target.value)}
                placeholder="Ej: Jamaya"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="spanish1">Texto en Español</Label>
              <Input
                id="spanish1"
                value={options[0]?.textSpanish || ""}
                onChange={(e) => handleOptionChange(1, "textSpanish", e.target.value)}
                placeholder="Ej: Hola"
                required
              />
            </div>
          </div>
        </div>
      )
    }

    if (questionType === "matching") {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Pares para Emparejar</h3>
            <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
              <PlusCircle className="h-4 w-4 mr-1" /> Añadir Par
            </Button>
          </div>
          {options.map((option, index) => (
            <div key={option.id} className="grid grid-cols-2 gap-4 relative border p-4 rounded-md">
              {options.length > 3 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground"
                  onClick={() => handleRemoveOption(option.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <div className="space-y-2">
                <Label htmlFor={`wayuunaiki${option.id}`}>Texto en Wayuunaiki</Label>
                <Input
                  id={`wayuunaiki${option.id}`}
                  value={option.textWayuunaiki}
                  onChange={(e) => handleOptionChange(option.id, "textWayuunaiki", e.target.value)}
                  placeholder={`Palabra/Frase ${index + 1}`}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`spanish${option.id}`}>Texto en Español</Label>
                <Input
                  id={`spanish${option.id}`}
                  value={option.textSpanish}
                  onChange={(e) => handleOptionChange(option.id, "textSpanish", e.target.value)}
                  placeholder={`Traducción ${index + 1}`}
                  required
                />
              </div>
            </div>
          ))}
        </div>
      )
    }

    // Multiple choice
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Opciones</h3>
          <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
            <PlusCircle className="h-4 w-4 mr-1" /> Añadir Opción
          </Button>
        </div>
        <RadioGroup
          value={correctOptionId?.toString()}
          onValueChange={(value) => handleCorrectOptionChange(Number.parseInt(value))}
        >
          {options.map((option, index) => (
            <div key={option.id} className="grid grid-cols-1 gap-4 relative border p-4 rounded-md mb-4">
              {options.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground"
                  onClick={() => handleRemoveOption(option.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value={option.id.toString()} id={`correct-${option.id}`} />
                <Label htmlFor={`correct-${option.id}`}>Opción correcta</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`wayuunaiki${option.id}`}>Texto en Wayuunaiki</Label>
                  <Input
                    id={`wayuunaiki${option.id}`}
                    value={option.textWayuunaiki}
                    onChange={(e) => handleOptionChange(option.id, "textWayuunaiki", e.target.value)}
                    placeholder={`Opción ${index + 1} en Wayuunaiki`}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`spanish${option.id}`}>Texto en Español</Label>
                  <Input
                    id={`spanish${option.id}`}
                    value={option.textSpanish}
                    onChange={(e) => handleOptionChange(option.id, "textSpanish", e.target.value)}
                    placeholder={`Opción ${index + 1} en Español`}
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/pages/admin/lessons">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-wayuu-red">Gestión de Preguntas</h1>
        </div>
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-wayuu-red hover:bg-wayuu-red/80">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Pregunta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingQuestion ? "Editar Pregunta" : "Crear Nueva Pregunta"}</DialogTitle>
              <DialogDescription>Complete los detalles de la pregunta a continuación.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Pregunta</Label>
                  <Select value={questionType} onValueChange={(value) => handleTypeChange(value as any)}>
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
                  <Textarea
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
                    {renderOptionFields()}
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
                  {question.options.map((option) => (
                    <div key={option.id} className="flex justify-between items-center p-2 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{option.textWayuunaiki}</p>
                        <p className="text-sm text-muted-foreground">{option.textSpanish}</p>
                      </div>
                      {option.isCorrect && question.type === "multiple" && (
                        <span className="text-green-500 text-sm">Correcta</span>
                      )}
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

