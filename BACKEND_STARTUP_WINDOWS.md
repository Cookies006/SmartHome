# 🚀 Guide de Démarrage - Backend SmartHome (Windows)

## 📋 Prérequis Vérifiés

✅ Python 3.13 configuré  
✅ Environnement virtuel (venv) créé  
✅ Configuration .env prête  
✅ Code backend vérifié et corrigé  

## 🔧 Installation et Démarrage

### Étape 1 : Installation des dépendances

Ouvrez **PowerShell** et exécutez :

```powershell
cd "c:\Users\HP\Documents\Projet\SmartHome\backend-python"
pip install -r requirements.txt
```

### Étape 2 : Tester la configuration

```powershell
python test_setup.py
```

Vous devriez voir :
```
✓ TOUS LES TESTS SONT PASSÉS!
```

### Étape 3 : Démarrer le backend

```powershell
python run.py
```

Ou directement avec Flask :
```powershell
flask run
```

Résultat attendu :
```
✓ Database initialized
🚀 Starting SmartHome Backend on http://localhost:5000
📚 API Documentation: http://localhost:5000/api/health
```

## 📡 Tester l'API

### 1. Vérifier la santé du serveur

```bash
curl http://localhost:5000/api/health
```

Réponse attendue :
```json
{
  "status": "ok",
  "message": "SmartHome Backend API"
}
```

### 2. S'inscrire

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePassword123!"
  }'
```

### 3. Se connecter

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "SecurePassword123!"
  }'
```

## ⚙️ Configuration

### Variables d'environnement (.env)

```env
# Serveur
PORT=5000
FLASK_ENV=development
FLASK_APP=app.py

# Base de données PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smarthome
DB_USER=postgres
DB_PASSWORD=coco6422

# JWT Token
JWT_SECRET_KEY=cocoikrambiscremcookiestacoscordonbleu006burgerpoulettiramissuoreochoco
JWT_EXPIRE_HOURS=168

# CORS (Origine du frontend)
CORS_ORIGIN=http://localhost:8081,http://192.168.1.20:3000

# Email (Gmail)
MAIL_USERNAME=aissataba395@gmail.com
MAIL_PASSWORD=gjjzuceodekqyif
```

## 🗄️ Configuration de la Base de Données

### Option 1 : SQLite (Développement - Aucune installation requise)

Modifiez `.env` pour utiliser SQLite :

```env
# Commentez les paramètres PostgreSQL ci-dessus et ajoutez :
SQLALCHEMY_DATABASE_URI=sqlite:///smarthome.db
```

Modifiez `config.py` :

```python
# Dans config.py, changez la ligne 10 de :
SQLALCHEMY_DATABASE_URI = (
    f"postgresql://..."
)

# En :
SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///smarthome.db')
```

### Option 2 : PostgreSQL (Production)

Assurez-vous que PostgreSQL est installé et en cours d'exécution :

```bash
# Windows : Vérifier le service PostgreSQL
Get-Service postgres

# Créer la base de données (si nécessaire)
psql -U postgres -c "CREATE DATABASE smarthome;"
```

## 🔍 Dépannage

### Problème : ModuleNotFoundError

**Solution** : Assurez-vous que pip install s'est bien exécuté :
```bash
pip install -r requirements.txt --upgrade
```

### Problème : Connexion à PostgreSQL échouée

**Solution 1** : Utiliser SQLite pour le développement (voir ci-dessus)

**Solution 2** : Vérifier la connexion PostgreSQL :
```bash
psql -h localhost -U postgres -d smarthome
```

### Problème : Port 5000 déjà utilisé

**Solution** : Changer le port dans `.env` :
```env
PORT=5001
```

### Problème : Erreur d'email

**Solution** : Désactiver les emails pour le développement en commentant les lignes Mail dans `app.py`

## 📚 Structure des Routes API

```
GET  /api/health                    - Vérifier la santé du serveur
POST /api/auth/register             - Créer un compte
POST /api/auth/verify-code          - Vérifier le code
POST /api/auth/login                - Se connecter
GET  /api/auth/profile              - Obtenir le profil
PUT  /api/auth/profile              - Mettre à jour le profil

GET  /api/families                  - Lister les familles
POST /api/families                  - Créer une famille
GET  /api/families/:id              - Détails d'une famille
PUT  /api/families/:id              - Modifier une famille
DELETE /api/families/:id            - Supprimer une famille
POST /api/families/:id/members      - Ajouter un membre
DELETE /api/families/:id/members/:memberId - Supprimer un membre

GET  /api/shopping                  - Lister les listes de courses
POST /api/shopping                  - Créer une liste
GET  /api/shopping/:id              - Détails d'une liste
PUT  /api/shopping/:id              - Modifier une liste
DELETE /api/shopping/:id            - Supprimer une liste
POST /api/shopping/:id/items        - Ajouter un article
PUT  /api/shopping/:id/items/:itemId - Modifier un article
DELETE /api/shopping/:id/items/:itemId - Supprimer un article
```

## ✅ Checklist de Démarrage

- [ ] Ouvrir PowerShell
- [ ] Exécuter : `cd "c:\Users\HP\Documents\Projet\SmartHome\backend-python"`
- [ ] Exécuter : `pip install -r requirements.txt`
- [ ] Exécuter : `python test_setup.py`
- [ ] Vérifier que tous les tests passent
- [ ] Exécuter : `python run.py`
- [ ] Tester : `curl http://localhost:5000/api/health`

## 🎯 Prochaines Étapes

1. ✅ Backend fonctionnel sur http://localhost:5000
2. ⏳ Connecter le frontend React Native au backend
3. ⏳ Tester l'intégration complète

---

**Questions ?** Consultez [FLASK_STARTUP_GUIDE.md](FLASK_STARTUP_GUIDE.md)
