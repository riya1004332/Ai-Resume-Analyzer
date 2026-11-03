import React from 'react';
import { Clock, Target, CheckCircle, Code2, Rocket, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { LearningRoadmapOutput } from '@ai-resume/shared';

export const LearningRoadmapView: React.FC<{
  roadmap: LearningRoadmapOutput;
  onTrackAsTasks?: () => void;
  isSavingTasks?: boolean;
}> = ({ roadmap, onTrackAsTasks, isSavingTasks = false }) => {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="primary">{roadmap.current_level} → {roadmap.target_level}</Badge>
              <Badge variant="slate" className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {roadmap.estimated_duration}
              </Badge>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">{roadmap.skill_name} Learning Roadmap</h2>
            <p className="text-xs text-slate-500 mt-1">
              Structured progressive curriculum designed to bridge technical gaps with hands-on practice.
            </p>
          </div>

          {onTrackAsTasks && (
            <Button
              variant="primary"
              size="md"
              onClick={onTrackAsTasks}
              isLoading={isSavingTasks}
              leftIcon={<Rocket className="w-4 h-4" />}
            >
              Add Tasks to Progress Tracker
            </Button>
          )}
        </div>
      </Card>

      {/* Learning Stages Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          Weekly Learning Progression
        </h3>

        <div className="space-y-4">
          {roadmap.learning_stages.map((stage, idx) => (
            <Card key={idx} className="relative overflow-hidden pl-6 border-l-4 border-l-indigo-600 hover:shadow-sm transition-shadow">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                    Week {stage.week}
                  </span>
                  <h4 className="text-base font-bold text-slate-800">{stage.title}</h4>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Objectives & Activities
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {stage.activities.map((act, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Hands-on Exercise
                  </span>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    🛠️ {stage.practical_exercise}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Capstone Projects & Success Criteria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-t-4 border-t-indigo-500">
          <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
            <Code2 className="w-5 h-5 text-indigo-600" />
            Recommended Portfolio Projects
          </h4>
          <div className="space-y-3">
            {roadmap.projects.map((proj, idx) => (
              <div key={idx} className="p-3.5 bg-indigo-50/30 rounded-lg border border-indigo-100">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-bold text-slate-800">{proj.title}</span>
                  <Badge variant="primary" size="sm">{proj.difficulty}</Badge>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-t-4 border-t-emerald-500">
          <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            Success Evaluation Criteria
          </h4>
          <div className="space-y-2">
            {roadmap.success_criteria.map((crit, idx) => (
              <div key={idx} className="p-2.5 bg-emerald-50/20 rounded-lg border border-emerald-100 flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{crit}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

