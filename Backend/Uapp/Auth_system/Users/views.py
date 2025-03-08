from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import CustomUserSerializer, RoleSerializer, UserProgressSerializer
from .services.user_service import RoleService, UserService
from .repositories.user_repository import RoleRepository, UserProgressRepository

class RegisterView(generics.CreateAPIView):
    """Registra un usuario y devuelve los tokens"""
    serializer_class = CustomUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            # Formateamos los errores para hacerlos más legibles
            error_messages = {field: ", ".join(errors) for field, errors in serializer.errors.items()}
            return Response(data={"errors": error_messages}, status=status.HTTP_400_BAD_REQUEST)

        try:
            tokens = UserService.register_user(serializer.validated_data)
            return Response(tokens, status=status.HTTP_201_CREATED)
        
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"error": "Error inesperado al registrar el usuario."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(generics.GenericAPIView):
    """Autentica un usuario y devuelve los tokens"""
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        credentials = UserService.authenticate_user(email, password)
        if credentials:
            return credentials
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class UserProgressList(generics.ListCreateAPIView):
    """Lista el progreso del usuario o permite crearlo"""
    serializer_class = UserProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserProgressRepository.get_all_progress()

    def perform_create(self, serializer):
        serializer.save()
class RoleList(generics.ListCreateAPIView):
    """Lista el progreso del usuario o permite crearlo"""
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RoleRepository.get_all_roles()

    def perform_create(self, serializer):
        serializer.save()
class RoleDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Obtiene, actualiza y elimina una lección."""
    permission_classes = [IsAuthenticated]
    serializer_class = RoleSerializer

    def get_object(self):
        return RoleService.get_rol_by_id(self.kwargs.get("pk"))

    def put(self, request, *args, **kwargs):
        role = self.get_object()
        updated_role = RoleService.update_role(role.id, request.data)
        if updated_role:
            return Response(RoleSerializer(updated_role).data)
        return Response({"error": "Lección no encontrada"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        role = self.get_object()
        if role:
            RoleService.delete_role(role.id)
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "Lección no encontrada"}, status=status.HTTP_404_NOT_FOUND)
