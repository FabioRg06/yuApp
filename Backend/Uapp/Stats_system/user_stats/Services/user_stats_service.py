from ..Repositories.user_stats_repository import UserStatsRepository

class UserStatsService:
    @staticmethod
    def get_user_stats(user):
        """Obtiene las estadísticas del usuario y las actualiza si es necesario"""
        stats = UserStatsRepository.get_or_create_stats(user)
        stats = UserStatsRepository.update_lives(stats)
        stats = UserStatsRepository.update_streak(stats)
        return stats

    @staticmethod
    def decrement_life(user):
        """Descuenta una vida cuando el usuario comete un error"""
        stats = UserStatsRepository.get_or_create_stats(user)
        if stats.lives > 0:
            stats.lives -= 1
            stats.save()
        return stats
