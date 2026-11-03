import React from 'react';
import { Calendar, CheckSquare, MessageSquare, Briefcase, FileCheck, Layers } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { JobPreparationOutput } from '@ai-resume/shared';

export const JobPreparationView: React.FC<{ plan: JobPreparationOutput }> = ({ plan }) => {
  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <Card className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Badge variant="primary" className="mb-2">Roadmap Timeline: {plan.duration}</Badge>
            <h2 className="text-2xl font-black">{plan.target_role} Actionable Job Plan</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Covers technical preparation, portfolio refinement, recruiter outreach, and interview mock mastery.
            </p>
          </div>
        </div>
      </Card>

      {/* Weekly Milestone Tasks */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Weekly Execution Schedule
        </h3>

        <div className="space-y-4">
          {plan.weekly_plan.map((week, idx) => (
            <Card key={idx} className="border-l-4 border-l-indigo-600">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                  Week {week.week}
                </span>
                <h4 className="text-sm font-bold text-slate-800">{week.focus}</h4>
              </div>

              <div className="space-y-2">
                {week.tasks.map((task, tIdx) => (
                  <div key={tIdx} className="flex items-start justify-between gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-800">{task.title}</span>
                        <Badge variant="slate" size="sm">{task.category}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>
                    </div>
                    <Badge variant={task.priority === 'high' ? 'danger' : 'warning'} size="sm">
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Interview Preparation Topics & Search Strategy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-t-4 border-t-indigo-500">
          <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            Interview Preparation Focus Areas
          </h4>
          <div className="space-y-3">
            {plan.interview_preparation.map((item, idx) => (
              <div key={idx} className="p-3 bg-indigo-50/20 rounded-lg border border-indigo-100">
                <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1.5">{item.category}</h5>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                  {item.topics.map((t, tIdx) => (
                    <li key={tIdx}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-t-4 border-t-emerald-500">
          <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
            <CheckSquare className="w-5 h-5 text-emerald-600" />
            Launch & Readiness Checklist
          </h4>
          <div className="space-y-2 mb-6">
            {plan.success_checklist.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50/30 border border-emerald-100 text-xs text-slate-800">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Targeted Job Search Strategy
          </h5>
          <ul className="space-y-1.5 text-xs text-slate-600">
            {plan.job_search_strategy.map((strat, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-indigo-600 font-bold">•</span>
                <span>{strat}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

