import { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, ChevronDown, LogOut, User as UserIcon, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-ink-100 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-lg hover:bg-ink-100 flex items-center justify-center text-ink-600"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-ink-50 rounded-xl w-72">
          <Search className="w-4 h-4 text-ink-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-ink-700 placeholder-ink-400 outline-none flex-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 rounded-lg hover:bg-ink-100 flex items-center justify-center text-ink-600 transition-colors">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-500 rounded-full ring-2 ring-white" />
        </button>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-ink-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white text-sm font-semibold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <span className="hidden sm:block text-sm font-medium text-ink-700">{user?.name?.split(' ')[0] || 'Student'}</span>
            <ChevronDown className="w-4 h-4 text-ink-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-card-hover border border-ink-100 py-2 animate-slide-up">
              <div className="px-3 py-2 border-b border-ink-100">
                <p className="text-sm font-medium text-ink-800">{user?.name}</p>
                <p className="text-xs text-ink-400">{user?.email}</p>
              </div>
              <button
                onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-ink-600 hover:bg-ink-50 transition-colors"
              >
                <UserIcon className="w-4 h-4" /> My Profile
              </button>
              <button
                onClick={() => { setMenuOpen(false); navigate('/settings'); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-ink-600 hover:bg-ink-50 transition-colors"
              >
                <SettingsIcon className="w-4 h-4" /> Settings
              </button>
              <div className="border-t border-ink-100 mt-1 pt-1">
                <button
                  onClick={() => { logout(); navigate('/login'); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
