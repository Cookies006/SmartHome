"""
Script de test pour vérifier la structure du backend Flask
"""

import sys
import os

# Ajouter le répertoire du backend au chemin
sys.path.insert(0, os.path.dirname(__file__))

def test_imports():
    """Tester les imports"""
    try:
        print("✓ Test imports...")
        
        print("  - config.py...")
        import config
        
        print("  - models.py...")
        import models
        
        print("  - middleware.py...")
        import middleware
        
        print("  - validation.py...")
        import validation
        
        print("  - activity_log.py...")
        import activity_log
        
        print("  - controllers...")
        from controllers import auth_controller, family_controller, shopping_controller
        
        print("  - routes...")
        from routes import auth_routes, family_routes, shopping_routes
        
        print("✓ Tous les imports sont OK!")
        return True
    except Exception as e:
        print(f"✗ Erreur d'import: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_app_creation():
    """Tester la création de l'app"""
    try:
        print("\n✓ Test création de l'app...")
        from app import create_app
        
        app = create_app('testing')  # Use testing config
        
        print("✓ App créée avec succès!")
        return app
    except Exception as e:
        print(f"✗ Erreur création app: {e}")
        import traceback
        traceback.print_exc()
        return None

def test_routes(app):
    """Tester les routes"""
    try:
        print("\n✓ Test routes...")
        
        with app.test_client() as client:
            # Test health check
            response = client.get('/api/health')
            print(f"  - GET /api/health: {response.status_code}")
            assert response.status_code == 200
            
            print("✓ Toutes les routes sont OK!")
        return True
    except Exception as e:
        print(f"✗ Erreur routes: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    print("=" * 50)
    print("TEST BACKEND FLASK SMARTHOME")
    print("=" * 50)
    
    # Test imports
    if not test_imports():
        sys.exit(1)
    
    # Test app creation
    app = test_app_creation()
    if not app:
        sys.exit(1)
    
    # Test routes
    if not test_routes(app):
        sys.exit(1)
    
    print("\n" + "=" * 50)
    print("✓ TOUS LES TESTS SONT PASSÉS!")
    print("=" * 50)
