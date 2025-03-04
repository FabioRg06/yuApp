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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { createWord, deleteWord, fetchWords, updateWord } from "@/app/services/api/words/api"
import { WordPhrase } from "@/app/utils/interfaces/interfaces"

export default function WordsPage() {
  const [words, setWords] = useState<WordPhrase[]>([])

  const [isOpen, setIsOpen] = useState(false)
  const [editingWord, setEditingWord] = useState<WordPhrase | null>(null)
  const [tags, setTags] = useState("")
  useEffect(() => {
          fetchWords(setWords)
        }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const textWayuunaiki = formData.get("textWayuunaiki") as string
    const textSpanish = formData.get("textSpanish") as string
    const type = formData.get("type") as "word" | "phrase"
    const isKnown = formData.get("isKnown") === "on"
    const tagsList = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "")

    if (editingWord) {
      // Update existing word
      setWords(
        words.map((word) =>
          word.id === editingWord.id ? { ...word, textWayuunaiki, textSpanish, type, isKnown, tags: tagsList } : word,
        ),
      )
      updateWord(editingWord.id,textWayuunaiki, textSpanish, type, isKnown)
    } else {
      // Create new word
      createWord(textWayuunaiki, textSpanish, type, isKnown)
    }

    setIsOpen(false)
    setEditingWord(null)
    setTags("")
  }

  const handleEdit = (word: WordPhrase) => {
    setEditingWord(word)
    setTags(word.tags.join(", "))
    setIsOpen(true)
  }

  const handleDelete = (id: number) => {
    setWords(words.filter((word) => word.id !== id))
    deleteWord(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-wayuu-red">Gestión de Palabras/Frases</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-wayuu-red hover:bg-wayuu-red/80">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Palabra/Frase
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingWord ? "Editar Palabra/Frase" : "Crear Nueva Palabra/Frase"}</DialogTitle>
              <DialogDescription>Complete los detalles de la palabra o frase a continuación.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="textWayuunaiki">Texto en Wayuunaiki</Label>
                  <Input
                    id="textWayuunaiki"
                    name="textWayuunaiki"
                    defaultValue={editingWord?.text_wayuunaiki}
                    placeholder="Ej: Jamaya"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="textSpanish">Texto en Español</Label>
                  <Input
                    id="textSpanish"
                    name="textSpanish"
                    defaultValue={editingWord?.text_spanish}
                    placeholder="Ej: Hola"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select name="type" defaultValue={editingWord?.type || "word"} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="word">Palabra</SelectItem>
                      <SelectItem value="phrase">Frase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Ej: saludo, básico, cortesía"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="isKnown" name="isKnown" defaultChecked={editingWord?.is_known} />
                  <Label htmlFor="isKnown">Marcar como conocida</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-wayuu-red hover:bg-wayuu-red/80">
                  {editingWord ? "Guardar Cambios" : "Crear Palabra/Frase"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {words.map((word) => (
          <Card key={word.id}>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>{word.text_wayuunaiki}</span>
                <span className="text-sm bg-wayuu-teal text-wayuu-navy px-2 py-1 rounded-full">
                  {word.type === "word" ? "Palabra" : "Frase"}
                </span>
              </CardTitle>
              <CardDescription>{word.text_spanish}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                {word.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-wayuu-sand dark:bg-wayuu-dark-bg text-wayuu-navy dark:text-wayuu-dark-text text-xs px-2 py-1 rounded-full mr-1 mb-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(word)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(word.id)}>
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

