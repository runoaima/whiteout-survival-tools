import firebase_admin
from firebase_admin import credentials, auth

cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred)

def verify_token(id_token):
    decoded = auth.verify_id_token(id_token)
    return decoded['uid']
