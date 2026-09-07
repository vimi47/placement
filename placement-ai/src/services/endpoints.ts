import api from './api';
import type {
  AuthResponse,
  RegisterPayload,
  LoginPayload,
  User,
  ATSResult,
  SkillGapResult,
  RoadmapPhase,
  Assessment,
  AssessmentResult,
  MockInterview,
  CompanyPrep,
  ProgressData,
  ChatMessage,
} from '@/types';

// ---- Auth ----
export const authService = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', payload);
    return data;
  },
  getProfile: async () => {
  const response = await api.get('/student/profile');
  return response.data;
   },
  updateProfile: async (payload: {
  name: string;
  target_role: string;
  target_company: string;
  year_and_branch: string;
  programming_languages: string;
  skills: string;
  deadline: string;
  daily_hours: string;
  strengths: string;
  weaknesses: string;
}) => {
  const { data } = await api.put('/student/profile', payload);
  return data;
},
  logout: () => {
    localStorage.removeItem('placement_ai_token');
    localStorage.removeItem('placement_ai_user');
  },
};

// ---- Resume / ATS ----
export const resumeService = {
  upload: async (file: File) => {
    const formData = new FormData();

    formData.append('file', file);

    const { data } = await api.post(
      '/resume/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return data;
  },

  analyze: async () => {
    const { data } = await api.post('/resume/analyze');
    return data;
  },

  getAnalysis: async () => {
    const { data } = await api.get('/resume/analysis');
    return data;
  },
};
// ---- Skill Gap ----
export const skillGapService = {
  analyze: async () => {
    const { data } = await api.post('/skill-gap/analyze');
    return data;
  },

  getAnalysis: async () => {
    const { data } = await api.get('/skill-gap/analysis');
    return data;
  },
};

// ---- Roadmap ----
export const roadmapService = {
  generate: async () => {
    const { data } = await api.post('/roadmap/generate');
    return data;
  },

  getRoadmap: async () => {
    const { data } = await api.get('/roadmap');
    return data;
  },
};

// ---- Assessments ----
export const codingService = {
  generate: async () => {
    const { data } = await api.post('/coding/generate');
    return data;
  },

  getAssessment: async () => {
    const { data } = await api.get('/coding');
    return data;
  },
};

// ---- Mock Interviews ----
export const interviewService = {
  list: async (): Promise<MockInterview[]> => {
    const { data } = await api.get('/interviews');
    return data;
  },
  start: async (id: string): Promise<{ questions: any[] }> => {
    const { data } = await api.post(`/interviews/${id}/start`);
    return data;
  },
  submitAnswer: async (interviewId: string, questionId: string, answer: string): Promise<void> => {
    await api.post(`/interviews/${interviewId}/answer`, { question_id: questionId, answer });
  },
};

// ---- Company Prep ----
export const companyService = {
  list: async (): Promise<CompanyPrep[]> => {
    const { data } = await api.get('/companies');
    return data;
  },
  get: async (id: string): Promise<CompanyPrep> => {
    const { data } = await api.get(`/companies/${id}`);
    return data;
  },
};

// ---- Progress ----
export const progressService = {
  get: async (): Promise<ProgressData> => {
    const { data } = await api.get('/progress');
    return data;
  },
};

// ---- AI Coach ----
export const coachService = {
  chat: async (message: string, history: ChatMessage[]): Promise<ChatMessage> => {
    const { data } = await api.post('/coach/chat', { message, history });
    return data;
  },
  getAgents: async (): Promise<any[]> => {
    const { data } = await api.get('/coach/agents');
    return data;
  },
};

// ---- Settings ----
export const settingsService = {
  updateProfile: async (payload: Partial<User>): Promise<User> => {
    const { data } = await api.put('/student/profile', payload);
    return data;
  },
  changePassword: async (current: string, next: string): Promise<void> => {
    await api.post('/auth/change-password', { current_password: current, new_password: next });
  },
};
