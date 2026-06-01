import os
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException

configuration = sib_api_v3_sdk.Configuration()
configuration.api_key['api-key'] = os.getenv("BREVO_API_KEY")

api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
    sib_api_v3_sdk.ApiClient(configuration)
)

def envoyer_code_verification(email_destinataire, code):
    try:
        sender = {"name": "SmartHome", "email": "tonemail@gmail.com"}

        to = [{"email": email_destinataire}]

        email = sib_api_v3_sdk.SendSmtpEmail(
            to=to,
            sender=sender,
            subject="Votre code de vérification SmartHome",
            text_content=f"""
Bonjour,

Votre code de vérification SmartHome est : {code}

Il est valable 10 minutes.

L'équipe SmartHome
"""
        )

        response = api_instance.send_transac_email(email)
        print("Email envoyé :", response)
        return True

    except ApiException as e:
        print("Erreur API Brevo :", e)
        return False
