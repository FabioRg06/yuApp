
# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.hashers import make_password
from Content_system.Chapters.models import Chapter
from Content_system.Lessons.models import Lesson

class Role(models.Model):
    name=models.CharField(default="student", max_length=50)
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    role=models.ForeignKey(Role, default=1,on_delete=models.CASCADE, related_name="role")

    def save(self, *args, **kwargs):
        if not self.pk:  # Solo aplica cuando se crea un usuario
            self.password = make_password(self.password)
        super().save(*args, **kwargs)
class UserProgress(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="progress")
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="progress")
    progress = models.FloatField(default=0.0) 
    completed = models.BooleanField(default=False)  
    score=models.FloatField(default=0.0)

    class Meta:
        unique_together = ('user', 'lesson')  

    def save(self, *args, **kwargs):
        if self.progress >= 100.0:
            self.completed = True
        super().save(*args, **kwargs)


