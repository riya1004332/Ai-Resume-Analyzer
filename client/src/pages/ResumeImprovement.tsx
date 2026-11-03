import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Textarea } from '../components/common/Textarea';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ResumeImprovementOutput } from '@ai-resume/shared';
import {
  FileCheck2,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Lightbulb,
  Check,
  Copy,
  Hash,
  LayoutTemplate
} from 'lucide-react';

export const ResumeImprovementPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryAnalysisId = searchParams.get('analysisId') || '';

  const [selectedAnalysisId, setSelectedAnalysisId] = useState(queryAnalysisId);
  const [targetJobRole, setTargetJobRole] = useState('');
  const [selectedFocus, setSelectedFocus] = useState<string[]>([
    'Professional Summary',
    'Work Experience',
    'Projects',
    'ATS Keywords'
  ]);
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [improvementResult, setImprovementResult] = useState<ResumeImprovementOutput | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Load previous analyses
  const { data: analyses, isLoading: isLoadingAnalyses } = useQuery({
    queryKey: ['resumeAnalysesHistory'],
    queryFn: () => api.getAnalysisHistory()
  });

  useEffect(() => {
    if (queryAnalysisId) {
      setSelectedAnalysisId(queryAnalysisId);
    } else if (analyses && analyses.length > 0 && !selectedAnalysisId) {
      setSelectedAnalysisId(analyses[0].id);
    }
  }, [queryAnalysisId, analyses]);

  const focusOptions = [
    'Professional Summary',
    'Work Experience',
    'Technical Skills',
    'Projects',
    'Education & Certifications',
    'ATS Keywords',
    'Resume Formatting',
    'Grammar & Impact'
  ];

  const toggleFocus = (opt: string) => {
    if (selectedFocus.includes(opt)) {
      if (selectedFocus.length > 1) {
        setSelectedFocus(selectedFocus.filter((f) => f !== opt));
      }
    } else {
      setSelectedFocus([...selectedFocus, opt]);
    }
  };

  const mutation = useMutation({
    mutationFn: () =>
      api.generateResumeImprovement({
        resumeAnalysisId: selectedAnalysisId,
        targetJobRole: targetJobRole.trim() || undefined,
        improvementFocus: selectedFocus,
        additionalInstructions: additionalInstructions.trim() || undefined
      }),
    onSuccess: (data) => {
      setImprovementResult(data);
      setErrorMsg(null);
    },
    onError: (err: any) => {
      setErrorMsg(err.message || 'Failed to generate resume improvements.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnalysisId) {
      setErrorMsg('Please select a resume analysis to base improvements upon.');
      return;
    }
    setErrorMsg(null);
    mutation.mutate();
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Before-and-After Rewriting & Impact Formula</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Resume Improvement Advisor
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Receive tailored phrasing suggestions using the Google XYZ accomplishment formula ("Accomplished [X], as measured by [Y], by doing [Z]") with high-impact power verbs.
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Card */}
      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                Select Resume Analysis <span className="text-rose-500">*</span>
              </label>
              {isLoadingAnalyses ? (
                <div className="py-2 text-xs text-slate-400">Loading analysis history...</div>
              ) : analyses && analyses.length > 0 ? (
                <select
                  value={selectedAnalysisId}
                  onChange={(e) => setSelectedAnalysisId(e.target.value)}
                  disabled={mutation.isPending}
                  className="block w-full rounded-lg border border-slate-300 text-sm py-2 px-3.5 bg-white text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  {analyses.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.target_job_role || 'General Analysis'} — Score: {Math.round(a.overall_score)}% ({new Date(a.created_at).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800">
                  No resume analyses found. Please{' '}
                  <Link to="/analyzer" className="font-bold underline">
                    upload and analyze a resume first
                  </Link>.
                </div>
              )}
            </div>

            <Input
              label="Target Job Role (Optional)"
              placeholder="e.g. Senior Frontend Engineer"
              value={targetJobRole}
              onChange={(e) => setTargetJobRole(e.target.value)}
              disabled={mutation.isPending}
              helperText="Tailors power verbs and domain keywords to this specific position."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Improvement Focus Areas <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {focusOptions.map((opt) => {
                const isSelected = selectedFocus.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleFocus(opt)}
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

          <Textarea
            label="Additional Custom Instructions (Optional)"
            placeholder="e.g. Emphasize full-stack React and PostgreSQL experience; make tone confident but concise."
            value={additionalInstructions}
            onChange={(e) => setAdditionalInstructions(e.target.value)}
            disabled={mutation.isPending}
            rows={2}
          />

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!selectedAnalysisId || mutation.isPending}
              isLoading={mutation.isPending}
              rightIcon={<Sparkles className="w-4 h-4" />}
            >
              Generate Rewrites & Suggestions
            </Button>
          </div>
        </form>
      </Card>

      {/* Results Output */}
      {mutation.isPending ? (
        <div className="py-12 flex justify-center">
          <LoadingSpinner size="lg" text="Generating before-and-after rewrite suggestions..." />
        </div>
      ) : improvementResult ? (
        <div className="space-y-6">
          {/* Executive Improvement Feedback */}
          <Card className="p-6 bg-gradient-to-r from-indigo-900 to-slate-900 text-white">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Improvement Assessment
            </span>
            <p className="text-sm text-slate-200 mt-1 leading-relaxed">
              {improvementResult.overall_feedback}
            </p>
          </Card>

          {/* Before-and-After Comparisons */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Before & After Section Rewrites
            </h3>

            <div className="space-y-4">
              {improvementResult.improvements.map((item, idx) => (
                <Card key={idx} className="p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        {item.section}
                      </span>
                    </div>
                    <Badge
                      variant={
                        item.priority === 'high'
                          ? 'danger'
                          : item.priority === 'medium'
                          ? 'warning'
                          : 'slate'
                      }
                      size="sm"
                    >
                      {item.priority} Priority
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Before */}
                    <div className="p-4 bg-rose-50/40 rounded-xl border border-rose-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 block mb-1">
                        Current Content
                      </span>
                      <p className="text-xs text-slate-700 font-mono leading-relaxed">
                        {item.original_text}
                      </p>
                    </div>

                    {/* After */}
                    <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 relative">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                          Suggested High-Impact Rewrite
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(item.suggested_text, idx)}
                          className="p-1 text-emerald-700 hover:text-emerald-900 rounded hover:bg-emerald-100 transition-colors"
                          title="Copy suggested text"
                        >
                          {copiedIdx === idx ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800">
                              <Check className="w-3.5 h-3.5" /> Copied
                            </span>
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-slate-900 font-semibold leading-relaxed">
                        {item.suggested_text}
                      </p>
                    </div>
                  </div>

                  {/* Why it works */}
                  <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-800">Strategic impact:</strong> {item.reason}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Keywords & Formatting Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-t-4 border-t-indigo-500 p-6">
              <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
                <Hash className="w-4 h-4 text-indigo-600" />
                Target ATS Keyword Recommendations
              </h4>
              <div className="flex flex-wrap gap-2">
                {improvementResult.keyword_recommendations.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-semibold border border-indigo-100"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="border-t-4 border-t-slate-500 p-6">
              <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
                <LayoutTemplate className="w-4 h-4 text-slate-600" />
                Formatting & Layout Best Practices
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {improvementResult.formatting_suggestions.map((fmt, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{fmt}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
};

