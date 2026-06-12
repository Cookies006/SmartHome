# ✅ Frontend & Backend - Intégration Complétée

## 🔗 Connexion Établie

Le frontend **React Native** est maintenant connecté au backend **Flask**!

### Fichiers Modifiés

#### 1. **api.js** (CRÉÉ) 🆕
Service API centralisé pour tous les appels au backend.

**Location**: `smarthome/api.js`

**Fonctionnalités**:
- ✅ Gestion automatique du token JWT
- ✅ Appels HTTP sécurisés (avec Authorization header)
- ✅ Gestion d'erreur centralisée

**Endpoints disponibles**:
```javascript
// Authentification
api.register(username, email, password, displayName)
api.verifyCode(email, code)
api.login(username, password)
api.getProfile()
api.updateProfile(displayName, activeFamilyId)

// Familles
api.getFamilies()
api.createFamily(name, description)
api.getFamily(familyId)
// ... etc

// Listes de courses
api.getShoppingLists()
api.createShoppingList(name, familyId)
api.addShoppingItem(listId, itemName, quantity, category)
// ... etc
```

#### 2. **Auth.js** (MODIFIÉ) 🔄

**Changements**:
- ✅ Import du service API
- ✅ Ajouter `ActivityIndicator` (indicateur de chargement)
- ✅ `validateLogin()` → Appel réel au backend
- ✅ `validateSignup()` → Appel réel au backend  
- ✅ `verifyCodeSubmit()` → Appel réel au backend (nouvelle fonction)
- ✅ Boutons avec loader pendant la requête

**Avant** ❌:
```javascript
const validateLogin = () => {
  if (username === 'micheal' && password === '12345') {
    notify('✨ Connexion réussie');
    onLoginSuccess?.();
  } else {
    notify('❌ Identifiant ou mot de passe incorrect');
  }
};
```

**Après** ✅:
```javascript
const validateLogin = async () => {
  setLoading(true);
  const result = await api.login(username, password);
  setLoading(false);
  
  if (result.success) {
    notify('✨ Connexion réussie');
    onLoginSuccess?.();
  } else {
    notify(`❌ ${result.error}`);
  }
};
```

---

## 🚀 Comment Ça Fonctionne

### Flow d'Authentification

```
┌─────────────────────┐
│   Frontend (React)  │
│   Auth.js           │
└──────────┬──────────┘
           │
           │ api.login(username, password)
           ▼
┌─────────────────────────────────────┐
│   Backend (Flask)                   │
│   POST /api/auth/login              │
│   Vérifie les credentials           │
│   Retourne token JWT                │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────┐
│  Token Stocké       │
│  (api.js)           │
│                     │
│  Bearer <token>     │
└─────────────────────┘
           │
           │ Utilisé pour les requêtes futures
           ▼
┌─────────────────────────────────────┐
│   GET /api/auth/profile             │
│   GET /api/families                 │
│   POST /api/shopping                │
│   ... Toutes les requêtes           │
└─────────────────────────────────────┘
```

### 1️⃣ Inscription

**User**: Remplit email, username, password, confirme password
↓
**Frontend**: Appel `api.register(username, email, password)`
↓
**Backend**: 
- Valide les données
- Crée l'utilisateur
- Génère code 4 chiffres
- Envoie email avec code
↓
**Frontend**: Écran de vérification du code
↓
**User**: Rentre le code reçu par email
↓
**Frontend**: Appel `api.verifyCode(email, code)`
↓
**Backend**:
- Vérifie le code
- Génère token JWT
↓
**Frontend**: Token sauvegardé, redirection vers Dashboard

### 2️⃣ Connexion

**User**: Rentre username et password
↓
**Frontend**: Appel `api.login(username, password)`
↓
**Backend**:
- Vérifie les credentials
- Génère token JWT
↓
**Frontend**: Token sauvegardé, redirection vers Dashboard

### 3️⃣ Appels Authentifiés

**Frontend**: `api.getFamilies()`
↓
**api.js**: Ajoute header `Authorization: Bearer <token>`
↓
**Backend**: Vérifie le token, retourne les données

---

## 📋 Configuration

### URL Base du Backend

**File**: `smarthome/.env`

```env
API_BASE_URL=http://192.168.1.20:5000/api
```

**Assurez-vous que**:
- ✅ L'IP `192.168.1.20` correspond à votre machine avec le backend
- ✅ Le port `5000` est accessible
- ✅ Le backend Flask est en cours d'exécution

---

## ✅ Tests d'Intégration

### Test 1: Inscription et Vérification de Code

```
1. Lancer le backend: python run.py
2. Ouvrir le frontend
3. Cliquer "S'inscrire"
4. Remplir: email, username, password
5. Cliquer "Suivant"
6. Vérifier l'email reçu pour le code (ou voir la console du backend)
7. Rentrer le code à 4 chiffres
8. ✅ Vous devez être connecté!
```

### Test 2: Connexion avec les mêmes credentials

```
1. Cliquer "Se connecter"
2. Entrer: username et password
3. ✅ Connexion réussie, redirection vers Dashboard
```

### Test 3: Erreurs

```
1. Rentrer un mauvais password
2. ✅ Voir le message d'erreur du backend
```

---

## 🔒 Sécurité

### Token JWT

- ✅ Généré par le backend après login/register
- ✅ Stocké en mémoire dans `api.js` (session)
- ✅ Utilisé automatiquement pour toutes les requêtes
- ✅ Valable 7 jours (configurable dans `.env` backend)

### Points d'Attention

⚠️ **En développement**: Le token est en mémoire (perdu au refresh)
⚠️ **En production**: Utiliser AsyncStorage pour persister le token

---

## 📦 Prochaines Étapes

### 1. Modifier Dashboard.js
Pour charger les données du backend:
```javascript
import * as api from './api';

useEffect(() => {
  api.getProfile().then(result => {
    if (result.success) {
      setUserProfile(result.data.user);
    }
  });
}, []);
```

### 2. Modifier Courses.js
Pour intégrer les listes de courses du backend

### 3. Modifier Familles.js
Pour gérer les familles avec le backend

### 4. Ajouter persistance du token
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sauvegarder le token
await AsyncStorage.setItem('authToken', token);

// Restaurer le token
const token = await AsyncStorage.getItem('authToken');
if (token) api.setAuthToken(token);
```

---

## 🐛 Dépannage

### Erreur: "Failed to fetch from http://192.168.1.20:5000"

**Causes possibles**:
- ❌ Backend n'est pas en cours d'exécution
- ❌ IP `192.168.1.20` incorrecte
- ❌ Pare-feu bloque le port 5000

**Solution**:
```powershell
# 1. Vérifier que le backend est actif
python run.py

# 2. Vérifier l'IP de votre machine
ipconfig

# 3. Mettre à jour .env avec la bonne IP
API_BASE_URL=http://<VOTRE_IP>:5000/api
```

### Erreur: "Invalid or expired token"

**Cause**: Token a expiré ou n'est pas valide

**Solution**:
```javascript
// Dans Auth.js au démarrage:
useEffect(() => {
  api.clearAuthToken(); // Réinitialiser
}, []);
```

### Code de vérification ne reçoit pas d'email

**Vérifier**:
- ✅ Configuration Gmail dans `.env` backend
- ✅ Google App Password généré et configuré
- ✅ Connexion internet active

---

## 📚 Documentation

- [Backend Setup](../BACKEND_STARTUP_WINDOWS.md)
- [API Service](./api.js)
- [Auth Component](./Auth.js)
- [Backend API Docs](../backend-python/README.md)

---

## ✨ Status

**Frontend ↔️ Backend: ✅ CONNECTÉS**

- ✅ Service API créé (`api.js`)
- ✅ Authentification intégrée (`Auth.js`)
- ✅ Gestion des tokens JWT
- ✅ Indicateurs de chargement
- ✅ Gestion des erreurs

**Prêt pour les prochaines intégrations!** 🚀
