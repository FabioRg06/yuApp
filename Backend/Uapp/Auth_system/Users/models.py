
# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.hashers import make_password

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)

    def save(self, *args, **kwargs):
        if not self.pk:  # Solo aplica cuando se crea un usuario
            self.password = make_password(self.password)
        super().save(*args, **kwargs)
