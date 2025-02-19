from Content_system.WordPhrases.repositories.word_phrase_repository import WordPhraseRepository

class WordPhraseService:
    @staticmethod
    def list_word_phrases():
        return WordPhraseRepository.get_all()

    @staticmethod
    def get_word_phrase(word_phrase_id):
        return WordPhraseRepository.get_by_id(word_phrase_id)

    @staticmethod
    def create_word_phrase(validated_data):
        return WordPhraseRepository.create(validated_data)

    @staticmethod
    def update_word_phrase(word_phrase_id, validated_data):
        word_phrase = WordPhraseRepository.get_by_id(word_phrase_id)
        if word_phrase:
            return WordPhraseRepository.update(word_phrase, validated_data)
        return None

    @staticmethod
    def delete_word_phrase(word_phrase_id):
        word_phrase = WordPhraseRepository.get_by_id(word_phrase_id)
        if word_phrase:
            WordPhraseRepository.delete(word_phrase)
            return True
        return False
