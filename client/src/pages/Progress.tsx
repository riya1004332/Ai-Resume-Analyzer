import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ProgressTask } from '@ai-resume/shared';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  Trash2,
  Plus,
  Play,
  RotateCcw,
  Sparkles,
  Award
} from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  const { data: progressData, isLoading } = useQuery({
    queryKey: ['progressOverview'],
    queryFn: () => api.listProgress()
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'pending' | 'in_progress' | 'completed' }) =>
      api.updateProgressTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progressOverview'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => api.deleteProgressTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progressOverview'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    }
  });

  const createTaskMutation = useMutation({
    mutationFn: () =>
      api.createProgressTask({
        taskTitle: newTaskTitle.trim(),
        description: newTaskDesc.trim() || undefined
      }),
    onSuccess: () => {
      setNewTaskTitle('');
      setNewTaskDesc('');
      setIsAdding(false);
      queryClient.invalidateQueries({ queryKey: ['progressOverview'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    }
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    createTaskMutation.mutate();
  };

  const tasks = progressData?.tasks || [];
  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  });

  const completedCount = progressData?.completed || 0;
  const totalCount = progressData?.total || 0;
  const percentage = progressData?.percentage || 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Continuous Career & Skill Milestones</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Career Progress Tracker
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Track practical skill exercises, learning roadmaps, portfolio projects, and interview preparation tasks until you reach full job readiness.
        </p>
      </div>

      {/* Progress Metric Card */}
      <Card className="p-6 sm:p-8 bg-gradient-to-r from-indigo-900 to-slate-900 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Career Development Completion
            </span>
            <h2 className="text-2xl font-black mt-1">
              {completedCount} of {totalCount} Tasks Completed
            </h2>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-indigo-300">{percentage}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-400 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </Card>

      {/* Controls & Add Task */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
          {(['all', 'pending', 'in_progress', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors capitalize ${
                filterStatus === status
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          {isAdding ? 'Cancel' : 'Add Custom Task'}
        </Button>
      </div>

      {/* New Task Inline Form */}
      {isAdding && (
        <Card className="p-5 border-indigo-200 bg-indigo-50/20">
          <form onSubmit={handleCreateTask} className="space-y-3">
            <Input
              label="Task Title"
              required
              placeholder="e.g. Build Dockerized backend API, Complete LeetCode medium SQL"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              disabled={createTaskMutation.isPending}
            />
            <Input
              label="Description (Optional)"
              placeholder="e.g. Include PostgreSQL and Redis container orchestration"
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              disabled={createTaskMutation.isPending}
            />
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={createTaskMutation.isPending}
              >
                Create Task
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tasks List */}
      {isLoading ? (
        <div className="py-12 flex justify-center">
          <LoadingSpinner size="lg" text="Loading progress milestones..." />
        </div>
      ) : filteredTasks.length === 0 ? (
        <Card className="p-8 text-center text-slate-400">
          <CheckSquare className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-semibold text-slate-700">No tasks in this category</p>
          <p className="text-xs text-slate-400 mt-1">
            Generate a learning roadmap or add a custom task above to begin tracking.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className={`p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                task.status === 'completed' ? 'bg-slate-50/60 border-slate-200' : 'bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() =>
                    updateStatusMutation.mutate({
                      id: task.id,
                      status: task.status === 'completed' ? 'pending' : 'completed'
                    })
                  }
                  className="mt-0.5 p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                  title={task.status === 'completed' ? 'Mark uncompleted' : 'Mark completed'}
                >
                  <CheckCircle2
                    className={`w-5 h-5 ${
                      task.status === 'completed'
                        ? 'text-emerald-500 fill-emerald-100'
                        : 'text-slate-300 hover:text-slate-500'
                    }`}
                  />
                </button>

                <div>
                  <h4
                    className={`text-sm font-semibold ${
                      task.status === 'completed'
                        ? 'line-through text-slate-400'
                        : 'text-slate-800'
                    }`}
                  >
                    {task.task_title}
                  </h4>
                  {task.description && (
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {task.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {task.status !== 'completed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: task.id,
                        status: task.status === 'in_progress' ? 'pending' : 'in_progress'
                      })
                    }
                  >
                    {task.status === 'in_progress' ? 'Pause' : 'Start'}
                  </Button>
                )}

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                    task.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : task.status === 'in_progress'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {task.status.replace('_', ' ')}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete task "${task.task_title}"?`)) {
                      deleteTaskMutation.mutate(task.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

