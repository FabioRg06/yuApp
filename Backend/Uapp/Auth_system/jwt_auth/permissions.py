from rest_framework.permissions import BasePermission
from Auth_system.Users.models import CustomUser # Importa el modelo de usuario

class RolePermission(BasePermission):
    required_role = None

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        try:
            user = CustomUser.objects.get(id=request.user.id)  
        except CustomUser.DoesNotExist:
            return False 
        return user.role.name == self.required_role  

class IsAdmin(RolePermission):
    required_role = "admin"

class IsTeacher(RolePermission):
    required_role = "teacher"

class IsStudent(RolePermission):
    required_role = "student"
