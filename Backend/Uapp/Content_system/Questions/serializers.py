from rest_framework import serializers
from .models import  Question, QuestionType

class QuestionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionType
        fields = ['id', 'name']


class QuestionSerializer(serializers.ModelSerializer):



    class Meta:
        model = Question
        fields = ['id', 'lesson', 'text', 'question_type', 'correct_word_phrases']

