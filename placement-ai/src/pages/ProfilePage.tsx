import { useEffect, useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  GraduationCap,
  Linkedin,
  Github,
  Globe,
  Target,
  Building2,
  Edit3,
  Save,
  X,
  Award,
  Briefcase,
  Code,
  Clock,
  CalendarDays,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/endpoints';
import { demoUser } from '@/data/demoData';

export function ProfilePage() {
  const { user, setUser } = useAuth();

  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<any>(user || demoUser);

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState<any>({
    ...(user || demoUser),

    target_company: '',
    year_and_branch: '',
    programming_languages: '',
    skills: '',
    deadline: '',
    daily_hours: '',
    strengths: '',
    weaknesses: '',
  });

  /* ---------------- LOAD PROFILE FROM BACKEND ---------------- */

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await authService.getProfile();

        console.log('Backend profile:', data);

        const backendProfile = data.profile || {};

        const combinedProfile = {
          ...(user || demoUser),

          id: data.student_id || user?.id || '',
          name: data.name || user?.name || '',
          email: data.email || user?.email || '',

          target_role:
            backendProfile.target_role ||
            user?.target_role ||
            '',

          target_company:
            backendProfile.target_company || '',

          year_and_branch:
            backendProfile.year_and_branch || '',

          programming_languages:
            backendProfile.programming_languages || '',

          skills:
            backendProfile.skills || '',

          deadline:
            backendProfile.deadline || '',

          daily_hours:
            backendProfile.daily_hours || '',

          strengths:
            backendProfile.strengths || '',

          weaknesses:
            backendProfile.weaknesses || '',

          phone: user?.phone || '',
          university: user?.university || '',
          branch: user?.branch || '',
          year: user?.year || '',
          cgpa: user?.cgpa || 0,
          linkedin_url: user?.linkedin_url || '',
          github_url: user?.github_url || '',
          portfolio_url: user?.portfolio_url || '',
        };

        setProfile(combinedProfile);
        setForm(combinedProfile);

        /*
         * Update the AuthContext with the real student name/email.
         * This also keeps the dashboard synchronized.
         */
        setUser({
          ...user,
          id: combinedProfile.id,
          name: combinedProfile.name,
          email: combinedProfile.email,
          target_role: combinedProfile.target_role,
        } as any);

      } catch (error) {
        console.error('Failed to load student profile:', error);

        /*
         * If backend fails, keep the existing logged-in user.
         */
        setProfile(user || demoUser);
        setForm({
          ...(user || demoUser),
          target_company: '',
          year_and_branch: '',
          programming_languages: '',
          skills: '',
          deadline: '',
          daily_hours: '',
          strengths: '',
          weaknesses: '',
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-ink-100 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  /* ---------------- SAVE PROFILE ---------------- */

const handleSave = async () => {
  try {
    await authService.updateProfile({
      name: form.name,
      target_role: form.target_role || '',
      target_company: form.target_company || '',
      year_and_branch: form.year_and_branch || '',
      programming_languages: form.programming_languages || '',
      skills: form.skills || '',
      deadline: form.deadline || '',
      daily_hours: form.daily_hours || '',
      strengths: form.strengths || '',
      weaknesses: form.weaknesses || '',
    });

    setProfile(form);

    setUser({
      ...user,
      ...form,
      name: form.name,
      target_role: form.target_role || '',
      target_companies: form.target_company
        ? [form.target_company]
        : [],
    } as any);

    setEditing(false);

    alert('Profile updated successfully!');
  } catch (error) {
    console.error('Failed to update profile:', error);
    alert('Failed to update profile. Please try again.');
  }
};

  /* ---------------- CANCEL EDIT ---------------- */

  const handleCancel = () => {
    setForm({
      ...profile,
    });

    setEditing(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* ---------------- HEADER ---------------- */}

      <div className="card overflow-hidden">

        <div className="h-28 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-accent-400/15 blur-3xl -translate-y-1/3 translate-x-1/4" />
        </div>

        <div className="px-6 pb-6 -mt-12 relative">

          <div className="flex flex-col sm:flex-row sm:items-end gap-4">

            {/* PROFILE AVATAR */}

            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white text-3xl font-bold font-display ring-4 ring-white shadow-lg shrink-0">
              {profile.name?.charAt(0)?.toUpperCase() || 'S'}
            </div>

            {/* NAME */}

            <div className="flex-1">

              <h1 className="text-xl font-bold font-display text-ink-900">
                {profile.name || 'Student'}
              </h1>

              <p className="text-sm text-ink-500">
                {profile.email || 'No email'}
              </p>

            </div>

            {/* BUTTONS */}

            {!editing ? (

              <button
                onClick={() => setEditing(true)}
                className="btn-secondary"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>

            ) : (

              <div className="flex gap-2">

                <button
                  onClick={handleCancel}
                  className="btn-secondary"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="btn-primary"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>

              </div>

            )}

          </div>
        </div>
      </div>


      {/* ---------------- MAIN GRID ---------------- */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ---------------- PERSONAL INFORMATION ---------------- */}

        <div className="card p-6 lg:col-span-2">

          <h3 className="section-title mb-4">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <InfoField
              icon={<UserIcon className="w-4 h-4" />}
              label="Full Name"
              value={form.name || ''}
              editing={editing}
              onChange={(v) =>
                setForm({
                  ...form,
                  name: v,
                })
              }
            />

            <InfoField
              icon={<Mail className="w-4 h-4" />}
              label="Email"
              value={form.email || ''}
              editing={editing}
              onChange={(v) =>
                setForm({
                  ...form,
                  email: v,
                })
              }
            />

            <InfoField
              icon={<Phone className="w-4 h-4" />}
              label="Phone"
              value={form.phone || ''}
              editing={editing}
              onChange={(v) =>
                setForm({
                  ...form,
                  phone: v,
                })
              }
            />

            <InfoField
              icon={<Building2 className="w-4 h-4" />}
              label="University"
              value={form.university || ''}
              editing={editing}
              onChange={(v) =>
                setForm({
                  ...form,
                  university: v,
                })
              }
            />

            <InfoField
              icon={<GraduationCap className="w-4 h-4" />}
              label="Branch / Year"
              value={form.year_and_branch || ''}
              editing={editing}
              onChange={(v) =>
                setForm({
                  ...form,
                  year_and_branch: v,
                })
              }
            />

            <InfoField
              icon={<Award className="w-4 h-4" />}
              label="CGPA"
              value={
                form.cgpa !== undefined
                  ? String(form.cgpa)
                  : ''
              }
              editing={editing}
              onChange={(v) =>
                setForm({
                  ...form,
                  cgpa: parseFloat(v) || 0,
                })
              }
            />

            <InfoField
              icon={<Target className="w-4 h-4" />}
              label="Target Role"
              value={form.target_role || ''}
              editing={editing}
              onChange={(v) =>
                setForm({
                  ...form,
                  target_role: v,
                })
              }
            />

            <InfoField
              icon={<Building2 className="w-4 h-4" />}
              label="Target Company"
              value={form.target_company || ''}
              editing={editing}
              onChange={(v) =>
                setForm({
                  ...form,
                  target_company: v,
                })
              }
            />

          </div>
        </div>


        {/* ---------------- RIGHT COLUMN ---------------- */}

        <div className="space-y-6">

          {/* SOCIAL LINKS */}

          <div className="card p-6">

            <h3 className="section-title mb-4">
              Social Links
            </h3>

            <div className="space-y-3">

              <LinkField
                icon={<Linkedin className="w-4 h-4" />}
                label="LinkedIn"
                value={form.linkedin_url || ''}
                editing={editing}
                onChange={(v) =>
                  setForm({
                    ...form,
                    linkedin_url: v,
                  })
                }
                color="text-[#0A66C2]"
              />

              <LinkField
                icon={<Github className="w-4 h-4" />}
                label="GitHub"
                value={form.github_url || ''}
                editing={editing}
                onChange={(v) =>
                  setForm({
                    ...form,
                    github_url: v,
                  })
                }
                color="text-ink-700"
              />

              <LinkField
                icon={<Globe className="w-4 h-4" />}
                label="Portfolio"
                value={form.portfolio_url || ''}
                editing={editing}
                onChange={(v) =>
                  setForm({
                    ...form,
                    portfolio_url: v,
                  })
                }
                color="text-accent-600"
              />

            </div>
          </div>


          {/* SKILLS */}

          <div className="card p-6">

            <h3 className="section-title mb-4">
              Skills
            </h3>

            <InfoDisplay
              icon={<Code className="w-4 h-4" />}
              value={form.skills || ''}
            />

          </div>


          {/* PROGRAMMING LANGUAGES */}

          <div className="card p-6">

            <h3 className="section-title mb-4">
              Programming Languages
            </h3>

            <InfoDisplay
              icon={<Code className="w-4 h-4" />}
              value={form.programming_languages || ''}
            />

          </div>

        </div>
      </div>


      {/* ---------------- PREPARATION INFORMATION ---------------- */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <InfoCard
          icon={<CalendarDays className="w-5 h-5" />}
          title="Preparation Deadline"
          value={form.deadline || ''}
        />

        <InfoCard
          icon={<Clock className="w-5 h-5" />}
          title="Daily Preparation"
          value={
            form.daily_hours
              ? `${form.daily_hours} hours/day`
              : ''
          }
        />

        <InfoCard
          icon={<Briefcase className="w-5 h-5" />}
          title="Target Company"
          value={form.target_company || ''}
        />

      </div>


      {/* ---------------- STRENGTHS & WEAKNESSES ---------------- */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* STRENGTHS */}

        <div className="card p-6">

          <h3 className="section-title mb-4">
            Strengths
          </h3>

          <p className="text-sm text-ink-600">
            {form.strengths || 'Not added yet'}
          </p>

        </div>


        {/* WEAKNESSES */}

        <div className="card p-6">

          <h3 className="section-title mb-4">
            Areas to Improve
          </h3>

          <p className="text-sm text-ink-600">
            {form.weaknesses || 'Not added yet'}
          </p>

        </div>

      </div>

    </div>
  );
}


/* ========================================================= */
/* INFO FIELD */
/* ========================================================= */

function InfoField({
  icon,
  label,
  value,
  editing,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
}) {

  return (
    <div>

      <label className="label">
        {label}
      </label>

      {editing ? (

        <div className="relative">

          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">
            {icon}
          </span>

          <input
            className="input pl-10"
            value={value || ''}
            onChange={(e) =>
              onChange(e.target.value)
            }
          />

        </div>

      ) : (

        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-ink-50/50">

          <span className="text-ink-400">
            {icon}
          </span>

          <span className="text-sm text-ink-800">
            {value || '—'}
          </span>

        </div>

      )}

    </div>
  );
}


/* ========================================================= */
/* LINK FIELD */
/* ========================================================= */

function LinkField({
  icon,
  label,
  value,
  editing,
  onChange,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
  color: string;
}) {

  return (
    <div>

      <label className="text-xs font-medium text-ink-500 mb-1 block">
        {label}
      </label>

      {editing ? (

        <input
          className="input"
          value={value || ''}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={`Add ${label} URL`}
        />

      ) : (

        <a
          href={value || '#'}
          target="_blank"
          rel="noreferrer"
          className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-ink-50/50 hover:bg-ink-50 transition-colors ${
            value
              ? ''
              : 'opacity-50 pointer-events-none'
          }`}
        >

          <span className={color}>
            {icon}
          </span>

          <span className="text-sm text-ink-700 truncate">
            {value || 'Not added'}
          </span>

        </a>

      )}

    </div>
  );
}


/* ========================================================= */
/* INFO DISPLAY */
/* ========================================================= */

function InfoDisplay({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: string;
}) {

  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-ink-50/50">

      <span className="text-ink-400">
        {icon}
      </span>

      <span className="text-sm text-ink-800">
        {value || 'Not added yet'}
      </span>

    </div>
  );
}


/* ========================================================= */
/* INFO CARD */
/* ========================================================= */

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {

  return (
    <div className="card p-6">

      <div className="flex items-center gap-3 mb-3">

        <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
          {icon}
        </div>

        <h3 className="font-semibold text-ink-800">
          {title}
        </h3>

      </div>

      <p className="text-sm text-ink-600">
        {value || 'Not added yet'}
      </p>

    </div>
  );
}