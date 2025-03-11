from django.utils.deprecation import MiddlewareMixin

class CookieToHeaderMiddleware(MiddlewareMixin):
    """Extrae el token de la cookie y lo coloca en el header Authorization"""
    
    

    def process_request(self, request):
        excluded_paths = [
            '/api/token/refresh/',
            '/api/token/validate-token/',
            '/api/user/login/',
            '/api/user/register/',
        ]
        if request.path in excluded_paths:
            return
        token = request.COOKIES.get("access_token")
        if token:
            request.META["HTTP_AUTHORIZATION"] = f"Bearer {token}"
