from rest_framework import serializers
from .models import LessonType,Lesson  

class LessonTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonType
        fields = '__all__'


class LessonSerializer(serializers.ModelSerializer):
    lesson_type = LessonTypeSerializer(read_only=True)
    word_phrases = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = '__all__'