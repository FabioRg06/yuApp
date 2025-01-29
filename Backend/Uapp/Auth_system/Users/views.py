from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser
from .serializers import CustomUserSerializer
from rest_framework_simplejwt.tokens import RefreshToken

class CustomUserList(APIView):
    """Lista todos los tipos de predicción o crea uno nuevo."""
    def get(self, request, format=None):
        custom_users = CustomUser.objects.all()
        serializer = CustomUserSerializer(custom_users, many=True)
        return Response(serializer.data)
class RegisterView(APIView):
    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    """
    Autentica a un usuario y devuelve los tokens de acceso y refresco.
    """
    def post(self, request):
        from django.contrib.auth import authenticate
        from django.contrib.auth import get_user_model

        email = request.data.get('email')
        password = request.data.get('password')
        
        try:
            # Busca el usuario por el email
            user = get_user_model().objects.get(email=email)
            # Verifica que la contraseña proporcionada coincida con la almacenada (con hash)
            if user.check_password(password):
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_200_OK)
        
        except get_user_model().DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
