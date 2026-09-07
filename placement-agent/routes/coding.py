from fastapi import APIRouter, Depends, HTTPException
import json

from routes.auth_utils import get_current_student
from agents.coding_agent import coding_agent

from google.adk.runners import InMemoryRunner
from google.genai import types


router = APIRouter(
    prefix="/coding",
    tags=["Coding Assessment"]
)


async def generate_coding_assessment_with_agent(
    profile: dict,
    skill_gap_analysis: dict
):

    runner = InMemoryRunner(
        agent=coding_agent,
        app_name="placement_ai"
    )

    student_id = str(profile.get("student_id", "coding_user"))

    session = await runner.session_service.create_session(
        app_name="placement_ai",
        user_id=student_id
    )

    target_role = profile.get(
        "target_role",
        ""
    )

    target_company = profile.get(
        "target_company",
        ""
    )

    programming_languages = profile.get(
        "programming_languages",
        ""
    )

    skills = profile.get(
        "skills",
        ""
    )

    prompt = f"""
Create a company-specific coding assessment
for the following student.

TARGET COMPANY:
{target_company}

TARGET ROLE:
{target_role}

PROGRAMMING LANGUAGES:
{programming_languages}

CURRENT SKILLS:
{skills}

SKILL GAP ANALYSIS:
{json.dumps(skill_gap_analysis, indent=2)}

IMPORTANT REQUIREMENTS:

1. The assessment must be tailored to the target company.

2. The assessment must be relevant to the target role.

3. Use the student's skill gaps to decide which
   coding topics should receive higher priority.

4. Critical skill gaps should receive more attention.

5. Moderate skill gaps should receive medium attention.

6. Generate exactly 5 coding questions.

7. Use a realistic mixture of Easy, Medium and Hard questions.

8. Keep the assessment suitable for placement preparation.

9. Do not claim that any question is an actual
   company interview question.

10. Do not provide solution code.

11. Do not provide the final answer.

12. Return ONLY valid JSON.

Use exactly this structure:

{{
    "assessment_title": "",
    "target_company": "",
    "target_role": "",
    "assessment_strategy": "",
    "total_questions": 5,
    "recommended_duration_minutes": 60,
    "questions": [
        {{
            "question_id": 1,
            "title": "",
            "topic": "",
            "difficulty": "Easy",
            "problem_statement": "",
            "input_format": "",
            "output_format": "",
            "constraints": [],
            "sample_input": "",
            "sample_output": "",
            "explanation": ""
        }}
    ]
}}

Difficulty must be exactly one of:

"Easy"
"Medium"
"Hard"

Make the assessment feel personalized to the
student's target company and target role.
"""

    content = types.Content(
        role="user",
        parts=[
            types.Part(text=prompt)
        ]
    )

    final_response = None

    async for event in runner.run_async(
        user_id=student_id,
        session_id=session.id,
        new_message=content
    ):

        if event.is_final_response():
            final_response = event.content.parts[0].text

    if not final_response:
        raise Exception(
            "Coding assessment agent returned no response"
        )

    final_response = final_response.strip()

    # Remove Markdown code fences if Gemini adds them

    if final_response.startswith("```json"):
        final_response = final_response[7:]

    if final_response.startswith("```"):
        final_response = final_response[3:]

    if final_response.endswith("```"):
        final_response = final_response[:-3]

    final_response = final_response.strip()

    return json.loads(final_response)


@router.post("/generate")
async def generate_coding_assessment(
    student=Depends(get_current_student)
):

    profile = student.get(
        "profile",
        {}
    )

    target_role = profile.get(
        "target_role",
        ""
    ).strip()

    target_company = profile.get(
        "target_company",
        ""
    ).strip()

    if not target_role:
        raise HTTPException(
            status_code=400,
            detail="Please set your target role in your profile first."
        )

    if not target_company:
        raise HTTPException(
            status_code=400,
            detail="Please set your target company in your profile first."
        )

    skill_gap_analysis = student.get(
        "skill_gap_analysis",
        {}
    )

    if not skill_gap_analysis:

        raise HTTPException(
            status_code=400,
            detail="Please generate your skill gap analysis first."
        )

    try:

        profile_for_agent = {
            **profile,
            "student_id": str(student["_id"])
        }

        result = await generate_coding_assessment_with_agent(
        profile=profile_for_agent,
        skill_gap_analysis=skill_gap_analysis
)

        from mongodb import students_collection

        students_collection.update_one(
               {"_id": student["_id"]},
               {
               "$set": {
               "coding_assessment": result,
               "coding_assessment_input_snapshot": {
               "target_role": profile.get("target_role", ""),
               "target_company": profile.get("target_company", ""),
               "programming_languages": profile.get("programming_languages", ""),
               "skills": profile.get("skills", "")
    }
}
               }
)

        return result

    except Exception as e:

        print(
            "Coding Assessment Error:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
@router.get("")
def get_coding_assessment(
    student=Depends(get_current_student)
):
    assessment = student.get("coding_assessment")

    if not assessment:
        raise HTTPException(
            status_code=404,
            detail="Coding assessment not found."
        )

    profile = student.get("profile", {})
    snapshot = student.get(
        "coding_assessment_input_snapshot",
        {}
    )

    fields_to_check = [
        "target_role",
        "target_company",
        "programming_languages",
        "skills"
    ]

    assessment_outdated = False

    for field in fields_to_check:
        current_value = profile.get(field, "")
        assessment_value = snapshot.get(field, "")

        if str(current_value).strip() != str(assessment_value).strip():
            assessment_outdated = True
            break

    if assessment_outdated:
        return {
            "assessment_outdated": True,
            "message": "Your profile has changed. Please regenerate your coding assessment.",
            "assessment": assessment
        }

    return {
        "assessment_outdated": False,
        "assessment": assessment
    }