from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import uvicorn

from database import engine, get_db
from models import Base, User as UserModel
from routers import finance, workout, profile, learning

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Success Path API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(finance.router, prefix="/finance", tags=["finance"])
app.include_router(workout.router, prefix="/workout", tags=["workout"])
app.include_router(profile.router, prefix="/profile", tags=["profile"])
app.include_router(learning.router, prefix="/learning", tags=["learning"])

# Security configuration
SECRET_KEY = "your-secret-key-here"  # In production, use a secure secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Models
class User(BaseModel):
    username: str
    email: str
    password: str

class Activity(BaseModel):
    user_id: int
    steps: Optional[int]
    calories: Optional[float]
    activity_type: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Security functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    # TODO: Get user from database
    return token_data

# Auth routes
@app.post("/auth/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # TODO: Validate user against database
    if form_data.username != "test@example.com" or form_data.password != "password":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": form_data.username}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/register")
async def register_user(user: User):
    # TODO: Add user to database
    hashed_password = get_password_hash(user.password)
    return {"message": "User registered successfully"}

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to Success Path API"}

@app.post("/users/")
async def create_user(user: User):
    # TODO: Implement user creation with password hashing
    return {"message": "User created successfully"}

@app.post("/activities/")
async def log_activity(activity: Activity):
    return {"message": "Activity logged successfully"}

@app.get("/quotes/daily")
async def get_daily_quote():
    # TODO: Implement quote fetching from database or external API
    return {"quote": "Success is not final, failure is not fatal: it is the courage to continue that counts."}

# Protected routes
@app.get("/activities/daily")
async def get_daily_stats(current_user: User = Depends(get_current_user)):
    return {
        "steps": 8432,
        "calories": 2100,
        "water_intake": 2.5,
        "active_minutes": 45
    }

@app.get("/activities/weekly")
async def get_weekly_stats(current_user: User = Depends(get_current_user)):
    return {
        "steps": [7000, 8500, 6800, 9200, 8432, 7600, 8100],
        "calories": [2200, 2100, 1950, 2300, 2100, 1800, 2000],
        "dates": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
