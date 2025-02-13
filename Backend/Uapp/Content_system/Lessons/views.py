from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404
from rest_framework.permissions import IsAuthenticated
from Auth_system.Users.models import UserProgress
from .models import Lesson
from .serializers import (
    LessonSerializer
)

# Create your views here.
class LessonList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        """Obtiene todas las lecciones y crea automáticamente UserProgress si no existe"""
        lessons = Lesson.objects.all()

        # Verifica si el usuario ya tiene progreso en las lecciones y crea si es necesario
        for lesson in lessons:
            UserProgress.objects.get_or_create(user=request.user, lesson=lesson)

        # Serializa las lecciones con el contexto del request para incluir el progreso
        serializer = LessonSerializer(lessons, many=True, context={'request': request})
        return Response(serializer.data)


    def post(self, request, format=None):
        serializer = LessonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LessonDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Lesson.objects.get(pk=pk)
        except Lesson.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        """Obtiene una lección y crea UserProgress si no existe"""
        lesson = self.get_object(pk)

        # Crea el progreso si aún no existe
        UserProgress.objects.get_or_create(user=request.user, lesson=lesson)

        serializer = LessonSerializer(lesson, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        lesson = self.get_object(pk)
        serializer = LessonSerializer(lesson, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        lesson = self.get_object(pk)
        lesson.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
class UpdateProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, lesson_id, format=None):
        """Actualiza el progreso de una lección para el usuario autenticado"""
        try:
            lesson = Lesson.objects.get(pk=lesson_id)
        except Lesson.DoesNotExist:
            return Response({"error": "Lección no encontrada"}, status=status.HTTP_404_NOT_FOUND)

        progress_data = request.data.get("progress", 0.0)
        if not (0.0 <= progress_data <= 100.0):
            return Response({"error": "El progreso debe estar entre 0 y 100"}, status=status.HTTP_400_BAD_REQUEST)

        user_progress, created = UserProgress.objects.get_or_create(user=request.user, lesson=lesson)
        user_progress.progress = progress_data
        user_progress.save()

        return Response({"message": "Progreso actualizado", "progress": user_progress.progress})
