import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { LearningRoadmapView } from '../components/skills/LearningRoadmapView';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { LearningRoadmapOutput, LearningRoadmap } from '@ai-resume/shared';
import {
  TrendingUp,
  Sparkles,
  AlertCircle,
  Clock,
  BookOpen,
  CheckCircle,
  Calendar
} from 'lucide-react';

export const SkillImprovementPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const querySkill = searchParams.get('skill') || '';

  const [skillName, setSkillName] = useState(querySkill || 'Docker');
  const [currentLevel, setCurrentLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [targetLevel, setTargetLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('intermediate');
  const [availableTime, setAvailableTime] = useState('5-8 hours per week');
  const [learningPreference, setLearningPreference] = useState('Hands-on Projects & Exercises');
  const [activeRoadmap, setActiveRoadmap] = useState<LearningRoadmap | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAddingTasks, setIsAddingTasks] = useState(false);
  const [tasksSuccessMsg, setTasksSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (querySkill) setSkillName(querySkill);
  }, [querySkill]);

  // Load user's saved roadmaps
  const { data: savedRoadmaps, isLoading: isLoadingSaved } = useQuery({
    queryKey: ['learningRoadmaps'],
    queryFn: () => api.listRoadmaps()
  });

  const mutation = useMutation({
    mutationFn: () =>
      api.generateLearningRoadmap({
        skillName: skillName.trim(),
        currentLevel,
        targetLevel,
        availableTime,
        learningPreference
      }),
    onSuccess: (data) => {
      setActiveRoadmap(data);
      setErrorMsg(null);
      setTasksSuccessMsg(null);
      queryClient.invalidateQueries({ queryKey: ['learningRoadmaps'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    },
    onError: (err: any) => {
      setErrorMsg(err.message || 'Failed to generate learning roadmap.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) {
      setErrorMsg('Please specify a skill name.');
      return;
    }
    setErrorMsg(null);
    mutation.mutate();
  };

  const handleTrackAsTasks = async () => {
    if (!activeRoadmap?.roadmap?.learning_stages) return;
    setIsAddingTasks(true);
    setTasksSuccessMsg(null);
    try {
      for (const stage of activeRoadmap.roadmap.learning_stages) {
        await api.createProgressTask({
          roadmapId: activeRoadmap.id,
          taskTitle: `[${activeRoadmap.skill_name}] Week ${stage.week}: ${stage.title}`,
          description: stage.practical_exercise
        });
      }
      await queryClient.invalidateQueries({ queryKey: ['progressOverview'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
      setTasksSuccessMsg('Tasks successfully scheduled into your Career Progress Tracker!');
    } catch (err: any) {
      setErrorMsg('Failed to add some tasks to tracker.');
    } finally {
      setIsAddingTasks(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Curated Learning Roadmaps & Project Blueprints</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Skill Improvement Advisor
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Transform any technical skill gap into an actionable weekly curriculum with real-world coding exercises and portfolio projects.
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {tasksSuccessMsg && (
        <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{tasksSuccessMsg}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/progress')}>
            View Progress Tracker
          </Button>
        </div>
      )}

      {/* Generation Form */}
      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Skill to Master"
              required
              placeholder="e.g. Docker, TypeScript, GraphQL, Next.js"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              disabled={mutation.isPending}
            />

            <Select
              label="Current Proficiency"
              required
              value={currentLevel}
              onChange={(e) => setCurrentLevel(e.target.value as any)}
              disabled={mutation.isPending}
              options={[
                { value: 'beginner', label: 'Beginner (Basic Syntax / Concepts)' },
                { value: 'intermediate', label: 'Intermediate (Working Knowledge)' },
                { value: 'advanced', label: 'Advanced (Experienced)' }
              ]}
            />

            <Select
              label="Target Goal"
              required
              value={targetLevel}
              onChange={(e) => setTargetLevel(e.target.value as any)}
              disabled={mutation.isPending}
              options={[
                { value: 'intermediate', label: 'Intermediate (Job Ready)' },
                { value: 'advanced', label: 'Advanced (Production Ready)' },
                { value: 'expert', label: 'Expert (Lead / Architect)' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Weekly Available Study Time"
              required
              value={availableTime}
              onChange={(e) => setAvailableTime(e.target.value)}
              disabled={mutation.isPending}
              options={[
                { value: '2-4 hours per week', label: 'Light (2 - 4 hrs / week)' },
                { value: '5-8 hours per week', label: 'Standard (5 - 8 hrs / week)' },
                { value: '10-15 hours per week', label: 'Intensive (10 - 15 hrs / week)' },
                { value: '20+ hours per week', label: 'Full-Time Immersion (20+ hrs / week)' }
              ]}
            />

            <Select
              label="Preferred Learning Style"
              value={learningPreference}
              onChange={(e) => setLearningPreference(e.target.value)}
              disabled={mutation.isPending}
              options={[
                { value: 'Hands-on Projects & Exercises', label: 'Project-First & Exercises' },
                { value: 'Video Tutorials & Walkthroughs', label: 'Video Tutorials' },
                { value: 'Official Documentation & Specs', label: 'Official Documentation' },
                { value: 'Mixed Hybrid Learning', label: 'Comprehensive Mixed Style' }
              ]}
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={mutation.isPending}
              rightIcon={<Sparkles className="w-4 h-4" />}
            >
              Generate Learning Roadmap
            </Button>
          </div>
        </form>
      </Card>

      {/* Active Roadmap Output */}
      {mutation.isPending ? (
        <div className="py-12 flex justify-center">
          <LoadingSpinner size="lg" text="Designing custom weekly curriculum with practical exercises..." />
        </div>
      ) : activeRoadmap ? (
        <LearningRoadmapView
          roadmap={activeRoadmap.roadmap}
          onTrackAsTasks={handleTrackAsTasks}
          isSavingTasks={isAddingTasks}
        />
      ) : null}

      {/* Previously Saved Roadmaps */}
      {savedRoadmaps && savedRoadmaps.length > 0 && !activeRoadmap && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Your Saved Learning Roadmaps
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {savedRoadmaps.map((r) => (
              <Card
                key={r.id}
                hover
                onClick={() => setActiveRoadmap(r)}
                className="p-5 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-800">{r.skill_name}</span>
                    <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {r.target_level}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                    <Clock className="w-3 h-3" />
                    <span>{r.estimated_duration || 'Self-paced'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{new Date(r.created_at).toLocaleDateString()}</span>
                  <span className="font-semibold text-indigo-600">Open Roadmap →</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

