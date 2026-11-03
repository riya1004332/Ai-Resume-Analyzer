import { randomUUID } from 'crypto';
import { supabaseAdmin } from '../../config/supabase';
import { env } from '../../config/env';
import {
  Profile,
  Resume,
  ResumeAnalysis,
  Skill,
  UserSkill,
  SkillGapAnalysis,
  LearningRoadmap,
  ProgressTask,
  CareerRecommendation,
  JobPreparationPlan,
  DashboardMetrics
} from '@ai-resume/shared';

// In-memory fallback repository when running in standalone offline dev/demo
class MemoryStore {
  profiles: Map<string, Profile> = new Map();
  resumes: Map<string, Resume> = new Map();
  analyses: Map<string, ResumeAnalysis> = new Map();
  skills: Map<string, Skill> = new Map();
  userSkills: Map<string, UserSkill> = new Map();
  skillGaps: Map<string, SkillGapAnalysis> = new Map();
  roadmaps: Map<string, LearningRoadmap> = new Map();
  tasks: Map<string, ProgressTask> = new Map();
  careerRecs: Map<string, CareerRecommendation> = new Map();
  jobPlans: Map<string, JobPreparationPlan> = new Map();

  constructor() {
    this.seedDefaultSkills();
  }

  seedDefaultSkills() {
    const defaultSkills = [
      { name: 'JavaScript', category: 'Software Development', description: 'Core programming language of the web' },
      { name: 'TypeScript', category: 'Software Development', description: 'Typed JavaScript superset' },
      { name: 'React', category: 'Software Development', description: 'Component-based frontend library' },
      { name: 'Node.js', category: 'Software Development', description: 'Server-side JavaScript runtime' },
      { name: 'Python', category: 'Software Development', description: 'Multipurpose programming language' },
      { name: 'SQL', category: 'Data & AI', description: 'Relational database query language' },
      { name: 'PostgreSQL', category: 'Data & AI', description: 'Advanced open-source relational database' },
      { name: 'Docker', category: 'Cloud & DevOps', description: 'Containerization platform' },
      { name: 'Git', category: 'Software Development', description: 'Version control system' },
      { name: 'REST API', category: 'Software Development', description: 'HTTP web services architecture' }
    ];

    defaultSkills.forEach((s) => {
      const id = randomUUID();
      this.skills.set(id, {
        id,
        name: s.name,
        category: s.category,
        description: s.description,
        created_at: new Date().toISOString()
      });
    });
  }
}

const memoryStore = new MemoryStore();

// Check if live Supabase is configured
const isSupabaseConfigured =
  env.SUPABASE_URL.startsWith('https://') &&
  env.SUPABASE_SERVICE_ROLE_KEY !== 'dev-service-role-key';

export const dbService = {
  // ==========================================
  // Profiles
  // ==========================================
  async getProfile(userId: string): Promise<Profile | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('[DB] Error fetching profile:', error);
      }
      return data || null;
    }

    return memoryStore.profiles.get(userId) || null;
  },

  async upsertProfile(profile: Partial<Profile> & { id: string }): Promise<Profile> {
    const now = new Date().toISOString();
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: profile.id,
          full_name: profile.full_name,
          email: profile.email,
          education_level: profile.education_level,
          experience_level: profile.experience_level,
          career_domain: profile.career_domain,
          career_interest: profile.career_interest,
          updated_at: now
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    const existing = memoryStore.profiles.get(profile.id);
    const updated: Profile = {
      id: profile.id,
      full_name: profile.full_name ?? existing?.full_name ?? null,
      email: profile.email ?? existing?.email ?? null,
      education_level: profile.education_level ?? existing?.education_level ?? null,
      experience_level: profile.experience_level ?? existing?.experience_level ?? null,
      career_domain: profile.career_domain ?? existing?.career_domain ?? null,
      career_interest: profile.career_interest ?? existing?.career_interest ?? null,
      created_at: existing?.created_at ?? now,
      updated_at: now
    };
    memoryStore.profiles.set(profile.id, updated);
    return updated;
  },

  // ==========================================
  // Resumes
  // ==========================================
  async createResume(resume: Omit<Resume, 'id' | 'created_at'>): Promise<Resume> {
    const now = new Date().toISOString();
    const id = randomUUID();

    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('resumes')
        .insert({
          id,
          user_id: resume.user_id,
          file_name: resume.file_name,
          storage_path: resume.storage_path,
          file_type: resume.file_type,
          file_size: resume.file_size,
          extracted_text: resume.extracted_text,
          processing_status: resume.processing_status
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    const newResume: Resume = {
      id,
      ...resume,
      created_at: now
    };
    memoryStore.resumes.set(id, newResume);
    return newResume;
  },

  async getResumeById(id: string, userId: string): Promise<Resume | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('resumes')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) return null;
      return data;
    }

    const resume = memoryStore.resumes.get(id);
    if (resume && resume.user_id === userId) return resume;
    return null;
  },

  async listUserResumes(userId: string): Promise<Resume[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }

    return Array.from(memoryStore.resumes.values())
      .filter((r) => r.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async deleteResume(id: string, userId: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      // First get storage path to delete storage object
      const { data: resume } = await supabaseAdmin
        .from('resumes')
        .select('storage_path')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (resume?.storage_path) {
        await supabaseAdmin.storage.from('resumes').remove([resume.storage_path]);
      }

      const { error } = await supabaseAdmin
        .from('resumes')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    }

    const existing = memoryStore.resumes.get(id);
    if (existing && existing.user_id === userId) {
      memoryStore.resumes.delete(id);
      return true;
    }
    return false;
  },

  // ==========================================
  // Resume Analyses
  // ==========================================
  async createResumeAnalysis(analysis: Omit<ResumeAnalysis, 'id' | 'created_at'>): Promise<ResumeAnalysis> {
    const now = new Date().toISOString();
    const id = randomUUID();

    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('resume_analyses')
        .insert({
          id,
          user_id: analysis.user_id,
          resume_id: analysis.resume_id,
          target_job_role: analysis.target_job_role,
          overall_score: analysis.overall_score,
          ats_score: analysis.ats_score,
          analysis_result: analysis.analysis_result,
          model_name: analysis.model_name,
          prompt_version: analysis.prompt_version
        })
        .select('*, resume:resumes(*)')
        .single();

      if (error) throw error;
      return data;
    }

    const resume = memoryStore.resumes.get(analysis.resume_id);
    const newAnalysis: ResumeAnalysis = {
      id,
      ...analysis,
      created_at: now,
      resume
    };
    memoryStore.analyses.set(id, newAnalysis);
    return newAnalysis;
  },

  async getAnalysisById(id: string, userId: string): Promise<ResumeAnalysis | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('resume_analyses')
        .select('*, resume:resumes(*)')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) return null;
      return data;
    }

    const item = memoryStore.analyses.get(id);
    if (item && item.user_id === userId) return item;
    return null;
  },

  async listUserAnalyses(userId: string, limit = 20): Promise<ResumeAnalysis[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('resume_analyses')
        .select('*, resume:resumes(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    }

    return Array.from(memoryStore.analyses.values())
      .filter((a) => a.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  },

  async deleteAnalysis(id: string, userId: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabaseAdmin
        .from('resume_analyses')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    }

    const existing = memoryStore.analyses.get(id);
    if (existing && existing.user_id === userId) {
      memoryStore.analyses.delete(id);
      return true;
    }
    return false;
  },

  // ==========================================
  // Skills & User Skills
  // ==========================================
  async syncUserSkills(userId: string, skillNames: string[], proficiency: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'): Promise<void> {
    for (const name of skillNames) {
      const trimmed = name.trim();
      if (!trimmed) continue;

      let skillId = '';
      if (isSupabaseConfigured) {
        // Upsert global skill
        const { data: existingSkill } = await supabaseAdmin
          .from('skills')
          .select('id')
          .ilike('name', trimmed)
          .maybeSingle();

        if (existingSkill) {
          skillId = existingSkill.id;
        } else {
          const { data: createdSkill } = await supabaseAdmin
            .from('skills')
            .insert({ name: trimmed, category: 'Technical' })
            .select('id')
            .single();
          if (createdSkill) skillId = createdSkill.id;
        }

        if (skillId) {
          await supabaseAdmin.from('user_skills').upsert(
            {
              user_id: userId,
              skill_id: skillId,
              proficiency_level: proficiency,
              assessment_source: 'ai_inferred'
            },
            { onConflict: 'user_id,skill_id' }
          );
        }
      } else {
        // In-memory
        let found = Array.from(memoryStore.skills.values()).find(
          (s) => s.name.toLowerCase() === trimmed.toLowerCase()
        );
        if (!found) {
          found = {
            id: randomUUID(),
            name: trimmed,
            category: 'Technical',
            description: null,
            created_at: new Date().toISOString()
          };
          memoryStore.skills.set(found.id, found);
        }

        const key = `${userId}_${found.id}`;
        memoryStore.userSkills.set(key, {
          id: randomUUID(),
          user_id: userId,
          skill_id: found.id,
          proficiency_level: proficiency,
          assessment_source: 'ai_inferred',
          created_at: new Date().toISOString(),
          skill: found
        });
      }
    }
  },

  async getUserSkills(userId: string): Promise<UserSkill[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('user_skills')
        .select('*, skill:skills(*)')
        .eq('user_id', userId);

      if (error) throw error;
      return data || [];
    }

    return Array.from(memoryStore.userSkills.values()).filter((u) => u.user_id === userId);
  },

  // ==========================================
  // Skill Gap Analyses
  // ==========================================
  async createSkillGapAnalysis(gap: Omit<SkillGapAnalysis, 'id' | 'created_at'>): Promise<SkillGapAnalysis> {
    const now = new Date().toISOString();
    const id = randomUUID();

    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('skill_gap_analyses')
        .insert({
          id,
          user_id: gap.user_id,
          resume_analysis_id: gap.resume_analysis_id,
          target_job_role: gap.target_job_role,
          career_domain: gap.career_domain,
          result: gap.result
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    const created: SkillGapAnalysis = {
      id,
      ...gap,
      created_at: now
    };
    memoryStore.skillGaps.set(id, created);
    return created;
  },

  async getSkillGapAnalysisById(id: string, userId: string): Promise<SkillGapAnalysis | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('skill_gap_analyses')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) return null;
      return data;
    }

    const gap = memoryStore.skillGaps.get(id);
    return gap && gap.user_id === userId ? gap : null;
  },

  // ==========================================
  // Learning Roadmaps & Progress Tasks
  // ==========================================
  async createLearningRoadmap(roadmap: Omit<LearningRoadmap, 'id' | 'created_at'>): Promise<LearningRoadmap> {
    const now = new Date().toISOString();
    const id = randomUUID();

    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('learning_roadmaps')
        .insert({
          id,
          user_id: roadmap.user_id,
          skill_name: roadmap.skill_name,
          current_level: roadmap.current_level,
          target_level: roadmap.target_level,
          roadmap: roadmap.roadmap,
          estimated_duration: roadmap.estimated_duration
        })
        .select()
        .single();

      if (error) throw error;

      // Automatically create progress tasks from roadmap learning stages
      if (roadmap.roadmap?.learning_stages?.length) {
        const tasksToInsert = roadmap.roadmap.learning_stages.map((stage: any) => ({
          id: randomUUID(),
          user_id: roadmap.user_id,
          roadmap_id: id,
          task_title: `Stage ${stage.week}: ${stage.title}`,
          description: stage.practical_exercise || (stage.objectives || []).join('; '),
          status: 'pending'
        }));
        await supabaseAdmin.from('progress_tasks').insert(tasksToInsert);
      }

      return data;
    }

    const created: LearningRoadmap = {
      id,
      ...roadmap,
      created_at: now
    };
    memoryStore.roadmaps.set(id, created);

    if (roadmap.roadmap?.learning_stages?.length) {
      roadmap.roadmap.learning_stages.forEach((stage: any) => {
        const taskId = randomUUID();
        memoryStore.tasks.set(taskId, {
          id: taskId,
          user_id: roadmap.user_id,
          roadmap_id: id,
          task_title: `Stage ${stage.week}: ${stage.title}`,
          description: stage.practical_exercise || (stage.objectives || []).join('; '),
          status: 'pending',
          completed_at: null,
          created_at: now
        });
      });
    }

    return created;
  },

  async listLearningRoadmaps(userId: string): Promise<LearningRoadmap[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('learning_roadmaps')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }

    return Array.from(memoryStore.roadmaps.values())
      .filter((r) => r.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getLearningRoadmapById(id: string, userId: string): Promise<LearningRoadmap | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('learning_roadmaps')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) return null;
      return data;
    }

    const r = memoryStore.roadmaps.get(id);
    return r && r.user_id === userId ? r : null;
  },

  // Progress Tasks
  async createProgressTask(task: Omit<ProgressTask, 'id' | 'created_at' | 'completed_at'>): Promise<ProgressTask> {
    const now = new Date().toISOString();
    const id = randomUUID();

    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('progress_tasks')
        .insert({
          id,
          user_id: task.user_id,
          roadmap_id: task.roadmap_id,
          task_title: task.task_title,
          description: task.description,
          status: task.status
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    const created: ProgressTask = {
      id,
      ...task,
      completed_at: task.status === 'completed' ? now : null,
      created_at: now
    };
    memoryStore.tasks.set(id, created);
    return created;
  },

  async updateProgressTaskStatus(id: string, userId: string, status: 'pending' | 'in_progress' | 'completed'): Promise<ProgressTask | null> {
    const now = new Date().toISOString();
    const completedAt = status === 'completed' ? now : null;

    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('progress_tasks')
        .update({ status, completed_at: completedAt })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) return null;
      return data;
    }

    const task = memoryStore.tasks.get(id);
    if (!task || task.user_id !== userId) return null;
    task.status = status;
    task.completed_at = completedAt;
    return task;
  },

  async listProgressTasks(userId: string): Promise<ProgressTask[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('progress_tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }

    return Array.from(memoryStore.tasks.values())
      .filter((t) => t.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async deleteProgressTask(id: string, userId: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabaseAdmin
        .from('progress_tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    }

    const task = memoryStore.tasks.get(id);
    if (task && task.user_id === userId) {
      memoryStore.tasks.delete(id);
      return true;
    }
    return false;
  },

  // ==========================================
  // Career Guidance & Job Prep
  // ==========================================
  async saveCareerRecommendations(rec: Omit<CareerRecommendation, 'id' | 'created_at'>): Promise<CareerRecommendation> {
    const now = new Date().toISOString();
    const id = randomUUID();

    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('career_recommendations')
        .insert({
          id,
          user_id: rec.user_id,
          resume_analysis_id: rec.resume_analysis_id,
          recommendations: rec.recommendations
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    const created: CareerRecommendation = {
      id,
      ...rec,
      created_at: now
    };
    memoryStore.careerRecs.set(id, created);
    return created;
  },

  async getLatestCareerRecommendations(userId: string): Promise<CareerRecommendation | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('career_recommendations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) return null;
      return data;
    }

    const list = Array.from(memoryStore.careerRecs.values())
      .filter((c) => c.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return list[0] || null;
  },

  async saveJobPreparationPlan(plan: Omit<JobPreparationPlan, 'id' | 'created_at'>): Promise<JobPreparationPlan> {
    const now = new Date().toISOString();
    const id = randomUUID();

    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('job_preparation_plans')
        .insert({
          id,
          user_id: plan.user_id,
          target_job_role: plan.target_job_role,
          preparation_duration: plan.preparation_duration,
          plan: plan.plan
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    const created: JobPreparationPlan = {
      id,
      ...plan,
      created_at: now
    };
    memoryStore.jobPlans.set(id, created);
    return created;
  },

  async getLatestJobPreparationPlan(userId: string): Promise<JobPreparationPlan | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin
        .from('job_preparation_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) return null;
      return data;
    }

    const list = Array.from(memoryStore.jobPlans.values())
      .filter((j) => j.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return list[0] || null;
  },

  // ==========================================
  // Dashboard Metrics (Real Database-Backed)
  // ==========================================
  async getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
    const resumes = await this.listUserResumes(userId);
    const analyses = await this.listUserAnalyses(userId, 10);
    const userSkills = await this.getUserSkills(userId);
    const tasks = await this.listProgressTasks(userId);
    const latestRec = await this.getLatestCareerRecommendations(userId);

    const latestAnalysis = analyses[0] || null;

    const scoreHistory = analyses
      .slice()
      .reverse()
      .map((a) => ({
        date: new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        overallScore: Number(a.overall_score),
        atsScore: Number(a.ats_score),
        role: a.target_job_role || 'General'
      }));

    return {
      totalResumes: resumes.length,
      totalAnalyses: analyses.length,
      latestOverallScore: latestAnalysis ? Number(latestAnalysis.overall_score) : null,
      latestAtsScore: latestAnalysis ? Number(latestAnalysis.ats_score) : null,
      identifiedSkillsCount: userSkills.length,
      skillGapsCount: latestAnalysis?.analysis_result?.weaknesses?.length || 0,
      recommendedRolesCount: latestRec?.recommendations?.recommended_roles?.length || 0,
      pendingTasksCount: tasks.filter((t) => t.status !== 'completed').length,
      completedTasksCount: tasks.filter((t) => t.status === 'completed').length,
      recentAnalyses: analyses.slice(0, 5),
      recentSkills: userSkills.slice(0, 8),
      recentTasks: tasks.slice(0, 5),
      scoreHistory
    };
  }
};
