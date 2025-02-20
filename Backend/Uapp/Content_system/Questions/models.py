from django.db import models
from Content_system.Lessons.models import Lesson
from Content_system.WordPhrases.models import WordPhrase


class QuestionType(models.Model):
    """Define los tipos de preguntas disponibles."""
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Question(models.Model):
    """Modelo base para todas las preguntas."""
    lesson = models.ForeignKey(Lesson, related_name="questions", on_delete=models.CASCADE)
    question_type = models.ForeignKey(QuestionType, on_delete=models.SET_NULL, null=True)
    text = models.TextField()  # Enunciado de la pregunta


    def __str__(self):
        return self.text


class QuestionOption(models.Model):
    """Opciones de respuesta para una pregunta (tanto selección como emparejamiento)."""
    question = models.ForeignKey(Question, related_name="options", on_delete=models.CASCADE)
    word_phrase = models.ForeignKey(WordPhrase, on_delete=models.CASCADE)
    is_correct = models.BooleanField(default=False)  # Indica si esta opción es una respuesta válida

