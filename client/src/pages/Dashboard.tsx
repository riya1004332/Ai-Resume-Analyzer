import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { ProgressChart } from '../components/dashboard/ProgressChart';
import { RecentAnalyses } from '../components/dashboard/RecentAnalyses';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  FileSearch,
  GitCompare,
  TrendingUp,
  Compass,
  Briefcase,
  CheckSquare,
  Sparkles,
  ArrowRight,
  Target
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const {
    data: metrics,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['dashboardMetrics'],
    queryFn: () => api.getDashboard()
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard metrics..." />
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-rose-600 mb-4">
          Failed to load dashboard metrics. {(error as any)?.message}
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Professional';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Career Development Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {displayName}!
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-xl">
            Track your resume optimization, identified skills, and personalized career roadmaps in one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/analyzer">
            <Button
              variant="primary"
              size="md"
              className="bg-white text-indigo-950 hover:bg-slate-100 shadow-sm font-bold"
              leftIcon={<FileSearch className="w-4 h-4 text-indigo-600" />}
            >
              Analyze New Resume
            </Button>
          </Link>
          <Link to="/skill-gap">
            <Button
              variant="outline"
              size="md"
              className="border-white/30 text-white hover:bg-white/10"
              leftIcon={<GitCompare className="w-4 h-4" />}
            >
              Skill Gap Check
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <DashboardStats metrics={metrics} />

      {/* Quick Action Hub */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
          Advisory & Action Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Skill Gap Analyzer',
              desc: 'Benchmark your verified skills against desired roles',
              link: '/skill-gap',
              icon: GitCompare,
              color: 'text-indigo-600',
              bgColor: 'bg-indigo-50'
            },
            {
              title: 'Skill Roadmaps',
              desc: 'Generate weekly practical learning plans',
              link: '/skill-improvement',
              icon: TrendingUp,
              color: 'text-emerald-600',
              bgColor: 'bg-emerald-50'
            },
            {
              title: 'Career Recommendations',
              desc: 'Explore roles matching your education & experience',
              link: '/career-guidance',
              icon: Compass,
              color: 'text-purple-600',
              bgColor: 'bg-purple-50'
            },
            {
              title: 'Job Preparation Plan',
              desc: 'Structured timeline, interview mocks & outreach',
              link: '/job-preparation',
              icon: Briefcase,
              color: 'text-rose-600',
              bgColor: 'bg-rose-50'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link key={idx} to={item.link}>
                <Card hover className="p-4 h-full flex flex-col justify-between">
                  <div>
                    <div className={`w-9 h-9 rounded-xl ${item.bgColor} ${item.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 mt-4">
                    <span>Open Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Analytics Chart & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProgressChart data={metrics.scoreHistory} />
          <RecentAnalyses analyses={metrics.recentAnalyses} />
        </div>

        <div className="space-y-6">
          {/* Active Skills Snapshot */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Identified Skills</h3>
              <span className="text-xs text-indigo-600 font-semibold">{metrics.identifiedSkillsCount} total</span>
            </div>
            {metrics.recentSkills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {metrics.recentSkills.map((us) => (
                  <span
                    key={us.id}
                    className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md text-xs font-medium border border-slate-200/60"
                  >
                    {us.skill?.name || 'Technical Skill'}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-3 text-center">
                Upload a resume to automatically extract verified skills.
              </p>
            )}
            <Link to="/skill-gap" className="block mt-4">
              <Button variant="ghost" size="sm" className="w-full text-xs">
                Compare Skills Against Target Role
              </Button>
            </Link>
          </Card>

          {/* Pending Tasks Snapshot */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-purple-600" />
                Active Career Tasks
              </h3>
              <Link to="/progress" className="text-xs text-indigo-600 font-semibold hover:underline">
                View All
              </Link>
            </div>
            {metrics.recentTasks.length > 0 ? (
              <div className="space-y-2">
                {metrics.recentTasks.map((t) => (
                  <div key={t.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-slate-800 truncate max-w-[180px]">
                      {t.task_title}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${
                      t.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : t.status === 'in_progress'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-3 text-center">
                No tasks yet. Generate a learning roadmap to auto-create progress milestones.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

