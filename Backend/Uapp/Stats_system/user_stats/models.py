from django.db import models
from Auth_system.Users.models import CustomUser
from django.utils.timezone import now

class UserStats(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="stats")
    lives = models.PositiveIntegerField(default=5)
    last_life_update = models.DateTimeField(auto_now_add=True)
    lessons_completed = models.PositiveIntegerField(default=0)
    streak = models.PositiveIntegerField(default=0)
    last_activity = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Stats de {self.user.username}"
