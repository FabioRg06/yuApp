from django.db import models
from ..Lessons.models import Lesson
from ..WordPhrases.models import WordPhrase
# Create your models here.
class QuestionType(models.Model):
    """Define los diferentes tipos de preguntas (opción múltiple, completar, traducir, etc.)."""
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Question(models.Model):
    lesson = models.ForeignKey(Lesson, related_name="questions", on_delete=models.CASCADE)
    text = models.TextField()  # La pregunta en sí misma
    question_type = models.ForeignKey(QuestionType, on_delete=models.SET_NULL, null=True, related_name="questions")
    correct_word_phrases = models.ManyToManyField(WordPhrase, related_name="associated_questions", blank=True)

    def __str__(self):
        return f"{self.lesson.title}: {self.text}"

