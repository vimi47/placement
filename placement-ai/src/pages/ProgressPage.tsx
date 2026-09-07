import { TrendingUp, Flame, Clock, CheckCircle2, Target } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, Legend,
  BarChart, Bar, Cell,
} from 'recharts';
import { SectionHeader, StatCard, ProgressRing, ProgressBar } from '@/components/ui';
import { demoProgress } from '@/data/demoData';

export function ProgressPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <SectionHeader
        title="Progress Analytics"
        subtitle="Track your placement readiness and improvement over time"
        icon={<TrendingUp className="w-5 h-5" />}
      />

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Target className="w-5 h-5" />} label="Overall Readiness" value={`${demoProgress.overall_readiness}%`} trend={{ value: '5%', positive: true }} />
        <StatCard icon={<Flame className="w-5 h-5" />} label="Current Streak" value={`${demoProgress.streak_days} days`} color="text-warning-600" />
        <StatCard icon={<Clock className="w-5 h-5" />} label="Total Hours" value={demoProgress.total_hours} color="text-primary-600" />
        <StatCard icon={<CheckCircle2 className="w-5 h-5" />} label="Tasks Done" value={demoProgress.tasks_completed} color="text-success-600" />
      </div>

      {/* Activity + readiness ring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <h3 className="section-title mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={demoProgress.weekly_activity}>
              <defs>
                <linearGradient id="gradH" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2f5fff" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#2f5fff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradT" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06c8a6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#06c8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#8593aa' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#8593aa' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eceef2', fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="hours" stroke="#2f5fff" strokeWidth={2.5} fill="url(#gradH)" name="Hours" />
              <Area type="monotone" dataKey="tasks" stroke="#06c8a6" strokeWidth={2.5} fill="url(#gradT)" name="Tasks" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6 flex flex-col items-center justify-center">
          <h3 className="section-title mb-4">Placement Readiness</h3>
          <ProgressRing value={demoProgress.overall_readiness} label={`${demoProgress.overall_readiness}%`} sublabel="Overall" size={160} strokeWidth={12} />
          <p className="text-sm text-ink-500 mt-4 text-center">You're on track! Focus on system design to reach 80%.</p>
        </div>
      </div>

      {/* Skill radar + assessment trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="section-title mb-4">Skill Radar</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={demoProgress.skill_radar}>
              <PolarGrid stroke="#eceef2" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: '#677591' }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#b0bac9' }} axisLine={false} />
              <Radar name="Current" dataKey="value" stroke="#06c8a6" fill="#06c8a6" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Target" dataKey="target" stroke="#2f5fff" fill="#2f5fff" fillOpacity={0.08} strokeWidth={2} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eceef2', fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="section-title mb-4">Assessment Score Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={demoProgress.assessment_trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8593aa' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#8593aa' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eceef2', fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="coding" stroke="#2f5fff" strokeWidth={2.5} dot={{ r: 4 }} name="Coding" />
              <Line type="monotone" dataKey="aptitude" stroke="#06c8a6" strokeWidth={2.5} dot={{ r: 4 }} name="Aptitude" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Milestone progress */}
      <div className="card p-6">
        <h3 className="section-title mb-4">Milestone Progress</h3>
        <div className="space-y-4">
          {demoProgress.milestone_progress.map((m) => {
            const pct = Math.round((m.value / m.target) * 100);
            const color = pct >= 90 ? 'bg-success-500' : pct >= 60 ? 'bg-primary-500' : pct >= 30 ? 'bg-warning-500' : 'bg-error-500';
            return (
              <div key={m.label}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-medium text-ink-700">{m.label}</span>
                  <span className="text-sm text-ink-500">{m.value}/{m.target} ({pct}%)</span>
                </div>
                <ProgressBar value={pct} color={color} height="h-2.5" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
