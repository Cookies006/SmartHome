# 📚 DOCUMENTATION COMPLÈTE DU BACKEND SMARTHOME

## 🎯 Vue d'ensemble

SmartHome est une application de gestion familiale permettant de gérer des familles, des listes de courses collaboratives et l'historique des activités. Le backend est construit avec:
- **Node.js/Express**: Framework web
- **PostgreSQL**: Base de données
- **JWT**: Authentification par tokens
- **Bcrypt**: Hachage des mots de passe
- **Joi**: Validation des données

---

## 📁 Structure du Projet

```
smarthome/
├── config/                    # Configuration de la base de données
│   └── database.js
├── controllers/              # Logique métier (handlers des routes)
│   ├── authController.js
│   ├── familyController.js
│   └── shoppingController.js
├── middleware/              # Middlewares Express
│   ├── auth.js
│   └── errorHandler.js
├── models/                  # Modèles de données (requêtes BD)
│   ├── Family.js
│   ├── Shopping.js
│   └── User.js
├── routes/                  # Définition des routes API
│   ├── authRoutes.js
│   ├── familyRoutes.js
│   └── shoppingRoutes.js
├── utils/                   # Utilitaires
│   ├── validation.js
│   └── activityLog.js
├── server.js               # Point d'entrée du serveur
├── package.json            # Dépendances et scripts
└── database.sql            # Schéma de la base de données
```

---

## 🗄️ BASE DE DONNÉES

### Architecture PostgreSQL

#### Table: users
Stocke les informations des utilisateurs.
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  active_family_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Champs clés:**
- `id`: ID unique
- `username`: Identifiant unique (alphanumérique, min 3 chars)
- `email`: Email unique
- `password_hash`: Mot de passe hashé avec bcrypt
- `display_name`: Nom d'affichage de l'utilisateur
- `active_family_id`: ID de la famille active de l'utilisateur

#### Table: families
Représente une famille.
```sql
CREATE TABLE families (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_by_user_id INTEGER NOT NULL,
  invite_code VARCHAR(10) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by_user_id) REFERENCES users(id)
);
```
**Champs clés:**
- `id`: ID unique
- `name`: Nom de la famille
- `created_by_user_id`: ID du créateur (Parent initialement)
- `invite_code`: Code d'invitation unique (10 caractères)

#### Table: family_members
Liens entre utilisateurs et familles.
```sql
CREATE TABLE family_members (
  id SERIAL PRIMARY KEY,
  family_id INTEGER NOT NULL,
  user_id INTEGER,
  member_name VARCHAR(100) NOT NULL,
  role user_role NOT NULL DEFAULT 'Membre',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  can_delete BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```
**Rôles disponibles:**
- Parent
- Enfant
- Tonton
- Tante
- Grand-mère
- Grand-père
- Autres

#### Table: shopping_lists
Listes de courses de la famille.
```sql
CREATE TABLE shopping_lists (
  id SERIAL PRIMARY KEY,
  family_id INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_by_user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table: shopping_items
Articles individuels dans une liste de courses.
```sql
CREATE TABLE shopping_items (
  id SERIAL PRIMARY KEY,
  shopping_list_id INTEGER NOT NULL,
  icon VARCHAR(10),
  name VARCHAR(200) NOT NULL,
  category VARCHAR(50),
  urgent BOOLEAN DEFAULT FALSE,
  checked BOOLEAN DEFAULT FALSE,
  quantity VARCHAR(50),
  added_by_user_id INTEGER NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  bought_at TIMESTAMP
);
```
**Champs clés:**
- `icon`: Emoji représentant l'article
- `urgent`: Article prioritaire
- `checked`: Article coché/acheté
- `bought_at`: Timestamp du marquage comme acheté

#### Table: activity_logs
Journal des activités (audit trail).
```sql
CREATE TABLE activity_logs (
  id SERIAL PRIMARY KEY,
  family_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  item_id INTEGER,
  action VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table: invite_codes
Gestion des codes d'invitation temporaires.
```sql
CREATE TABLE invite_codes (
  id SERIAL PRIMARY KEY,
  family_id INTEGER NOT NULL,
  code VARCHAR(10) NOT NULL UNIQUE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);
```

---

## 🔐 AUTHENTIFICATION (authController.js)

### 1️⃣ INSCRIPTION: `POST /api/auth/register`

**Endpoint:** `/api/auth/register`
**Méthode:** POST
**Body:**
```json
{
  "username": "micheal",
  "email": "micheal@example.com",
  "password": "motdepasse123",
  "confirmPassword": "motdepasse123",
  "display_name": "Michaël"
}
```

**Processus:**
1. Validation des données avec Joi
2. Vérification que confirmPassword = password
3. Vérification unicité du username et email
4. Hachage du mot de passe avec bcrypt (10 rounds)
5. Création de l'utilisateur en BD
6. Génération d'un JWT token
7. Retour utilisateur + token

**Réponse (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "micheal",
    "email": "micheal@example.com",
    "display_name": "Michaël"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erreurs possibles:**
- 400: Données invalides ou mots de passe non identiques
- 409: Username ou email déjà existants

### 2️⃣ CONNEXION: `POST /api/auth/login`

**Endpoint:** `/api/auth/login`
**Méthode:** POST
**Body:**
```json
{
  "username": "micheal",
  "password": "motdepasse123"
}
```

**Processus:**
1. Vérification que username et password sont fournis
2. Recherche de l'utilisateur par username
3. Comparaison du password avec le hash stocké (bcrypt)
4. Génération d'un JWT token
5. Retour utilisateur + token

**Réponse (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "micheal",
    "email": "micheal@example.com",
    "display_name": "Michaël",
    "active_family_id": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erreurs possibles:**
- 400: Username ou password manquants
- 401: Identifiant ou mot de passe incorrect

### 3️⃣ PROFIL: `GET /api/auth/profile`

**Endpoint:** `/api/auth/profile`
**Méthode:** GET
**Authentification:** Requiert JWT token en header `Authorization: Bearer <token>`

**Réponse (200):**
```json
{
  "user": {
    "id": 1,
    "username": "micheal",
    "email": "micheal@example.com",
    "display_name": "Michaël",
    "active_family_id": 1
  },
  "families": [
    {
      "id": 1,
      "name": "Famille Faye",
      "role": "Parent"
    }
  ]
}
```

### 4️⃣ UPDATE PROFIL: `PUT /api/auth/profile`

**Endpoint:** `/api/auth/profile`
**Méthode:** PUT
**Body:**
```json
{
  "display_name": "Michaël Faye",
  "active_family_id": 1
}
```

---

## 👨‍👩‍👧‍👦 GESTION DES FAMILLES (familyController.js)

### 1️⃣ CRÉER UNE FAMILLE: `POST /api/families`

**Endpoint:** `/api/families`
**Méthode:** POST
**Authentification:** Requiert JWT
**Body:**
```json
{
  "name": "Famille Faye",
  "description": "Notre famille adorée"
}
```

**Processus:**
1. Création de la famille avec le créateur (utilisateur authentifié)
2. Génération d'un code d'invitation unique
3. Ajout automatique du créateur comme "Parent"

**Réponse (201):**
```json
{
  "id": 1,
  "name": "Famille Faye",
  "description": "Notre famille adorée",
  "created_by_user_id": 1,
  "invite_code": "FAYE2024",
  "members": [
    {
      "id": 1,
      "member_name": "Papa (Vous)",
      "role": "Parent",
      "user_id": 1
    }
  ]
}
```

### 2️⃣ LISTER LES FAMILLES: `GET /api/families`

**Endpoint:** `/api/families`
**Réponse:** Array de familles de l'utilisateur

### 3️⃣ RÉCUPÉRER UNE FAMILLE: `GET /api/families/:id`

**Endpoint:** `/api/families/:id`
**Réponse:**
```json
{
  "family": { ... },
  "members": [ ... ],
  "shopping_lists": [ ... ]
}
```

### 4️⃣ REJOINDRE UNE FAMILLE: `POST /api/families/join`

**Endpoint:** `/api/families/join`
**Méthode:** POST
**Body:**
```json
{
  "invite_code": "FAYE2024",
  "member_name": "Fatou",
  "role": "Enfant"
}
```

**Processus:**
1. Recherche de la famille par code d'invitation
2. Ajout de l'utilisateur comme membre
3. Création d'entrée activity_log

### 5️⃣ AJOUTER UN MEMBRE (NON-INSCRIT): `POST /api/families/:id/members`

**Endpoint:** `/api/families/:id/members`
**Méthode:** POST
**Body:**
```json
{
  "member_name": "Maman",
  "role": "Parent"
}
```

**Processus:**
1. Création d'un member sans user_id associé (pour non-inscrits)
2. L'utilisateur pourra se connecter plus tard et lier son compte

### 6️⃣ SUPPRIMER UN MEMBRE: `DELETE /api/families/:familyId/members/:memberId`

**Processus:**
1. Vérification que l'utilisateur a la permission (Parent ou creator)
2. Suppression du member si `can_delete = TRUE`
3. Logging de l'action

---

## 🛒 LISTES DE COURSES (shoppingController.js)

### 1️⃣ CRÉER UNE LISTE: `POST /api/shopping`

**Endpoint:** `/api/shopping`
**Méthode:** POST
**Body:**
```json
{
  "name": "Courses hebdomadaires",
  "family_id": 1
}
```

### 2️⃣ RÉCUPÉRER UNE LISTE: `GET /api/shopping/:id`

**Réponse:**
```json
{
  "list": {
    "id": 1,
    "name": "Courses hebdomadaires",
    "family_id": 1
  },
  "items": [
    {
      "id": 1,
      "icon": "🍼",
      "name": "Lait 1er âge",
      "category": "Bébé",
      "urgent": true,
      "checked": false,
      "quantity": "2L"
    }
  ]
}
```

### 3️⃣ AJOUTER UN ARTICLE: `POST /api/shopping/:id/items`

**Endpoint:** `/api/shopping/:id/items`
**Méthode:** POST
**Body:**
```json
{
  "icon": "🍼",
  "name": "Lait 1er âge",
  "category": "Bébé",
  "urgent": true,
  "quantity": "2L"
}
```

**Processus:**
1. Validation des données
2. Création de l'item
3. Logging de l'activité

### 4️⃣ COCHER UN ARTICLE: `PUT /api/shopping/items/:itemId`

**Endpoint:** `/api/shopping/items/:itemId`
**Méthode:** PUT
**Body:**
```json
{
  "checked": true
}
```

**Processus:**
1. Mise à jour du statut `checked`
2. Si checked = true, définition de `bought_at`
3. Logging de l'activité

### 5️⃣ SUPPRIMER UN ARTICLE: `DELETE /api/shopping/items/:itemId`

**Processus:**
1. Vérification de la permission
2. Suppression de l'article
3. Logging

### 6️⃣ METTRE À JOUR UN ARTICLE: `PUT /api/shopping/items/:itemId/edit`

**Body:**
```json
{
  "name": "Lait 2e âge",
  "quantity": "3L",
  "urgent": false
}
```

---

## 📝 MODÈLES (Models)

### User.js
```javascript
// Méthodes principales:
- createUser(username, email, password_hash, display_name)
- getUserById(userId)
- getUserByUsername(username)
- getUserByEmail(email)
- updateUser(userId, display_name, active_family_id)
- getUserFamilies(userId)
```

### Family.js
```javascript
// Méthodes principales:
- createFamily(name, description, created_by_user_id, invite_code)
- getFamilyById(familyId)
- getFamiliesByUserId(userId)
- getFamilyMembers(familyId)
- addMember(familyId, member_name, role, user_id)
- removeMember(memberId)
- generateInviteCode(familyId)
- joinFamilyByCode(familyId, user_id, member_name, role)
```

### Shopping.js
```javascript
// Méthodes principales:
- createList(family_id, name, created_by_user_id)
- getListById(listId)
- getListsByFamilyId(familyId)
- addItem(shopping_list_id, icon, name, category, urgent, quantity, added_by_user_id)
- updateItem(itemId, data)
- deleteItem(itemId)
- getItems(listId)
```

---

## 🛡️ MIDDLEWARE

### auth.js
**Fonction: `verifyToken(req, res, next)`**

Middleware pour protéger les routes. Extrait le token JWT du header `Authorization: Bearer <token>` et ajoute `req.user` contenant `userId`.

**Erreurs:**
- 401: Token manquant ou invalide
- 403: Token expiré

**Fonction: `generateToken(userId)`**

Génère un JWT valide 7 jours.

### errorHandler.js
Middleware global de gestion des erreurs. Capture les exceptions non gérées et retourne un statut 500 avec un message d'erreur.

---

## 📊 UTILITAIRES

### validation.js
Schémas Joi pour valider les données entrantes:
- `validateUser()`: Valide inscriptions (username, email, password, confirmPassword)
- `validateFamily()`: Valide création de famille
- `validateShoppingList()`: Valide liste de courses
- `validateShoppingItem()`: Valide article
- `validateFamilyMember()`: Valide membres

### activityLog.js
```javascript
// Méthode: logActivity(userId, familyId, action, description, itemId)
```
Enregistre les actions des utilisateurs dans la table `activity_logs`:
- Actions: CREATE, UPDATE, DELETE, CHECK
- Permet de tracker qui a fait quoi et quand

---

## 🔧 CONFIGURATION

### config/database.js
Configure la connexion PostgreSQL:
```javascript
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'smarthome',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});
```

---

## 🚀 ROUTES API

### Routes d'Authentification (`/api/auth`)
```
POST   /api/auth/register         - Inscription
POST   /api/auth/login            - Connexion
GET    /api/auth/profile          - Récupérer profil (JWT)
PUT    /api/auth/profile          - Modifier profil (JWT)
```

### Routes de Familles (`/api/families`)
```
POST   /api/families              - Créer famille (JWT)
GET    /api/families              - Lister familles (JWT)
GET    /api/families/:id          - Détails famille (JWT)
POST   /api/families/join         - Rejoindre famille (JWT)
POST   /api/families/:id/members  - Ajouter membre (JWT)
DELETE /api/families/:id/members/:memberId - Supprimer membre (JWT)
```

### Routes Shopping (`/api/shopping`)
```
POST   /api/shopping              - Créer liste (JWT)
GET    /api/shopping/:id          - Récupérer liste (JWT)
POST   /api/shopping/:id/items    - Ajouter article (JWT)
PUT    /api/shopping/items/:itemId        - Cocher article (JWT)
PUT    /api/shopping/items/:itemId/edit   - Modifier article (JWT)
DELETE /api/shopping/items/:itemId        - Supprimer article (JWT)
```

---

## 🌍 VARIABLES D'ENVIRONNEMENT (.env)

```
# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smarthome
DB_USER=postgres
DB_PASSWORD=votre_password

# Serveur
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=votre_clé_secrète_super_sécurisée

# API
API_BASE_URL=http://localhost:5000
```

---

## 🏃 DÉMARRER LE SERVEUR

```bash
# Installation des dépendances
npm install

# Configuration de la base de données
psql -U postgres < database.sql

# Démarrer le serveur (développement)
npm start

# Démarrer en production
npm run start:prod
```

Le serveur démarre sur `http://localhost:5000`

---

## 📚 FLUX D'UTILISATION TYPIQUE

### Scénario 1: Création d'une famille

1. **Utilisateur A s'inscrit**
   ```
   POST /api/auth/register
   → JWT token généré
   ```

2. **Utilisateur A crée une famille**
   ```
   POST /api/families
   → Famille créée avec code d'invitation "FAYE2024"
   → Utilisateur A ajouté comme "Parent"
   ```

3. **Utilisateur A crée une liste de courses**
   ```
   POST /api/shopping
   → Liste "Courses hebdomadaires" créée
   ```

4. **Utilisateur A ajoute des articles**
   ```
   POST /api/shopping/1/items
   → 🍼 Lait, 🧻 Papier toilette, 🍎 Pommes ajoutés
   ```

### Scénario 2: Autre membre rejoint

1. **Utilisateur B s'inscrit**
   ```
   POST /api/auth/register
   ```

2. **Utilisateur B rejoint la famille avec le code**
   ```
   POST /api/families/join (avec invite_code: "FAYE2024")
   → Utilisateur B ajouté comme "Enfant"
   ```

3. **Utilisateur B consulte la liste**
   ```
   GET /api/shopping/1
   → Voir articles et qui les a ajoutés
   ```

4. **Utilisateur B coche un article**
   ```
   PUT /api/shopping/items/1 (checked: true)
   → Article marqué comme acheté
   → Activity log créé
   ```

---

## 🔍 DEBUGGING ET LOGS

Les requêtes API avec des erreurs retournent des messages clairs:

```json
{
  "error": "Username already exists"
}
```

Vérifiez:
1. Le JWT token est valide et non expiré
2. Les données envoyées correspondent au schéma
3. L'utilisateur a les permissions
4. La base de données est accessible

---

## 📦 DÉPENDANCES PRINCIPALES

- **express**: Framework web
- **bcryptjs**: Hachage des mots de passe
- **jsonwebtoken**: Tokens JWT
- **joi**: Validation des données
- **pg**: Driver PostgreSQL
- **cors**: Gestion CORS
- **dotenv**: Variables d'environnement

---

## ✅ CHECKLIST DE VALIDATION

- ✅ Les mots de passe sont confirmés à l'inscription
- ✅ Les mots de passe sont hashés avec bcrypt
- ✅ Les tokens JWT sont générés pour chaque session
- ✅ Les routes protégées nécessitent un JWT valide
- ✅ Les codes d'invitation sont uniques
- ✅ Les rôles de famille sont validés
- ✅ Les activités sont loggées
- ✅ La base de données est normalisée (3NF)
- ✅ Les contraintes de clés étrangères sont appliquées

---

**Dernière mise à jour:** Mai 2026
**Version:** 1.0.0
**Auteur:** SmartHome Team
