import { useEffect, useState } from 'react';
import {
  Target,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  Loader2,
} from 'lucide-react';

import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';

import { SectionHeader, ProgressBar } from '@/components/ui';
import { skillGapService } from '@/services/endpoints';

interface Skill {
  skill: string;
  category: string;
  current_level: number;
  required_level: number;
  gap: number;
  status: 'critical' | 'moderate' | 'met';
}

interface SkillGapResult {
  target_role: string;
  summary: string;
  recommended_focus: string[];
  skills: Skill[];
}

export function SkillGapPage() {
  const [result, setResult] = useState<SkillGapResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSkillGap = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await skillGapService.getAnalysis();

        setResult(data);
      } catch (err: any) {
        console.error('Failed to load skill gap analysis:', err);

        setError(
          err.response?.data?.detail ||
          'Unable to load skill gap analysis.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadSkillGap();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          <p className="text-sm text-ink-500">
            Loading your AI skill gap analysis...
          </p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <SectionHeader
          title="Skill Gap Analysis"
          subtitle="AI-powered analysis of your placement skills"
          icon={<Target className="w-5 h-5" />}
        />

        <div className="card p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-error-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-error-500" />
          </div>

          <h3 className="font-semibold text-ink-900">
            Skill Gap Analysis Not Available
          </h3>

          <p className="text-sm text-ink-500 mt-2">
            {error || 'Please analyze your resume first.'}
          </p>
        </div>
      </div>
    );
  }

  const critical = result.skills.filter(
    (s) => s.status === 'critical'
  );

  const moderate = result.skills.filter(
    (s) => s.status === 'moderate'
  );

  const met = result.skills.filter(
    (s) => s.status === 'met'
  );

  const radarData = result.skills.map((s) => ({
    skill:
      s.skill.length > 18
        ? s.skill.substring(0, 18) + '...'
        : s.skill,
    current: s.current_level,
    required: s.required_level,
  }));

  const statusBadge = (status: string) => {
    if (status === 'critical') {
      return {
        cls: 'badge-error',
        icon: <AlertCircle className="w-3 h-3" />,
        text: 'Critical Gap',
      };
    }

    if (status === 'moderate') {
      return {
        cls: 'badge-warning',
        icon: <TrendingDown className="w-3 h-3" />,
        text: 'Moderate Gap',
      };
    }

    return {
      cls: 'badge-success',
      icon: <CheckCircle2 className="w-3 h-3" />,
      text: 'On Track',
    };
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* Header */}
      <SectionHeader
        title="Skill Gap Analysis"
        subtitle={`Target role: ${result.target_role}`}
        icon={<Target className="w-5 h-5" />}
      />

      {/* AI Summary */}
      <div className="card p-6 bg-gradient-to-br from-primary-50/50 to-accent-50/30">
        <div className="flex items-start gap-4">

          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-primary-700" />
          </div>

          <div className="flex-1">

            <h3 className="font-semibold text-ink-900">
              AI Analysis Summary
            </h3>

            <p className="text-sm text-ink-600 mt-1">
              {result.summary}
            </p>

            <div className="flex flex-wrap gap-2 mt-3">

              <span className="badge-error">
                {critical.length} Critical
              </span>

              <span className="badge-warning">
                {moderate.length} Moderate
              </span>

              <span className="badge-success">
                {met.length} On Track
              </span>

            </div>
          </div>
        </div>
      </div>

      {/* Radar + Focus Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Radar */}
        <div className="card p-6 lg:col-span-2">

          <h3 className="section-title mb-4">
            Skill Radar — Current vs Required
          </h3>

          <ResponsiveContainer width="100%" height={360}>
            <RadarChart data={radarData}>

              <PolarGrid stroke="#eceef2" />

              <PolarAngleAxis
                dataKey="skill"
                tick={{
                  fontSize: 11,
                  fill: '#677591',
                }}
              />

              <PolarRadiusAxis
                domain={[0, 100]}
                tick={{
                  fontSize: 10,
                  fill: '#b0bac9',
                }}
                axisLine={false}
              />

              <Radar
                name="Required"
                dataKey="required"
                stroke="#2f5fff"
                fill="#2f5fff"
                fillOpacity={0.08}
                strokeWidth={2}
              />

              <Radar
                name="Current"
                dataKey="current"
                stroke="#06c8a6"
                fill="#06c8a6"
                fillOpacity={0.15}
                strokeWidth={2}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #eceef2',
                  fontSize: 13,
                }}
              />

            </RadarChart>
          </ResponsiveContainer>

          <div className="flex items-center justify-center gap-6 mt-2">

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-accent-500" />
              <span className="text-xs text-ink-500">
                Current Level
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary-500" />
              <span className="text-xs text-ink-500">
                Required Level
              </span>
            </div>

          </div>
        </div>

        {/* Recommended Focus */}
        <div className="card p-6">

          <h3 className="section-title mb-4">
            Recommended Focus
          </h3>

          <div className="space-y-3">

            {result.recommended_focus.map((focus, index) => (

              <div
                key={focus}
                className="flex items-start gap-3 p-3 rounded-xl bg-primary-50/50"
              >

                <span className="w-7 h-7 rounded-lg bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center shrink-0">
                  {index + 1}
                </span>

                <span className="text-sm font-medium text-ink-700">
                  {focus}
                </span>

              </div>

            ))}

          </div>
        </div>
      </div>

      {/* Detailed Skill Breakdown */}
      <div className="card p-6">

        <h3 className="section-title mb-4">
          Detailed Skill Breakdown
        </h3>

        <div className="space-y-3">

          {result.skills.map((skill) => {

            const badge = statusBadge(skill.status);

            return (
              <div
                key={skill.skill}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-ink-100 hover:border-ink-200 transition-colors"
              >

                <div className="flex-1 min-w-0">

                  <div className="flex items-center gap-2 mb-1">

                    <h4 className="text-sm font-semibold text-ink-800">
                      {skill.skill}
                    </h4>

                    <span className="badge-neutral text-[10px]">
                      {skill.category}
                    </span>

                  </div>

                  <div className="flex items-center gap-2">

                    <ProgressBar
                      value={skill.current_level}
                      color={
                        skill.status === 'critical'
                          ? 'bg-error-500'
                          : skill.status === 'moderate'
                            ? 'bg-warning-500'
                            : 'bg-success-500'
                      }
                      height="h-1.5"
                    />

                    <span className="text-xs text-ink-400 shrink-0">
                      {skill.current_level}/{skill.required_level}
                    </span>

                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">

                  <span className="text-xs text-ink-400">
                    Gap:{' '}
                    <span
                      className={`font-semibold ${
                        skill.gap > 30
                          ? 'text-error-600'
                          : skill.gap > 10
                            ? 'text-warning-600'
                            : 'text-success-600'
                      }`}
                    >
                      {skill.gap}
                    </span>
                  </span>

                  <span className={badge.cls}>
                    {badge.icon}
                    {' '}
                    {badge.text}
                  </span>

                </div>

              </div>
            );

          })}

        </div>
      </div>
    </div>
  );
}