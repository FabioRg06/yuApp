from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import CustomUserSerializer, UserProgressSerializer
from .services.user_service import UserService
from .repositories.user_repository import UserProgressRepository

class RegisterView(generics.CreateAPIView):
    """Registra un usuario y devuelve los tokens"""
    serializer_class = CustomUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            tokens = UserService.register_user(serializer.validated_data)
            return Response(tokens, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(generics.GenericAPIView):
    """Autentica un usuario y devuelve los tokens"""
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        tokens = UserService.authenticate_user(email, password)
        if tokens:
            return Response(tokens, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class UserProgressList(generics.ListCreateAPIView):
    """Lista el progreso del usuario o permite crearlo"""
    serializer_class = UserProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserProgressRepository.get_all_progress()

    def perform_create(self, serializer):
        serializer.save()
