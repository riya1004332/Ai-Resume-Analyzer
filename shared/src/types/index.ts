import { z } from 'zod';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  profileUpdateSchema,
  resumeUploadSchema,
  resumeAnalyzeRequestSchema,
  skillGapSchema,
  learningSchema,
  resumeImprovementRequestSchema,
  careerGuidanceRequestSchema,
  jobPreparationRequestSchema,
  createProgressTaskSchema,
  updateProgressTaskSchema,
  resumeAnalysisOutputSchema,
  skillGapOutputSchema,
  learningRoadmapOutputSchema,
  resumeImprovementOutputSchema,
  careerGuidanceOutputSchema,
  jobPreparationOutputSchema
} from '../schemas';

// Request / Input Types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type ResumeUploadInput = z.infer<typeof resumeUploadSchema>;
export type ResumeAnalyzeRequest = z.infer<typeof resumeAnalyzeRequestSchema>;
export type SkillGapInput = z.infer<typeof skillGapSchema>;
export type LearningRoadmapInput = z.infer<typeof learningSchema>;
export type ResumeImprovementRequest = z.infer<typeof resumeImprovementRequestSchema>;
export type CareerGuidanceRequest = z.infer<typeof careerGuidanceRequestSchema>;
export type JobPreparationRequest = z.infer<typeof jobPreparationRequestSchema>;
export type CreateProgressTaskInput = z.infer<typeof createProgressTaskSchema>;
export type UpdateProgressTaskInput = z.infer<typeof updateProgressTaskSchema>;

// AI Output Types
export type ResumeAnalysisOutput = z.infer<typeof resumeAnalysisOutputSchema>;
export type SkillGapOutput = z.infer<typeof skillGapOutputSchema>;
export type LearningRoadmapOutput = z.infer<typeof learningRoadmapOutputSchema>;
export type ResumeImprovementOutput = z.infer<typeof resumeImprovementOutputSchema>;
export type CareerGuidanceOutput = z.infer<typeof careerGuidanceOutputSchema>;
export type JobPreparationOutput = z.infer<typeof jobPreparationOutputSchema>;

// Database Entity Types
export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  education_level: string | null;
  experience_level: string | null;
  career_domain: string | null;
  career_interest: string | null;
  created_at: string;
  updated_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  file_name: string;
  storage_path: string;
  file_type: 'pdf' | 'docx';
  file_size: number;
  extracted_text: string | null;
  processing_status: 'uploaded' | 'processing' | 'completed' | 'failed';
  created_at: string;
}

export interface ResumeAnalysis {
  id: string;
  user_id: string;
  resume_id: string;
  target_job_role: string | null;
  overall_score: number;
  ats_score: number;
  analysis_result: ResumeAnalysisOutput;
  model_name: string | null;
  prompt_version: string | null;
  created_at: string;
  resume?: Resume;
}

export interface Skill {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  created_at: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  proficiency_level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'unknown';
  assessment_source: 'ai_inferred' | 'user_confirmed';
  created_at: string;
  skill?: Skill;
}

export interface SkillGapAnalysis {
  id: string;
  user_id: string;
  resume_analysis_id: string | null;
  target_job_role: string;
  career_domain: string | null;
  result: SkillGapOutput;
  created_at: string;
}

export interface LearningRoadmap {
  id: string;
  user_id: string;
  skill_name: string;
  current_level: string | null;
  target_level: string | null;
  roadmap: LearningRoadmapOutput;
  estimated_duration: string | null;
  created_at: string;
}

export interface ProgressTask {
  id: string;
  user_id: string;
  roadmap_id: string | null;
  task_title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  completed_at: string | null;
  created_at: string;
}

export interface CareerRecommendation {
  id: string;
  user_id: string;
  resume_analysis_id: string | null;
  recommendations: CareerGuidanceOutput;
  created_at: string;
}

export interface JobPreparationPlan {
  id: string;
  user_id: string;
  target_job_role: string;
  preparation_duration: string | null;
  plan: JobPreparationOutput;
  created_at: string;
}

// API Response Wrappers
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
}

export interface DashboardMetrics {
  totalResumes: number;
  totalAnalyses: number;
  latestOverallScore: number | null;
  latestAtsScore: number | null;
  identifiedSkillsCount: number;
  skillGapsCount: number;
  recommendedRolesCount: number;
  pendingTasksCount: number;
  completedTasksCount: number;
  recentAnalyses: ResumeAnalysis[];
  recentSkills: UserSkill[];
  recentTasks: ProgressTask[];
  scoreHistory: Array<{
    date: string;
    overallScore: number;
    atsScore: number;
    role: string;
  }>;
}

