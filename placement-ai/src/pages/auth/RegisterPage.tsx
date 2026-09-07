import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, Building2, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    branch: 'Computer Science & Engineering',
    year: 'Final Year (B.Tech)',
    university: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const branches = [
    'Computer Science & Engineering',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Information Technology',
    'Civil Engineering',
  ];
  const years = ['First Year', 'Second Year', 'Third Year', 'Final Year (B.Tech)'];

  return (
    <div className="min-h-screen flex">
      {/* Left panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-ink-50 overflow-y-auto">
        <div className="w-full max-w-md animate-slide-up py-8">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <p className="font-bold font-display text-ink-900">PLACEMENT AI</p>
          </div>

          <h2 className="text-2xl font-bold font-display text-ink-900">Create your account</h2>
          <p className="text-ink-500 mt-1.5">Start your AI-powered placement preparation journey</p>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-error-50 border border-error-100 text-error-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-ink-400" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Arjun Sharma"
                  className="input pl-11"
                />
              </div>
            </div>

            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-ink-400" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@university.edu"
                  className="input pl-11"
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-ink-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  className="input pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                >
                  {showPass ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">University / College</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-ink-400" />
                <input
                  type="text"
                  required
                  value={form.university}
                  onChange={(e) => setForm({ ...form, university: e.target.value })}
                  placeholder="Vellore Institute of Technology"
                  className="input pl-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Branch</label>
                <select
                  value={form.branch}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}
                  className="input"
                >
                  {branches.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Year</label>
                <select
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="input"
                >
                  {years.map((y) => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <p className="text-center text-sm text-ink-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-accent-400 blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-primary-400 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <p className="font-bold font-display text-lg">PLACEMENT AI</p>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold font-display leading-tight">
              Crack your<br />dream placement
            </h1>
            <div className="space-y-3">
              {[
                'AI-generated personalized study roadmap',
                'ATS-optimized resume analysis',
                'Mock interviews with instant AI feedback',
                'Real-time placement readiness tracking',
                'Company-specific preparation guides',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-400/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-accent-300" />
                  </div>
                  <span className="text-white/80 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/40">© 2025 Placement AI. Built for B.Tech students.</p>
        </div>
      </div>
    </div>
  );
}
