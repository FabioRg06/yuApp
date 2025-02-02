
# Create your views here.
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404
from rest_framework.permissions import IsAuthenticated
from .models import Chapter
from .serializers import (
    ChapterSerializer
)

class ChapterList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        chapters = Chapter.objects.all()
        serializer = ChapterSerializer(chapters, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = ChapterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChapterDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Chapter.objects.get(pk=pk)
        except Chapter.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        chapter = self.get_object(pk)
        serializer = ChapterSerializer(chapter)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        chapter = self.get_object(pk)
        serializer = ChapterSerializer(chapter, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        chapter = self.get_object(pk)
        chapter.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)