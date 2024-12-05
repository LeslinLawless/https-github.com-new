from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User

router = APIRouter()

# Mock data for workout music
WORKOUT_PLAYLISTS = {
    "High Intensity": [
        {"id": 1, "title": "Power Up", "artist": "Workout Kings", "duration": "3:45"},
        {"id": 2, "title": "Maximum Energy", "artist": "Fitness Beats", "duration": "4:10"},
        {"id": 3, "title": "Ultimate Cardio", "artist": "Training Mix", "duration": "3:55"},
    ],
    "Cardio": [
        {"id": 4, "title": "Running Rhythm", "artist": "Cardio Crew", "duration": "4:20"},
        {"id": 5, "title": "Endurance Mix", "artist": "Fitness Flow", "duration": "3:50"},
        {"id": 6, "title": "Cardio Blast", "artist": "Workout Pros", "duration": "4:05"},
    ],
    "Strength Training": [
        {"id": 7, "title": "Power Lift", "artist": "Gym Heroes", "duration": "3:30"},
        {"id": 8, "title": "Iron Pumping", "artist": "Muscle Mix", "duration": "4:15"},
        {"id": 9, "title": "Strong & Steady", "artist": "Weight Warriors", "duration": "3:40"},
    ],
    "Yoga": [
        {"id": 10, "title": "Peaceful Flow", "artist": "Zen Masters", "duration": "5:20"},
        {"id": 11, "title": "Mindful Movement", "artist": "Yoga Vibes", "duration": "6:10"},
        {"id": 12, "title": "Inner Balance", "artist": "Meditation Mood", "duration": "5:45"},
    ],
    "Cool Down": [
        {"id": 13, "title": "Gentle Recovery", "artist": "Cool Beats", "duration": "4:30"},
        {"id": 14, "title": "Stretch & Relax", "artist": "Chill Zone", "duration": "4:50"},
        {"id": 15, "title": "Wind Down", "artist": "Recovery Rhythm", "duration": "4:15"},
    ],
}

@router.get("/music/{genre}")
async def get_workout_music(
    genre: str,
    current_user: User = Depends(get_current_user)
):
    if genre not in WORKOUT_PLAYLISTS:
        raise HTTPException(status_code=404, detail="Genre not found")
    return WORKOUT_PLAYLISTS[genre]

@router.get("/music/genres")
async def get_music_genres(
    current_user: User = Depends(get_current_user)
):
    return list(WORKOUT_PLAYLISTS.keys())
