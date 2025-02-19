from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import WordPhraseSerializer
from .services.word_phrase_service import WordPhraseService

class WordPhraseListCreateView(generics.ListCreateAPIView):
    """Lista todas las palabras/frases o permite crear nuevas"""
    serializer_class = WordPhraseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WordPhraseService.list_word_phrases()

    def perform_create(self, serializer):
        serializer.save()

class WordPhraseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Ver, actualizar o eliminar una palabra/frase"""
    serializer_class = WordPhraseSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        word_phrase_id = self.kwargs["pk"]
        return WordPhraseService.get_word_phrase(word_phrase_id)
