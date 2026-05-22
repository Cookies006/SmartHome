@echo off
REM Script de démarrage du backend SmartHome sur Windows
REM Ce script installe les dépendances et démarre le serveur Flask

setlocal enabledelayedexpansion

echo.
echo =========================================
echo  SmartHome Backend - Démarrage Windows
echo =========================================
echo.

REM Aller au répertoire du backend
cd /d "c:\Users\HP\Documents\Projet\SmartHome\backend-python"

if errorlevel 1 (
    echo ✗ Erreur: Impossible d'accéder au répertoire du backend
    pause
    exit /b 1
)

echo ✓ Répertoire du backend : %cd%
echo.

REM Vérifier si l'environnement virtuel existe
if not exist ".venv\" (
    echo ⚠ Environnement virtuel non trouvé, création...
    python -m venv .venv
    if errorlevel 1 (
        echo ✗ Erreur: Impossible de créer l'environnement virtuel
        pause
        exit /b 1
    )
    echo ✓ Environnement virtuel créé
)

REM Activer l'environnement virtuel
call .venv\Scripts\activate.bat
echo ✓ Environnement virtuel activé

REM Installer les dépendances
echo.
echo ⏳ Installation des dépendances... (cela peut prendre quelques minutes)
python -m pip install -r requirements.txt --quiet
if errorlevel 1 (
    echo ✗ Erreur: Impossible d'installer les dépendances
    pause
    exit /b 1
)
echo ✓ Dépendances installées

REM Tester la configuration
echo.
echo ⏳ Test de configuration du backend...
python test_setup.py
if errorlevel 1 (
    echo ✗ Erreur: Les tests de configuration ont échoué
    pause
    exit /b 1
)

REM Démarrer le serveur
echo.
echo =========================================
echo  ✓ Tous les tests sont passés!
echo  🚀 Démarrage du serveur Flask...
echo.
echo  Le backend est accessible sur:
echo  http://localhost:5000
echo.
echo  API Health: http://localhost:5000/api/health
echo.
echo  Appuyez sur Ctrl+C pour arrêter le serveur
echo =========================================
echo.

python run.py

pause
