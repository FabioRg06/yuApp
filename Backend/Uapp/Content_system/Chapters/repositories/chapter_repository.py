from ..models import Chapter

class ChapterRepository:
    @staticmethod
    def get_all_chapters():
        return Chapter.objects.all()

    @staticmethod
    def get_chapter_by_id(pk):
        return Chapter.objects.filter(pk=pk).first()

    @staticmethod
    def create_chapter(data):
        return Chapter.objects.create(**data)

    @staticmethod
    def update_chapter(chapter, data):
        for attr, value in data.items():
            setattr(chapter, attr, value)
        chapter.save()
        return chapter

    @staticmethod
    def delete_chapter(chapter):
        chapter.delete()
