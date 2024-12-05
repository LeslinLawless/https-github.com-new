from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
from database import get_db
from models import User
from datetime import datetime

router = APIRouter()

# Mock data for learning modules
LEARNING_MODULES = [
    {
        "id": 1,
        "title": "Financial Freedom Basics",
        "description": "Learn the fundamentals of personal finance and wealth building.",
        "category": "Finance",
        "duration": "2 hours",
        "lessons": [
            {"id": 1, "title": "Budgeting Basics"},
            {"id": 2, "title": "Saving Strategies"},
            {"id": 3, "title": "Investment Fundamentals"},
            {"id": 4, "title": "Debt Management"},
        ]
    },
    {
        "id": 2,
        "title": "Productivity Mastery",
        "description": "Master techniques to boost your productivity and achieve more.",
        "category": "Productivity",
        "duration": "1.5 hours",
        "lessons": [
            {"id": 1, "title": "Time Management"},
            {"id": 2, "title": "Goal Setting"},
            {"id": 3, "title": "Focus Techniques"},
        ]
    }
]

@router.get("/modules")
async def get_learning_modules(
    current_user: User = Depends(get_current_user)
):
    # TODO: Replace with database query
    return LEARNING_MODULES

@router.get("/modules/{module_id}")
async def get_module_details(
    module_id: int,
    current_user: User = Depends(get_current_user)
):
    module = next((m for m in LEARNING_MODULES if m["id"] == module_id), None)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    return module

@router.post("/modules/{module_id}/lessons/{lesson_id}/complete")
async def complete_lesson(
    module_id: int,
    lesson_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # TODO: Implement lesson completion in database
    return {"message": "Lesson completed successfully"}
