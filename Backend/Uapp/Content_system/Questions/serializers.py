from rest_framework import serializers
from .models import  Question, QuestionType,QuestionOption
from ..WordPhrases.serializers import WordPhraseSerializer


class QuestionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionType
        fields = "__all__"

class QuestionOptionSerializer(serializers.ModelSerializer):
    word_phrase=WordPhraseSerializer(read_only=True)
    class Meta:
        model = QuestionOption
        fields =  ["question_id", "word_phrase", "is_correct"]



class QuestionSerializer(serializers.ModelSerializer):

    question_type= QuestionTypeSerializer(read_only=True)
    options = QuestionOptionSerializer(many=True,read_only=True) 
    class Meta:
        model = Question
        fields = ["id","lesson","question_type","text","options"]

