from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .services.lessson_service import LessonService
from .serializers import LessonSerializer
from Auth_system.Users.services.user_service import UserProgressService
from Content_system.Lessons.repositories.lesson_repository import LessonRepository
from Auth_system.Users.serializers import UserProgressSerializer

class LessonListCreateView(generics.ListCreateAPIView):
    """Lista y crea lecciones."""
    permission_classes = [IsAuthenticated]
    serializer_class = LessonSerializer

    def get_queryset(self):
        return LessonService.get_lessons()

    def perform_create(self, serializer_class):
        lesson = LessonService.create_lesson(serializer_class.validated_data)
        serializer_class.instance = lesson
        return Response(LessonSerializer(lesson).data, status=status.HTTP_201_CREATED)

class LessonDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Obtiene, actualiza y elimina una lección."""
    permission_classes = [IsAuthenticated]
    serializer_class = LessonSerializer

    def get_object(self):
        return LessonService.get_lesson_by_id(self.kwargs.get("pk"))


    def delete(self, request, *args, **kwargs):
        lesson = self.get_object()
        if lesson:
            LessonService.delete_lesson(lesson.id)
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "Lección no encontrada"}, status=status.HTTP_404_NOT_FOUND)

class UpdateLessonProgressView(generics.UpdateAPIView):
    """
    Vista para actualizar el progreso de una lección.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserProgressSerializer

    def get_object(self):
        """
        Obtiene la lección basada en el ID de la URL.
        """
        lesson_id = self.kwargs.get('pk')
        lesson = LessonRepository.get_lesson_by_id(lesson_id)
        if not lesson:
            self.raise_not_found()
        return lesson

    def update(self, request, *args, **kwargs):
        """
        Actualiza el progreso de la lección para el usuario autenticado.
        """
        lesson = self.get_object()
        progress_data = request.data.get("progress", 0.0)

        try:
            updated_progress = UserProgressService.update_lesson_progress(request.user, lesson, progress_data)
            return Response(UserProgressSerializer(updated_progress).data, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
