from django.db import models
from Content_system.Tags.models import Tag
from Content_system.Lessons.models import Lesson

class WordPhrase(models.Model):
    WORD = "word"
    PHRASE = "phrase"
    TYPE_CHOICES = [
        (WORD, "Word"),
        (PHRASE, "Phrase"),
    ]

    text_wayuunaiki = models.CharField(max_length=200)
    text_spanish = models.CharField(max_length=200)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES,default=(WORD, "Word"))  # Nuevo campo para diferenciar
    tags = models.ManyToManyField(Tag, related_name="word_phrases")  # Eliminamos la coma que creaba una tupla
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    is_known = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.text_wayuunaiki} - {self.text_spanish} ({self.get_type_display()})"
