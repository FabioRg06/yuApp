"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Pencil, Trash2, ArrowLeft, PlusCircle, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { WordPhrase,QuestionOption,QuestionType,Question } from "@/app/utils/interfaces/interfaces"
import { fetchWords } from "@/app/services/api/words/api"
import {  createOption, createQuestionWithOptions, deleteQuestion, deleteQuestionOption, fetchQuestionsOfLesson, updateOption, updateQuestion } from "@/app/services/api/questions/api"
import { text } from "stream/consumers"


export default function QuestionsPage({ params }: { params: { id: string } }) {
  const lessonId = Number.parseInt(params.id)
  const [questions, setQuestions] = useState<Question[]>([])
  const [wordPhrases, setWordPhrases] = useState<WordPhrase[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [questionType, setQuestionType] = useState<string>("multiple selection")
  const [selectedWordPhrases, setSelectedWordPhrases] = useState<{ word_phrase: number; is_correct: boolean, id:number,question_option:number}[]>([])
  const [questionText, setQuestionText] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Simular carga de datos
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      // Simular datos de palabras/frases
      

      // Simular datos de preguntas
     

      fetchWords(setWordPhrases)
      fetchQuestionsOfLesson(lessonId,setQuestions)
      setIsLoading(false)
    }

    fetchData()
  }, [lessonId])

  const resetForm = () => {
    setEditingQuestion(null)
    setQuestionType("multiple selection")
    setSelectedWordPhrases([])
    setQuestionText("")
  }

  const handleEdit = (question: Question) => {
    setEditingQuestion(question)
    setQuestionType(question.question_type.name)
    setQuestionText(question.text)
    // Mapear las opciones existentes
    const mappedOptions = question.question_option.map((option) => (
      
      {
      word_phrase: option.word_phrase.id,
      is_correct: option.is_correct,
      id:option.id,
      question_option:option.question_option
    }))

    setSelectedWordPhrases(mappedOptions)
    setIsOpen(true)
  }

  const handleDelete = (id: number) => {
    deleteQuestion(id)
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const handleAddWordPhrase = async () => {
    // Añadir una palabra/frase vacía a la selección
    const question_option=selectedWordPhrases.length>0?selectedWordPhrases[0].question_option:0
    let obj:any={}
    if(question_option){
       obj= await createOption(question_option,wordPhrases[0].id,false)
    }
    setSelectedWordPhrases([...selectedWordPhrases, {id:0,word_phrase:0,is_correct:false,question_option:0}])
    
 
  }

  const handleRemoveWordPhrase = (index: number) => {
    if(confirm("are you sure?")){
      const newSelected = [...selectedWordPhrases]
      if(newSelected[index].id!=0){
        deleteQuestionOption(newSelected[index].id)
      }
      newSelected.splice(index, 1)
      setSelectedWordPhrases(newSelected)
    }
    
  }

  const handleWordPhraseChange = (index: number, wordPhraseId: number) => {
    const newSelected = [...selectedWordPhrases]
    if(newSelected[index].id!=0){
      const toUpdate=newSelected[index]
      updateOption(toUpdate.id,toUpdate.question_option,wordPhraseId,toUpdate.is_correct)
      
    }
    newSelected[index].word_phrase = wordPhraseId
    setSelectedWordPhrases(newSelected)
  }

  const handleCorrectChange = (index: number, isCorrect: boolean) => {
    const newSelected = [...selectedWordPhrases]
    if(newSelected[index].id!=0){
      const toUpdate=newSelected[index]
      updateOption(toUpdate.id,toUpdate.question_option,toUpdate.word_phrase,isCorrect)
      
    }
    newSelected[index].is_correct = isCorrect
    setSelectedWordPhrases(newSelected)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validar que haya al menos una opción seleccionada
    if (selectedWordPhrases.length === 0) {
      alert("Debes seleccionar al menos una palabra/frase")
      return
    }

    // Validar que todas las opciones tengan una palabra/frase seleccionada
    if (selectedWordPhrases.some((item) => item.word_phrase === 0)) {
      alert("Todas las opciones deben tener una palabra/frase seleccionada")
      return
    }

    // Validar que haya al menos una opción correcta para multiple y translation
    if (
      (questionType === "multiple selection" || questionType === "translation") &&
      !selectedWordPhrases.some((item) => item.is_correct)
    ) {
      alert("Debe haber al menos una opción correcta")
      return
    }
    // Crear las opciones de la pregunta
    const questionOptions: any[] = selectedWordPhrases.map((selected, index) => {
      const wordPhrase = wordPhrases.find((wp) => wp.id === selected.word_phrase)!
      return {
        word_phrase: wordPhrase,
        is_correct: selected.is_correct,
      }
    })

    // Determinar el tipo de pregunta
    const questionTypeObj: QuestionType = {
      id: questionType === "multiple selection" ? 1 : questionType === "matching" ? 2 : 3,
      name: questionType,
      description:
        questionType === "translation"
          ? "translate the next word/phrase"
          : questionType === "matching"
            ? "connect two words"
            : null,
    }

    if (editingQuestion) {
      // Actualizar pregunta existente
      const updatedQuestion: Question = {
        ...editingQuestion,
        text: questionText,
        question_type: questionTypeObj,
        question_option: questionOptions.map((option, index) => ({
          ...option,
          id: editingQuestion.question_option[index]?.id || index + 1,
          question_option: editingQuestion.id,
        })),
      }
      updateQuestion(editingQuestion.id,lessonId,questionTypeObj.id,questionText)
      setQuestions(questions.map((q) => (q.id === editingQuestion.id ? updatedQuestion : q)))

    } else {
      // Crear nueva pregunta
      const newId= await createQuestionWithOptions(lessonId,questionTypeObj.id,questionText, questionOptions.map((option, index) => ({
        ...option,
      })))
      const newQuestion: Question = {
        id: newId,
        lesson: lessonId,
        question_type: questionTypeObj,
        text: questionText,
        question_option: questionOptions.map((option, index) => ({
          ...option,
          id: index + 1,
          question_option: newId,
        })),
      }

      setQuestions([...questions, newQuestion])
    }

    setIsOpen(false)
    resetForm()
  }

  const getMinOptionsCount = () => {
    switch (questionType) {
      case "multiple selection":
        return 2 // Al menos 2 opciones para selección múltiple
      case "translation":
        return 1 // Solo 1 opción para traducción
      case "matching":
        return 3 // Al menos 3 pares para emparejamiento
      default:
        return 2
    }
  }

  const renderWordPhraseSelector = () => {
    const minOptions = getMinOptionsCount()

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">
            {questionType === "translation"
              ? "Respuesta Correcta"
              : questionType === "matching"
                ? "Pares para Emparejar"
                : "Opciones"}
          </h3>
          {questionType !== "translation" && (
            <Button type="button" variant="outline" size="sm" onClick={handleAddWordPhrase}>
              <PlusCircle className="h-4 w-4 mr-1" />
              Añadir {questionType === "matching" ? "Par" : "Opción"}
            </Button>
          )}
        </div>

        {selectedWordPhrases.map((selected, index) => (
          <div key={`word-${index}`} className="border p-4 rounded-md relative">
            {selectedWordPhrases.length > minOptions && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground"
                onClick={() => handleRemoveWordPhrase(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            <div className="grid grid-cols-1 gap-4">
              {questionType !== "translation" && (
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id={`correct-${index}`}
                    checked={selected.is_correct}
                    onCheckedChange={(checked) => handleCorrectChange(index, checked === true)}
                  />
                  <Label htmlFor={`correct-${index}`}>
                    {questionType === "multiple selection" ? "Opción correcta" : "Par correcto"}
                  </Label>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor={`wordphrase-${index}`}>Palabra/Frase</Label>
                <Select
                  value={selected.word_phrase.toString()}
                  onValueChange={(value) => handleWordPhraseChange(index, Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una palabra/frase" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Selecciona una palabra/frase</SelectItem>
                    {wordPhrases.map((wp) => (
                      <SelectItem key={wp.id} value={wp.id.toString()}>
                        {wp.text_wayuunaiki} - {wp.text_spanish}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selected.word_phrase > 0 && (
                <div className="bg-muted p-2 rounded-md">
                  <p className="font-medium">{wordPhrases.find((wp) => wp.id === selected.word_phrase)?.text_wayuunaiki}</p>
                  <p className="text-sm text-muted-foreground">
                    {wordPhrases.find((wp) => wp.id === selected.word_phrase)?.text_spanish}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}

        {selectedWordPhrases.length === 0 && (
          <Button type="button" variant="outline" className="w-full" onClick={handleAddWordPhrase}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Añadir {questionType === "translation" ? "Respuesta" : questionType === "matching" ? "Par" : "Opción"}
          </Button>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wayuu-red"></div>
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
                  <Select
                    value={questionType}
                    onValueChange={(value) => {
                      setQuestionType(value)
                      // Reiniciar las opciones seleccionadas
                      if (value === "translation") {
                        setSelectedWordPhrases([{ id: 0, is_correct: true,word_phrase:0,question_option:0}])
                      } else if (value === "matching" && selectedWordPhrases.length < 3) {
                        setSelectedWordPhrases([
                          { id: 0, is_correct: true,word_phrase:0,question_option:0},
                          { id: 0, is_correct: true,word_phrase:0,question_option:0},
                          { id: 0, is_correct: true,word_phrase:0,question_option:0},
                        ])
                      } else if (value === "multiple selection" && selectedWordPhrases.length < 2) {
                        setSelectedWordPhrases([
                          { id: 0, is_correct: false,word_phrase:0,question_option:0},
                          { id: 0, is_correct: false,word_phrase:0,question_option:0},
                        ])
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple selection">Selección Múltiple</SelectItem>
                      <SelectItem value="translation">Traducción</SelectItem>
                      <SelectItem value="matching">Emparejamiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="text">Texto de la Pregunta</Label>
                  <Textarea
                    id="text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
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
                    {renderWordPhraseSelector()}
                  </TabsContent>
                  <TabsContent value="preview">
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-muted-foreground">Vista previa de la pregunta...</p>
                        <div className="mt-4">
                          <h3 className="font-medium">{questionText}</h3>
                          <div className="mt-2 space-y-2">
                            {selectedWordPhrases.map((selected, index) => {
                              const wordPhrase = wordPhrases.find((wp) => wp.id === selected.word_phrase)
                              if (!wordPhrase) return null

                              return (
                                <div key={index} className="flex items-center space-x-2">
                                  {questionType === "multiple selection" && (
                                    <div
                                      className={`w-4 h-4 rounded-full ${selected.is_correct ? "bg-green-500" : "bg-gray-300"}`}
                                    ></div>
                                  )}
                                  <span>
                                    {wordPhrase.text_wayuunaiki} - {wordPhrase.text_spanish}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
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
                {question.question_type.name === "multiple selection"
                  ? "Selección Múltiple"
                  : question.question_type.name === "translation"
                    ? "Traducción"
                    : "Emparejamiento"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  {question.question_option.map((option) => (
                    <div key={option.id} className="flex justify-between items-center p-2 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{option.word_phrase.text_wayuunaiki}</p>
                        <p className="text-sm text-muted-foreground">{option.word_phrase.text_spanish}</p>
                      </div>
                      {option.is_correct && question.question_type.name === "multiple selection" && (
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

