"use client"
import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle,CardFooter } from "@/components/ui/card"
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
import { Plus, Pencil, Trash2, FileQuestion } from "lucide-react"
import Link from "next/link"
import { Chapter, Lesson } from "@/app/utils/interfaces/interfaces"
import { createLesson, deleteLesson, fetchLessons, updateLesson } from "@/app/services/api/lessons/api"
import { fetchChapters } from "@/app/services/api/api"


function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  useEffect(() => {
        fetchLessons(setLessons)
        fetchChapters(setChapters)
      }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const chapterId = Number.parseInt(formData.get("chapterId") as string)
    const icon = formData.get("icon") as string

    if (editingLesson) {
      // Update existing lesson
      setLessons(
        lessons.map((lesson) =>
          lesson.id === editingLesson.id ? { ...lesson, title, description, chapterId, icon } : lesson,
        ),
      )
      updateLesson(editingLesson.id,title,description,chapterId,icon)
    } else {
      // Create new lesson
      createLesson(title,description,chapterId,icon)
    }

    setIsOpen(false)
    setEditingLesson(null)
  }

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setIsOpen(true)
  }

  const handleDelete = (id: number) => {
    setLessons(lessons.filter((lesson) => lesson.id !== id))
    deleteLesson(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-wayuu-red">Gestión de Lecciones</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-wayuu-red hover:bg-wayuu-red/80">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Lección
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingLesson ? "Editar Lección" : "Crear Nueva Lección"}</DialogTitle>
              <DialogDescription>Complete los detalles de la lección a continuación.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="chapterId">Capítulo</Label>
                  <Select name="chapterId" defaultValue={editingLesson?.chapter.toString()} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un capítulo" />
                    </SelectTrigger>
                    <SelectContent>
                      {chapters.map((chapter) => (
                        <SelectItem key={chapter.id} value={chapter.id.toString()}>
                          {chapter.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingLesson?.title}
                    placeholder="Ej: Saludos básicos"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={editingLesson?.description}
                    placeholder="Describe el contenido de la lección"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icono (emoji)</Label>
                  <Input id="icon" name="icon" defaultValue={editingLesson?.icon} placeholder="Ej: 👋" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-wayuu-red hover:bg-wayuu-red/80">
                  {editingLesson ? "Guardar Cambios" : "Crear Lección"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <Card key={lesson.id}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{lesson.icon}</span>
                <div>
                  <CardTitle>{lesson.title}</CardTitle>
                  <CardDescription>{chapters.find((c) => c.id === lesson.chapter)?.title}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">{lesson.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(lesson)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(lesson.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/pages/admin/lessons/${lesson.id}/questions`} className="w-full">
                <Button variant="outline" className="w-full">
                  <FileQuestion className="mr-2 h-4 w-4" />
                  Gestionar Preguntas
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default LessonsPage