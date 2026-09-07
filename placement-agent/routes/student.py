from fastapi import APIRouter, Depends
from pydantic import BaseModel

from routes.auth_utils import get_current_student
from mongodb import students_collection

router = APIRouter(prefix="/student", tags=["Student"])


class ProfileUpdateRequest(BaseModel):
    name: str = ""
    target_role: str = ""
    target_company: str = ""
    year_and_branch: str = ""
    programming_languages: str = ""
    skills: str = ""
    deadline: str = ""
    daily_hours: str = ""
    strengths: str = ""
    weaknesses: str = ""


@router.get("/profile")
def get_student_profile(
    student=Depends(get_current_student)
):
    return {
        "student_id": str(student["_id"]),
        "name": student["name"],
        "email": student["email"],
        "profile": student.get("profile", {})
    }


@router.put("/profile")
def update_student_profile(
    data: ProfileUpdateRequest,
    student=Depends(get_current_student)
):
    students_collection.update_one(
        {"_id": student["_id"]},
        {
            "$set": {
                "name": data.name,
                "profile.target_role": data.target_role,
                "profile.target_company": data.target_company,
                "profile.year_and_branch": data.year_and_branch,
                "profile.programming_languages": data.programming_languages,
                "profile.skills": data.skills,
                "profile.deadline": data.deadline,
                "profile.daily_hours": data.daily_hours,
                "profile.strengths": data.strengths,
                "profile.weaknesses": data.weaknesses,
            }
        }
    )

    return {
        "message": "Profile updated successfully"
    }