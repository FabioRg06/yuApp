
# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.hashers import make_password
from Content_system.Chapters.models import Chapter
from Content_system.Lessons.models import Lesson

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)

    def save(self, *args, **kwargs):
        if not self.pk:  # Solo aplica cuando se crea un usuario
            self.password = make_password(self.password)
        super().save(*args, **kwargs)
class UserProgress(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name="user_progress", null=True, blank=True)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="user_progress", null=True, blank=True)
    completed = models.BooleanField(default=False)
    completion_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.lesson:
            return f"{self.user.username} - Lesson: {self.lesson.title}"
        return f"{self.user.username} - Chapter: {self.chapter.title}"
