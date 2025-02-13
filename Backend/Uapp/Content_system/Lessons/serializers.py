from rest_framework import serializers
from .models import Lesson  


class LessonSerializer(serializers.ModelSerializer):
    word_phrases = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = '__all__'