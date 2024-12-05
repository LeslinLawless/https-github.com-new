from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict
from database import get_db
from models import User
from datetime import datetime

router = APIRouter()

@router.get("/me")
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "username": user.username,
        "email": user.email,
        "profile": user.profile if hasattr(user, 'profile') else {},
        "goals": user.goals if hasattr(user, 'goals') else {
            "dailySteps": 10000,
            "weeklyWorkouts": 5,
            "dailyCalories": 2000
        },
        "notifications": user.notifications if hasattr(user, 'notifications') else {
            "email": True,
            "push": True,
            "workout": True,
            "diet": True
        }
    }

@router.put("/me")
async def update_profile(
    profile_data: Dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update allowed fields
    allowed_fields = ["username", "email", "profile", "goals", "notifications"]
    for field in allowed_fields:
        if field in profile_data:
            setattr(user, field, profile_data[field])
    
    user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(user)
    
    return {"message": "Profile updated successfully"}
