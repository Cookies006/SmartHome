from flask_mail import Message
from flask import current_app


def envoyer_code_verification(email_destinataire, code):
    """Envoyer le code de vérification par email"""
    from app import mail
    try:
        msg = Message(
            subject="Votre code de vérification SmartHome",
            sender=('SmartHome', current_app.config['MAIL_USERNAME']),
            recipients=[email_destinataire]
        )
        msg.body = f"""
Bonjour,

Votre code de vérification SmartHome est : {code}

Il est valable 10 minutes.

L'équipe SmartHome
        """
        mail.send(msg)
        return True
    except Exception as e:
        print(f"⚠ Erreur d'envoi d'email: {e}")
        return False
