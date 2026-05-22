# 🔧 GUIDE DE DÉMARRAGE ET TROUBLESHOOTING - SmartHome

## ⚡ Démarrage Rapide

### 1️⃣ Vérifier les prérequis
```bash
# Vérifier Python
python --version   # Doit être 3.8+
pip --version      # Doit être installé

# Vérifier PostgreSQL
psql --version     # PostgreSQL 12+
```

### 2️⃣ Installation de la base de données
```bash
# Accéder à PostgreSQL
psql -U postgres

# Dans le terminal psql:
CREATE DATABASE smarthome;
\c smarthome

# Quitter psql
\q
```

### 3️⃣ Charger le schéma de la base de données
```bash
# Depuis le dossier backend-python
psql -U postgres -d smarthome -f database.sql
"C:\Program Files\PostgreSQL\16\bin\psql.exe"

# Vérifier que les tables ont été créées
psql -U postgres -d smarthome -c "\dt"
```

### 4️⃣ Configurer les variables d'environnement
Vérifier que le fichier `backend-python/.env` existe avec la bonne configuration:

```env
# Serveur
PORT=5000
FLASK_ENV=development
FLASK_APP=app.py

# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smarthome_db
DB_USER=nom_user
DB_PASSWORD=mdp

# JWT
JWT_SECRET_KEY=..........
JWT_EXPIRE_HOURS=168

# CORS
CORS_ORIGIN=http://localhost:8081,http://localhost:3000
```

### 5️⃣ Installer les dépendances Python
```bash
cd backend-python
pip install -r requirements.txt
```

### 6️⃣ Démarrer le serveur backend (Flask)
```bash
# Mode développement avec auto-reload
python run.py

# Ou directement avec Flask
flask run
```

**✅ Sortie attendue:**
```
✓ Database initialized
🚀 Starting SmartHome Backend on http://localhost:5000
📚 API Documentation: http://localhost:5000/api/health
 * Running on http://0.0.0.0:5000
```

### 7️⃣ Démarrer le frontend (dans un autre terminal)
```bash
# Depuis le dossier smarthome
npm start          # Lance Expo sur http://localhost:8081 (web)
# ou
npm run web        # Alternative directe pour le web
```

---

## 🚨 PROBLÈMES COURANTS ET SOLUTIONS

### ❌ Erreur 500 - "Internal Server Error"

**Cause 1: Variables d'environnement manquantes**
```
Solution:
1. Vérifier que le fichier backend-python/.env existe
2. Vérifier que JWT_SECRET_KEY est défini
3. Relancer le serveur après modification du .env
```

**Cause 2: Impossible de se connecter à PostgreSQL**
```
Solution:
1. Vérifier que PostgreSQL est démarré:
   - Windows: Vérifier Services (services.msc → PostgreSQL)
   - Mac/Linux: brew services start postgresql
   
2. Vérifier les credentials du .env:
   - DB_HOST: localhost (ou votre serveur)
   - DB_PORT: 5432
   - DB_USER: postgres
   - DB_PASSWORD: votre password
   
3. Test de connexion:
   psql -U postgres -d smarthome -c "SELECT version();"
```

**Cause 3: Tables de base de données manquantes**
```
Solution:
1. Vérifier que les tables existent:
   psql -U postgres -d smarthome -c "\dt"
   
2. Si vide, recharger le schéma:
   psql -U postgres -d smarthome -f database.sql
```

### ❌ Erreur "ModuleNotFoundError: No module named 'flask'"

```
Solution:
1. Vérifier que pip a installé les dépendances:
   cd backend-python
   pip install -r requirements.txt
   
2. Vérifier que vous êtes dans le bon environnement Python:
   python --version  # Doit être 3.8+
```

### ❌ Erreur MIME Type: "Refused to execute script...application/json is not executable"

**Cause: Le bundle JavaScript n'est pas servi correctement (Frontend)**

```
Solutions:
1. Vérifier que Expo démarre correctement:
   npm start
   
2. Attendre que le bundle compile complètement (peut prendre 30-60 secondes)
   
3. Nettoyer le cache d'Expo:
   npx expo start --clear
   
4. Vérifier les erreurs dans le code:
   - Chercher les "red screens" dans l'app
   - Vérifier la console du terminal
   
5. Redémarrer le serveur:
   - Arrêter Ctrl+C
   - Relancer: npm start
```

### ❌ Port 5000 déjà utilisé (Backend Flask)

```
Solution 1: Utiliser un autre port
- Modifier dans backend-python/.env: PORT=5001
- Redémarrer le serveur

Solution 2: Libérer le port 5000
- Windows:
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F

- Mac/Linux:
  lsof -i :5000
  kill -9 <PID>
```

### ❌ Port 8081 déjà utilisé (Expo Frontend)

```
Solution 1: Utiliser un autre port
npm start -- --port 8082

Solution 2: Libérer le port 8081 (cf. ci-dessus)
```

### ❌ Erreur "ConnectionRefused" au login/register

```
Cause: Le backend Flask n'est pas accessible

Solutions:
1. Vérifier que le backend Flask est démarré:
   cd backend-python
   python run.py
   
2. Vérifier que PostgreSQL est running
3. Vérifier les logs du serveur Flask: python run.py
4. Tester la connexion:
   psql -U postgres -d smarthome -c "SELECT COUNT(*) FROM users;"
```

### ❌ Token expiré ou invalide

```
Cause: JWT_SECRET_KEY ne correspond pas ou token expiré

Solutions:
1. Vérifier JWT_SECRET_KEY dans backend-python/.env
2. Vérifier que JWT_EXPIRE_HOURS est défini (par défaut 168h = 7 jours)
3. Se reconnecter pour obtenir un nouveau token
```

### ❌ Erreur "Username already exists"

```
Solutions:
1. Utiliser un username différent
2. Ou vider la table users:
   psql -U postgres -d smarthome -c "DELETE FROM users;"
```

---

## 📊 VÉRIFIER QUE LE SERVEUR FONCTIONNE

### Test 1: Health Check
```bash
curl http://localhost:5000/api/health
```

**Réponse attendue:**
```json
{
  "status": "ok",
  "message": "SmartHome Backend API"
}
```

### Test 2: Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "display_name": "Test User"
  }'
```

### Test 3: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

**Réponse attendue:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "display_name": "Test User",
    "active_family_id": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Test 4: Profile avec Token
```bash
# Remplacer TOKEN par le token reçu
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 📱 ACCÉDER À L'APP LOCALE

### Web Browser
1. Ouvrir terminal dans le dossier du projet
2. `npm start`
3. Attendre le message "Local: http://localhost:19006"
4. Accéder à `http://localhost:19006` dans le navigateur

### Émulateur Android
```bash
npm run android
```

### Simulateur iOS
```bash
npm run ios
```

---

## 📝 LOGS UTILES

### Voir les erreurs du backend Flask
```bash
cd backend-python
python run.py
# Les logs s'affichent en temps réel dans le terminal
```

### Voir les erreurs du frontend
```bash
npm start
# Les erreurs d'Expo s'affichent dans le terminal
```

### Vérifier l'état du serveur
```bash
# Voir si le port 5000 écoute
netstat -ano | findstr :5000

# Voir si la base de données répond
psql -U postgres -d smarthome -c "SELECT 1;"
```

---

## 🔐 SÉCURITÉ EN PRODUCTION

**⚠️ AVANT DE DÉPLOYER:**

1. **Changer le JWT_SECRET_KEY**
   ```bash
   # Générer une nouvelle clé en Python:
   python -c "import secrets; print(secrets.token_hex(32))"
   ```
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres
2. **Changer FLASK_ENV**
   ```env
   FLASK_ENV=production
   ```

3. **Utiliser des bases de données managées**
   ```
   Utiliser un service cloud au lieu de localhost:
   - Amazon RDS
   - Azure Database
   - Google Cloud SQL
   - Heroku Postgres
   ```

4. **Configurer CORS correctement**
   ```env
   CORS_ORIGIN=https://yourdomain.com
   ```

5. **Utiliser HTTPS**
   ```
   Configurer un certificat SSL/TLS
   Utiliser un reverse proxy (nginx, Cloudflare)
   ```

---

## 🚀 DÉPLOIEMENT RAPIDE

### Heroku (Backend Flask)
```bash
# Installation du CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Créer l'app
heroku create smarthome-backend

# Configurer les variables d'environnement
heroku config:set -a smarthome-backend JWT_SECRET_KEY=votre_secret
heroku config:set -a smarthome-backend FLASK_ENV=production

# Déployer
git push heroku main
```

### Docker (Optionnel)
```bash
# Build l'image
docker build -t smarthome-backend -f backend-python/Dockerfile .

# Lancer le container
docker run -p 5000:5000 \
  -e DB_HOST=host.docker.internal \
  -e DB_USER=postgres \
  -e DB_PASSWORD=password \
  -e JWT_SECRET_KEY=secret \
  smarthome-backend
```

---

## 💡 TIPS & TRICKS

### 1. Réinitialiser la base de données
```bash
# Supprimer toutes les données (ATTENTION!)
psql -U postgres -d smarthome -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Recharger le schéma
psql -U postgres -d smarthome -f database.sql
```

### 2. Vider une table spécifique
```bash
psql -U postgres -d smarthome -c "DELETE FROM users;"
psql -U postgres -d smarthome -c "DELETE FROM families;"
```

### 3. Voir tous les utilisateurs
```bash
psql -U postgres -d smarthome -c "SELECT * FROM users;"
```

### 4. Démarrage automatique de PostgreSQL
**Windows:**
```
Services → PostgreSQL → Right-click → Properties → Startup type: Automatic
```

**Mac:**
```bash
brew services start postgresql
```

**Linux:**
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 5. Faire un backup de la base de données
```bash
# Créer un backup
pg_dump -U postgres smarthome > backup_smarthome.sql

# Restaurer depuis un backup
psql -U postgres smarthome < backup_smarthome.sql
```

### 6. Démarrer Backend + Frontend en une commande (Windows)
```bash
# Ouvrir 2 terminaux côte à côte:
# Terminal 1:
cd backend-python && python run.py

# Terminal 2:
npm start
```

---

## 📞 SUPPORT

**Logs à partager en cas de problème:**

```bash
# Copier la sortie complète du serveur Flask
cd backend-python
python run.py > backend_logs.txt 2>&1

# Vérifier la version Python
python --version

# Vérifier la version PostgreSQL
psql --version

# Exporter les variables d'environnement (sans le password!)
echo $env:DB_HOST
echo $env:DB_USER
echo $env:DB_PORT
```

---

**Dernière mise à jour:** Mai 2026
**Version:** 2.0.0 (Python/Flask backend)
**Architecture:** React Native Frontend + Python Flask Backend + PostgreSQL
