from django.urls import path
from .views import RegisterView, LoginView, CustomUserList,UserProgressList

urlpatterns = [
    path('showUsers/', CustomUserList.as_view(), name='show_users'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user-progress/',UserProgressList.as_view(),name='user-progress')
]
