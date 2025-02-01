from rest_framework import serializers
from .models import WordPhrase

class WordPhraseSerializer(serializers.ModelSerializer):

    class Meta:
        model = WordPhrase
        fields = '__all__'