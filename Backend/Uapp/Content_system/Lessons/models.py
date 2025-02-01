from django.db import models
from Content_system.Chapters.models import Chapter 
# Create your models here.
class LessonType(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Lesson(models.Model):
    title = models.CharField(max_length=200)
    chapter = models.ForeignKey(Chapter, related_name="lessons", on_delete=models.CASCADE)
    lesson_type = models.ForeignKey(LessonType, on_delete=models.SET_NULL, null=True, related_name="lessons")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.lesson_type})"
