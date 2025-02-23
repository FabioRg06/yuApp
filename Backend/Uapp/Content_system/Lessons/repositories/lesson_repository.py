from Content_system.Lessons.models import Lesson

class LessonRepository:
    """Maneja la interacción con la base de datos para las lecciones."""

    @staticmethod
    def get_all_lessons():
        return Lesson.objects.all()

    @staticmethod
    def get_lesson_by_id(lesson_id):
        return Lesson.objects.filter(id=lesson_id).first()

    @staticmethod
    def create_lesson(data):
        lesson = Lesson.objects.create(**data)
        return lesson 

    @staticmethod
    def update_lesson(lesson, data):
        for key, value in data.items():
            setattr(lesson, key, value)
        lesson.save()
        return lesson

    @staticmethod
    def delete_lesson(lesson):
        lesson.delete()
