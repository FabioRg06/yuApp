from rest_framework import serializers
from .models import  Question, QuestionType,QuestionOption
from ..WordPhrases.serializers import WordPhraseSerializer


class QuestionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionType
        fields = "__all__"

class QuestionOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOption
        fields =  ["question_option", "word_phrase", "is_correct"]



class QuestionSerializer(serializers.ModelSerializer):

    question_type= QuestionTypeSerializer(read_only=True)
    question_option = QuestionOptionSerializer(many=True,read_only=True) 
    class Meta:
        model = Question
        fields = ["id","lesson","question_type","text","question_option"]

