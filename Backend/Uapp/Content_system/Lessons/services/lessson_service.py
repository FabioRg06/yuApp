from ..repositories.lesson_repository import LessonRepository

class LessonService:
    """Maneja la lógica de negocio para las lecciones."""

    @staticmethod
    def get_lessons():
        return LessonRepository.get_all_lessons()

    @staticmethod
    def get_lesson_by_id(lesson_id):
        return LessonRepository.get_lesson_by_id(lesson_id)

    @staticmethod
    def create_lesson(data):
        return LessonRepository.create_lesson(data)

    @staticmethod
    def update_lesson(lesson_id, data):
        lesson = LessonRepository.get_lesson_by_id(lesson_id)
        if lesson:
            return LessonRepository.update_lesson(lesson, data)
        return None

    @staticmethod
    def delete_lesson(lesson_id):
        lesson = LessonRepository.get_lesson_by_id(lesson_id)
        if lesson:
            LessonRepository.delete_lesson(lesson)
