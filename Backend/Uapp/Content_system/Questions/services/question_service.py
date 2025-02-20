from ..repositories.question_repository import QuestionRepository, QuestionOptionRepository, QuestionTypeRepository

class QuestionTypeService:
    """Maneja la lógica de negocio para los tipos de preguntas."""
    @staticmethod
    def create_question_type(**kwargs):
        return QuestionTypeRepository.create(**kwargs)
    
    @staticmethod
    def get_question_types():
        return QuestionTypeRepository.get_all()
    
    @staticmethod
    def get_question_type_by_id(type_id):
        return QuestionTypeRepository.get_by_id(type_id)
    
    @staticmethod
    def delete_question_type(type_id):
        question_type = QuestionTypeRepository.get_by_id(type_id)
        QuestionTypeRepository.delete(question_type)

class QuestionService:
    """Maneja la lógica de negocio de las preguntas."""
    @staticmethod
    def create_question(**kwargs):
        return QuestionRepository.create(**kwargs)
    
    @staticmethod
    def get_questions():
        return QuestionRepository.get_all()
    
    @staticmethod
    def get_question_by_id(question_id):
        return QuestionRepository.get_by_id(question_id)
    
    @staticmethod
    def delete_question(question_id):
        question = QuestionRepository.get_by_id(question_id)
        QuestionRepository.delete(question)

class QuestionOptionService:
    """Maneja la lógica de negocio de las opciones de pregunta."""
    @staticmethod
    def create_option(**kwargs):
        return QuestionOptionRepository.create(**kwargs)
    
    @staticmethod
    def get_options():
        return QuestionOptionRepository.get_all()
    
    @staticmethod
    def get_option_by_id(option_id):
        return QuestionOptionRepository.get_by_id(option_id)
    
    @staticmethod
    def delete_option(option_id):
        option = QuestionOptionRepository.get_by_id(option_id)
        QuestionOptionRepository.delete(option)
