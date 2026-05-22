# SmartHome Backend - Python/Flask

Backend API pour l'application SmartHome - Gestion des listes de courses familiales.

## Architecture

```
backend-python/
├── app.py                 # Application factory Flask
├── config.py              # Configuration de l'app
├── models.py              # Modèles SQLAlchemy (User, Family, Shopping, etc.)
├── middleware.py          # Authentification JWT et utilitaires
├── validation.py          # Validations des données
├── activity_log.py        # Enregistrement des activités
├── requirements.txt       # Dépendances Python
├── .env                   # Variables d'environnement
├── controllers/
│   ├── auth_controller.py        # Contrôleur d'authentification
│   ├── family_controller.py      # Contrôleur des familles
│   └── shopping_controller.py    # Contrôleur des listes de courses
└── routes/
    ├── auth_routes.py            # Routes d'authentification
    ├── family_routes.py          # Routes des familles
    └── shopping_routes.py        # Routes des listes de courses
```

## Installation

### Prérequis
- Python 3.8+
- PostgreSQL
- pip

### Étapes

1. **Cloner le projet**
```bash
cd backend-python
```

2. **Créer un environnement virtuel**
```bash
python -m venv venv

# Activer l'environnement virtuel
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

3. **Installer les dépendances**
```bash
pip install -r requirements.txt
```

4. **Configurer les variables d'environnement**
Éditer le fichier `.env` avec vos paramètres PostgreSQL:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smarthome
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
```

5. **Démarrer l'application**
```bash
python app.py
```

L'API sera disponible à `http://localhost:5000`

## Endpoints API

### Authentification (`/api/auth`)
- `POST /register` - Enregistrement utilisateur
- `POST /login` - Connexion
- `GET /profile` - Profil utilisateur (protégé)
- `PUT /profile` - Mise à jour profil (protégé)

### Familles (`/api/families`)
- `POST /` - Créer une famille (protégé)
- `GET /<family_id>` - Obtenir les détails d'une famille (protégé)
- `POST /<family_id>/members` - Ajouter un membre (protégé)
- `PUT /members/<member_id>` - Mettre à jour un membre (protégé)
- `DELETE /members/<member_id>` - Supprimer un membre (protégé)
- `POST /join` - Rejoindre une famille (protégé)

### Listes de courses (`/api/shopping`)
- `POST /` - Créer une liste (protégé)
- `GET /list/<list_id>` - Obtenir une liste (protégé)
- `GET /family/<family_id>` - Obtenir les listes d'une famille (protégé)
- `PUT /list/<list_id>` - Mettre à jour une liste (protégé)
- `DELETE /list/<list_id>` - Supprimer une liste (protégé)
- `POST /item` - Ajouter un article (protégé)
- `PUT /item/<item_id>` - Mettre à jour un article (protégé)
- `DELETE /item/<item_id>` - Supprimer un article (protégé)

## Authentification

Utilisez le header `Authorization` avec le token JWT:
```
Authorization: Bearer <token>
```

## Variables d'environnement

- `PORT` - Port du serveur (défaut: 5000)
- `FLASK_ENV` - Environnement (development/production)
- `DB_HOST` - Hôte PostgreSQL
- `DB_PORT` - Port PostgreSQL
- `DB_NAME` - Nom de la base de données
- `DB_USER` - Utilisateur PostgreSQL
- `DB_PASSWORD` - Mot de passe PostgreSQL
- `JWT_SECRET_KEY` - Clé secrète JWT
- `JWT_EXPIRE_HOURS` - Durée d'expiration du token en heures
- `CORS_ORIGIN` - Origines CORS autorisées

## Technologie utilisée

- **Flask** - Framework web
- **Flask-SQLAlchemy** - ORM
- **Flask-JWT-Extended** - Authentification JWT
- **Flask-CORS** - Gestion CORS
- **psycopg2** - Driver PostgreSQL
- **bcrypt** - Hachage des mots de passe

## Développement

### Mode debug
L'application démarre en mode debug quand `FLASK_ENV=development`

### Créer la base de données
```python
from app import app, db
with app.app_context():
    db.create_all()
```

## Support

Pour les problèmes ou suggestions, veuillez ouvrir une issue.
