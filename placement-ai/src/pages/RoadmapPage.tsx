import { useEffect, useState } from 'react';
import {
  Map,
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  Sparkles,
  Loader2,
  AlertCircle,
  Target,
  CalendarDays,
} from 'lucide-react';

import { SectionHeader, ProgressBar } from '@/components/ui';
import { roadmapService } from '@/services/endpoints';

interface Phase {
  phase: string;
  priority: string;
  duration_days: number;
  objective: string;
  topics: string[];
  tasks: string[];
  expected_outcome: string;
}

interface DailyPlan {
  day: number;
  focus: string;
  tasks: string[];
  estimated_hours: number;
  priority: string;
}

interface RoadmapResult {
  target_role: string;
  target_company: string;
  duration_days: number;
  daily_hours: number;
  overall_strategy: string;
  phases: Phase[];
  daily_plan: DailyPlan[];
}

export function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<RoadmapResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedPhase, setExpandedPhase] = useState<number | null>(0);

  useEffect(() => {
    const loadRoadmap = async () => {
  try {
    setLoading(true);
    setError('');

    const response = await roadmapService.getRoadmap();

    // Check whether the roadmap was created using
    // an older version of the student's profile.
    if (response.roadmap_outdated) {
      setError(
        response.message ||
        'Your profile has changed. Please regenerate your roadmap.'
      );

      setRoadmap(null);
      return;
    }

    const data = response.roadmap;

    setRoadmap(data);

    if (data?.phases?.length > 0) {
      setExpandedPhase(0);
    }

  } catch (err: any) {

    console.error(
      'Failed to load roadmap:',
      err
    );

    setError(
      err.response?.data?.detail ||
      'Unable to load your personalized roadmap.'
    );

  } finally {

    setLoading(false);
  }
};

    loadRoadmap();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />

          <p className="text-sm text-ink-500">
            Loading your personalized roadmap...
          </p>
        </div>
      </div>
    );
  }

 if (error || !roadmap) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <SectionHeader
        title="Personalized Roadmap"
        subtitle="AI-generated learning path adapted to your goals"
        icon={<Map className="w-5 h-5" />}
      />

      <div className="card p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-error-50 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7 text-error-500" />
        </div>

        <h3 className="font-semibold text-ink-900">
          Roadmap Needs Updating
        </h3>

        <p className="text-sm text-ink-500 mt-2">
          {error || 'Please generate your personalized roadmap first.'}
        </p>

        <button
          onClick={async () => {
            try {
              setLoading(true);
              setError('');

              const data = await roadmapService.generate();

              setRoadmap(data);

              if (data?.phases?.length > 0) {
                setExpandedPhase(0);
              }

            } catch (err: any) {
              console.error(
                'Failed to regenerate roadmap:',
                err
              );

              setError(
                err.response?.data?.detail ||
                'Unable to regenerate your personalized roadmap.'
              );

            } finally {
              setLoading(false);
            }
          }}
          className="btn-primary mt-5"
        >
          <Sparkles className="w-4 h-4" />
          Regenerate Roadmap
        </button>
      </div>
    </div>
  );
}

  const totalTasks = roadmap.phases.reduce(
    (total, phase) => total + phase.tasks.length,
    0
  );

  const totalDays = roadmap.duration_days;

  const getPhaseStatus = (index: number) => {
    if (index === 0) return 'in-progress';
    return 'upcoming';
  };

  const statusIcon = (status: string) => {
    if (status === 'completed') {
      return (
        <CheckCircle2 className="w-5 h-5 text-success-500" />
      );
    }

    if (status === 'in-progress') {
      return (
        <Clock className="w-5 h-5 text-primary-500 animate-pulse" />
      );
    }

    return (
      <Circle className="w-5 h-5 text-ink-300" />
    );
  };

  const priorityBadge = (priority: string) => {
    if (priority === 'High') {
      return 'badge-error';
    }

    if (priority === 'Medium') {
      return 'badge-warning';
    }

    return 'badge-neutral';
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <SectionHeader
        title="Personalized Roadmap"
        subtitle="AI-generated learning path adapted to your placement goals"
        icon={<Map className="w-5 h-5" />}
        action={
          <div className="text-right">
            <p className="text-2xl font-bold font-display text-ink-900">
              {totalTasks}
            </p>

            <p className="text-xs text-ink-400">
              Planned tasks
            </p>
          </div>
        }
      />

      {/* Roadmap Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-700" />
            </div>

            <div>
              <p className="text-xs text-ink-400">
                Target Role
              </p>

              <p className="text-sm font-semibold text-ink-900">
                {roadmap.target_role}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-accent-700" />
            </div>

            <div>
              <p className="text-xs text-ink-400">
                Preparation Duration
              </p>

              <p className="text-sm font-semibold text-ink-900">
                {totalDays} Days
              </p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary-700" />
            </div>

            <div>
              <p className="text-xs text-ink-400">
                Daily Preparation
              </p>

              <p className="text-sm font-semibold text-ink-900">
                {roadmap.daily_hours} Hours / Day
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* AI Strategy */}
      <div className="card p-6 bg-gradient-to-br from-primary-50/50 to-accent-50/30">

        <div className="flex items-start gap-4">

          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-primary-700" />
          </div>

          <div>

            <h3 className="font-semibold text-ink-900">
              AI Preparation Strategy
            </h3>

            <p className="text-sm text-ink-600 mt-1">
              {roadmap.overall_strategy}
            </p>

            {roadmap.target_company && (
              <p className="text-xs text-ink-400 mt-2">
                Target company: {roadmap.target_company}
              </p>
            )}

          </div>

        </div>
      </div>

      {/* Timeline */}
      <div className="relative">

        {/* Vertical line */}
        <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-ink-100" />

        <div className="space-y-4">

          {roadmap.phases.map((phase, index) => {

            const status = getPhaseStatus(index);
            const expanded = expandedPhase === index;

            return (
              <div
                key={`${phase.phase}-${index}`}
                className="relative pl-14"
              >

                {/* Node */}
                <div className="absolute left-0 top-1 w-11 h-11 rounded-full bg-white border-2 border-ink-100 flex items-center justify-center z-10">
                  {statusIcon(status)}
                </div>

                {/* Phase Card */}
                <div className="card card-hover overflow-hidden">

                  <button
                    onClick={() =>
                      setExpandedPhase(
                        expanded ? null : index
                      )
                    }
                    className="w-full text-left p-5 flex items-center justify-between gap-4"
                  >

                    <div className="flex-1 min-w-0">

                      <div className="flex items-center gap-2 mb-1">

                        <span className="text-xs font-medium text-ink-400">
                          Phase {index + 1}
                        </span>

                        <span
                          className={`badge ${
                            status === 'in-progress'
                              ? 'badge-primary'
                              : 'badge-neutral'
                          }`}
                        >
                          {status === 'in-progress'
                            ? 'In Progress'
                            : 'Upcoming'}
                        </span>

                        <span
                          className={`badge ${priorityBadge(
                            phase.priority
                          )}`}
                        >
                          {phase.priority} Priority
                        </span>

                      </div>

                      <h3 className="font-semibold text-ink-900">
                        {phase.phase}
                      </h3>

                      <p className="text-xs text-ink-400 mt-0.5">
                        {phase.duration_days} days ·{' '}
                        {phase.tasks.length} tasks
                      </p>

                    </div>

                    <div className="flex items-center gap-3 shrink-0">

                      <div className="w-24 hidden sm:block">
                        <ProgressBar
                          value={status === 'in-progress' ? 10 : 0}
                          height="h-1.5"
                        />
                      </div>

                      <span className="text-sm font-semibold text-ink-700 hidden sm:block">
                        {status === 'in-progress' ? '10%' : '0%'}
                      </span>

                      <ChevronDown
                        className={`w-4 h-4 text-ink-400 transition-transform ${
                          expanded ? 'rotate-180' : ''
                        }`}
                      />

                    </div>

                  </button>

                  {/* Expanded Phase */}
                  {expanded && (
                    <div className="border-t border-ink-100 p-5 bg-ink-50/30 animate-fade-in">

                      {/* Objective */}
                      <div className="mb-4">

                        <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide">
                          Objective
                        </p>

                        <p className="text-sm text-ink-600 mt-1">
                          {phase.objective}
                        </p>

                      </div>

                      {/* Topics */}
                      {phase.topics.length > 0 && (
                        <div className="mb-4">

                          <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-2">
                            Topics
                          </p>

                          <div className="flex flex-wrap gap-2">

                            {phase.topics.map((topic) => (
                              <span
                                key={topic}
                                className="badge-neutral"
                              >
                                {topic}
                              </span>
                            ))}

                          </div>

                        </div>
                      )}

                      {/* Tasks */}
                      <div className="space-y-2.5">

                        {phase.tasks.map((task, taskIndex) => (

                          <div
                            key={`${task}-${taskIndex}`}
                            className="flex items-start gap-3 p-3 rounded-xl bg-white border border-ink-100 hover:border-ink-200 transition-colors"
                          >

                            <div className="w-5 h-5 rounded-full bg-ink-100 flex items-center justify-center shrink-0 mt-0.5">
                              <Circle className="w-3 h-3 text-ink-400" />
                            </div>

                            <div className="flex-1 min-w-0">

                              <h4 className="text-sm font-medium text-ink-800">
                                {task}
                              </h4>

                            </div>

                          </div>

                        ))}

                      </div>

                      {/* Expected Outcome */}
                      <div className="mt-4 p-4 rounded-xl bg-primary-50/50">

                        <p className="text-xs font-semibold text-primary-700 uppercase tracking-wide">
                          Expected Outcome
                        </p>

                        <p className="text-sm text-ink-600 mt-1">
                          {phase.expected_outcome}
                        </p>

                      </div>

                    </div>
                  )}

                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* Daily Plan */}
      {roadmap.daily_plan.length > 0 && (
        <div className="card p-6">

          <div className="flex items-center justify-between mb-4">

            <div>
              <h3 className="section-title">
                Daily Preparation Plan
              </h3>

              <p className="text-xs text-ink-400 mt-1">
                Your AI-generated day-by-day preparation schedule
              </p>
            </div>

          </div>

          <div className="space-y-3">

            {roadmap.daily_plan.map((day) => (

              <div
                key={day.day}
                className="flex items-start gap-4 p-4 rounded-xl border border-ink-100 hover:border-ink-200 transition-colors"
              >

                {/* Day */}
                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">

                  <span className="text-xs font-bold">
                    D{day.day}
                  </span>

                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">

                  <div className="flex flex-wrap items-center gap-2">

                    <h4 className="text-sm font-semibold text-ink-800">
                      {day.focus}
                    </h4>

                    <span
                      className={`badge ${priorityBadge(
                        day.priority
                      )}`}
                    >
                      {day.priority}
                    </span>

                  </div>

                  <div className="mt-2 space-y-1">

                    {day.tasks.map((task, index) => (

                      <p
                        key={`${task}-${index}`}
                        className="text-xs text-ink-500"
                      >
                        • {task}
                      </p>

                    ))}

                  </div>

                </div>

                {/* Hours */}
                <span className="text-xs text-ink-400 shrink-0">
                  {day.estimated_hours}h
                </span>

              </div>

            ))}

          </div>

        </div>
      )}

    </div>
  );
}