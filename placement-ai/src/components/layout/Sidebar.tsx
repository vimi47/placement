import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FileText,
  Target,
  Map,
  Code2,
  Brain,
  Video,
  Building2,
  TrendingUp,
  Bot,
  Settings,
  GraduationCap,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/profile', label: 'Student Profile', icon: User },
  { to: '/resume', label: 'Resume / ATS Analysis', icon: FileText },
  { to: '/skill-gap', label: 'Skill Gap Analysis', icon: Target },
  { to: '/roadmap', label: 'Personalized Roadmap', icon: Map },
  { to: '/assessments/coding', label: 'Coding Assessments', icon: Code2 },
  { to: '/assessments/aptitude', label: 'Aptitude Assessments', icon: Brain },
  { to: '/interviews', label: 'Mock Interviews', icon: Video },
  { to: '/companies', label: 'Company Preparation', icon: Building2 },
  { to: '/progress', label: 'Progress Analytics', icon: TrendingUp },
  { to: '/coach', label: 'AI Career Coach', icon: Bot },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-ink-950/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-ink-100 flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-ink-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-sm">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold font-display text-ink-900 text-sm leading-none">PLACEMENT AI</p>
              <p className="text-[10px] text-ink-400 mt-0.5 leading-none">AI-Powered Prep Platform</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-ink-400 hover:text-ink-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-ink-500 hover:bg-ink-50 hover:text-ink-800'
                }`
              }
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User card */}
        <div className="p-3 border-t border-ink-100 shrink-0">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-ink-50 cursor-pointer transition-colors">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink-800 truncate">{user?.name || 'Student'}</p>
              <p className="text-xs text-ink-400 truncate">{user?.email || ''}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
