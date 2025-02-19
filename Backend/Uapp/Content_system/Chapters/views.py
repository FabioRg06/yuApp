from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import ChapterSerializer
from .services.chapter_service import ChapterService

class ChapterList(generics.ListCreateAPIView):
    """Lista todos los capítulos y permite crear uno nuevo"""
    serializer_class = ChapterSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChapterService.list_chapters()

    def perform_create(self, serializer):
        ChapterService.create_chapter(serializer.validated_data)

class ChapterDetail(generics.RetrieveUpdateDestroyAPIView):
    """Obtiene, actualiza o elimina un capítulo"""
    serializer_class = ChapterSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        chapter = ChapterService.retrieve_chapter(self.kwargs["pk"])
        if not chapter:
            self.raise_not_found()
        return chapter
