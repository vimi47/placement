import { Building2, Search, ChevronRight, CheckCircle2, TrendingUp, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { SectionHeader, ProgressBar, EmptyState } from '@/components/ui';
import { demoCompanies } from '@/data/demoData';

export function CompaniesPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const filtered = demoCompanies.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || c.difficulty === filter;
    return matchesSearch && matchesFilter;
  });

  const filters = ['all', 'Product-Based', 'Service-Based', 'Startup'];

  const statusBadge = (status: string) => {
    if (status === 'ready') return { cls: 'badge-success', text: 'Ready' };
    if (status === 'preparing') return { cls: 'badge-primary', text: 'Preparing' };
    return { cls: 'badge-neutral', text: 'Not Started' };
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <SectionHeader
        title="Company Preparation"
        subtitle="Company-specific prep guides with previous questions and eligibility"
        icon={<Building2 className="w-5 h-5" />}
      />

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-ink-400" />
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-11"
          />
        </div>
        <div className="flex gap-1.5">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filter === f ? 'bg-primary-600 text-white' : 'bg-white border border-ink-200 text-ink-600 hover:bg-ink-50'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Company cards */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Building2 className="w-7 h-7" />}
          title="No companies found"
          description="Try adjusting your search or filter criteria."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((c) => {
            const badge = statusBadge(c.status);
            return (
              <div key={c.id} className="card card-hover p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink-900">{c.name}</h3>
                      <p className="text-xs text-ink-400">{c.industry}</p>
                    </div>
                  </div>
                  <span className={badge.cls}>{badge.text}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-2.5 rounded-lg bg-ink-50/50">
                    <p className="text-[10px] text-ink-400 uppercase tracking-wide">Package</p>
                    <p className="text-sm font-semibold text-ink-800 mt-0.5">{c.package_range}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-ink-50/50">
                    <p className="text-[10px] text-ink-400 uppercase tracking-wide">Type</p>
                    <p className="text-sm font-semibold text-ink-800 mt-0.5">{c.difficulty}</p>
                  </div>
                </div>

                {c.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs text-ink-500">Prep Progress</span>
                      <span className="text-xs font-medium text-ink-700">{c.progress}%</span>
                    </div>
                    <ProgressBar value={c.progress} height="h-1.5" />
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  <div>
                    <p className="text-[10px] text-ink-400 uppercase tracking-wide mb-1.5">Key Topics</p>
                    <div className="flex flex-wrap gap-1.5">
                      {c.prep_topics.map((t) => (
                        <span key={t} className="badge-primary text-[10px]">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-ink-400 uppercase tracking-wide mb-1.5">Previous Questions</p>
                    <div className="space-y-1">
                      {c.previous_questions.slice(0, 2).map((q, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-ink-500">
                          <ChevronRight className="w-3 h-3 mt-0.5 shrink-0 text-ink-300" />
                          <span>{q}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-ink-100">
                  <Briefcase className="w-3.5 h-3.5 text-ink-400" />
                  <span className="text-xs text-ink-500">{c.eligibility}</span>
                </div>

                <button className="btn-secondary w-full text-sm mt-3">
                  {c.status === 'ready' ? (
                    <><CheckCircle2 className="w-3.5 h-3.5" /> Review Prep</>
                  ) : c.status === 'preparing' ? (
                    <><TrendingUp className="w-3.5 h-3.5" /> Continue Prep</>
                  ) : (
                    'Start Preparation'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
