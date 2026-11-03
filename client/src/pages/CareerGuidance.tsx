import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { CareerRecommendationCard } from '../components/career/CareerRecommendationCard';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Textarea } from '../components/common/Textarea';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { CareerGuidanceOutput } from '@ai-resume/shared';
import {
  Compass,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ListOrdered
} from 'lucide-react';

export const CareerGuidancePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryAnalysisId = searchParams.get('analysisId') || '';
  const queryClient = useQueryClient();

  const [educationLevel, setEducationLevel] = useState("Bachelor's Degree");
  const [careerInterest, setCareerInterest] = useState('Full Stack Web Development & Cloud Systems');
  const [existingSkills, setExistingSkills] = useState('JavaScript, TypeScript, React, Node.js, SQL, Git');
  const [experienceLevel, setExperienceLevel] = useState<'fresher' | 'entry' | 'mid' | 'senior' | 'switcher'>('entry');
  const [preferredDomain, setPreferredDomain] = useState('Software Development');
  const [guidanceResult, setGuidanceResult] = useState<CareerGuidanceOutput | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch latest saved recommendations
  const { data: savedRec, isLoading: isLoadingSaved } = useQuery({
    queryKey: ['latestCareerRecommendations'],
    queryFn: () => api.getCareerGuidance()
  });

  useEffect(() => {
    if (savedRec?.recommendations) {
      setGuidanceResult(savedRec.recommendations);
    }
  }, [savedRec]);

  const mutation = useMutation({
    mutationFn: () =>
      api.generateCareerGuidance({
        educationLevel,
        careerInterest,
        existingSkills,
        experienceLevel,
        preferredDomain,
        resumeAnalysisId: queryAnalysisId || undefined
      }),
    onSuccess: (data) => {
      setGuidanceResult(data.recommendations);
      setErrorMsg(null);
      queryClient.invalidateQueries({ queryKey: ['latestCareerRecommendations'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    },
    onError: (err: any) => {
      setErrorMsg(err.message || 'Failed to generate career recommendations.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerInterest.trim() || !existingSkills.trim()) {
      setErrorMsg('Please provide your career interest and current skills.');
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
          <Compass className="w-3.5 h-3.5" />
          <span>Intelligent Career Matching & Progression Pathways</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Career Recommendations Advisor
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Discover high-alignment roles engineered around your educational background, practical skills, and personal career ambitions.
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
            <Select
              label="Education Level"
              required
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              disabled={mutation.isPending}
              options={[
                { value: "High School / Diploma", label: 'High School / Diploma' },
                { value: "Bachelor's Degree", label: "Bachelor's Degree" },
                { value: "Master's Degree", label: "Master's Degree" },
                { value: "PhD / Doctorate", label: 'PhD / Doctorate' },
                { value: "Bootcamp Graduate / Self-Taught", label: 'Bootcamp / Self-Taught' }
              ]}
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
              label="Preferred Career Domain"
              required
              value={preferredDomain}
              onChange={(e) => setPreferredDomain(e.target.value)}
              disabled={mutation.isPending}
              options={[
                { value: 'Software Development', label: 'Software Development' },
                { value: 'Data and Artificial Intelligence', label: 'Data & AI' },
                { value: 'Cloud and DevOps', label: 'Cloud & DevOps' },
                { value: 'Cybersecurity and Networking', label: 'Cybersecurity & Networking' },
                { value: 'Design and Digital Products', label: 'Design & UI/UX' },
                { value: 'Business and Management', label: 'Business & Management' }
              ]}
            />
          </div>

          <Input
            label="Career Interest / Desired Direction"
            required
            placeholder="e.g. Modern frontend development with React, backend architecture, machine learning engineering"
            value={careerInterest}
            onChange={(e) => setCareerInterest(e.target.value)}
            disabled={mutation.isPending}
          />

          <Textarea
            label="Current Core Skills & Proficiencies"
            required
            placeholder="e.g. JavaScript, Python, React, Docker, SQL, REST APIs, Git"
            value={existingSkills}
            onChange={(e) => setExistingSkills(e.target.value)}
            disabled={mutation.isPending}
            rows={2}
          />

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={mutation.isPending}
              rightIcon={<Sparkles className="w-4 h-4" />}
            >
              Generate Career Recommendations
            </Button>
          </div>
        </form>
      </Card>

      {/* Output Results */}
      {mutation.isPending ? (
        <div className="py-12 flex justify-center">
          <LoadingSpinner size="lg" text="Analyzing qualifications and modeling career pathways..." />
        </div>
      ) : guidanceResult ? (
        <div className="space-y-8">
          {/* Executive Career Summary */}
          <Card className="p-6 bg-gradient-to-r from-indigo-950 to-slate-900 text-white">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Personalized Guidance Assessment
            </span>
            <p className="text-sm text-slate-200 mt-2 leading-relaxed">
              {guidanceResult.career_summary}
            </p>
          </Card>

          {/* Recommended Roles Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Top Matched Career Opportunities ({guidanceResult.recommended_roles?.length || 0})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guidanceResult.recommended_roles?.map((role, idx) => (
                <CareerRecommendationCard key={idx} role={role} />
              ))}
            </div>
          </div>

          {/* Actionable Next Steps */}
          {guidanceResult.next_steps && guidanceResult.next_steps.length > 0 && (
            <Card className="p-6 border-t-4 border-t-indigo-600">
              <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
                <ListOrdered className="w-5 h-5 text-indigo-600" />
                Strategic Next Steps
              </h4>
              <ul className="space-y-2">
                {guidanceResult.next_steps.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      ) : null}
    </div>
  );
};

