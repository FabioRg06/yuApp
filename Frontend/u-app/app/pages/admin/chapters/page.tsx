"use client"

import type React from "react"

import { useEffect, useState } from "react"
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
import { Chapter } from "@/app/utils/interfaces/interfaces"
import { fetchChapters } from "@/app/services/api/api"
import { createChapter, deleteChapter, updateChapter } from "@/app/services/api/chapters/api"
import { withAuth } from "@/app/utils/withAuth"


function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([])

  const [isOpen, setIsOpen] = useState(false)
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null)
  useEffect(() => {
      fetchChapters(setChapters)
      console.log(chapters)
    }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get("title") as string
    const description = formData.get("description") as string

    if (editingChapter) {
      // Update existing chapter
      updateChapter(editingChapter.id,title,description)
      setChapters(
        chapters.map((chapter) => (chapter.id === editingChapter.id ? { ...chapter, title, description } : chapter)),
      )
    } else {
      // Create new chapter
      createChapter(title,description)
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
    deleteChapter(id)
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

export default withAuth(ChaptersPage)