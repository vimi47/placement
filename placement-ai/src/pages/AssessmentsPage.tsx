import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Code2, Brain, Clock, Play, Trophy, Star, ArrowLeft,
} from 'lucide-react';
import { SectionHeader, EmptyState, ProgressBar } from '@/components/ui';
import { demoAptitudeAssessments } from '@/data/demoData';
import { codingService } from '@/services/endpoints';
import type { Assessment } from '@/types';

interface CodingQuestion {
  question_id: number;
  title: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  problem_statement: string;
  input_format: string;
  output_format: string;
  constraints: string[];
  sample_input: string;
  sample_output: string;
  explanation: string;
}

interface CodingAssessment {
  assessment_title: string;
  target_company: string;
  target_role: string;
  assessment_strategy: string;
  total_questions: number;
  recommended_duration_minutes: number;
  questions: CodingQuestion[];
}

export function AssessmentsPage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();

  const isCoding = type === 'coding';

  const [codingAssessment, setCodingAssessment] =
    useState<CodingAssessment | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isCoding) return;

    const loadCodingAssessment = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await codingService.getAssessment();

if (response.assessment_outdated) {
  setCodingAssessment(null);

  setError(
    response.message ||
      'Your profile has changed. Please regenerate your coding assessment.'
  );

  return;
}

setCodingAssessment(response.assessment);
      } catch (err: any) {
        console.error(
          'Failed to load coding assessment:',
          err
        );

        if (err.response?.status === 404) {
          setCodingAssessment(null);
          setError(
            'No coding assessment found. Generate your personalized assessment to begin.'
          );
        } else {
          setError(
            err.response?.data?.detail ||
            'Unable to load your coding assessment.'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadCodingAssessment();
  }, [isCoding]);

  /*
   * CODING ASSESSMENT PAGE
   */

  if (isCoding) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">

        <SectionHeader
          title="Coding Assessments"
          subtitle="Company-tailored coding practice based on your target role and skill gaps"
          icon={<Code2 className="w-5 h-5" />}
        />

        {loading && (
          <div className="card p-8 text-center">
            <p className="text-sm text-ink-500">
              Loading your personalized coding assessment...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="card p-8 text-center">
            <Code2 className="w-10 h-10 mx-auto mb-3 text-ink-300" />

            <h3 className="font-semibold text-ink-900 mb-2">
              Assessment Needs Updating
            </h3>

            <p className="text-sm text-ink-500 mb-5">
              {error}
            </p>

            <button
              onClick={async () => {
                try {
                  setLoading(true);
                  setError('');

                  const data =
                    await codingService.generate();

                  setCodingAssessment(data);
                } catch (err: any) {
                  console.error(
                    'Failed to generate coding assessment:',
                    err
                  );

                  setError(
                    err.response?.data?.detail ||
                    'Unable to generate your coding assessment.'
                  );
                } finally {
                  setLoading(false);
                }
              }}
              className="btn-primary"
            >
              <Play className="w-4 h-4" />
              Regenerate Assessment
            </button>
          </div>
        )}

        {!loading && codingAssessment && (
          <>
            {/* Assessment overview */}

            <div className="card p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Code2 className="w-5 h-5 text-primary-600" />

                    <span className="badge-primary">
                      Company Tailored
                    </span>
                  </div>

                  <h2 className="text-xl font-bold font-display text-ink-900">
                    {codingAssessment.assessment_title}
                  </h2>

                  <p className="text-sm text-ink-500 mt-2">
                    {codingAssessment.assessment_strategy}
                  </p>
                </div>

                <div className="flex gap-6 text-center">

                  <div>
                    <p className="text-xl font-bold text-ink-900">
                      {codingAssessment.total_questions}
                    </p>
                    <p className="text-xs text-ink-400">
                      Questions
                    </p>
                  </div>

                  <div>
                    <p className="text-xl font-bold text-ink-900">
                      {codingAssessment.recommended_duration_minutes}
                    </p>
                    <p className="text-xs text-ink-400">
                      Minutes
                    </p>
                  </div>

                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-ink-100 flex flex-wrap gap-2">

                <span className="badge-neutral">
                  Company: {codingAssessment.target_company}
                </span>

                <span className="badge-neutral">
                  Role: {codingAssessment.target_role}
                </span>

              </div>
            </div>

            {/* Questions */}

            <div className="space-y-3">

              <h3 className="text-sm font-semibold text-ink-500 uppercase tracking-wide">
                Coding Questions
              </h3>

              {codingAssessment.questions.map((question) => (

                <div
                  key={question.question_id}
                  className="card card-hover p-5"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex items-start gap-3">

                      <div className="w-9 h-9 rounded-lg bg-ink-50 flex items-center justify-center shrink-0">

                        <span className="text-sm font-bold text-ink-600">
                          {question.question_id}
                        </span>

                      </div>

                      <div>

                        <h4 className="font-semibold text-ink-900">
                          {question.title}
                        </h4>

                        <div className="flex flex-wrap gap-2 mt-2">

                          <span className="badge-neutral text-[10px]">
                            {question.topic}
                          </span>

                          <span
                            className={
                              question.difficulty === 'Easy'
                                ? 'badge-success text-[10px]'
                                : question.difficulty === 'Medium'
                                ? 'badge-warning text-[10px]'
                                : 'badge-error text-[10px]'
                            }
                          >
                            {question.difficulty}
                          </span>

                        </div>

                      </div>

                    </div>

                  </div>

                  <p className="text-sm text-ink-600 mt-4 leading-relaxed">
                    {question.problem_statement}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

                    <div className="rounded-lg bg-ink-50 p-3">
                      <p className="text-xs font-semibold text-ink-500 mb-1">
                        Input
                      </p>

                      <p className="text-xs text-ink-600 whitespace-pre-wrap">
                        {question.input_format}
                      </p>
                    </div>

                    <div className="rounded-lg bg-ink-50 p-3">
                      <p className="text-xs font-semibold text-ink-500 mb-1">
                        Output
                      </p>

                      <p className="text-xs text-ink-600 whitespace-pre-wrap">
                        {question.output_format}
                      </p>
                    </div>

                  </div>

                  <div className="mt-4">

                    <p className="text-xs font-semibold text-ink-500 mb-2">
                      Constraints
                    </p>

                    <ul className="list-disc pl-5 space-y-1">

                      {question.constraints.map(
                        (constraint, index) => (
                          <li
                            key={index}
                            className="text-xs text-ink-500"
                          >
                            {constraint}
                          </li>
                        )
                      )}

                    </ul>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

                    <div>
                      <p className="text-xs font-semibold text-ink-500 mb-1">
                        Sample Input
                      </p>

                      <pre className="rounded-lg bg-ink-900 text-white p-3 text-xs overflow-x-auto">
                        {question.sample_input}
                      </pre>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-ink-500 mb-1">
                        Sample Output
                      </p>

                      <pre className="rounded-lg bg-ink-900 text-white p-3 text-xs overflow-x-auto">
                        {question.sample_output}
                      </pre>
                    </div>

                  </div>

                </div>

              ))}

            </div>
          </>
        )}

        {/* Switch to aptitude */}

        <div className="flex justify-center pt-2">

          <button
            onClick={() =>
              navigate('/assessments/aptitude')
            }
            className="btn-secondary text-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Switch to Aptitude Assessments
          </button>

        </div>

      </div>
    );
  }

  /*
   * EXISTING APTITUDE ASSESSMENTS
   */

  const assessments: Assessment[] =
    demoAptitudeAssessments;

  const completed = assessments.filter(
    (a) => a.status === 'completed'
  );

  const inProgress = assessments.filter(
    (a) => a.status === 'in-progress'
  );

  const avgScore =
    completed.length > 0
      ? Math.round(
          completed.reduce(
            (acc, a) => acc + (a.score || 0),
            0
          ) / completed.length
        )
      : 0;

  const difficultyBadge = (d: string) => {
    if (d === 'Easy') return 'badge-success';
    if (d === 'Medium') return 'badge-warning';
    return 'badge-error';
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      <SectionHeader
        title="Aptitude Assessments"
        subtitle="Quantitative, logical reasoning, verbal ability, and data interpretation"
        icon={<Brain className="w-5 h-5" />}
        action={
          <div className="flex gap-3">

            <div className="text-center">
              <p className="text-2xl font-bold font-display text-ink-900">
                {completed.length}
              </p>

              <p className="text-xs text-ink-400">
                Completed
              </p>
            </div>

            <div className="w-px bg-ink-100" />

            <div className="text-center">
              <p className="text-2xl font-bold font-display text-success-600">
                {avgScore || '—'}
              </p>

              <p className="text-xs text-ink-400">
                Avg Score
              </p>
            </div>

          </div>
        }
      />

      {inProgress.length > 0 && (
        <div className="space-y-3">

          <h3 className="text-sm font-semibold text-ink-500 uppercase tracking-wide">
            Continue
          </h3>

          {inProgress.map((a) => (
            <div
              key={a.id}
              className="card p-5 border-l-4 border-l-primary-400"
            >

              <div className="flex items-center justify-between">

                <div className="flex-1">

                  <div className="flex items-center gap-2 mb-1">

                    <h4 className="font-semibold text-ink-900">
                      {a.title}
                    </h4>

                    <span className="badge-primary text-[10px]">
                      In Progress
                    </span>

                  </div>

                  <div className="flex items-center gap-3 text-xs text-ink-400">

                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {a.duration_minutes} min
                    </span>

                    <span
                      className={difficultyBadge(
                        a.difficulty
                      )}
                    >
                      {a.difficulty}
                    </span>

                  </div>

                </div>

                <button className="btn-primary text-sm">
                  Resume
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

      <div className="space-y-3">

        <h3 className="text-sm font-semibold text-ink-500 uppercase tracking-wide">
          Available Assessments
        </h3>

        {assessments
          .filter((a) => a.status !== 'in-progress')
          .map((a) => (

            <div
              key={a.id}
              className="card card-hover p-5"
            >

              <div className="flex items-start justify-between mb-3">

                <div className="w-10 h-10 rounded-xl bg-ink-50 flex items-center justify-center">

                  {a.status === 'completed' ? (
                    <Trophy className="w-5 h-5 text-warning-500" />
                  ) : (
                    <Brain className="w-5 h-5 text-accent-600" />
                  )}

                </div>

                <span
                  className={difficultyBadge(
                    a.difficulty
                  )}
                >
                  {a.difficulty}
                </span>

              </div>

              <h4 className="font-semibold text-ink-900 text-sm">
                {a.title}
              </h4>

              <div className="flex items-center gap-3 mt-2 text-xs text-ink-400">

                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {a.duration_minutes} min
                </span>

                <span>·</span>

                <span>
                  {a.topics.join(', ')}
                </span>

              </div>

              {a.status === 'completed' && (
                <div className="mt-3 pt-3 border-t border-ink-100">

                  <div className="flex items-center justify-between mb-1.5">

                    <span className="text-xs text-ink-500">
                      Your Score
                    </span>

                    <span className="text-sm font-bold text-ink-900">
                      {a.score}/{a.max_score}
                    </span>

                  </div>

                  <ProgressBar
                    value={a.score || 0}
                    max={a.max_score}
                    color={
                      a.score && a.score >= 80
                        ? 'bg-success-500'
                        : 'bg-warning-500'
                    }
                    height="h-1.5"
                  />

                </div>
              )}

              <div className="mt-4">

                {a.status === 'completed' ? (
                  <button className="btn-secondary w-full text-sm">
                    <Star className="w-3.5 h-3.5" />
                    View Results
                  </button>
                ) : (
                  <button className="btn-primary w-full text-sm">
                    <Play className="w-3.5 h-3.5" />
                    Start Assessment
                  </button>
                )}

              </div>

            </div>

          ))}

      </div>

      <div className="flex justify-center pt-2">

        <button
          onClick={() =>
            navigate('/assessments/coding')
          }
          className="btn-secondary text-sm"
        >
          <Code2 className="w-3.5 h-3.5" />
          Switch to Coding Assessments
        </button>

      </div>

    </div>
  );
}