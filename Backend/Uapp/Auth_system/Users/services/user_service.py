from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from ..repositories.user_repository import UserRepository,UserProgressRepository

class UserService:
    @staticmethod
    def register_user(validated_data):
        """Registra un usuario y devuelve sus tokens"""
        user = UserRepository.create_user(validated_data)
        return UserService.generate_tokens(user)

    @staticmethod
    def authenticate_user(email, password):
        """Autentica un usuario y devuelve tokens si es válido"""
        user = UserRepository.get_user_by_email(email)
        if user and user.check_password(password):
            return UserService.generate_tokens(user)
        return None

    @staticmethod
    def generate_tokens(user):
        """Genera tokens de acceso y refresco para un usuario"""
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


class UserProgressService:
    """Maneja la lógica de negocio para el progreso de los usuarios."""

    @staticmethod
    def get_progress(user, lesson):
        return UserProgressRepository.get_progress(user, lesson)

    @staticmethod
    def is_completed(user, lesson):
        return UserProgressRepository.is_completed(user, lesson)
    @staticmethod
    def update_lesson_progress(user, lesson, progress):
        """Lógica para actualizar el progreso de la lección del usuario."""
        if not (0.0 <= progress <= 100.0):
            raise ValueError("El progreso debe estar entre 0 y 100")
        return UserProgressRepository.update_or_create_progress(user, lesson, progress)