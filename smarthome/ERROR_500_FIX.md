# 🔴 RÉSOUDRE L'ERREUR 500 - Guide Rapide

## Le Problème
```
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
MIME type ('application/json') is not executable
```

Cela signifie que le **serveur Express** retourne une erreur au lieu de servir correctement l'application.

---

## ⚡ Étapes de Résolution (5 min)

### Étape 1: Démarrer le diagnostic
```bash
npm test
# ou
npm run test:server
```

Cela va vérifier:
- ✓ Si le serveur est accessible
- ✓ Si les variables d'environnement sont configurées
- ✓ Si la base de données est accessible
- ✓ Si les endpoints fonctionnent

### Étape 2: Vérifier les erreurs affichées

**Si le test dit "Server not running":**
```bash
# Terminal 1: Démarrer le serveur avec logs détaillés
npm run dev

# Attendre et chercher les erreurs en rouge (🔴)
```

**Si le test dit "Missing environment variables":**
```bash
# Vérifier le fichier .env
cat .env

# Il doit contenir:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=smarthome
# DB_USER=postgres
# DB_PASSWORD=...
# JWT_SECRET=...
```

**Si le test échoue à la "User Registration":**
```bash
# La base de données n'est peut-être pas accessible
# Vérifier que PostgreSQL fonctionne

# Windows:
# Services → PostgreSQL → Vérifier qu'il est "Running"

# Mac/Linux:
brew services list | grep postgresql
# ou
sudo systemctl status postgresql
```

### Étape 3: Redémarrer avec la bonne séquence

**Terminal 1 - Serveur backend:**
```bash
npm run dev
# Attendre de voir "✅ Running on http://localhost:3000"
```

**Terminal 2 - App frontend:**
```bash
npm start
# Attendre de voir "Local: http://localhost:19006"
```

### Étape 4: Tester les endpoints manuellement

Si `npm test` échoue, vérifier manuellement:

```bash
# Test de santé
curl http://localhost:3000/health

# Réponse attendue:
# {"status":"OK","message":"SmartHome Backend is running",...}

# Si ça fonctionne, l'erreur vient d'ailleurs
```

---

## 🔍 Checklist Rapide

- [ ] PostgreSQL est-il démarré?
  ```bash
  psql -U postgres -c "SELECT version();"
  ```

- [ ] La base de données "smarthome" existe?
  ```bash
  psql -U postgres -lqt | grep smarthome
  ```

- [ ] Les tables existent?
  ```bash
  psql -U postgres -d smarthome -c "\dt"
  # Doit afficher: families, users, shopping_lists, etc.
  ```

- [ ] Le fichier .env existe et est complet?
  ```bash
  cat .env
  ```

- [ ] NODE_ENV n'est pas "production"?
  ```bash
  grep NODE_ENV .env
  # Doit être "development"
  ```

- [ ] npm packages sont installés?
  ```bash
  npm install
  ```

---

## 🚀 Commandes Rapides pour Démarrer

```bash
# OPTION 1: Démarrage classique (2 terminaux)
# Terminal 1:
npm run dev

# Terminal 2 (dans un autre terminal du même dossier):
npm start

# OPTION 2: Avec script de diagnostic
# Terminal 1:
npm run dev

# Terminal 2 (dans un nouveau terminal):
npm test      # Lance le diagnostic
```

---

## 📊 Vérifier que c'est Fixé

### ✅ Signe que ça marche:
- Le terminal du backend affiche: `✅ Running on http://localhost:3000`
- Le terminal du frontend affiche: `Local: http://localhost:19006`
- Ouvrir `http://localhost:19006` dans le navigateur
- L'app apparaît (pas d'erreur 500)
- Vous pouvez voir l'écran d'inscription

### ❌ Signes que ça ne marche pas:
- Erreur dans le terminal du backend (🔴)
- Erreur dans le terminal du frontend (RED SCREEN)
- Page blanche dans le navigateur
- MIME type error
- Impossible de se connecter

---

## 📞 Si ça ne marche toujours pas

### Étape 1: Collecter les informations

```bash
# Copier tout ça:
node --version
npm --version
psql --version
env | grep -E "DB_|JWT_|PORT|NODE_ENV"
cat .env
```

### Étape 2: Lancer le diagnostic complet

```bash
# Terminal 1
npm run dev > backend_logs.txt 2>&1

# Terminal 2
npm test > test_output.txt 2>&1

# Attendre 10 secondes, puis afficher les fichiers
cat backend_logs.txt
cat test_output.txt
```

### Étape 3: Réinitialiser la base de données

```bash
# ⚠️ ATTENTION: Cela va supprimer TOUTES les données

# 1. Arrêter le serveur (Ctrl+C dans le terminal backend)

# 2. Réinitialiser
psql -U postgres -d smarthome -c "DROP SCHEMA public CASCADE;"
psql -U postgres -d smarthome -c "CREATE SCHEMA public;"

# 3. Recharger le schéma
psql -U postgres -d smarthome -f database.sql

# 4. Redémarrer le serveur
npm run dev
```

---

## 📚 Ressources Complètes

- **Guide de Démarrage Complet:** [STARTUP_GUIDE.md](./STARTUP_GUIDE.md)
- **Documentation Backend:** [BACKEND_DOCUMENTATION.md](./BACKEND_DOCUMENTATION.md)
- **Troubleshooting Détaillé:** [STARTUP_GUIDE.md#-problèmes-courants-et-solutions](./STARTUP_GUIDE.md)

---

## 💡 Conseil: Toujours Vérifier d'Abord

Quand une erreur 500 se produit:
1. **Regarder les logs du backend** (`npm run dev`)
2. **Exécuter le diagnostic** (`npm test`)
3. **Vérifier PostgreSQL** (`psql -U postgres -d smarthome -c "SELECT 1"`)

99% des erreurs 500 viennent de:
- PostgreSQL pas démarré ❌
- Variables d'environnement manquantes ❌
- Base de données vide ❌

---

**Dernière mise à jour:** Mai 2026

Si le problème persiste, créer un issue avec:
- Output de `npm test`
- Output complet de `npm run dev`
- Votre fichier `.env` (sans passwords)
