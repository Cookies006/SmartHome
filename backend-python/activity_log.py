from models import ActivityLog, db

def log_activity(family_id, user_id, action, description, item_id=None):
    """Enregistrer une activité"""
    try:
        activity = ActivityLog(
            family_id=family_id,
            user_id=user_id,
            action=action,
            description=description,
            item_id=item_id
        )
        db.session.add(activity)
        db.session.commit()
        return activity
    except Exception as e:
        db.session.rollback()
        print(f"Error logging activity: {str(e)}")
        return None
