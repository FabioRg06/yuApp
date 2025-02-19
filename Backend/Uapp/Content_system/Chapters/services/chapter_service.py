from ..repositories.chapter_repository import ChapterRepository

class ChapterService:
    @staticmethod
    def list_chapters():
        return ChapterRepository.get_all_chapters()

    @staticmethod
    def retrieve_chapter(pk):
        return ChapterRepository.get_chapter_by_id(pk)

    @staticmethod
    def create_chapter(validated_data):
        return ChapterRepository.create_chapter(validated_data)

    @staticmethod
    def update_chapter(pk, validated_data):
        chapter = ChapterRepository.get_chapter_by_id(pk)
        if chapter:
            return ChapterRepository.update_chapter(chapter, validated_data)
        return None

    @staticmethod
    def delete_chapter(pk):
        chapter = ChapterRepository.get_chapter_by_id(pk)
        if chapter:
            ChapterRepository.delete_chapter(chapter)
            return True
        return False
