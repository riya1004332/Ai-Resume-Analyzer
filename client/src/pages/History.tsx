import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ResumeAnalysis } from '@ai-resume/shared';
import {
  History,
  FileText,
  Calendar,
  Award,
  Target,
  Trash2,
  ArrowRight,
  GitCompare,
  Plus
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);

  const { data: analyses, isLoading } = useQuery({
    queryKey: ['resumeAnalysesHistory'],
    queryFn: () => api.getAnalysisHistory()
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteAnalysis(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumeAnalysesHistory'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    }
  });

  const toggleComparison = (id: string) => {
    if (selectedForComparison.includes(id)) {
      setSelectedForComparison(selectedForComparison.filter((item) => item !== id));
    } else {
      if (selectedForComparison.length >= 2) {
        setSelectedForComparison([selectedForComparison[1], id]);
      } else {
        setSelectedForComparison([...selectedForComparison, id]);
      }
    }
  };

  const comparedItems = (analyses || []).filter((a) =>
    selectedForComparison.includes(a.id)
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Complete Historical Archive & Version Comparisons</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Analysis History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Review past evaluations, track quality and ATS score trends over time, and compare changes across resume revisions.
          </p>
        </div>

        <Link to="/analyzer">
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            New Analysis
          </Button>
        </Link>
      </div>

      {/* Side-by-Side Comparison Modal / Box */}
      {comparedItems.length === 2 && (
        <Card className="p-6 border-indigo-200 bg-indigo-50/20 space-y-4">
          <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-indigo-600" />
              Side-by-Side Version Comparison
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedForComparison([])}
            >
              Clear Comparison
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {comparedItems.map((item, idx) => (
              <div key={item.id} className="p-4 bg-white rounded-xl border border-indigo-100 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                  Version {idx === 0 ? 'A' : 'B'} • {new Date(item.created_at).toLocaleDateString()}
                </span>
                <h4 className="text-base font-bold text-slate-800">
                  {item.target_job_role || 'General Analysis'}
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                  <div className="p-2 bg-slate-50 rounded">
                    <span className="text-slate-400 block text-[10px]">Quality Score</span>
                    <span className="text-base font-extrabold text-indigo-600">
                      {Math.round(item.overall_score)}%
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded">
                    <span className="text-slate-400 block text-[10px]">ATS Score</span>
                    <span className="text-base font-extrabold text-sky-600">
                      {Math.round(item.ats_score)}%
                    </span>
                  </div>
                </div>
                <Link to={`/analysis/${item.id}`} className="block pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Open Full Report
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* History List */}
      {isLoading ? (
        <div className="py-12 flex justify-center">
          <LoadingSpinner size="lg" text="Loading analysis history..." />
        </div>
      ) : !analyses || analyses.length === 0 ? (
        <Card className="p-8 text-center text-slate-400">
          <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-semibold text-slate-700">No analyses found in history</p>
          <p className="text-xs text-slate-400 mt-1">
            Run an analysis on your resume to populate this history.
          </p>
          <Link to="/analyzer" className="inline-block mt-4">
            <Button variant="primary" size="sm">Start First Analysis</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>Select any 2 versions to benchmark progress</span>
            <span>{analyses.length} total evaluations</span>
          </div>

          <div className="space-y-3">
            {analyses.map((item) => {
              const isSelected = selectedForComparison.includes(item.id);
              return (
                <Card
                  key={item.id}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                    isSelected ? 'border-indigo-400 bg-indigo-50/20' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleComparison(item.id)}
                      className={`w-5 h-5 rounded border mt-0.5 sm:mt-0 flex items-center justify-center transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 hover:border-indigo-400'
                      }`}
                      title="Select for comparison"
                    >
                      {isSelected && '✓'}
                    </button>

                    <div>
                      <Link
                        to={`/analysis/${item.id}`}
                        className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                      >
                        {item.target_job_role || 'General Analysis'}
                      </Link>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-600 font-medium">
                          <FileText className="w-3 h-3 text-indigo-500" />
                          {item.resume?.file_name || 'Resume'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-base font-extrabold text-indigo-600">
                        {Math.round(item.overall_score)}%
                      </span>
                      <span className="text-[10px] text-slate-400 block">Quality</span>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-sky-600">
                        {Math.round(item.ats_score)}%
                      </span>
                      <span className="text-[10px] text-slate-400 block">ATS</span>
                    </div>

                    <Link to={`/analysis/${item.id}`}>
                      <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3 h-3" />}>
                        View
                      </Button>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this analysis report?')) {
                          deleteMutation.mutate(item.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                      title="Delete analysis"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

