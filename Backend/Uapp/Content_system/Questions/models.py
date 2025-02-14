from django.db import models
from ..Lessons.models import Lesson
from ..WordPhrases.models import WordPhrase
# Create your models here.
class QuestionType(models.Model):
    """Define los diferentes tipos de preguntas (opción múltiple, completar, traducir, etc.)."""
    name = models.CharField(max_length=50)
    text= models.TextField(default="")
    def __str__(self):
        return self.name


class Question(models.Model):
    lesson = models.ForeignKey(Lesson, related_name="questions", on_delete=models.CASCADE)
    question_type = models.ForeignKey(QuestionType, on_delete=models.SET_NULL, null=True, related_name="questions")
    options = models.ManyToManyField(WordPhrase, related_name="associated_questions", blank=True)
    correct_answer=models.ForeignKey(WordPhrase,on_delete=models.CASCADE,default=1)

    def __str__(self):
        return f"{self.lesson.title}: {self.text}"

