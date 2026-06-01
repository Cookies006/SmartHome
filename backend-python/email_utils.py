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
        sender = {"name": "SmartHome", "email": "amysene@esp.sn"} 
        to = [{"email": email_destinataire}]

        # Le design de l'e-mail en HTML/CSS en ligne
        html_template = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Votre code de vérification SmartHome</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f6f9fc; color: #333333;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 550px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e2e8f0;">
                
                <tr>
                    <td style="padding: 32px 20px; text-align: center; background-color: #0f172a;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: 1px;">
                            🏠 SmartHome
                        </h1>
                    </td>
                </tr>
                
                <tr>
                    <td style="padding: 40px 32px;">
                        <p style="font-size: 16px; line-height: 1.6; color: #1e293b; margin-top: 0;">Bonjour,</p>
                        <p style="font-size: 16px; line-height: 1.6; color: #334155;">
                            Pour sécuriser l'accès à votre compte SmartHome, veuillez utiliser le code de vérification temporaire ci-dessous :
                        </p>
                        
                        <div style="text-align: center; margin: 35px 0;">
                            <span style="display: inline-block; padding: 14px 32px; background-color: #f1f5f9; border: 2px dashed #3b82f6; border-radius: 8px; font-size: 32px; font-weight: 800; color: #2563eb; letter-spacing: 6px;">
                                {code}
                            </span>
                        </div>
                        
                        <p style="font-size: 14px; line-height: 1.5; color: #64748b; text-align: center; margin-bottom: 25px;">
                            ⏳ Ce code est confidentiel et reste valide pendant <strong>10 minutes</strong>.
                        </p>
                        
                        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                        
                        <p style="font-size: 13px; line-height: 1.5; color: #94a3b8; text-align: center; margin-bottom: 0;">
                            Si vous n'avez pas demandé ce code, vous pouvez ignorer cet e-mail en toute sécurité. Quelqu'un a peut-être simplement fait une erreur de saisie.
                        </p>
                    </td>
                </tr>
                
                <tr>
                    <td style="padding: 24px; text-align: center; background-color: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
                        &copy; 2026 SmartHome. Tous droits réservés.<br>
                        Ceci est un e-mail automatisé, merci de ne pas y répondre.
                    </td>
                </tr>
                
            </table>
        </body>
        </html>
        """

        # Version texte brut si l'application de l'utilisateur bloque le HTML
        text_template = f"Bonjour,\n\nVotre code de vérification SmartHome est : {code}\n\nIl est valable 10 minutes.\n\nL'équipe SmartHome"

        email = sib_api_v3_sdk.SendSmtpEmail(
            to=to,
            sender=sender,
            subject="🔑 Votre code de vérification SmartHome",
            html_content=html_template,
            text_content=text_template
        )

        response = api_instance.send_transac_email(email)
        print("Email envoyé :", response)
        return True

    except ApiException as e:
        print("Erreur API Brevo :", e)
        return False
