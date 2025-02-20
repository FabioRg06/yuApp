from ..models import CustomUser, UserProgress

class UserRepository:
    @staticmethod
    def get_user_by_email(email):
        """Obtiene un usuario por su email"""
        try:
            return CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return None

    @staticmethod
    def create_user(validated_data):
        """Crea un usuario con contraseña encriptada"""
        user = CustomUser.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])  # Hash de la contraseña
        user.save()
        return user

class UserProgressRepository:
    """Maneja la interacción con la base de datos para el progreso de los usuarios."""

    @staticmethod
    def get_progress(user, lesson):
        progress = UserProgress.objects.filter(user=user, lesson=lesson).first()
        return progress.progress if progress else 0.0

    @staticmethod
    def is_completed(user, lesson):
        progress = UserProgress.objects.filter(user=user, lesson=lesson).first()
        return progress.completed if progress else False
    @staticmethod
    def update_or_create_progress(user, lesson, progress):
        """Actualiza o crea el progreso de una lección para el usuario."""
        user_progress, _ = UserProgress.objects.get_or_create(user=user, lesson=lesson)
        user_progress.progress = progress
        user_progress.completed = progress == 100.0
        user_progress.save()
        return user_progress