from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from ..repositories.user_repository import UserRepository

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
