import React from 'react';
import { Briefcase, Check, ArrowRight, GitFork } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Link } from 'react-router-dom';

export interface CareerRoleItem {
  job_title: string;
  suitability: 'high' | 'medium' | 'low' | string;
  reason: string;
  matching_skills: string[];
  missing_skills: string[];
  recommended_projects: string[];
  career_progression: string[];
}

export const CareerRecommendationCard: React.FC<{ role: CareerRoleItem }> = ({ role }) => {
  return (
    <Card hover className="flex flex-col justify-between border-slate-200">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">{role.job_title}</h3>
              <Badge variant={role.suitability === 'high' ? 'success' : 'primary'} size="sm">
                {role.suitability} Alignment
              </Badge>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 mt-2 mb-4 leading-relaxed">{role.reason}</p>

        {/* Matching Skills */}
        <div className="mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Matching Skills
          </span>
          <div className="flex flex-wrap gap-1.5">
            {role.matching_skills.slice(0, 5).map((skill, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-xs">
                ✓ {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        {role.missing_skills.length > 0 && (
          <div className="mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Skills to Develop
            </span>
            <div className="flex flex-wrap gap-1.5">
              {role.missing_skills.slice(0, 4).map((skill, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                  + {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Progression */}
        {role.career_progression?.length > 0 && (
          <div className="pt-3 border-t border-slate-100 mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5 text-indigo-500" /> Career Trajectory
            </span>
            <p className="text-xs text-indigo-700 font-medium">
              {role.career_progression.join('  ➔  ')}
            </p>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link to={`/skill-gap?role=${encodeURIComponent(role.job_title)}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Run Skill Gap Analysis
          </Button>
        </Link>
      </div>
    </Card>
  );
};

