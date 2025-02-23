from ..models import Question, QuestionOption, QuestionType

class QuestionTypeRepository:
    """Maneja operaciones de base de datos para los tipos de preguntas."""
    @staticmethod
    def get_all():
        return QuestionType.objects.all()
    
    @staticmethod
    def get_by_id(type_id):
        return QuestionType.objects.get(id=type_id)
    
    @staticmethod
    def create(data):
        return QuestionType.objects.create(**data)
    
    @staticmethod
    def delete(question_type):
        question_type.delete()

class QuestionRepository:
    """Maneja operaciones de base de datos para las preguntas."""
    @staticmethod
    def get_all():
        return Question.objects.all()
    
    @staticmethod
    def get_by_id(question_id):
        return Question.objects.get(id=question_id)
    
    @staticmethod
    def create(data):
        print(data)
        #return Question.objects.create(**data)
    
    @staticmethod
    def delete(question):
        question.delete()

class QuestionOptionRepository:
    """Maneja operaciones de base de datos para las opciones de preguntas."""
    @staticmethod
    def get_all():
        return QuestionOption.objects.all()
    
    @staticmethod
    def get_by_id(option_id):
        return QuestionOption.objects.get(id=option_id)
    
    @staticmethod
    def create(data):
        print(data)
        #return QuestionOption.objects.create(**data )
    
    @staticmethod
    def delete(option):
        option.delete()
