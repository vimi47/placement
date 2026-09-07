import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

from mongodb import students_collection

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"

security = HTTPBearer()


def get_current_student(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        student_id = payload.get("student_id")

        if not student_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        student = students_collection.find_one(
            {"_id": __import__("bson").ObjectId(student_id)}
        )

        if not student:
            raise HTTPException(
                status_code=401,
                detail="Student not found"
            )

        return student

    except (JWTError, Exception):
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )