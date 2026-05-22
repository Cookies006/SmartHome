#!/usr/bin/env python
"""
Point d'entrée pour le serveur Flask SmartHome
"""
import os
from app import create_app, db
from dotenv import load_dotenv

load_dotenv()

def create_tables():
    """Créer les tables de la base de données"""
    app = create_app()
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("✓ Database tables created successfully!")

if __name__ == '__main__':
    app = create_app()
    
    # Create tables if they don't exist
    with app.app_context():
        try:
            db.create_all()
            print("✓ Database initialized")
        except Exception as e:
            print(f"⚠ Database initialization warning: {e}")
    
    # Run the Flask app
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV', 'development') == 'development'
    
    print(f"\n🚀 Starting SmartHome Backend on http://localhost:{port}")
    print(f"📚 API Documentation: http://localhost:{port}/api/health")
    app.run(host='0.0.0.0', port=port, debug=debug)
