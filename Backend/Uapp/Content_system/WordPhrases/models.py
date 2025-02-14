from django.db import models
from ..Tags.models import Tag
from ..Lessons.models import Lesson
# Create your models here.
class WordPhrase(models.Model):
    text_wayuunaiki = models.CharField(max_length=200)
    text_spanish = models.CharField(max_length=200)
    tags = models.ManyToManyField(Tag, related_name="word_phrases"),
    lesson=models.ForeignKey(Lesson,default=1 , on_delete=models.CASCADE)
    is_known = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.text_wayuunaiki} - {self.text_spanish}"
