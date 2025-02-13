from rest_framework import serializers
from .models import Chapter
from Content_system.Lessons.serializers import LessonSerializer

class ChapterSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)  
    class Meta:
        model = Chapter
        fields = ['id', 'title', 'description', 'created_at', 'lessons']

