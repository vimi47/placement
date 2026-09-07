from fastapi import APIRouter, Depends, UploadFile, File, HTTPException

from routes.auth_utils import get_current_student
from mongodb import students_collection
from agents.resume_agent import resume_agent

import os
import uuid
import json
import re
import fitz

from google.adk.runners import InMemoryRunner
from google.genai import types


router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)

UPLOAD_DIR = "uploads/resumes"

os.makedirs(UPLOAD_DIR, exist_ok=True)


# ============================================================
# PDF TEXT EXTRACTION
# ============================================================

def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from a PDF resume."""

    document = fitz.open(file_path)

    text = ""

    for page in document:
        text += page.get_text()

    document.close()

    return text.strip()


# ============================================================
# RESUME UPLOAD
# ============================================================

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    student=Depends(get_current_student)
):
    # Check file type
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF resumes are allowed"
        )

    # Create unique filename
    filename = f"{student['_id']}_{uuid.uuid4().hex}.pdf"

    file_path = os.path.join(
        UPLOAD_DIR,
        filename
    )

    # Save PDF
    contents = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(contents)

    # Extract resume text
    resume_text = extract_text_from_pdf(file_path)

    if not resume_text:
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from the resume"
        )

    # Store resume information in MongoDB
    students_collection.update_one(
        {"_id": student["_id"]},
        {
            "$set": {
                "resume": {
                    "filename": file.filename,
                    "saved_filename": filename,
                    "file_path": file_path,
                    "text": resume_text
                }
            }
        }
    )

    return {
        "message": "Resume uploaded and text extracted successfully",
        "filename": file.filename,
        "text_length": len(resume_text)
    }


# ============================================================
# RESUME AGENT
# ============================================================

async def analyze_resume_with_agent(resume_text: str):
    """
    Send extracted resume text to the Resume Agent
    and return the AI analysis.
    """

    runner = InMemoryRunner(
        agent=resume_agent,
        app_name="placement_ai"
    )

    session = await runner.session_service.create_session(
        app_name="placement_ai",
        user_id="resume_user"
    )

    prompt = f"""
Analyze the following student resume.

RESUME TEXT:
{resume_text}

Return ONLY valid JSON.

The JSON must contain these fields:

{{
    "ats_score": 0,
    "technical_skills": [],
    "education": [],
    "projects": [],
    "experience": [],
    "certifications": [],
    "leadership_activities": [],
    "strengths": [],
    "weaknesses": [],
    "missing_keywords": [],
    "suggestions": []
}}

Do not add Markdown.
Do not add ```json.
Do not add explanations outside the JSON.
Do not invent information.
"""

    content = types.Content(
        role="user",
        parts=[
            types.Part(text=prompt)
        ]
    )

    final_response = None

    async for event in runner.run_async(
        user_id="resume_user",
        session_id=session.id,
        new_message=content
    ):
        if event.is_final_response():
            if event.content and event.content.parts:
                final_response = event.content.parts[0].text

    if not final_response:
        raise Exception(
            "Resume Agent did not return a response"
        )

    # Remove Markdown code fences if Gemini adds them
    final_response = re.sub(
        r"```json\s*",
        "",
        final_response
    )

    final_response = re.sub(
        r"```\s*$",
        "",
        final_response
    )

    final_response = final_response.strip()

    try:
        analysis = json.loads(final_response)

    except json.JSONDecodeError as e:
        raise Exception(
            f"Resume Agent returned invalid JSON: {str(e)}"
        )

    return analysis


# ============================================================
# RESUME ANALYSIS API
# ============================================================

@router.post("/analyze")
async def analyze_resume(
    student=Depends(get_current_student)
):
    """
    Analyze the student's uploaded resume
    using the Resume Agent.
    """

    resume = student.get("resume")

    # Check whether resume exists
    if not resume:
        raise HTTPException(
            status_code=404,
            detail="No resume uploaded"
        )

    # Get extracted resume text
    resume_text = resume.get("text", "")

    if not resume_text:
        raise HTTPException(
            status_code=400,
            detail="Resume text is not available"
        )

    try:

        # Send resume to Resume Agent
        analysis = await analyze_resume_with_agent(
            resume_text
        )

        # Save AI analysis in MongoDB
        students_collection.update_one(
            {"_id": student["_id"]},
            {
                "$set": {
                    "resume.analysis": analysis
                }
            }
        )

        return {
            "message": "Resume analyzed successfully",
            "analysis": analysis
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Resume analysis failed: {str(e)}"
        )


# ============================================================
# GET RESUME ANALYSIS
# ============================================================

@router.get("/analysis")
async def get_resume_analysis(
    student=Depends(get_current_student)
):
    """
    Get the student's previously generated resume analysis.
    """

    resume = student.get("resume")

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="No resume uploaded"
        )

    analysis = resume.get("analysis")

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Resume has not been analyzed yet"
        )

    return {
        "analysis": analysis
    }