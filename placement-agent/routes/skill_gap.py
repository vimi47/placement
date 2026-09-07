from fastapi import APIRouter, Depends, HTTPException
import json

from routes.auth_utils import get_current_student
from agents.skill_gap_agent import skill_gap_agent

from google.adk.runners import InMemoryRunner
from google.genai import types


router = APIRouter(
    prefix="/skill-gap",
    tags=["Skill Gap Analysis"]
)


async def analyze_skill_gap_with_agent(
    target_role: str,
    profile: dict,
    resume_analysis: dict
):
    runner = InMemoryRunner(
        agent=skill_gap_agent,
        app_name="placement_ai"
    )

    session = await runner.session_service.create_session(
        app_name="placement_ai",
        user_id="skill_gap_user"
    )

    prompt = f"""
Analyze the following student's skill gap.

TARGET ROLE:
{target_role}

STUDENT PROFILE:
{json.dumps(profile, indent=2)}

RESUME ANALYSIS:
{json.dumps(resume_analysis, indent=2)}

Return ONLY valid JSON using exactly this structure:

{{
    "target_role": "",
    "summary": "",
    "recommended_focus": [],
    "skills": [
        {{
            "skill": "",
            "category": "",
            "current_level": 0,
            "required_level": 0,
            "gap": 0,
            "status": "critical"
        }}
    ]
}}
"""

    content = types.Content(
        role="user",
        parts=[
            types.Part(text=prompt)
        ]
    )

    final_response = None

    async for event in runner.run_async(
        user_id="skill_gap_user",
        session_id=session.id,
        new_message=content
    ):
        if event.is_final_response():
            final_response = event.content.parts[0].text

    if not final_response:
        raise Exception("Skill gap agent returned no response")

    final_response = final_response.strip()

    if final_response.startswith("```json"):
        final_response = final_response[7:]

    if final_response.startswith("```"):
        final_response = final_response[3:]

    if final_response.endswith("```"):
        final_response = final_response[:-3]

    final_response = final_response.strip()

    return json.loads(final_response)


@router.post("/analyze")
async def analyze_skill_gap(
    student=Depends(get_current_student)
):
    profile = student.get("profile", {})

    target_role = profile.get("target_role", "").strip()

    if not target_role:
        raise HTTPException(
            status_code=400,
            detail="Please set your target role in your profile first."
        )

    resume_analysis = student.get(
        "resume",
        {}
    ).get(
        "analysis",
        {}
    )

    if not resume_analysis:
        raise HTTPException(
            status_code=400,
            detail="Please upload and analyze your resume first."
        )

    try:
        result = await analyze_skill_gap_with_agent(
            target_role=target_role,
            profile=profile,
            resume_analysis=resume_analysis
        )

        from mongodb import students_collection

        students_collection.update_one(
            {"_id": student["_id"]},
            {
             "$set": {
            "skill_gap_analysis": result
        }
        }
)

        return result

    except Exception as e:
        print("Skill Gap Error:", repr(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/analysis")
def get_skill_gap_analysis(
    student=Depends(get_current_student)
):
    analysis = student.get(
        "skill_gap_analysis"
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Skill gap analysis not found."
        )

    return analysis