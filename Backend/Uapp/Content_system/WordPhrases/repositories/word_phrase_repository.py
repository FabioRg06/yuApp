from Content_system.WordPhrases.models import WordPhrase

class WordPhraseRepository:
    @staticmethod
    def get_all():
        return WordPhrase.objects.all()

    @staticmethod
    def get_by_id(word_phrase_id):
        return WordPhrase.objects.filter(id=word_phrase_id).first()

    @staticmethod
    def create(validated_data):
        return WordPhrase.objects.create(**validated_data)

    @staticmethod
    def update(word_phrase, validated_data):
        for key, value in validated_data.items():
            setattr(word_phrase, key, value)
        word_phrase.save()
        return word_phrase

    @staticmethod
    def delete(word_phrase):
        word_phrase.delete()
