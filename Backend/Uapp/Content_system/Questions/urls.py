from django.urls import path
from .views import QuestionList,QuestionDetail, QuestionTypeList,QuestionTypeDetail

urlpatterns = [

    path('', QuestionList.as_view(), name='question-list'),
    path('<int:pk>/', QuestionDetail.as_view(), name='question-detail'),
    path('question-types/', QuestionTypeList.as_view(), name='questiontype-list'),
    path('question-types/<int:pk>/', QuestionTypeDetail.as_view(), name='questiontype-detail')
]
