from rest_framework import serializers
from .models import  Question, QuestionType
from ..WordPhrases.serializers import WordPhraseSerializer


class QuestionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionType
        fields = "__all__"


class QuestionSerializer(serializers.ModelSerializer):

    question_type= QuestionTypeSerializer(read_only=True)
    correct_answer = WordPhraseSerializer(read_only=True)  # Muestra el objeto completo
    options = WordPhraseSerializer(many=True, read_only=True) 
    class Meta:
        model = Question
        fields = "__all__"

