from ..models import UserStats
from django.utils.timezone import now

class UserStatsRepository:
    @staticmethod
    def get_or_create_stats(user):
        stats, _ = UserStats.objects.get_or_create(user=user)
        return stats

    @staticmethod
    def update_lives(user_stats):
        """Regenera vidas si ha pasado una hora desde el último update"""
        elapsed_time = (now() - user_stats.last_life_update).total_seconds()
        if elapsed_time >= 3600 and user_stats.lives < 5:
            user_stats.lives = min(5, user_stats.lives + (elapsed_time // 3600))
            user_stats.last_life_update = now()
            user_stats.save()
        return user_stats

    @staticmethod
    def update_streak(user_stats):
        """Actualiza la racha de días consecutivos"""
        today = now().date()
        last_date = user_stats.last_activity.date() if user_stats.last_activity else None

        if last_date is None or (today - last_date).days > 1:
            user_stats.streak = 1  # Se reinicia la racha
        elif last_date == today:
            return user_stats  # Ya se registró actividad hoy
        else:
            user_stats.streak += 1  # Se suma a la racha

        user_stats.last_activity = now()
        user_stats.save()
        return user_stats
