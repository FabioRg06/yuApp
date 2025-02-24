from rest_framework import serializers
from .models import  Question, QuestionType,QuestionOption
from Content_system.WordPhrases.serializers import WordPhraseSerializer,WordPhrase


class QuestionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionType
        fields = ["id","name","description"]

class QuestionOptionSerializer(serializers.ModelSerializer):
    word_phrase = serializers.PrimaryKeyRelatedField(queryset=WordPhrase.objects.all())

    class Meta:
        model = QuestionOption
        fields =  ["id","question_option", "word_phrase", "is_correct"]
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if isinstance(instance.word_phrase, WordPhrase):
            data["word_phrase"] = WordPhraseSerializer(instance.word_phrase).data  
        
        return data



class QuestionSerializer(serializers.ModelSerializer):
    question_option = QuestionOptionSerializer(many=True,read_only=True)
    question_type=serializers.PrimaryKeyRelatedField(queryset=QuestionType.objects.all())
    class Meta:
        model = Question
        fields = ["id","lesson","question_type","text","question_option"]
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if isinstance(instance.question_type, QuestionType):
            data["question_type"] = QuestionTypeSerializer(instance.question_type).data  
        
        return data

