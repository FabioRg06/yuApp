from django.db import models
from Tags.models import Tag
from Lessons.models import Lesson
# Create your models here.
class WordPhrase(models.Model):
    text_wayuunaiki = models.CharField(max_length=200)
    text_spanish = models.CharField(max_length=200)
    tags = models.ManyToManyField(Tag, related_name="word_phrases")
    is_known = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.text_wayuunaiki} - {self.text_spanish}"


class LessonWordPhrase(models.Model):
    lesson = models.ForeignKey(Lesson, related_name="word_phrases", on_delete=models.CASCADE)
    word_phrase = models.ForeignKey(WordPhrase, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.lesson.title}: {self.word_phrase.text_wayuunaiki}"