from django.urls import path
from .views import QuestionList,QuestionDetail,AnswerList, QuestionTypeList,QuestionTypeDetail

urlpatterns = [

    path('questions/', QuestionList.as_view(), name='question-list'),
    path('questions/<int:pk>/', QuestionDetail.as_view(), name='question-detail'),
    path('answers/', AnswerList.as_view(), name='answer-list'),
    path('question-types/', QuestionTypeList.as_view(), name='questiontype-list'),
    path('question-types/<int:pk>/', QuestionTypeDetail.as_view(), name='questiontype-detail')
]
