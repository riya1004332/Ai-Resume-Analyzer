import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { JobPreparationView } from '../components/career/JobPreparationView';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { JobPreparationOutput } from '@ai-resume/shared';
import {
  Briefcase,
  Sparkles,
  AlertCircle,
  Calendar,
  Layers,
  CheckCircle2
} from 'lucide-react';

export const JobPreparationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryRole = searchParams.get('role') || '';
  const queryClient = useQueryClient();

  const [targetJobRole, setTargetJobRole] = useState(queryRole || 'Full Stack Developer');
  const [experienceLevel, setExperienceLevel] = useState<'fresher' | 'entry' | 'mid' | 'senior' | 'switcher'>('entry');
  const [preparationDuration, setPreparationDuration] = useState('8 weeks');
  const [selectedInterviews, setSelectedInterviews] = useState<string[]>([
    'Technical / Coding Assessment',
    'Behavioral & HR Interview',
    'System Design Fundamentals'
  ]);
  const [currentPreparationLevel, setCurrentPreparationLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [activePlan, setActivePlan] = useState<JobPreparationOutput | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (queryRole) setTargetJobRole(queryRole);
  }, [queryRole]);

  // Load latest plan
  const { data: savedPlan, isLoading: isLoadingSaved } = useQuery({
    queryKey: ['latestJobPreparationPlan'],
    queryFn: () => api.getJobPreparation()
  });

  useEffect(() => {
    if (savedPlan?.plan) {
      setActivePlan(savedPlan.plan);
    }
  }, [savedPlan]);

  const interviewOptions = [
    'Technical / Coding Assessment',
    'System Design Fundamentals',
    'Behavioral & HR Interview',
    'Domain Case Study & Architecture',
    'Take-Home Practical Assignment'
  ];

  const toggleInterview = (opt: string) => {
    if (selectedInterviews.includes(opt)) {
      if (selectedInterviews.length > 1) {
        setSelectedInterviews(selectedInterviews.filter((i) => i !== opt));
      }
    } else {
      setSelectedInterviews([...selectedInterviews, opt]);
    }
  };

  const mutation = useMutation({
    mutationFn: () =>
      api.generateJobPreparation({
        targetJobRole: targetJobRole.trim(),
        experienceLevel,
        preparationDuration,
        interviewTypes: selectedInterviews,
        currentPreparationLevel
      }),
    onSuccess: (data) => {
      setActivePlan(data.plan);
      setErrorMsg(null);
      queryClient.invalidateQueries({ queryKey: ['latestJobPreparationPlan'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    },
    onError: (err: any) => {
      setErrorMsg(err.message || 'Failed to generate job preparation roadmap.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetJobRole.trim()) {
      setErrorMsg('Please enter a target job role.');
      return;
    }
    setErrorMsg(null);
    mutation.mutate();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Job Hunt Strategy & Technical Interview Readiness</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Job Preparation Advisor
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Get a comprehensive, week-by-week strategy covering resume tailoring, LinkedIn positioning, portfolio development, and technical interview mock preparation.
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Input Form */}
      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Target Role"
              required
              placeholder="e.g. Software Engineer, Data Analyst"
              value={targetJobRole}
              onChange={(e) => setTargetJobRole(e.target.value)}
              disabled={mutation.isPending}
            />

            <Select
              label="Experience Level"
              required
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value as any)}
              disabled={mutation.isPending}
              options={[
                { value: 'fresher', label: 'Fresh Graduate / Student' },
                { value: 'entry', label: 'Entry-Level (0 - 2 yrs)' },
                { value: 'mid', label: 'Mid-Level (2 - 5 yrs)' },
                { value: 'senior', label: 'Senior (5+ yrs)' },
                { value: 'switcher', label: 'Career Switcher' }
              ]}
            />

            <Select
              label="Preparation Timeline"
              required
              value={preparationDuration}
              onChange={(e) => setPreparationDuration(e.target.value)}
              disabled={mutation.isPending}
              options={[
                { value: '4 weeks', label: 'Sprint (4 Weeks)' },
                { value: '8 weeks', label: 'Standard (8 Weeks)' },
                { value: '12 weeks', label: 'Comprehensive (12 Weeks)' },
                { value: '16 weeks', label: 'Extensive (16 Weeks)' }
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Interview Categories to Target <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {interviewOptions.map((opt) => {
                const isSelected = selectedInterviews.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleInterview(opt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={mutation.isPending}
              rightIcon={<Sparkles className="w-4 h-4" />}
            >
              Generate Job Preparation Roadmap
            </Button>
          </div>
        </form>
      </Card>

      {/* Output Results */}
      {mutation.isPending ? (
        <div className="py-12 flex justify-center">
          <LoadingSpinner size="lg" text="Assembling weekly milestones, interview mocks, and application timeline..." />
        </div>
      ) : activePlan ? (
        <JobPreparationView plan={activePlan} />
      ) : null}
    </div>
  );
};

