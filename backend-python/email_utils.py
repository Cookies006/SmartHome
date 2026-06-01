import sib-api-v3-sdk
import os

resend.api_key = os.getenv('RESEND_API_KEY')

def envoyer_code_verification(email_destinataire, code):
    try:
        resend.Emails.send({
            "from": "SmartHome <onboarding@resend.dev>",
            "to": email_destinataire,
            "subject": "Votre code de vérification SmartHome",
            "text": f"""
Bonjour,

Votre code de vérification SmartHome est : {code}

Il est valable 10 minutes.

L'équipe SmartHome
            """
        })
        return True
    except Exception as e:
        print(f"⚠ Erreur d'envoi d'email: {e}")
        return False
