import type {
  User,
  ATSResult,
  SkillGapResult,
  RoadmapPhase,
  Assessment,
  MockInterview,
  CompanyPrep,
  ProgressData,
  ChatMessage,
  AgentStatus,
} from '@/types';

export const demoUser: User = {
  id: 'usr_001',
  name: 'Arjun Sharma',
  email: 'arjun.sharma@vit.ac.in',
  role: 'Student',
  branch: 'Computer Science & Engineering',
  year: 'Final Year (B.Tech)',
  cgpa: 8.42,
  university: 'Vellore Institute of Technology',
  phone: '+91 98765 43210',
  linkedin_url: 'https://linkedin.com/in/arjunsharma',
  github_url: 'https://github.com/arjunsharma',
  portfolio_url: 'https://arjunsharma.dev',
  target_role: 'Software Engineer (Backend)',
  target_companies: ['Google', 'Amazon', 'Microsoft', 'Atlassian', 'Swiggy'],
  created_at: '2025-08-15T10:00:00Z',
};

export const demoATSResult: ATSResult = {
  overall_score: 72,
  sections: [
    {
      name: 'Contact & Header',
      score: 95,
      feedback: 'All required contact fields present. Consider adding a portfolio link.',
      keywords_found: ['email', 'phone', 'location'],
      keywords_missing: ['portfolio'],
    },
    {
      name: 'Summary',
      score: 68,
      feedback: 'Summary is generic. Tailor it to highlight backend engineering strengths and quantifiable impact.',
      keywords_found: ['software', 'developer', 'java'],
      keywords_missing: ['scalable', 'microservices', 'distributed systems'],
    },
    {
      name: 'Experience',
      score: 75,
      feedback: 'Good project descriptions. Add more quantifiable metrics (e.g., "reduced latency by 40%").',
      keywords_found: ['REST API', 'Node.js', 'PostgreSQL', 'Docker'],
      keywords_missing: ['Kubernetes', 'CI/CD', 'system design'],
    },
    {
      name: 'Skills',
      score: 80,
      feedback: 'Strong technical skills listed. Add cloud platform experience (AWS/GCP).',
      keywords_found: ['Java', 'Python', 'React', 'SQL', 'Git'],
      keywords_missing: ['AWS', 'Redis', 'Kafka', 'GraphQL'],
    },
    {
      name: 'Education',
      score: 90,
      feedback: 'Education section is well-formatted with CGPA included.',
      keywords_found: ['B.Tech', 'CGPA', 'Computer Science'],
      keywords_missing: [],
    },
    {
      name: 'Projects',
      score: 65,
      feedback: 'Projects lack technical depth. Mention architecture decisions and tech stack details.',
      keywords_found: ['e-commerce', 'chat app'],
      keywords_missing: ['load testing', 'architecture', 'performance optimization'],
    },
  ],
  suggestions: [
    'Add quantifiable achievements: "Improved API response time by 35% through query optimization"',
    'Include a "System Design" section highlighting distributed systems knowledge',
    'Add AWS/GCP certifications or cloud project experience',
    'Tailor keywords to match target job descriptions (ATS optimization)',
    'Add GitHub contribution graph and open-source project links',
  ],
  parsed_skills: ['Java', 'Python', 'JavaScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'Git', 'REST API', 'MongoDB'],
  uploaded_at: '2025-09-01T14:30:00Z',
  file_name: 'Arjun_Sharma_Resume.pdf',
};

export const demoSkillGap: SkillGapResult = {
  target_role: 'Software Engineer (Backend)',
  summary: 'You have a solid foundation in backend development. Focus on distributed systems, cloud infrastructure, and system design to reach your target role readiness.',
  recommended_focus: ['System Design', 'AWS Cloud Services', 'Distributed Systems', 'Kafka/Message Queues'],
  skills: [
    { skill: 'Data Structures & Algorithms', category: 'Core CS', current_level: 85, required_level: 90, gap: 5, status: 'met' },
    { skill: 'System Design', category: 'Architecture', current_level: 45, required_level: 85, gap: 40, status: 'critical' },
    { skill: 'Database Design', category: 'Backend', current_level: 70, required_level: 85, gap: 15, status: 'moderate' },
    { skill: 'Cloud (AWS/GCP)', category: 'Infrastructure', current_level: 30, required_level: 75, gap: 45, status: 'critical' },
    { skill: 'Microservices', category: 'Architecture', current_level: 40, required_level: 80, gap: 40, status: 'critical' },
    { skill: 'Message Queues (Kafka)', category: 'Infrastructure', current_level: 20, required_level: 65, gap: 45, status: 'critical' },
    { skill: 'Python/Java Proficiency', category: 'Programming', current_level: 80, required_level: 85, gap: 5, status: 'met' },
    { skill: 'REST API Design', category: 'Backend', current_level: 75, required_level: 85, gap: 10, status: 'moderate' },
    { skill: 'CI/CD Pipelines', category: 'DevOps', current_level: 35, required_level: 70, gap: 35, status: 'critical' },
    { skill: 'Testing & TDD', category: 'Quality', current_level: 55, required_level: 75, gap: 20, status: 'moderate' },
    { skill: 'Git & Version Control', category: 'Tools', current_level: 85, required_level: 85, gap: 0, status: 'met' },
    { skill: 'Docker & Containers', category: 'DevOps', current_level: 60, required_level: 80, gap: 20, status: 'moderate' },
  ],
};

export const demoRoadmap: RoadmapPhase[] = [
  {
    id: 'phase_1',
    title: 'Foundation Strengthening',
    duration_weeks: 3,
    status: 'completed',
    progress: 100,
    tasks: [
      { id: 't1', title: 'Revise DSA Fundamentals', description: 'Arrays, Linked Lists, Stacks, Queues — solve 50 problems', status: 'completed', resource_type: 'practice', estimated_hours: 20 },
      { id: 't2', title: 'SQL & Database Basics', description: 'Joins, indexing, normalization, query optimization', status: 'completed', resource_type: 'course', estimated_hours: 15 },
      { id: 't3', title: 'OOP Concepts in Java', description: 'Inheritance, polymorphism, design patterns basics', status: 'completed', resource_type: 'course', estimated_hours: 10 },
    ],
  },
  {
    id: 'phase_2',
    title: 'Backend & API Mastery',
    duration_weeks: 4,
    status: 'in-progress',
    progress: 65,
    tasks: [
      { id: 't4', title: 'Advanced REST API Design', description: 'Idempotency, pagination, versioning, rate limiting', status: 'completed', resource_type: 'course', estimated_hours: 12 },
      { id: 't5', title: 'Build a Microservice', description: 'Create a production-grade microservice with Docker', status: 'in-progress', resource_type: 'project', estimated_hours: 25 },
      { id: 't6', title: 'Database Scaling Strategies', description: 'Sharding, replication, caching with Redis', status: 'todo', resource_type: 'course', estimated_hours: 15 },
      { id: 't7', title: 'Message Queue Integration', description: 'Implement Kafka producer/consumer patterns', status: 'todo', resource_type: 'project', estimated_hours: 18 },
    ],
  },
  {
    id: 'phase_3',
    title: 'System Design & Architecture',
    duration_weeks: 4,
    status: 'upcoming',
    progress: 0,
    tasks: [
      { id: 't8', title: 'Scalability Fundamentals', description: 'Load balancing, caching layers, CDN strategies', status: 'todo', resource_type: 'course', estimated_hours: 15 },
      { id: 't9', title: 'Design a URL Shortener', description: 'End-to-end system design with trade-off analysis', status: 'todo', resource_type: 'project', estimated_hours: 10 },
      { id: 't10', title: 'Design a Chat System', description: 'WebSocket, real-time messaging, presence', status: 'todo', resource_type: 'project', estimated_hours: 12 },
      { id: 't11', title: 'Design a Rate Limiter', description: 'Token bucket, sliding window, distributed limiter', status: 'todo', resource_type: 'project', estimated_hours: 8 },
    ],
  },
  {
    id: 'phase_4',
    title: 'Cloud & DevOps',
    duration_weeks: 3,
    status: 'upcoming',
    progress: 0,
    tasks: [
      { id: 't12', title: 'AWS Fundamentals', description: 'EC2, S3, RDS, IAM, VPC basics', status: 'todo', resource_type: 'certification', estimated_hours: 20 },
      { id: 't13', title: 'CI/CD with GitHub Actions', description: 'Build, test, deploy pipeline for a microservice', status: 'todo', resource_type: 'project', estimated_hours: 15 },
      { id: 't14', title: 'Kubernetes Basics', description: 'Pods, services, deployments, ingress', status: 'todo', resource_type: 'course', estimated_hours: 18 },
    ],
  },
  {
    id: 'phase_5',
    title: 'Interview Preparation',
    duration_weeks: 3,
    status: 'upcoming',
    progress: 0,
    tasks: [
      { id: 't15', title: 'Mock Technical Interviews', description: 'Complete 10 mock interviews with AI feedback', status: 'todo', resource_type: 'practice', estimated_hours: 15 },
      { id: 't16', title: 'Behavioral Interview Prep', description: 'STAR method, common behavioral questions', status: 'todo', resource_type: 'practice', estimated_hours: 8 },
      { id: 't17', title: 'Company-Specific Prep', description: 'Research target companies, practice their questions', status: 'todo', resource_type: 'practice', estimated_hours: 12 },
    ],
  },
];

export const demoCodingAssessments: Assessment[] = [
  { id: 'ca1', title: 'Array Manipulation Challenge', type: 'coding', difficulty: 'Easy', duration_minutes: 30, topics: ['Arrays', 'Two Pointers'], status: 'completed', score: 85, max_score: 100, attempted_at: '2025-08-28T10:00:00Z' },
  { id: 'ca2', title: 'Tree Traversal & BST Operations', type: 'coding', difficulty: 'Medium', duration_minutes: 45, topics: ['Trees', 'BST', 'Recursion'], status: 'completed', score: 72, max_score: 100, attempted_at: '2025-08-30T14:00:00Z' },
  { id: 'ca3', title: 'Dynamic Programming Fundamentals', type: 'coding', difficulty: 'Hard', duration_minutes: 60, topics: ['DP', 'Memoization', 'Tabulation'], status: 'in-progress', max_score: 100 },
  { id: 'ca4', title: 'Graph Algorithms', type: 'coding', difficulty: 'Hard', duration_minutes: 60, topics: ['BFS', 'DFS', 'Shortest Path'], status: 'not-started', max_score: 100 },
  { id: 'ca5', title: 'String Processing & Pattern Matching', type: 'coding', difficulty: 'Medium', duration_minutes: 40, topics: ['Strings', 'KMP', 'Rabin-Karp'], status: 'not-started', max_score: 100 },
  { id: 'ca6', title: 'Linked List Operations', type: 'coding', difficulty: 'Easy', duration_minutes: 25, topics: ['Linked Lists', 'Pointers'], status: 'not-started', max_score: 100 },
];

export const demoAptitudeAssessments: Assessment[] = [
  { id: 'ap1', title: 'Quantitative Aptitude — Basic', type: 'aptitude', difficulty: 'Easy', duration_minutes: 20, topics: ['Percentages', 'Profit & Loss', 'Ratio'], status: 'completed', score: 90, max_score: 100, attempted_at: '2025-08-20T09:00:00Z' },
  { id: 'ap2', title: 'Logical Reasoning — Patterns', type: 'aptitude', difficulty: 'Medium', duration_minutes: 30, topics: ['Series', 'Analogies', 'Blood Relations'], status: 'completed', score: 78, max_score: 100, attempted_at: '2025-08-25T11:00:00Z' },
  { id: 'ap3', title: 'Verbal Ability — Comprehension', type: 'aptitude', difficulty: 'Medium', duration_minutes: 35, topics: ['Reading Comprehension', 'Grammar', 'Vocabulary'], status: 'in-progress', max_score: 100 },
  { id: 'ap4', title: 'Data Interpretation', type: 'aptitude', difficulty: 'Hard', duration_minutes: 40, topics: ['Charts', 'Tables', 'Graphs'], status: 'not-started', max_score: 100 },
  { id: 'ap5', title: 'Quantitative Aptitude — Advanced', type: 'aptitude', difficulty: 'Hard', duration_minutes: 45, topics: ['Probability', 'Permutations', 'Geometry'], status: 'not-started', max_score: 100 },
];

export const demoInterviews: MockInterview[] = [
  { id: 'iv1', type: 'technical', topic: 'Data Structures & Algorithms', status: 'completed', score: 82, feedback: 'Strong problem-solving approach. Improve time complexity analysis for tree problems.', duration_minutes: 45, scheduled_at: '2025-08-22T15:00:00Z' },
  { id: 'iv2', type: 'technical', topic: 'System Design Basics', status: 'completed', score: 65, feedback: 'Good high-level design. Need more depth on scalability and trade-off discussions.', duration_minutes: 60, scheduled_at: '2025-08-27T16:00:00Z' },
  { id: 'iv3', type: 'behavioral', topic: 'Leadership & Teamwork', status: 'completed', score: 88, feedback: 'Excellent use of STAR method. Clear, structured answers with good examples.', duration_minutes: 30, scheduled_at: '2025-08-29T14:00:00Z' },
  { id: 'iv4', type: 'technical', topic: 'Backend Engineering', status: 'scheduled', duration_minutes: 50, scheduled_at: '2025-09-06T15:00:00Z' },
  { id: 'iv5', type: 'hr', topic: 'HR Round — Common Questions', status: 'not-started', duration_minutes: 25 },
  { id: 'iv6', type: 'technical', topic: 'Database & SQL Deep Dive', status: 'not-started', duration_minutes: 40 },
];

export const demoCompanies: CompanyPrep[] = [
  { id: 'co1', name: 'Google', industry: 'Technology', difficulty: 'Product-Based', package_range: '₹26-40 LPA', prep_topics: ['System Design', 'DSA (Hard)', 'Googliness', 'Leadership'], previous_questions: ['Design YouTube', 'Find the kth largest element', 'Tell me about a time you led a project'], eligibility: 'CGPA 7.5+, No active backlogs', status: 'preparing', progress: 35 },
  { id: 'co2', name: 'Amazon', industry: 'E-Commerce / Cloud', difficulty: 'Product-Based', package_range: '₹22-36 LPA', prep_topics: ['Leadership Principles', 'DSA', 'System Design', 'OOD'], previous_questions: ['Design a parking lot', 'LRU Cache implementation', 'Behavioral: Customer obsession example'], eligibility: 'CGPA 7.0+, No active backlogs', status: 'preparing', progress: 50 },
  { id: 'co3', name: 'Microsoft', industry: 'Technology', difficulty: 'Product-Based', package_range: '₹20-35 LPA', prep_topics: ['DSA', 'System Design', 'OS Fundamentals', 'Behavioral'], previous_questions: ['Design a chat application', 'Reverse linked list in groups', 'Explain a challenging bug you fixed'], eligibility: 'CGPA 7.5+, No active backlogs', status: 'not-started', progress: 0 },
  { id: 'co4', name: 'Atlassian', industry: 'SaaS / Collaboration', difficulty: 'Product-Based', package_range: '₹24-38 LPA', prep_topics: ['System Design', 'Behavioral', 'Java/Python', 'Cloud'], previous_questions: ['Design Jira', 'Implement a rate limiter', 'How do you handle conflicts?'], eligibility: 'CGPA 7.0+', status: 'not-started', progress: 0 },
  { id: 'co5', name: 'Swiggy', industry: 'Food Tech', difficulty: 'Startup', package_range: '₹16-28 LPA', prep_topics: ['DSA', 'System Design', 'Backend', 'DBMS'], previous_questions: ['Design a food delivery system', 'Nearest restaurant finder', 'Explain ACID properties'], eligibility: 'CGPA 7.0+', status: 'not-started', progress: 0 },
  { id: 'co6', name: 'TCS Digital', industry: 'IT Services', difficulty: 'Service-Based', package_range: '₹7-9 LPA', prep_topics: ['Aptitude', 'Basic DSA', 'SQL', 'Communication'], previous_questions: ['Reverse a string', 'SQL joins explanation', 'Why TCS?'], eligibility: 'CGPA 6.5+, No backlogs', status: 'ready', progress: 80 },
];

export const demoProgress: ProgressData = {
  overall_readiness: 68,
  streak_days: 12,
  total_hours: 147,
  tasks_completed: 23,
  weekly_activity: [
    { week: 'W1', hours: 8, tasks: 3 },
    { week: 'W2', hours: 12, tasks: 5 },
    { week: 'W3', hours: 15, tasks: 4 },
    { week: 'W4', hours: 10, tasks: 6 },
    { week: 'W5', hours: 18, tasks: 5 },
    { week: 'W6', hours: 14, tasks: 4 },
    { week: 'W7', hours: 20, tasks: 7 },
    { week: 'W8', hours: 16, tasks: 5 },
  ],
  skill_radar: [
    { skill: 'DSA', value: 85, target: 90 },
    { skill: 'System Design', value: 45, target: 85 },
    { skill: 'DBMS', value: 70, target: 85 },
    { skill: 'Cloud', value: 30, target: 75 },
    { skill: 'Aptitude', value: 80, target: 85 },
    { skill: 'Projects', value: 65, target: 80 },
  ],
  assessment_trend: [
    { month: 'Jun', coding: 60, aptitude: 70 },
    { month: 'Jul', coding: 68, aptitude: 75 },
    { month: 'Aug', coding: 75, aptitude: 82 },
    { month: 'Sep', coding: 80, aptitude: 85 },
  ],
  milestone_progress: [
    { label: 'DSA Mastery', value: 85, target: 90 },
    { label: 'System Design', value: 45, target: 85 },
    { label: 'Cloud Skills', value: 30, target: 75 },
    { label: 'Interview Prep', value: 55, target: 80 },
    { label: 'Projects', value: 65, target: 80 },
  ],
};

export const demoChatMessages: ChatMessage[] = [
  { id: 'm1', role: 'assistant', content: "Hi Arjun! I'm your AI Career Coach. I've analyzed your profile and progress. You're at 68% overall placement readiness. Your DSA and aptitude scores are strong, but system design and cloud skills need attention. What would you like to focus on today?", timestamp: '2025-09-04T10:00:00Z', agent_source: 'Planning Agent' },
  { id: 'm2', role: 'user', content: "I have an Amazon interview in 3 weeks. What should I prioritize?", timestamp: '2025-09-04T10:02:00Z' },
  { id: 'm3', role: 'assistant', content: "Great question! For Amazon specifically, I recommend focusing on these areas:\n\n1. **Leadership Principles** — Amazon heavily weights their 16 LPs. Prepare 2 stories per principle using the STAR method.\n2. **System Design** — You're at 45% readiness here. Focus on scalability, caching, and distributed systems. I've added 3 system design tasks to your roadmap.\n3. **DSA (Medium-Hard)** — Practice LRU Cache, trees, and graph problems. Amazon loves these.\n4. **OOD** — Brush up on object-oriented design patterns.\n\nI've updated your roadmap Phase 5 with Amazon-specific tasks. Want me to schedule a mock interview?", timestamp: '2025-09-04T10:03:00Z', agent_source: 'Interview Agent' },
];

export const demoAgents: AgentStatus[] = [
  { name: 'Resume Agent', description: 'Analyzes and optimizes your resume for ATS', status: 'done', icon: 'FileText' },
  { name: 'Skill Gap Agent', description: 'Identifies skill gaps vs. target roles', status: 'done', icon: 'Target' },
  { name: 'Interview Agent', description: 'Conducts mock interviews with AI feedback', status: 'thinking', icon: 'MessageSquare' },
  { name: 'Planning Agent', description: 'Creates personalized roadmaps and adapts plans', status: 'idle', icon: 'Map' },
];
