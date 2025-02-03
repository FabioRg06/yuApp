from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404
from rest_framework.permissions import IsAuthenticated
from .models import WordPhrase
from .serializers import (
    WordPhraseSerializer
)



class WordPhraseList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        word_phrases = WordPhrase.objects.all()
        serializer = WordPhraseSerializer(word_phrases, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = WordPhraseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WordPhraseDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return WordPhrase.objects.get(pk=pk)
        except WordPhrase.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        word_phrase = self.get_object(pk)
        serializer = WordPhraseSerializer(word_phrase)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        word_phrase = self.get_object(pk)
        serializer = WordPhraseSerializer(word_phrase, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        word_phrase = self.get_object(pk)
        word_phrase.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

