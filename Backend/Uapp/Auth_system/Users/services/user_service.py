from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.response import Response
from ..repositories.user_repository import UserRepository,UserProgressRepository,RoleRepository


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
        refresh.access_token['role'] = user.role  
        response = Response({"message": "Login exitoso"},status=201)
        
        # Configurar cookie HTTP-only para el token de acceso
        response.set_cookie(
            key="access_token",
            value=str(refresh.access_token),
            httponly=True,  # Evita acceso desde JavaScript
            secure=True,  # Solo funciona en HTTPS
            max_age=3600,  # Expira en 1 hora
            samesite="None"
        )

        # Configurar cookie HTTP-only para el refresh token
        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=True,
            max_age=7 * 24 * 3600,  # Expira en 7 días
            samesite="None"
        )

        return response


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

class RoleService:
    """Maneja la lógica de negocio para los roles."""

    @staticmethod
    def get_roles():
        return RoleRepository.get_all_roles()

    @staticmethod
    def get_role_by_id(role_id):
        return RoleRepository.get_role_by_id(role_id)

    @staticmethod
    def create_role(data):
        return RoleRepository.create_role(data)

    @staticmethod
    def update_role(role_id, data):
        role = RoleRepository.get_role_by_id(role_id)
        if role:
            return RoleRepository.update_role(role, data)
        return None

    @staticmethod
    def delete_role(role_id):
        role = RoleRepository.get_role_by_id(role_id)
        if role:
            RoleRepository.delete_role(role)


