import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  TrendingUp, Target, Clock, CheckCircle2, Bot, FileText, Code2, Brain,
  ArrowRight, Flame, Zap, Calendar, Video,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  RadialBarChart, RadialBar, PolarAngleAxis,
} from 'recharts';
import { ProgressRing, StatCard } from '@/components/ui';
import { demoProgress, demoUser, demoAgents, demoRoadmap, demoInterviews } from '@/data/demoData';

export function DashboardPage() {
  const { user } = useAuth();
  const activePhase = demoRoadmap.find((p) => p.status === 'in-progress');
  const upcomingInterview = demoInterviews.find((i) => i.status === 'scheduled');
  const completedInterviews = demoInterviews.filter((i) => i.status === 'completed');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-6 lg:p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent-400/20 blur-3xl -translate-y-1/3 translate-x-1/4" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge bg-white/10 text-white backdrop-blur-sm">
                <Flame className="w-3.5 h-3.5 text-accent-300" />
                {demoProgress.streak_days} day streak
              </span>
              <span className="badge bg-white/10 text-white backdrop-blur-sm">
                <Zap className="w-3.5 h-3.5 text-warning-300" />
                {demoProgress.total_hours} hrs logged
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display">
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
            </h1>
            <p className="text-white/70 mt-1.5 max-w-lg">
              You're at <span className="font-semibold text-white">{demoProgress.overall_readiness}%</span> placement readiness.
              Keep going — you're on track for your target role as {user?.target_role || 'your target role'}.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ProgressRing
              value={demoProgress.overall_readiness}
              label={`${demoProgress.overall_readiness}%`}
              sublabel="Readiness"
              size={110}
              color="#1ce8c0"
              trackColor="rgba(255,255,255,0.15)"
            />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Target className="w-5 h-5" />} label="Overall Readiness" value={`${demoProgress.overall_readiness}%`} subtext="+5% this week" trend={{ value: '5%', positive: true }} />
        <StatCard icon={<CheckCircle2 className="w-5 h-5" />} label="Tasks Completed" value={demoProgress.tasks_completed} subtext="of 35 total tasks" color="text-success-600" />
        <StatCard icon={<Clock className="w-5 h-5" />} label="Hours Logged" value={demoProgress.total_hours} subtext="across 8 weeks" color="text-warning-600" />
        <StatCard icon={<Video className="w-5 h-5" />} label="Mock Interviews" value={completedInterviews.length} subtext="3 completed" color="text-accent-600" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity chart */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">Weekly Activity</h3>
              <p className="text-sm text-ink-400 mt-0.5">Hours spent and tasks completed</p>
            </div>
            <Link to="/progress" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View analytics <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={demoProgress.weekly_activity}>
              <defs>
                <linearGradient id="gradHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2f5fff" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#2f5fff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#8593aa' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#8593aa' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #eceef2', fontSize: 13, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                cursor={{ stroke: '#d5dae3', strokeWidth: 1 }}
              />
              <Area type="monotone" dataKey="hours" stroke="#2f5fff" strokeWidth={2.5} fill="url(#gradHours)" name="Hours" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Agents status */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">AI Agent Status</h3>
            <Link to="/coach" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              Open <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {demoAgents.map((agent) => (
              <div key={agent.name} className="flex items-center gap-3 p-3 rounded-xl bg-ink-50/50 hover:bg-ink-50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-800">{agent.name}</p>
                  <p className="text-xs text-ink-400 truncate">{agent.description}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`w-2 h-2 rounded-full ${
                    agent.status === 'done' ? 'bg-success-500' :
                    agent.status === 'thinking' ? 'bg-warning-500 animate-pulse' :
                    agent.status === 'error' ? 'bg-error-500' : 'bg-ink-300'
                  }`} />
                  <span className="text-xs capitalize text-ink-500">{agent.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current phase + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current roadmap phase */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">Current Roadmap Phase</h3>
              <p className="text-sm text-ink-400 mt-0.5">Phase 2 of 5</p>
            </div>
            <Link to="/roadmap" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              Full roadmap <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {activePhase && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-ink-900">{activePhase.title}</h4>
                  <p className="text-xs text-ink-400 mt-0.5">{activePhase.duration_weeks} weeks · {activePhase.tasks.length} tasks</p>
                </div>
                <span className="badge-primary">{activePhase.progress}%</span>
              </div>
              <div className="w-full h-2 bg-ink-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-primary-500 rounded-full transition-all duration-700" style={{ width: `${activePhase.progress}%` }} />
              </div>
              <div className="space-y-2">
                {activePhase.tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-ink-50 transition-colors">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      task.status === 'completed' ? 'bg-success-500' :
                      task.status === 'in-progress' ? 'bg-primary-500' : 'bg-ink-200'
                    }`}>
                      {task.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-white" />}
                      {task.status === 'in-progress' && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                    </div>
                    <span className={`text-sm flex-1 ${task.status === 'completed' ? 'text-ink-400 line-through' : 'text-ink-700'}`}>
                      {task.title}
                    </span>
                    <span className="text-xs text-ink-400">{task.estimated_hours}h</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="section-title mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/resume" className="flex items-center gap-3 p-3 rounded-xl bg-primary-50 hover:bg-primary-100 transition-colors group">
                <FileText className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-medium text-primary-700 flex-1">Analyze Resume</span>
                <ArrowRight className="w-4 h-4 text-primary-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link to="/assessments/coding" className="flex items-center gap-3 p-3 rounded-xl bg-accent-50 hover:bg-accent-100 transition-colors group">
                <Code2 className="w-5 h-5 text-accent-600" />
                <span className="text-sm font-medium text-accent-700 flex-1">Take Coding Test</span>
                <ArrowRight className="w-4 h-4 text-accent-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link to="/interviews" className="flex items-center gap-3 p-3 rounded-xl bg-warning-50 hover:bg-warning-100 transition-colors group">
                <Video className="w-5 h-5 text-warning-600" />
                <span className="text-sm font-medium text-warning-700 flex-1">Mock Interview</span>
                <ArrowRight className="w-4 h-4 text-warning-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link to="/coach" className="flex items-center gap-3 p-3 rounded-xl bg-ink-50 hover:bg-ink-100 transition-colors group">
                <Bot className="w-5 h-5 text-ink-600" />
                <span className="text-sm font-medium text-ink-700 flex-1">Ask AI Coach</span>
                <ArrowRight className="w-4 h-4 text-ink-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {upcomingInterview && (
            <div className="card p-5 border-l-4 border-l-warning-400">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-warning-600" />
                <span className="text-xs font-medium text-warning-700 uppercase tracking-wide">Upcoming</span>
              </div>
              <h4 className="font-semibold text-ink-900 text-sm">{upcomingInterview.topic}</h4>
              <p className="text-xs text-ink-400 mt-1">
                {upcomingInterview.type} · {upcomingInterview.duration_minutes} min
              </p>
              <p className="text-xs text-ink-500 mt-2">
                {new Date(upcomingInterview.scheduled_at!).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at{' '}
                {new Date(upcomingInterview.scheduled_at!).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
