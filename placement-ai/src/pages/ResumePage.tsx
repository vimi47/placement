import { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Sparkles,
  TrendingUp,
  RefreshCw,
  GraduationCap,
  Briefcase,
  Award,
  Code2,
  Users,
  AlertTriangle,
} from 'lucide-react';

import { ProgressRing, SectionHeader } from '@/components/ui';
import { resumeService } from '@/services/endpoints';

interface ResumeAnalysis {
  ats_score: number;
  technical_skills: string[];
  education: string[];
  projects: string[];
  experience: string[];
  certifications: string[];
  leadership_activities: string[];
  strengths: string[];
  weaknesses: string[];
  missing_keywords: string[];
  suggestions: string[];
}

export function ResumePage() {
  const [result, setResult] = useState<ResumeAnalysis | null>(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const fileRef = useRef<HTMLInputElement>(null);

  // ============================================================
  // UPLOAD + AI ANALYSIS
  // ============================================================

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Only PDF is supported by backend
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF resume.');
      return;
    }

    setError('');
    setUploading(true);
    setResult(null);
    setFileName(file.name);

    try {
      // Step 1: Upload resume
      await resumeService.upload(file);

      setUploading(false);
      setLoading(true);

      // Step 2: Analyze resume using AI
      const response = await resumeService.analyze();

      setResult(response.analysis);

    } catch (err: any) {
      console.error('Resume processing failed:', err);

      setError(
        err?.response?.data?.detail ||
        'Resume upload or analysis failed. Please try again.'
      );
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

  // ============================================================
  // LOAD PREVIOUS ANALYSIS
  // ============================================================

  const handleLoadAnalysis = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await resumeService.getAnalysis();

      setResult(response.analysis);

    } catch (err: any) {
      console.error('Failed to load resume analysis:', err);

      // No previous analysis is okay
      if (err?.response?.status !== 404) {
        setError(
          err?.response?.data?.detail ||
          'Failed to load resume analysis.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================
useEffect(() => {
  handleLoadAnalysis();
}, []);

  // ============================================================
  // SCORE COLOR
  // ============================================================

  const scoreColor = (score: number) => {
    if (score >= 80) return '#25c883';
    if (score >= 60) return '#ff8d0d';
    return '#e22d2d';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Good match';
    if (score >= 60) return 'Needs improvement';
    return 'Below threshold';
  };

  // ============================================================
  // CATEGORY DATA
  // ============================================================

  const categories = result
    ? [
        {
          name: 'Technical Skills',
          icon: Code2,
          items: result.technical_skills,
        },
        {
          name: 'Education',
          icon: GraduationCap,
          items: result.education,
        },
        {
          name: 'Projects',
          icon: FileText,
          items: result.projects,
        },
        {
          name: 'Experience',
          icon: Briefcase,
          items: result.experience,
        },
        {
          name: 'Certifications',
          icon: Award,
          items: result.certifications,
        },
        {
          name: 'Leadership',
          icon: Users,
          items: result.leadership_activities,
        },
      ]
    : [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <SectionHeader
        title="Resume / ATS Analysis"
        subtitle="AI-powered resume scoring with ATS keyword optimization"
        icon={<FileText className="w-5 h-5" />}
      />

      {/* ====================================================== */}
      {/* ERROR */}
      {/* ====================================================== */}

      {error && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ====================================================== */}
      {/* UPLOAD */}
      {/* ====================================================== */}

      <div className="card p-6">

        <input
          ref={fileRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleUpload}
        />

        {!uploading && !loading ? (
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-ink-200 rounded-xl py-10 flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-primary-600" />
            </div>

            <p className="text-sm font-medium text-ink-700">
              Click to upload your resume
            </p>

            <p className="text-xs text-ink-400 mt-1">
              PDF only — max 5MB
            </p>
          </div>
        ) : (
          <div className="py-10 flex flex-col items-center">

            <div className="w-14 h-14 border-3 border-ink-100 border-t-primary-500 rounded-full animate-spin mb-3" />

            <p className="text-sm text-ink-500">
              {uploading
                ? 'Uploading your resume...'
                : 'Analyzing your resume with AI...'}
            </p>

            <p className="text-xs text-ink-400 mt-1">
              Extracting skills, experience, keywords and recommendations
            </p>

          </div>
        )}
      </div>

      {/* ====================================================== */}
      {/* RESULTS */}
      {/* ====================================================== */}

      {result && !loading && (

        <>
          {/* ================================================== */}
          {/* ATS SCORE */}
          {/* ================================================== */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="card p-6 flex flex-col items-center justify-center">

              <ProgressRing
                value={result.ats_score}
                label={`${result.ats_score}`}
                sublabel="ATS Score"
                size={140}
                color={scoreColor(result.ats_score)}
              />

              <div className="mt-3 text-center">

                <span
                  className={`badge ${
                    result.ats_score >= 80
                      ? 'badge-success'
                      : result.ats_score >= 60
                      ? 'badge-warning'
                      : 'badge-error'
                  }`}
                >
                  {getScoreLabel(result.ats_score)}
                </span>

              </div>

              {fileName && (
                <p className="text-xs text-ink-400 mt-2">
                  File: {fileName}
                </p>
              )}

            </div>

            {/* SCORE SUMMARY */}

            <div className="card p-6 lg:col-span-2">

              <h3 className="section-title mb-4">
                Resume Overview
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                <div className="p-4 rounded-xl bg-primary-50">
                  <p className="text-xs text-ink-400">
                    Technical Skills
                  </p>
                  <p className="text-2xl font-bold text-primary-700 mt-1">
                    {result.technical_skills.length}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-accent-50">
                  <p className="text-xs text-ink-400">
                    Projects
                  </p>
                  <p className="text-2xl font-bold text-accent-700 mt-1">
                    {result.projects.length}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-success-50">
                  <p className="text-xs text-ink-400">
                    Experience
                  </p>
                  <p className="text-2xl font-bold text-success-700 mt-1">
                    {result.experience.length}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-warning-50">
                  <p className="text-xs text-ink-400">
                    Certifications
                  </p>
                  <p className="text-2xl font-bold text-warning-700 mt-1">
                    {result.certifications.length}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-ink-50">
                  <p className="text-xs text-ink-400">
                    Missing Keywords
                  </p>
                  <p className="text-2xl font-bold text-ink-700 mt-1">
                    {result.missing_keywords.length}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-primary-50">
                  <p className="text-xs text-ink-400">
                    Suggestions
                  </p>
                  <p className="text-2xl font-bold text-primary-700 mt-1">
                    {result.suggestions.length}
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* ================================================== */}
          {/* PARSED RESUME INFORMATION */}
          {/* ================================================== */}

          <div className="card p-6">

            <h3 className="section-title mb-4">
              Resume Information
            </h3>

            <div className="space-y-4">

              {categories.map((category) => {

                const Icon = category.icon;

                return (
                  <div
                    key={category.name}
                    className="p-4 rounded-xl border border-ink-100 hover:border-ink-200 transition-colors"
                  >

                    <div className="flex items-center gap-2 mb-3">

                      <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary-600" />
                      </div>

                      <h4 className="font-semibold text-ink-800 text-sm">
                        {category.name}
                      </h4>

                    </div>

                    {category.items.length > 0 ? (

                      <div className="space-y-2">

                       {category.items.map((item: any, index) => (
  <div
    key={index}
    className="p-3 rounded-lg bg-ink-50/50 text-sm text-ink-600"
  >
    <div className="flex items-start gap-2">
      <CheckCircle2 className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />

      <div className="space-y-1">
        {typeof item === 'string' ? (
          <p>{item}</p>
        ) : (
          Object.entries(item).map(([key, value]) => (
            <div key={key}>
              <span className="font-medium text-ink-700 capitalize">
                {key.replace(/_/g, ' ')}:
              </span>{' '}
              <span>
                {Array.isArray(value)
                  ? value.join(', ')
                  : String(value ?? '')}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
))}

                      </div>

                    ) : (

                      <p className="text-sm text-ink-400">
                        No information detected.
                      </p>

                    )}

                  </div>
                );
              })}

            </div>

          </div>

          {/* ================================================== */}
          {/* STRENGTHS + WEAKNESSES */}
          {/* ================================================== */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* STRENGTHS */}

            <div className="card p-6">

              <div className="flex items-center gap-2 mb-4">

                <div className="w-8 h-8 rounded-lg bg-success-50 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-success-600" />
                </div>

                <h3 className="section-title">
                  Strengths
                </h3>

              </div>

              <div className="space-y-3">

                {result.strengths.length > 0 ? (

                  result.strengths.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-xl bg-success-50/50"
                    >
                      <CheckCircle2 className="w-4 h-4 text-success-600 mt-0.5 shrink-0" />

                      <p className="text-sm text-ink-600">
                        {item}
                      </p>
                    </div>
                  ))

                ) : (

                  <p className="text-sm text-ink-400">
                    No strengths identified.
                  </p>

                )}

              </div>

            </div>

            {/* WEAKNESSES */}

            <div className="card p-6">

              <div className="flex items-center gap-2 mb-4">

                <div className="w-8 h-8 rounded-lg bg-warning-50 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-warning-600" />
                </div>

                <h3 className="section-title">
                  Areas to Improve
                </h3>

              </div>

              <div className="space-y-3">

                {result.weaknesses.length > 0 ? (

                  result.weaknesses.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-xl bg-warning-50/50"
                    >
                      <AlertCircle className="w-4 h-4 text-warning-600 mt-0.5 shrink-0" />

                      <p className="text-sm text-ink-600">
                        {item}
                      </p>
                    </div>
                  ))

                ) : (

                  <p className="text-sm text-ink-400">
                    No major weaknesses identified.
                  </p>

                )}

              </div>

            </div>

          </div>

          {/* ================================================== */}
          {/* MISSING KEYWORDS */}
          {/* ================================================== */}

          <div className="card p-6">

            <div className="flex items-center gap-2 mb-4">

              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>

              <h3 className="section-title">
                Missing / Weak Keywords
              </h3>

            </div>

            {result.missing_keywords.length > 0 ? (

              <div className="flex flex-wrap gap-2">

                {result.missing_keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="badge-error text-[11px]"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {keyword}
                  </span>
                ))}

              </div>

            ) : (

              <p className="text-sm text-success-600">
                No major missing keywords detected.
              </p>

            )}

          </div>

          {/* ================================================== */}
          {/* AI SUGGESTIONS */}
          {/* ================================================== */}

          <div className="card p-6">

            <div className="flex items-center gap-2 mb-4">

              <div className="w-8 h-8 rounded-lg bg-warning-50 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-warning-600" />
              </div>

              <h3 className="section-title">
                AI Suggestions
              </h3>

            </div>

            <div className="space-y-3">

              {result.suggestions.map((suggestion, index) => (

                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl bg-ink-50/50"
                >

                  <span className="w-6 h-6 rounded-full bg-warning-100 text-warning-700 text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>

                  <p className="text-sm text-ink-600">
  {typeof suggestion === 'string'
    ? suggestion
    : JSON.stringify(suggestion)}
</p>

                </div>

              ))}

            </div>

          </div>

          {/* ================================================== */}
          {/* QUICK ACTIONS */}
          {/* ================================================== */}

          <div className="card p-6">

            <div className="flex items-center gap-2 mb-4">

              <div className="w-8 h-8 rounded-lg bg-accent-50 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-accent-600" />
              </div>

              <h3 className="section-title">
                Quick Actions
              </h3>

            </div>

            <div className="flex gap-2">

              <button
                onClick={() => fileRef.current?.click()}
                className="btn-secondary text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Re-analyze Resume
              </button>

            </div>

          </div>

        </>

      )}

      {/* ====================================================== */}
      {/* NO RESULT YET */}
      {/* ====================================================== */}

      {!result && !loading && !uploading && !error && (
        <div className="card p-8 text-center">

          <FileText className="w-10 h-10 text-ink-300 mx-auto mb-3" />

          <h3 className="font-semibold text-ink-700">
            Upload your resume to begin
          </h3>

          <p className="text-sm text-ink-400 mt-1">
            Our AI will analyze your resume and generate an ATS score,
            strengths, weaknesses, missing keywords and suggestions.
          </p>

        </div>
      )}

    </div>
  );
}