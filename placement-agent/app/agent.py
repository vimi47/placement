# ruff: noqa
# Copyright 2026 Google LLC
#
# Licensed under the Apache License, Version 2.0

from google.adk.agents import Agent
from google.adk.apps import App
from google.adk.models import Gemini
from google.genai import types

from mongodb import students_collection


MODEL = "gemini-3.6-flash"


def save_student_profile(
    target_role: str,
    target_company: str,
    year_and_branch: str,
    programming_languages: str,
    skills: str,
    deadline: str,
    daily_hours: str,
    strengths: str,
    weaknesses: str,
) -> str:
    """Save the student's placement profile permanently in MongoDB."""

    profile = {
        "target_role": target_role,
        "target_company": target_company,
        "year_and_branch": year_and_branch,
        "programming_languages": programming_languages,
        "skills": skills,
        "deadline": deadline,
        "daily_hours": daily_hours,
        "strengths": strengths,
        "weaknesses": weaknesses,
    }

    try:
        result = students_collection.insert_one(profile)

        return (
            "Student profile saved successfully in MongoDB!\n"
            f"Profile ID: {result.inserted_id}\n\n"
            f"Target Role: {target_role}\n"
            f"Target Company: {target_company}\n"
            f"Year & Branch: {year_and_branch}\n"
            f"Programming Languages: {programming_languages}\n"
            f"Skills: {skills}\n"
            f"Deadline: {deadline}\n"
            f"Daily Preparation Time: {daily_hours}\n"
            f"Strengths: {strengths}\n"
            f"Weaknesses: {weaknesses}"
        )

    except Exception as e:
        return f"Failed to save student profile: {str(e)}"


root_agent = Agent(
    name="placement_agent",

    model=Gemini(
        model=MODEL,
        retry_options=types.HttpRetryOptions(attempts=3),
    ),

    instruction="""
You are the Placement Preparation Agent in a Multi-Agent Placement Preparation Platform.

Your purpose is to help college students prepare for technical and placement interviews.

Your responsibilities include:

1. Understand the student's placement goal.
2. Collect important student profile information.
3. Identify strengths and weaknesses.
4. Help students prepare for their target role and company.
5. Suggest technical topics and preparation strategies.
6. Provide placement and interview guidance.
7. Create personalized preparation strategies.
8. Adapt recommendations according to the student's skills, deadline,
   available study time, and weaknesses.

Important student information includes:

- Target role
- Target company
- Year and branch
- Programming languages
- Current technical skills
- Preparation deadline
- Daily available preparation time
- Strengths
- Weaknesses

When the student provides these details, use the
save_student_profile tool to save their profile.

Do not ask for information that the student has already provided.

After saving the profile, confirm that the profile was saved
and briefly summarize the important details.

Be beginner-friendly, clear, practical, and concise.

Specialized agents such as Resume Review Agent,
Interview Intelligence Agent, Skill Gap Agent, Planning Agent,
Recommendation Agent, Assessment Agent, Mock Interview Agent,
Progress Agent, and Adaptive Replanning Agent will be added later.
""",

    tools=[save_student_profile],
)


app = App(
    root_agent=root_agent,
    name="app",
)