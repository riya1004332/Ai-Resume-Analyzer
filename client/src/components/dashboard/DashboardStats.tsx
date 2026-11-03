import React from 'react';
import { FileText, Award, CheckSquare, Zap, Target } from 'lucide-react';
import { Card } from '../common/Card';
import { DashboardMetrics } from '@ai-resume/shared';

export const DashboardStats: React.FC<{ metrics: DashboardMetrics }> = ({ metrics }) => {
  const stats = [
    {
      label: 'Resumes Uploaded',
      value: metrics.totalResumes,
      icon: FileText,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100'
    },
    {
      label: 'Latest Quality Score',
      value: metrics.latestOverallScore !== null ? `${metrics.latestOverallScore}%` : 'N/A',
      icon: Award,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100'
    },
    {
      label: 'Latest ATS Score',
      value: metrics.latestAtsScore !== null ? `${metrics.latestAtsScore}%` : 'N/A',
      icon: Target,
      color: 'text-sky-600',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-100'
    },
    {
      label: 'Identified Skills',
      value: metrics.identifiedSkillsCount,
      icon: Zap,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100'
    },
    {
      label: 'Pending Tasks',
      value: metrics.pendingTasksCount,
      icon: CheckSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <Card key={idx} className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">{s.label}</span>
              <div className={`w-8 h-8 rounded-lg ${s.bgColor} ${s.color} flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-800 tracking-tight">
              {s.value}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

