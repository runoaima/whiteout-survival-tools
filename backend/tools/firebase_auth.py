import firebase_admin
from firebase_admin import auth, credentials

if not firebase_admin._apps:
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred)

def verify_firebase_token(id_token: str) -> str:
    decoded = auth.verify_id_token(id_token)
    return decoded["uid"]
