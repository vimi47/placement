from fastapi import APIRouter, Depends, HTTPException
import json

from routes.auth_utils import get_current_student
from agents.roadmap_agent import roadmap_agent
from mongodb import students_collection

from google.adk.runners import InMemoryRunner
from google.genai import types


router = APIRouter(
    prefix="/roadmap",
    tags=["Personalized Roadmap"]
)


async def generate_roadmap_with_agent(
    profile: dict,
    resume_analysis: dict,
    skill_gap_analysis: dict
):
    runner = InMemoryRunner(
        agent=roadmap_agent,
        app_name="placement_ai"
    )

    session = await runner.session_service.create_session(
        app_name="placement_ai",
        user_id="roadmap_user"
    )

    target_role = profile.get("target_role", "")
    target_company = profile.get("target_company", "")
    deadline = profile.get("deadline", "")
    daily_hours = profile.get("daily_hours", "")

    prompt = f"""
Create a personalized placement preparation roadmap
for the following student.

STUDENT PROFILE:
{json.dumps(profile, indent=2)}

RESUME ANALYSIS:
{json.dumps(resume_analysis, indent=2)}

SKILL GAP ANALYSIS:
{json.dumps(skill_gap_analysis, indent=2)}

IMPORTANT STUDENT INFORMATION:

TARGET ROLE:
{target_role}

TARGET COMPANY:
{target_company}

DEADLINE:
{deadline}

DAILY AVAILABLE HOURS:
{daily_hours}

Create a realistic roadmap based on all the information above.

Critical skill gaps should receive the highest priority.

The roadmap should balance:
- Learning
- Coding practice
- Aptitude
- Core CS preparation
- Assessments
- Technical interviews
- HR interviews

Return ONLY valid JSON using exactly this structure:

{{
    "target_role": "",
    "target_company": "",
    "duration_days": 0,
    "daily_hours": 0,
    "overall_strategy": "",
    "phases": [
        {{
            "phase": "",
            "priority": "",
            "duration_days": 0,
            "objective": "",
            "topics": [],
            "tasks": [],
            "expected_outcome": ""
        }}
    ],
    "daily_plan": [
        {{
            "day": 1,
            "focus": "",
            "tasks": [],
            "estimated_hours": 0,
            "priority": ""
        }}
    ]
}}

Rules:

- Return ONLY JSON.
- Do not use Markdown.
- Do not invent student skills.
- Respect the student's available daily hours.
- Prioritize the largest skill gaps.
- Keep the workload realistic.
- Use High, Medium, or Low for priority.
"""


    content = types.Content(
        role="user",
        parts=[
            types.Part(text=prompt)
        ]
    )

    final_response = None

    async for event in runner.run_async(
        user_id="roadmap_user",
        session_id=session.id,
        new_message=content
    ):
        if event.is_final_response():
            final_response = event.content.parts[0].text

    if not final_response:
        raise Exception("Roadmap agent returned no response")

    final_response = final_response.strip()

    # Remove Markdown JSON fences if the model adds them
    if final_response.startswith("```json"):
        final_response = final_response[7:]

    if final_response.startswith("```"):
        final_response = final_response[3:]

    if final_response.endswith("```"):
        final_response = final_response[:-3]

    final_response = final_response.strip()

    return json.loads(final_response)


@router.post("/generate")
async def generate_roadmap(
    student=Depends(get_current_student)
):
    profile = student.get("profile", {})

    target_role = profile.get(
        "target_role",
        ""
    ).strip()

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

        result = await generate_roadmap_with_agent(
            profile=profile,
            resume_analysis=resume_analysis,
            skill_gap_analysis=skill_gap_analysis
        )

        # Save the roadmap
        students_collection.update_one(
            {"_id": student["_id"]},
            {
                "$set": {
                    "roadmap": result,

                    # Save the profile information
                    # used to generate this roadmap
                    "roadmap_input_snapshot": {
                        "target_role": profile.get(
                            "target_role",
                            ""
                        ),
                        "target_company": profile.get(
                            "target_company",
                            ""
                        ),
                        "deadline": profile.get(
                            "deadline",
                            ""
                        ),
                        "daily_hours": profile.get(
                            "daily_hours",
                            ""
                        ),
                        "skills": profile.get(
                            "skills",
                            ""
                        ),
                        "programming_languages": profile.get(
                            "programming_languages",
                            ""
                        )
                    }
                }
            }
        )

        return result

    except Exception as e:

        print(
            "Roadmap Generation Error:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get("")
def get_roadmap(
    student=Depends(get_current_student)
):
    roadmap = student.get("roadmap")

    if not roadmap:
        raise HTTPException(
            status_code=404,
            detail="Personalized roadmap not found."
        )

    profile = student.get("profile", {})
    snapshot = student.get("roadmap_input_snapshot", {})

    # Check whether important profile information
    # has changed after the roadmap was generated.
    fields_to_check = [
        "target_role",
        "target_company",
        "deadline",
        "daily_hours",
        "skills",
        "programming_languages"
    ]

    roadmap_outdated = False

    for field in fields_to_check:

        current_value = profile.get(field, "")
        roadmap_value = snapshot.get(field, "")

        if str(current_value).strip() != str(roadmap_value).strip():
            roadmap_outdated = True
            break

    if roadmap_outdated:
        return {
            "roadmap_outdated": True,
            "message": "Your profile has changed. Please regenerate your personalized roadmap.",
            "roadmap": roadmap
        }

    return {
        "roadmap_outdated": False,
        "roadmap": roadmap
    }