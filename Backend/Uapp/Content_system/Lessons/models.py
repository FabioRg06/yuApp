from django.db import models
from Content_system.Chapters.models import Chapter 

class Lesson(models.Model):
    title = models.CharField(max_length=200 , null=True)
    chapter = models.ForeignKey(Chapter, related_name="lessons", on_delete=models.CASCADE)
    description=models.CharField(max_length=200, null=True)
    icon=models.CharField(max_length=200, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    score=models.FloatField(default=0.0)

    def __str__(self):
        return f"{self.title}:({self.description})"
