import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Calendar } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ResumeAnalysis } from '@ai-resume/shared';

export const RecentAnalyses: React.FC<{ analyses: ResumeAnalysis[] }> = ({ analyses }) => {
  if (!analyses || analyses.length === 0) {
    return (
      <Card className="p-6 text-center text-slate-400">
        <p className="text-sm">No resume analyses recorded yet.</p>
        <Link to="/analyzer" className="inline-block mt-3">
          <Button variant="primary" size="sm">Start First Analysis</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Recent Resume Analyses</h3>
          <p className="text-xs text-slate-500">Latest evaluations performed on your uploaded resumes.</p>
        </div>
        <Link to="/history">
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            View All
          </Button>
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {analyses.map((a) => (
          <div key={a.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <Link to={`/analysis/${a.id}`} className="text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors">
                  {a.target_job_role || 'General Analysis'}
                </Link>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(a.created_at).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>{a.resume?.file_name || 'Resume'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-base font-extrabold text-indigo-600">
                  {Math.round(a.overall_score)}%
                </span>
                <span className="text-[10px] text-slate-400 block">Overall Score</span>
              </div>
              <Link to={`/analysis/${a.id}`}>
                <Button variant="outline" size="sm">Report</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

