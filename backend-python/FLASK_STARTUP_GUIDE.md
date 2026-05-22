# 🚀 SmartHome Backend - Python/Flask - Guide de Démarrage

## 📋 Prérequis

- Python 3.8 ou plus récent
- PostgreSQL 12+ (ou utiliser SQLite pour le développement)
- pip (gestionnaire de paquets Python)

## 🔧 Installation

### 1. Installer les dépendances

```bash
cd backend-python
pip install -r requirements.txt
```

### 2. Configurer les variables d'environnement

Le fichier `.env` est déjà configuré avec les valeurs par défaut :

```
PORT=5000
FLASK_ENV=development
FLASK_APP=app.py
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smarthome
DB_USER=postgres
DB_PASSWORD=coco6422
JWT_SECRET_KEY=cocoikrambiscremcookiestacoscordonbleu006burgerpoulettiramissu
CORS_ORIGIN=http://localhost:8081,http://localhost:3000
```

### 3. Configurer PostgreSQL (Optionnel - pour production)

```sql
CREATE DATABASE smarthome;
CREATE USER postgres WITH PASSWORD 'coco6422';
ALTER ROLE postgres SUPERUSER;
```

## ▶️ Démarrage du serveur

### Méthode 1 : Utiliser le script run.py

```bash
python run.py
```

### Méthode 2 : Utiliser Flask directement

```bash
flask run
```

### Résultat attendu

```
✓ Database initialized
🚀 Starting SmartHome Backend on http://localhost:5000
📚 API Documentation: http://localhost:5000/api/health
```

## 📡 Test de l'API

### Vérifier la santé du serveur

```bash
curl http://localhost:5000/api/health
```

### S'inscrire

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPassword123!",
    "display_name": "Test User"
  }'
```

### Se connecter

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPassword123!"
  }'
```

## 📁 Structure du projet

```
backend-python/
├── app.py                      # Application Factory Flask
├── run.py                      # Point d'entrée (nouveau)
├── config.py                   # Configuration
├── models.py                   # Modèles de base de données
├── middleware.py               # Authentification & middleware
├── validation.py               # Validations des données
├── activity_log.py             # Enregistrement des activités
├── requirements.txt            # Dépendances
├── .env                        # Variables d'environnement
├── controllers/                # Contrôleurs métier
│   ├── auth_controller.py
│   ├── family_controller.py
│   └── shopping_controller.py
└── routes/                     # Routes API
    ├── auth_routes.py
    ├── family_routes.py
    └── shopping_routes.py
```

## 🗂️ Endpoints disponibles

### Authentification (`/api/auth`)
- `POST /register` - Créer un compte
- `POST /login` - Se connecter
- `GET /profile` - Voir le profil (authentifié)
- `PUT /profile` - Mettre à jour le profil (authentifié)

### Familles (`/api/families`)
- `POST /` - Créer une famille
- `GET /` - Lister les familles de l'utilisateur
- `GET /<id>` - Voir une famille
- `PUT /<id>` - Modifier une famille
- `DELETE /<id>` - Supprimer une famille
- `POST /<id>/invite` - Inviter un membre

### Listes de courses (`/api/shopping`)
- `GET /lists` - Lister les listes de courses
- `POST /lists` - Créer une liste
- `POST /items` - Ajouter un article
- `PUT /items/<id>` - Modifier un article
- `DELETE /items/<id>` - Supprimer un article

## 🧪 Test complet

Utilisez le script de test inclus :

```bash
python test_setup.py
```

## 🐛 Dépannage

### "ModuleNotFoundError: No module named 'flask'"
```bash
pip install -r requirements.txt
```

### "Erreur de connexion PostgreSQL"
Vérifiez que PostgreSQL est en cours d'exécution et que `.env` a les bonnes identifiants.

### "Port 5000 déjà utilisé"
```bash
# Changer le port dans .env
PORT=5001
```

## 📝 Variables d'environnement importantes

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `PORT` | Port du serveur | 5000 |
| `FLASK_ENV` | Environnement | development |
| `DB_HOST` | Hôte PostgreSQL | localhost |
| `JWT_SECRET_KEY` | Clé JWT | * (changer en production) |
| `CORS_ORIGIN` | Origines CORS | localhost:8081,localhost:3000 |

## ✅ Prochaines étapes

1. ✓ Backend Python/Flask configuré
2. ✓ Base de données modélisée
3. ✓ Authentification JWT en place
4. ⏳ Connecter le frontend React Native
5. ⏳ Tests d'intégration

---

**Note**: Remplacez `JWT_SECRET_KEY` par une clé aléatoire longue en production.
