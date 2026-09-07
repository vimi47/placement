// Central type definitions for the PLACEMENT AI platform

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: string;
  branch: string;
  year: string;
  cgpa: number;
  university: string;
  phone?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  target_role: string;
  target_companies: string[];
  created_at: string;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  token_type: string;
  student_id: string;
  name: string;
  email: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  branch: string;
  year: string;
  university: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// Resume / ATS
export interface ATSResult {
  overall_score: number;
  sections: {
    name: string;
    score: number;
    feedback: string;
    keywords_found: string[];
    keywords_missing: string[];
  }[];
  suggestions: string[];
  parsed_skills: string[];
  uploaded_at: string;
  file_name: string;
}

// Skill Gap
export interface SkillGapItem {
  skill: string;
  category: string;
  current_level: number;
  required_level: number;
  gap: number;
  status: 'critical' | 'moderate' | 'met';
}
export interface SkillGapResult {
  target_role: string;
  skills: SkillGapItem[];
  summary: string;
  recommended_focus: string[];
}

// Roadmap
export interface RoadmapPhase {
  id: string;
  title: string;
  duration_weeks: number;
  status: 'completed' | 'in-progress' | 'upcoming';
  progress: number;
  tasks: RoadmapTask[];
}
export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'todo';
  resource_type: string;
  estimated_hours: number;
}

// Assessments
export interface Assessment {
  id: string;
  title: string;
  type: 'coding' | 'aptitude';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration_minutes: number;
  topics: string[];
  status: 'not-started' | 'in-progress' | 'completed';
  score?: number;
  max_score: number;
  attempted_at?: string;
}
export interface AssessmentResult {
  assessment_id: string;
  score: number;
  max_score: number;
  time_taken_minutes: number;
  breakdown: { topic: string; correct: number; total: number }[];
  submitted_at: string;
}

// Mock Interview
export interface MockInterview {
  id: string;
  type: 'technical' | 'behavioral' | 'hr';
  topic: string;
  status: 'scheduled' | 'completed' | 'not-started';
  scheduled_at?: string;
  score?: number;
  feedback?: string;
  duration_minutes: number;
}
export interface InterviewQuestion {
  id: string;
  question: string;
  type: string;
  difficulty: string;
  user_answer?: string;
  ai_feedback?: string;
  score?: number;
}

// Company Prep
export interface CompanyPrep {
  id: string;
  name: string;
  logo_url?: string;
  industry: string;
  difficulty: 'Service-Based' | 'Product-Based' | 'Startup';
  package_range: string;
  prep_topics: string[];
  previous_questions: string[];
  eligibility: string;
  status: 'not-started' | 'preparing' | 'ready';
  progress: number;
}

// Progress Analytics
export interface ProgressData {
  weekly_activity: { week: string; hours: number; tasks: number }[];
  skill_radar: { skill: string; value: number; target: number }[];
  assessment_trend: { month: string; coding: number; aptitude: number }[];
  milestone_progress: { label: string; value: number; target: number }[];
  overall_readiness: number;
  streak_days: number;
  total_hours: number;
  tasks_completed: number;
}

// AI Coach
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  agent_source?: string;
}
export interface AgentStatus {
  name: string;
  description: string;
  status: 'idle' | 'thinking' | 'done' | 'error';
  icon: string;
}
