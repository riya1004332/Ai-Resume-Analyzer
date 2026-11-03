import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import { SkillGapComparison } from '../components/skills/SkillGapComparison';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { SkillGapOutput } from '@ai-resume/shared';
import {
  GitCompare,
  Sparkles,
  AlertCircle,
  FileText,
  Target,
  ArrowRight
} from 'lucide-react';

export const SkillGapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryRole = searchParams.get('role') || '';
  const queryAnalysisId = searchParams.get('analysisId') || '';

  const [targetJobRole, setTargetJobRole] = useState(queryRole || 'Full Stack Developer');
  const [careerDomain, setCareerDomain] = useState('Software Development');
  const [experienceLevel, setExperienceLevel] = useState<'fresher' | 'entry' | 'mid' | 'senior' | 'switcher'>('entry');
  const [preferredSkillLevel, setPreferredSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('intermediate');
  const [selectedAnalysisId, setSelectedAnalysisId] = useState(queryAnalysisId);
  const [currentSkills, setCurrentSkills] = useState('');
  const [gapResult, setGapResult] = useState<SkillGapOutput | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load previous analyses for easy selection
  const { data: analyses } = useQuery({
    queryKey: ['resumeAnalysesHistory'],
    queryFn: () => api.getAnalysisHistory()
  });

  useEffect(() => {
    if (queryRole) setTargetJobRole(queryRole);
    if (queryAnalysisId) setSelectedAnalysisId(queryAnalysisId);
  }, [queryRole, queryAnalysisId]);

  const mutation = useMutation({
    mutationFn: () =>
      api.generateSkillGap({
        targetJobRole: targetJobRole.trim(),
        careerDomain,
        experienceLevel,
        preferredSkillLevel,
        resumeAnalysisId: selectedAnalysisId || undefined,
        currentSkills: currentSkills.trim() || undefined
      }),
    onSuccess: (data) => {
      setGapResult(data.result);
      setErrorMsg(null);
    },
    onError: (err: any) => {
      setErrorMsg(err.message || 'Failed to generate skill gap comparison.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetJobRole.trim()) {
      setErrorMsg('Please specify a target job role.');
      return;
    }
    setErrorMsg(null);
    mutation.mutate();
  };

  const handleSelectSkillForRoadmap = (skillName: string) => {
    navigate(`/skill-improvement?skill=${encodeURIComponent(skillName)}`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
          <GitCompare className="w-3.5 h-3.5" />
          <span>Competency Benchmarking & Skill Prioritization</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Skill Gap Analyzer
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Compare your verified skills directly against the industry requirements for your dream job role. Uncover missing competencies, priority ratings, and recommended learning sequences.
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Target Role Form */}
      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Target Job Role"
              required
              placeholder="e.g. Cloud Security Engineer, React Developer, Data Scientist"
              value={targetJobRole}
              onChange={(e) => setTargetJobRole(e.target.value)}
              disabled={mutation.isPending}
            />

            <Select
              label="Career Domain"
              required
              value={careerDomain}
              onChange={(e) => setCareerDomain(e.target.value)}
              disabled={mutation.isPending}
              options={[
                { value: 'Software Development', label: 'Software Development' },
                { value: 'Data and Artificial Intelligence', label: 'Data & Artificial Intelligence' },
                { value: 'Cloud and DevOps', label: 'Cloud & DevOps' },
                { value: 'Cybersecurity and Networking', label: 'Cybersecurity & Networking' },
                { value: 'Design and Digital Products', label: 'Design & UI/UX' },
                { value: 'Business and Management', label: 'Business & Management' },
                { value: 'General', label: 'General / Other' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Current Experience Level"
              required
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value as any)}
              disabled={mutation.isPending}
              options={[
                { value: 'fresher', label: 'Fresher / Fresh Graduate' },
                { value: 'entry', label: 'Entry-Level (0 - 2 yrs)' },
                { value: 'mid', label: 'Mid-Level (2 - 5 yrs)' },
                { value: 'senior', label: 'Senior (5+ yrs)' },
                { value: 'switcher', label: 'Career Switcher' }
              ]}
            />

            <Select
              label="Target Proficiency Goal"
              value={preferredSkillLevel}
              onChange={(e) => setPreferredSkillLevel(e.target.value as any)}
              disabled={mutation.isPending}
              options={[
                { value: 'beginner', label: 'Beginner (Foundational)' },
                { value: 'intermediate', label: 'Intermediate (Job Ready)' },
                { value: 'advanced', label: 'Advanced (Autonomous)' },
                { value: 'expert', label: 'Expert (Architectural)' }
              ]}
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Link Previous Resume Analysis
              </label>
              <select
                value={selectedAnalysisId}
                onChange={(e) => setSelectedAnalysisId(e.target.value)}
                disabled={mutation.isPending}
                className="block w-full rounded-lg border border-slate-300 text-sm py-2 px-3.5 bg-white text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Use All Verified Profile Skills</option>
                {analyses?.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.target_job_role || 'General'} ({new Date(a.created_at).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!selectedAnalysisId && (
            <Input
              label="Additional Current Skills (Optional)"
              placeholder="e.g. JavaScript, React, SQL, Git, Linux"
              value={currentSkills}
              onChange={(e) => setCurrentSkills(e.target.value)}
              disabled={mutation.isPending}
              helperText="Comma-separated skills if you haven't uploaded a resume yet."
            />
          )}

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={mutation.isPending}
              rightIcon={<Sparkles className="w-4 h-4" />}
            >
              Run Skill Gap Analysis
            </Button>
          </div>
        </form>
      </Card>

      {/* Comparison Results */}
      {mutation.isPending ? (
        <div className="py-12 flex justify-center">
          <LoadingSpinner size="lg" text="Benchmarking skills against industry expectations..." />
        </div>
      ) : gapResult ? (
        <SkillGapComparison
          gapData={gapResult}
          onSelectSkillForRoadmap={handleSelectSkillForRoadmap}
        />
      ) : null}
    </div>
  );
};

