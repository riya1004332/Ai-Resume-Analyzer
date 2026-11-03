import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { ResumeScoreCard, ATSScoreCard } from '../components/resume/ResumeScoreCard';
import { ResumeStrengths, ResumeWeaknesses } from '../components/resume/ResumeStrengths';
import { ResumeImprovementList } from '../components/resume/ResumeImprovementList';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Tabs } from '../components/common/Tabs';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  FileText,
  Calendar,
  Briefcase,
  GitCompare,
  TrendingUp,
  FileCheck2,
  Compass,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';

export const AnalysisReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  const {
    data: analysis,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['resumeAnalysis', id],
    queryFn: () => api.getAnalysis(id!),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Retrieving detailed AI analysis report..." />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="max-w-md mx-auto p-8 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">Analysis Report Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested analysis could not be retrieved. It may have been deleted or does not exist.
        </p>
        <Link to="/analyzer">
          <Button variant="primary" size="sm">Back to Resume Analyzer</Button>
        </Link>
      </div>
    );
  }

  const { analysis_result: result, overall_score, ats_score, target_job_role, resume, created_at } = analysis;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'strengths', label: `Strengths (${result.strengths?.length || 0})` },
    { id: 'weaknesses', label: `Weaknesses & Gaps (${result.weaknesses?.length || 0})` },
    { id: 'skills', label: 'Skills Identified' },
    { id: 'ats', label: 'ATS Assessment' },
    { id: 'improvements', label: `Improvement Actions (${result.improvement_suggestions?.length || 0})` },
    { id: 'career', label: 'Career Next Steps' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Navigation & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <Link
            to="/history"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Analysis History</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {target_job_role ? `${target_job_role} Analysis Report` : 'Comprehensive Resume Analysis'}
            </h1>
            <Badge variant="primary" size="sm">
              AI Evaluated
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              {resume?.file_name || 'Resume Document'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/skill-gap?analysisId=${analysis.id}&role=${encodeURIComponent(target_job_role || '')}`}>
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Run Skill Gap
            </Button>
          </Link>
          <Link to={`/resume-improvement?analysisId=${analysis.id}`}>
            <Button variant="primary" size="sm" leftIcon={<FileCheck2 className="w-3.5 h-3.5" />}>
              Get Rewrites
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ResumeScoreCard score={overall_score} />
        </div>
        <ATSScoreCard atsScore={ats_score} atsFeedback={result.ats_feedback} />
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Panels */}
      <div className="pt-2">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Executive Summary */}
            <Card className="p-6 bg-gradient-to-br from-indigo-50/50 to-white border-indigo-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Executive Summary Evaluation
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">{result.summary}</p>
            </Card>

            {/* Resume Sections Breakdown */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">
                Detailed Section-by-Section Rubric
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.sections?.map((sec, idx) => (
                  <Card key={idx} className="p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-800">{sec.name}</span>
                        <Badge
                          variant={
                            sec.status === 'good'
                              ? 'success'
                              : sec.status === 'needs_improvement'
                              ? 'warning'
                              : 'danger'
                          }
                          size="sm"
                        >
                          {sec.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">{sec.feedback}</p>
                    </div>

                    {sec.suggestions?.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 text-xs text-indigo-700 bg-indigo-50/40 p-2 rounded-lg">
                        <span className="font-semibold block mb-0.5">Tip:</span>
                        {sec.suggestions[0]}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STRENGTHS TAB */}
        {activeTab === 'strengths' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Resume Strengths & Key Advantages</h3>
              <p className="text-xs text-slate-500">
                Highlights from your background that stand out positively to technical hiring managers and automated parsers.
              </p>
            </div>
            <ResumeStrengths strengths={result.strengths || []} />
          </div>
        )}

        {/* WEAKNESSES TAB */}
        {activeTab === 'weaknesses' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Identified Weaknesses & Missing Information
              </h3>
              <p className="text-xs text-slate-500">
                Objective gap analysis pointing out missing metrics, vague phrasing, or unlisted credentials.
              </p>
            </div>
            <ResumeWeaknesses
              weaknesses={result.weaknesses || []}
              missingInfo={result.missing_information}
            />
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            {/* Technical Skills */}
            <Card className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Explicit Technical Skills ({result.skills?.technical?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.skills?.technical?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>

            {/* Soft Skills */}
            <Card className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                Soft & Professional Skills ({result.skills?.soft?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.skills?.soft?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-800 rounded-lg text-xs font-semibold border border-indigo-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>

            {/* Inferred Skills */}
            {result.skills?.inferred && result.skills.inferred.length > 0 && (
              <Card className="p-6 bg-slate-50/70 border-dashed">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-500" />
                    AI-Inferred Skills ({result.skills.inferred.length})
                  </h3>
                  <Badge variant="warning" size="sm">AI Inferred</Badge>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  These skills were inferred based on your project descriptions and duties, but were not explicitly labeled in your skills section.
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.skills.inferred.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-amber-50 text-amber-800 rounded-lg text-xs font-medium border border-amber-200"
                    >
                      ~ {skill}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ATS ASSESSMENT TAB */}
        {activeTab === 'ats' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4">ATS Compatibility Breakdown</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-400 block mb-1">Keyword Relevance</span>
                  <span className="text-base font-bold text-slate-800 capitalize">
                    {result.ats_feedback?.keyword_relevance || 'Moderate'}
                  </span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-400 block mb-1">Format Layout</span>
                  <span className="text-base font-bold text-emerald-600 capitalize">
                    {result.ats_feedback?.formatting || 'Good'}
                  </span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-400 block mb-1">Machine Readability</span>
                  <span className="text-base font-bold text-indigo-600 capitalize">
                    {result.ats_feedback?.readability || 'High'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  ATS Recommendations & Keyword Improvements
                </h4>
                <ul className="space-y-2">
                  {result.ats_feedback?.recommendations?.map((rec, idx) => (
                    <li
                      key={idx}
                      className="p-3 bg-indigo-50/30 rounded-lg border border-indigo-100 text-xs text-slate-700 flex items-start gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        )}

        {/* IMPROVEMENT ACTIONS TAB */}
        {activeTab === 'improvements' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Prioritized Action Items
                </h3>
                <p className="text-xs text-slate-500">
                  Follow these concrete suggestions to raise your resume quality and ATS score.
                </p>
              </div>
              <Link to={`/resume-improvement?analysisId=${analysis.id}`}>
                <Button variant="primary" size="sm" leftIcon={<FileCheck2 className="w-4 h-4" />}>
                  Generate Rewritten Text
                </Button>
              </Link>
            </div>

            <ResumeImprovementList suggestions={result.improvement_suggestions || []} />
          </div>
        )}

        {/* CAREER NEXT STEPS TAB */}
        {activeTab === 'career' && (
          <Card className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recommended Next Career Actions</h3>
              <p className="text-xs text-slate-500 mt-1">
                Take your analysis findings further with our integrated career advisory suite.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card hover className="p-4 border-indigo-100 bg-indigo-50/20">
                <GitCompare className="w-8 h-8 text-indigo-600 mb-2" />
                <h4 className="font-bold text-sm text-slate-800">Skill Gap Analyzer</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Compare your identified skills against specific target job descriptions.
                </p>
                <Link to={`/skill-gap?analysisId=${analysis.id}&role=${encodeURIComponent(target_job_role || '')}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Launch Skill Gap
                  </Button>
                </Link>
              </Card>

              <Card hover className="p-4 border-emerald-100 bg-emerald-50/20">
                <Compass className="w-8 h-8 text-emerald-600 mb-2" />
                <h4 className="font-bold text-sm text-slate-800">Career Guidance</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Get personalized role recommendations matching your education & background.
                </p>
                <Link to={`/career-guidance?analysisId=${analysis.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Explore Careers
                  </Button>
                </Link>
              </Card>

              <Card hover className="p-4 border-purple-100 bg-purple-50/20">
                <Briefcase className="w-8 h-8 text-purple-600 mb-2" />
                <h4 className="font-bold text-sm text-slate-800">Job Preparation Plan</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Build an 8-week structured roadmap with interview mocks & portfolio advice.
                </p>
                <Link to={`/job-preparation?role=${encodeURIComponent(target_job_role || '')}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Build Job Plan
                  </Button>
                </Link>
              </Card>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
