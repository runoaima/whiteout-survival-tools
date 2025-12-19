from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .firebase import verify_token
from .models import User

class FirebaseAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.headers.get('Authorization')
        if not token:
            return None

        uid = verify_token(token.replace('Bearer ', ''))
        user, _ = User.objects.get_or_create(firebase_uid=uid)
        return (user, None)
