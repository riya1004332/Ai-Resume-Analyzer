import React from 'react';
import { Award, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export interface ScoreCardProps {
  score: number;
  label?: string;
  description?: string;
}

export const ResumeScoreCard: React.FC<ScoreCardProps> = ({
  score,
  label = 'Overall Resume Score',
  description = 'Transparent quality rating based on section depth, quantifiable impact, and completeness.'
}) => {
  const getScoreColor = (val: number) => {
    if (val >= 80) return { text: 'text-emerald-600', stroke: '#10b981', badge: 'success' as const, grade: 'Strong Candidate' };
    if (val >= 65) return { text: 'text-indigo-600', stroke: '#6366f1', badge: 'primary' as const, grade: 'Competitive' };
    if (val >= 50) return { text: 'text-amber-600', stroke: '#f59e0b', badge: 'warning' as const, grade: 'Needs Polish' };
    return { text: 'text-rose-600', stroke: '#ef4444', badge: 'danger' as const, grade: 'Significant Gaps' };
  };

  const status = getScoreColor(score);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className="flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-br from-white to-slate-50/50">
      <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="text-slate-100"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={status.stroke}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-extrabold ${status.text}`}>{Math.round(score)}</span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">/ 100</span>
        </div>
      </div>

      <div className="space-y-2 text-center sm:text-left flex-1">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <h3 className="text-lg font-bold text-slate-900">{label}</h3>
          <Badge variant={status.badge}>{status.grade}</Badge>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
        <div className="flex items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-slate-600 font-medium">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Objective Rubric
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Verified Criteria
          </span>
        </div>
      </div>
    </Card>
  );
};

export const ATSScoreCard: React.FC<{ atsScore: number; atsFeedback: any }> = ({
  atsScore,
  atsFeedback
}) => {
  return (
    <Card className="flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">ATS Optimization</span>
          <h4 className="text-lg font-bold text-slate-900">ATS Readability</h4>
        </div>
        <div className="text-2xl font-black text-indigo-600">
          {Math.round(atsScore)}%
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 my-2 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-slate-400 block text-[11px]">Keyword Relevance</span>
          <span className="font-semibold text-slate-800 capitalize">
            {atsFeedback?.keyword_relevance || 'Moderate'}
          </span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-slate-400 block text-[11px]">Format Parsing</span>
          <span className="font-semibold text-emerald-700 capitalize">
            {atsFeedback?.formatting || 'Good'}
          </span>
        </div>
      </div>

      {atsFeedback?.recommendations?.length > 0 && (
        <p className="text-xs text-slate-500 mt-2 line-clamp-2">
          💡 {atsFeedback.recommendations[0]}
        </p>
      )}
    </Card>
  );
};

