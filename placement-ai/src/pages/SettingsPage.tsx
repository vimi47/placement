import { useState, FormEvent } from 'react';
import {
  Settings as SettingsIcon, User, Lock, Bell, Palette, Shield,
  Save, Globe, Moon, Monitor, Mail,
} from 'lucide-react';
import { SectionHeader } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export function SettingsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    interviewReminders: true,
    progressReports: true,
    weeklyDigest: false,
  });
  const [theme, setTheme] = useState('light');

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SectionHeader
        title="Settings"
        subtitle="Manage your account and preferences"
        icon={<SettingsIcon className="w-5 h-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <div className="card p-2 sticky top-20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-ink-500 hover:bg-ink-50 hover:text-ink-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="card p-6">
              <h3 className="section-title mb-4">Profile Settings</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="label">Full Name</label>
                  <input className="input" defaultValue={user?.name || ''} />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input className="input" defaultValue={user?.email || ''} disabled />
                </div>
                <div>
                  <label className="label">Target Role</label>
                  <input className="input" defaultValue={user?.target_role || ''} />
                </div>
                <div>
                  <label className="label">University</label>
                  <input className="input" defaultValue={user?.university || ''} />
                </div>
                <button type="submit" className="btn-primary">
                  <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card p-6">
              <h3 className="section-title mb-4">Security</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="label">Current Password</label>
                  <input type="password" className="input" placeholder="Enter current password" />
                </div>
                <div>
                  <label className="label">New Password</label>
                  <input type="password" className="input" placeholder="Enter new password" />
                </div>
                <div>
                  <label className="label">Confirm New Password</label>
                  <input type="password" className="input" placeholder="Re-enter new password" />
                </div>
                <button type="submit" className="btn-primary">
                  <Shield className="w-4 h-4" /> Update Password
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-ink-100">
                <h4 className="text-sm font-semibold text-ink-700 mb-2">Danger Zone</h4>
                <button onClick={() => { logout(); window.location.href = '/login'; }} className="btn text-error-600 hover:bg-error-50 border border-error-200">
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card p-6">
              <h3 className="section-title mb-4">Notification Preferences</h3>
              <div className="space-y-3">
                {[
                  { key: 'emailUpdates', label: 'Email Updates', desc: 'Receive important account and product updates', icon: Mail },
                  { key: 'interviewReminders', label: 'Interview Reminders', desc: 'Get notified before scheduled mock interviews', icon: Bell },
                  { key: 'progressReports', label: 'Progress Reports', desc: 'Weekly summary of your placement readiness', icon: Shield },
                  { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'A summary of new content and recommendations', icon: Globe },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-xl border border-ink-100 hover:border-ink-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-ink-50 flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-ink-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink-800">{item.label}</p>
                        <p className="text-xs text-ink-400">{item.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        notifications[item.key as keyof typeof notifications] ? 'bg-primary-500' : 'bg-ink-200'
                      }`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                        notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="card p-6">
              <h3 className="section-title mb-4">Appearance</h3>
              <div className="space-y-3">
                {[
                  { id: 'light', label: 'Light', desc: 'Clean, bright interface', icon: Monitor },
                  { id: 'dark', label: 'Dark', desc: 'Easy on the eyes at night', icon: Moon },
                  { id: 'system', label: 'System', desc: 'Match your OS preference', icon: Globe },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setTheme(opt.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      theme === opt.id ? 'border-primary-400 bg-primary-50/50' : 'border-ink-100 hover:border-ink-200'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      theme === opt.id ? 'bg-primary-100 text-primary-700' : 'bg-ink-50 text-ink-500'
                    }`}>
                      <opt.icon className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-sm font-medium text-ink-800">{opt.label}</p>
                      <p className="text-xs text-ink-400">{opt.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      theme === opt.id ? 'border-primary-500 bg-primary-500' : 'border-ink-200'
                    }`}>
                      {theme === opt.id && <div className="w-full h-full rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full" /></div>}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-ink-400 mt-4">Dark mode coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
