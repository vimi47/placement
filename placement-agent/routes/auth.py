import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import jwt

from mongodb import students_collection


router = APIRouter(prefix="/auth", tags=["Authentication"])

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/register")
def register_student(data: RegisterRequest):
    print("🔥 REGISTER ROUTE REACHED")

    # Check whether student already exists
    

    # Check whether student already exists
    existing_student = students_collection.find_one(
        {"email": data.email}
    )

    if existing_student:
        raise HTTPException(
            status_code=400,
            detail="Student already registered"
        )

    # Hash password
    password_hash = pwd_context.hash(data.password)

    # Create student document
    student = {
        "name": data.name,
        "email": data.email,
        "password_hash": password_hash,
        "profile": {
            "target_role": "",
            "target_company": "",
            "year_and_branch": "",
            "programming_languages": "",
            "skills": "",
            "deadline": "",
            "daily_hours": "",
            "strengths": "",
            "weaknesses": ""
        }
    }

    result = students_collection.insert_one(student)

    return {
        "message": "Student registered successfully",
        "student_id": str(result.inserted_id)
    }

@router.post("/login")
def login_student(data: LoginRequest):

    # Find student by email
    student = students_collection.find_one(
        {"email": data.email}
    )

    if not student:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Verify password
    if not pwd_context.verify(
        data.password,
        student["password_hash"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = jwt.encode(
    {
        "student_id": str(student["_id"]),
        "email": student["email"]
    },
    SECRET_KEY,
    algorithm=ALGORITHM
    
    )

    return {
    "message": "Login successful",
    "access_token": token,
    "token_type": "bearer",
    "student_id": str(student["_id"]),
    "name": student["name"],
    "email": student["email"]
     }
