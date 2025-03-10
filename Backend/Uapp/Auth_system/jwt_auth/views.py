from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework import status

class ValidateTokenView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response({"detail": "Token válido"}, status=200)

class CookieTokenRefreshView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')

        if refresh_token is None:
            return Response({"detail": "Refresh token no encontrado"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)

            response = Response({"detail": "Token renovado correctamente"}, status=status.HTTP_200_OK)
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=False,  # Cambiar a True en producción con HTTPS
                samesite='None',
                max_age=60 * 15,  # Ejemplo: 15 minutos
            )
            return response
        except TokenError:
            return Response({"detail": "Token inválido o expirado"}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):

    def post(self, request):
        response = Response({"message": "Logout exitoso"}, status=200)
        response.delete_cookie("access_token", samesite="None")
        response.delete_cookie("refresh_token", samesite="None")
        return response
        