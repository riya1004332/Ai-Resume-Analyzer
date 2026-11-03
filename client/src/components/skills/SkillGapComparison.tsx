import React from 'react';
import { Check, AlertCircle, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { SkillGapOutput } from '@ai-resume/shared';
import { Button } from '../common/Button';
import { Link } from 'react-router-dom';

export const SkillGapComparison: React.FC<{
  gapData: SkillGapOutput;
  onSelectSkillForRoadmap?: (skillName: string) => void;
}> = ({ gapData, onSelectSkillForRoadmap }) => {
  return (
    <div className="space-y-6">
      {/* Header Overview Card */}
      <Card className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 sm:p-8">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-indigo-300">Target Role Analysis</span>
          <h2 className="text-2xl font-extrabold mt-1">{gapData.target_role}</h2>
          <p className="text-xs text-slate-300 max-w-xl mt-2 leading-relaxed">
            {gapData.recommendation}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 shrink-0">
          <span className="text-3xl font-black text-indigo-300">{gapData.readiness_score}%</span>
          <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Role Readiness</span>
        </div>
      </Card>

      {/* Skills Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matching Skills */}
        <Card className="border-t-4 border-t-emerald-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600" />
              Existing Matching Skills ({gapData.matching_skills.length})
            </h3>
            <Badge variant="success" size="sm">Qualified</Badge>
          </div>

          <div className="space-y-2.5">
            {gapData.matching_skills.map((skill, idx) => (
              <div key={idx} className="p-3 bg-emerald-50/30 rounded-lg border border-emerald-100 flex items-start justify-between gap-2">
                <div>
                  <span className="text-sm font-bold text-slate-800">{skill.name}</span>
                  <p className="text-xs text-slate-500 mt-0.5">{skill.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Missing Skills */}
        <Card className="border-t-4 border-t-rose-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              Missing Skills & Skill Gaps ({gapData.missing_skills.length})
            </h3>
            <Badge variant="danger" size="sm">Action Required</Badge>
          </div>

          <div className="space-y-2.5">
            {gapData.missing_skills.map((skill, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">{skill.name}</span>
                    <Badge
                      variant={skill.priority === 'high' ? 'danger' : skill.priority === 'medium' ? 'warning' : 'slate'}
                      size="sm"
                    >
                      {skill.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{skill.reason}</p>
                </div>

                {onSelectSkillForRoadmap ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectSkillForRoadmap(skill.name)}
                    rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
                  >
                    Roadmap
                  </Button>
                ) : (
                  <Link to={`/skill-improvement?skill=${encodeURIComponent(skill.name)}`}>
                    <Button variant="outline" size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                      Roadmap
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Skills Requiring Improvement */}
      {gapData.improvement_skills && gapData.improvement_skills.length > 0 && (
        <Card className="border-t-4 border-t-amber-500">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            Skills Requiring Improvement
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {gapData.improvement_skills.map((item, idx) => (
              <div key={idx} className="p-3 bg-amber-50/30 rounded-lg border border-amber-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">{item.name}</span>
                <span className="text-xs text-slate-500">
                  {item.current_level} → <strong className="text-amber-700">{item.target_level}</strong>
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

