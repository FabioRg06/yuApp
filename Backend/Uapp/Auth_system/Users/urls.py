from django.urls import path
from .views import RegisterView, LoginView,UserProgressList,RoleList,RoleDetailView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user-progress/',UserProgressList.as_view(),name='user-progress'),
    path('role/',RoleList.as_view(),name='role'),
    path('role/<int:pk>',RoleDetailView.as_view(),name='role-detail')
]
