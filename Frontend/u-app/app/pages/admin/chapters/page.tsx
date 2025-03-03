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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2 } from "lucide-react"

interface Chapter {
  id: number
  title: string
  description: string
  progress: number
}

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: 1,
      title: "Saludos y Presentaciones",
      description: "Aprende a saludar y presentarte en Wayuu",
      progress: 75,
    },
    {
      id: 2,
      title: "Números y Colores",
      description: "Descubre los números y colores en Wayuu",
      progress: 33,
    },
  ])

  const [isOpen, setIsOpen] = useState(false)
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    if (editingChapter) {
      // Update existing chapter
      setChapters(
        chapters.map((chapter) => (chapter.id === editingChapter.id ? { ...chapter, title, description } : chapter)),
      )
    } else {
      // Create new chapter
      setChapters([
        ...chapters,
        {
          id: chapters.length + 1,
          title,
          description,
          progress: 0,
        },
      ])
    }

    setIsOpen(false)
    setEditingChapter(null)
  }

  const handleEdit = (chapter: Chapter) => {
    setEditingChapter(chapter)
    setIsOpen(true)
  }

  const handleDelete = (id: number) => {
    setChapters(chapters.filter((chapter) => chapter.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-wayuu-red">Gestión de Capítulos</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-wayuu-red hover:bg-wayuu-red/80">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Capítulo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingChapter ? "Editar Capítulo" : "Crear Nuevo Capítulo"}</DialogTitle>
              <DialogDescription>Complete los detalles del capítulo a continuación.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingChapter?.title}
                    placeholder="Ej: Saludos y Presentaciones"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={editingChapter?.description}
                    placeholder="Describe el contenido del capítulo"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-wayuu-red hover:bg-wayuu-red/80">
                  {editingChapter ? "Guardar Cambios" : "Crear Capítulo"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {chapters.map((chapter) => (
          <Card key={chapter.id}>
            <CardHeader>
              <CardTitle>{chapter.title}</CardTitle>
              <CardDescription>{chapter.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(chapter)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(chapter.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

