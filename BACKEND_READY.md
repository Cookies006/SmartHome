# ✅ Backend SmartHome - Configuration Complétée

## 📊 Résumé des Actions Effectuées

### ✅ Configuration Python
- **Python 3.13** configuré et prêt
- **Environnement virtuel (venv)** créé automatiquement
- **Localisation du venv** : `c:\Users\HP\Documents\Projet\SmartHome\.venv`

### ✅ Corrections du Code

#### 1. Routes d'authentification (`routes/auth_routes.py`)
**Problème** : Import manquant de la fonction `verify_code`  
**Correction** : Ajout de l'import : `from controllers.auth_controller import ... verify_code`

#### 2. Contrôleur d'authentification (`controllers/auth_controller.py`)
**Problème** : Appel à une fonction inexistante `envoyer_code_invitation()` avec variables non définies  
**Correction** : 
- Changement en `envoyer_code_verification(email, code)` (fonction qui existe dans `app.py`)
- Gestion des erreurs d'envoi d'email en mode développement

#### 3. Configuration de la base de données (`config.py`)
**Avant** : Base de données PostgreSQL obligatoire (nécessite installation externe)  
**Après** : 
- **Développement** : SQLite (aucune installation requise) ✓
- **Production** : PostgreSQL (configurable via variables d'environnement)
- **Tests** : SQLite en mémoire

### 📦 Dépendances Configurées

```
✓ Flask 3.0.0 - Framework web
✓ Flask-SQLAlchemy 3.1.1 - ORM base de données
✓ Flask-CORS 4.0.0 - Gestion des CORS
✓ Flask-JWT-Extended 4.5.3 - Authentification JWT
✓ Flask-Mail 0.9.1 - Envoi d'emails
✓ python-dotenv 1.0.0 - Variables d'environnement
✓ bcrypt 4.1.1 - Hachage des mots de passe
✓ psycopg2-binary 2.9.9 - Connecteur PostgreSQL
✓ Werkzeug 3.0.1 - Serveur WSGI
```

### 📁 Structure du Backend

```
backend-python/
├── app.py                    # Factory Flask + configuration mail
├── config.py                 # ✓ CORRIGÉ - Support SQLite/PostgreSQL
├── models.py                 # Modèles SQLAlchemy (User, Family, etc.)
├── middleware.py             # Authentification JWT + utilitaires
├── validation.py             # Validations des données
├── activity_log.py           # Enregistrement des activités
├── run.py                    # Point d'entrée pour démarrer le serveur
├── test_setup.py             # Tests de configuration
├── requirements.txt          # ✓ Dépendances prêtes
├── .env                      # Configuration (variables d'environnement)
├── start-backend.bat         # ✓ NOUVEAU - Script de démarrage Windows
├── controllers/
│   ├── auth_controller.py    # ✓ CORRIGÉ - Gestion authentification
│   ├── family_controller.py  # Gestion des familles
│   └── shopping_controller.py # Gestion des listes de courses
└── routes/
    ├── auth_routes.py        # ✓ CORRIGÉ - Routes d'auth
    ├── family_routes.py      # Routes des familles
    └── shopping_routes.py    # Routes des listes de courses
```

## 🚀 Démarrage Rapide

### Option 1 : Utiliser le script batch (⭐ Recommandé - Windows)

Double-cliquez sur ce fichier (ou exécutez dans PowerShell) :
```
c:\Users\HP\Documents\Projet\SmartHome\backend-python\start-backend.bat
```

**Résultat attendu** :
```
✓ Tous les tests sont passés!
🚀 Démarrage du serveur Flask...

Le backend est accessible sur:
http://localhost:5000

API Health: http://localhost:5000/api/health
```

### Option 2 : Démarrage manuel avec PowerShell

```powershell
# 1. Ouvrir PowerShell et aller au répertoire
cd "c:\Users\HP\Documents\Projet\SmartHome\backend-python"

# 2. Installer les dépendances (première fois uniquement)
pip install -r requirements.txt

# 3. Tester la configuration
python test_setup.py

# 4. Démarrer le serveur
python run.py
```

### Option 3 : Avec Flask directement

```powershell
cd "c:\Users\HP\Documents\Projet\SmartHome\backend-python"
pip install -r requirements.txt
flask run
```

## ✅ Vérification du Backend

### Test de santé du serveur

**Depuis PowerShell** :
```powershell
curl http://localhost:5000/api/health
```

**Réponse attendue** :
```json
{
  "status": "ok",
  "message": "SmartHome Backend API"
}
```

### Test d'inscription

```powershell
$url = "http://localhost:5000/api/auth/register"
$body = @{
    username = "testuser"
    email = "test@example.com"
    password = "SecurePassword123!"
} | ConvertTo-Json

curl -X POST $url `
  -H "Content-Type: application/json" `
  -Body $body
```

### Test de connexion

```powershell
$url = "http://localhost:5000/api/auth/login"
$body = @{
    username = "testuser"
    password = "SecurePassword123!"
} | ConvertTo-Json

curl -X POST $url `
  -H "Content-Type: application/json" `
  -Body $body
```

## 📚 Routes API Disponibles

### Authentification
```
POST   /api/auth/register          - Créer un compte
POST   /api/auth/verify-code       - Vérifier le code d'inscription
POST   /api/auth/login             - Se connecter
GET    /api/auth/profile           - Obtenir le profil (JWT requis)
PUT    /api/auth/profile           - Modifier le profil (JWT requis)
```

### Familles
```
GET    /api/families               - Lister les familles
POST   /api/families               - Créer une famille
GET    /api/families/:id           - Détails d'une famille
PUT    /api/families/:id           - Modifier une famille
DELETE /api/families/:id           - Supprimer une famille
POST   /api/families/:id/members   - Ajouter un membre
DELETE /api/families/:id/members/:memberId - Retirer un membre
```

### Listes de courses
```
GET    /api/shopping               - Lister les listes
POST   /api/shopping               - Créer une liste
GET    /api/shopping/:id           - Détails d'une liste
PUT    /api/shopping/:id           - Modifier une liste
DELETE /api/shopping/:id           - Supprimer une liste
POST   /api/shopping/:id/items     - Ajouter un article
PUT    /api/shopping/:id/items/:itemId - Modifier un article
DELETE /api/shopping/:id/items/:itemId - Supprimer un article
```

## ⚙️ Configuration Avancée

### Variables d'Environnement (.env)

```env
# Serveur
PORT=5000                                    # Port du serveur
FLASK_ENV=development                        # Mode: development|production
FLASK_APP=app.py                            # Application Flask

# Base de données SQLite (Développement)
# Aucune configuration supplémentaire requise!

# Base de données PostgreSQL (Production)
DB_HOST=localhost                           # Hôte PostgreSQL
DB_PORT=5432                                # Port PostgreSQL
DB_NAME=smarthome                           # Nom de la base
DB_USER=postgres                            # Utilisateur
DB_PASSWORD=coco6422                        # Mot de passe

# JWT
JWT_SECRET_KEY=cocoikrambiscremcookiestacoscordonbleu006burgerpoulettiramissuoreochoco
JWT_EXPIRE_HOURS=168                        # Expiration du token (7 jours)

# CORS
CORS_ORIGIN=http://localhost:8081,http://192.168.1.20:3000

# Email (Gmail)
MAIL_USERNAME=aissataba395@gmail.com
MAIL_PASSWORD=gjjzuceodekqyif
```

### Utiliser PostgreSQL pour la Production

**Installation de PostgreSQL** :
```powershell
# Via Chocolatey (si installé)
choco install postgresql

# Ou télécharger depuis https://www.postgresql.org/download/windows/
```

**Créer la base de données** :
```sql
CREATE DATABASE smarthome;
CREATE USER postgres WITH PASSWORD 'coco6422';
ALTER ROLE postgres SUPERUSER;
```

**Démarrer avec PostgreSQL** :
```powershell
$env:FLASK_ENV="production"
python run.py
```

## 🔍 Dépannage

### ❌ Erreur : "Port 5000 already in use"

**Solution** : Changer le port dans `.env`
```env
PORT=5001
```

### ❌ Erreur : "ModuleNotFoundError: No module named 'flask'"

**Solution** : Réinstaller les dépendances
```powershell
pip install -r requirements.txt --upgrade --force-reinstall
```

### ❌ Erreur : "RuntimeError: Working outside of application context"

**Solution** : C'est normal pendant les tests, les corrections ont été appliquées

### ❌ Erreur : "Email could not be sent"

**Solution** : C'est attendu en développement. Les emails peuvent être désactivés en commentant les lignes Mail dans `app.py`

### ❌ Erreur : "SQLAlchemy: connection refused"

**Solution 1** : Utiliser SQLite (par défaut en développement)  
**Solution 2** : Vérifier que PostgreSQL est running et accessible

## 📋 Checklist de Déploiement

- [x] Python 3.13 configuré
- [x] Environnement virtuel créé
- [x] Dépendances configurées
- [x] Code backend corrigé
- [x] Routes d'authentification opérationnelles
- [x] Base de données configurée (SQLite par défaut)
- [x] Tests automatisés prêts
- [x] API Health check fonctionnel
- [ ] Frontend connecté au backend
- [ ] Tests d'intégration complètement validés
- [ ] Déploiement en production

## 📖 Documentation Supplémentaire

- [BACKEND_STARTUP_WINDOWS.md](BACKEND_STARTUP_WINDOWS.md) - Guide détaillé pour Windows
- [FLASK_STARTUP_GUIDE.md](backend-python/FLASK_STARTUP_GUIDE.md) - Guide Flask original
- [API_DOCUMENTATION.md](smarthome/API_DOCUMENTATION.md) - Documentation API complète
- [README.md](backend-python/README.md) - Informations sur l'architecture

## 🎯 Prochaines Étapes

1. ✅ **Backend fonctionnel** - Prêt à être utilisé!
2. 🔄 **Connexion du frontend** - Configurer les appels API côté React Native
3. 🧪 **Tests d'intégration** - Valider le flux complet
4. 🚀 **Déploiement** - Mettre en production

## 💡 Notes Importantes

- **Base de données SQLite** : Automatiquement créée au premier démarrage (`smarthome.db`)
- **Tokens JWT** : Valables 7 jours par défaut (configurable via `JWT_EXPIRE_HOURS`)
- **CORS** : Autorise le frontend sur `localhost:8081` et `192.168.1.20:3000`
- **Emails** : Configurés mais optionnels pour le développement

---

**Status** : ✅ **BACKEND PRÊT À DÉMARRER**

**Prochaine action** : Cliquez sur [start-backend.bat](backend-python/start-backend.bat) ou exécutez la commande PowerShell pour démarrer le serveur!
