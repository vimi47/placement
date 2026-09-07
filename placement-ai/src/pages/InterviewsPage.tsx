import { Video, Plus, Star, Clock, CheckCircle2, MessageSquare, Calendar, Play } from 'lucide-react';
import { SectionHeader, StatCard, EmptyState } from '@/components/ui';
import { demoInterviews } from '@/data/demoData';

export function InterviewsPage() {
  const interviews = demoInterviews;
  const completed = interviews.filter((i) => i.status === 'completed');
  const scheduled = interviews.filter((i) => i.status === 'scheduled');
  const avgScore = completed.length > 0
    ? Math.round(completed.reduce((acc, i) => acc + (i.score || 0), 0) / completed.length)
    : 0;

  const typeBadge = (type: string) => {
    if (type === 'technical') return { cls: 'badge-primary', text: 'Technical' };
    if (type === 'behavioral') return { cls: 'badge-accent', text: 'Behavioral' };
    return { cls: 'badge-warning', text: 'HR' };
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <SectionHeader
        title="Mock Interviews"
        subtitle="AI-powered mock interviews with instant feedback"
        icon={<Video className="w-5 h-5" />}
        action={<button className="btn-primary"><Plus className="w-4 h-4" /> New Interview</button>}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Video className="w-5 h-5" />} label="Total Interviews" value={interviews.length} color="text-primary-600" />
        <StatCard icon={<CheckCircle2 className="w-5 h-5" />} label="Completed" value={completed.length} color="text-success-600" />
        <StatCard icon={<Calendar className="w-5 h-5" />} label="Scheduled" value={scheduled.length} color="text-warning-600" />
        <StatCard icon={<Star className="w-5 h-5" />} label="Avg Score" value={avgScore ? `${avgScore}%` : '—'} color="text-accent-600" />
      </div>

      {/* Scheduled */}
      {scheduled.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-ink-500 uppercase tracking-wide">Scheduled</h3>
          {scheduled.map((iv) => (
            <div key={iv.id} className="card p-5 border-l-4 border-l-warning-400">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-warning-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-ink-900 text-sm">{iv.topic}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={typeBadge(iv.type).cls}>{typeBadge(iv.type).text}</span>
                      <span className="text-xs text-ink-400">{iv.duration_minutes} min</span>
                      <span className="text-xs text-ink-400">·</span>
                      <span className="text-xs text-ink-500">
                        {new Date(iv.scheduled_at!).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at{' '}
                        {new Date(iv.scheduled_at!).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="btn-primary text-sm">Join Interview</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-ink-500 uppercase tracking-wide">Completed Interviews</h3>
        {completed.length === 0 ? (
          <EmptyState
            icon={<Video className="w-7 h-7" />}
            title="No completed interviews yet"
            description="Start a mock interview to get AI-powered feedback on your performance."
            action={<button className="btn-primary"><Plus className="w-4 h-4" /> Start Interview</button>}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completed.map((iv) => (
              <div key={iv.id} className="card card-hover p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-success-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-ink-900 text-sm">{iv.topic}</h4>
                      <span className={typeBadge(iv.type).cls}>{typeBadge(iv.type).text}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold font-display text-ink-900">{iv.score}%</p>
                    <div className="flex items-center gap-0.5 justify-end">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= Math.round((iv.score || 0) / 20) ? 'text-warning-400 fill-warning-400' : 'text-ink-200'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-ink-400 mb-3">
                  <Clock className="w-3 h-3" /> {iv.duration_minutes} min
                  <span>·</span>
                  <span>{new Date(iv.scheduled_at!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="p-3 rounded-xl bg-ink-50/50 border border-ink-100">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-primary-500" />
                    <span className="text-xs font-medium text-ink-600">AI Feedback</span>
                  </div>
                  <p className="text-xs text-ink-500 leading-relaxed">{iv.feedback}</p>
                </div>
                <button className="btn-secondary w-full text-sm mt-3">
                  View Detailed Report
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Start new */}
      <div className="card p-6 bg-gradient-to-br from-primary-50/50 to-accent-50/30">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <Play className="w-6 h-6 text-primary-700" />
            </div>
            <div>
              <h3 className="font-semibold text-ink-900">Start a New Mock Interview</h3>
              <p className="text-sm text-ink-500">Choose from technical, behavioral, or HR rounds</p>
            </div>
          </div>
          <button className="btn-primary">
            <Plus className="w-4 h-4" /> Schedule Interview
          </button>
        </div>
      </div>
    </div>
  );
}
