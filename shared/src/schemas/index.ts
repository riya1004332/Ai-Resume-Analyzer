import { z } from 'zod';

// ==========================================
// Authentication & Profile Schemas
// ==========================================

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128)
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters').max(128)
});

export const profileUpdateSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  educationLevel: z.string().max(100).optional(),
  experienceLevel: z.string().max(100).optional(),
  careerDomain: z.string().max(100).optional(),
  careerInterest: z.string().max(255).optional()
});

// ==========================================
// Resume Upload Schemas
// ==========================================

export const resumeUploadSchema = z.object({
  fileName: z.string().min(1).max(255),
  fileSize: z.number().positive().max(5242880, 'File size cannot exceed 5MB'),
  fileType: z.enum(['pdf', 'docx'])
});

export const resumeAnalyzeRequestSchema = z.object({
  targetJobRole: z.string().max(150).optional(),
  experienceLevel: z.enum(['fresher', 'entry', 'mid', 'senior', 'switcher']).optional(),
  careerDomain: z.string().max(100).optional()
});

// ==========================================
// AI Module Input Schemas
// ==========================================

export const skillGapSchema = z.object({
  targetJobRole: z.string().min(2, 'Target job role is required').max(150),
  careerDomain: z.string().min(2, 'Career domain is required').max(100),
  experienceLevel: z.enum(['fresher', 'entry', 'mid', 'senior', 'switcher']),
  preferredSkillLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  resumeAnalysisId: z.string().uuid().optional().nullable().or(z.literal('')),
  currentSkills: z.string().optional()
});

export const learningSchema = z.object({
  skillName: z.string().min(2, 'Skill name is required').max(100),
  currentLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  targetLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  availableTime: z.string().min(2, 'Available learning time is required').max(50),
  learningPreference: z.string().max(100).optional()
});

export const resumeImprovementRequestSchema = z.object({
  resumeAnalysisId: z.string().uuid('Invalid resume analysis ID'),
  targetJobRole: z.string().max(150).optional(),
  improvementFocus: z.array(z.string()).min(1, 'Select at least one improvement focus area'),
  additionalInstructions: z.string().max(1000).optional()
});

export const careerGuidanceRequestSchema = z.object({
  educationLevel: z.string().min(1, 'Education level is required').max(100),
  careerInterest: z.string().min(1, 'Career interest is required').max(255),
  existingSkills: z.string().min(1, 'Existing skills are required').max(2000),
  experienceLevel: z.enum(['fresher', 'entry', 'mid', 'senior', 'switcher']),
  preferredDomain: z.string().min(1, 'Preferred domain is required').max(100),
  resumeAnalysisId: z.string().uuid().optional().nullable().or(z.literal(''))
});

export const jobPreparationRequestSchema = z.object({
  targetJobRole: z.string().min(2, 'Target job role is required').max(150),
  experienceLevel: z.enum(['fresher', 'entry', 'mid', 'senior', 'switcher']),
  preparationDuration: z.string().min(1, 'Preparation duration is required').max(50),
  interviewTypes: z.array(z.string()).optional().default([]),
  currentPreparationLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional().default('beginner')
});

export const createProgressTaskSchema = z.object({
  roadmapId: z.string().uuid().optional().nullable().or(z.literal('')),
  taskTitle: z.string().min(2, 'Task title is required').max(255),
  description: z.string().max(1000).optional().nullable()
});

export const updateProgressTaskSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed'])
});

// ==========================================
// AI Output Zod Schemas (Strict Validation)
// ==========================================

export const resumeAnalysisOutputSchema = z.object({
  overall_score: z.number().min(0).max(100),
  ats_score: z.number().min(0).max(100),
  summary: z.string(),
  sections: z.array(
    z.object({
      name: z.string(),
      status: z.enum(['good', 'needs_improvement', 'poor']).or(z.string()),
      feedback: z.string(),
      suggestions: z.array(z.string())
    })
  ),
  skills: z.object({
    technical: z.array(z.string()),
    soft: z.array(z.string()),
    inferred: z.array(z.string()).default([])
  }),
  strengths: z.array(
    z.object({
      title: z.string(),
      description: z.string()
    })
  ),
  weaknesses: z.array(
    z.object({
      title: z.string(),
      description: z.string()
    })
  ),
  missing_information: z.array(z.string()),
  ats_feedback: z.object({
    keyword_relevance: z.string(),
    formatting: z.string(),
    readability: z.string(),
    recommendations: z.array(z.string())
  }),
  improvement_suggestions: z.array(
    z.object({
      priority: z.enum(['high', 'medium', 'low']).or(z.string()),
      section: z.string(),
      suggestion: z.string(),
      reason: z.string()
    })
  )
});

export const skillGapOutputSchema = z.object({
  target_role: z.string(),
  readiness_score: z.number().min(0).max(100),
  matching_skills: z.array(
    z.object({
      name: z.string(),
      reason: z.string()
    })
  ),
  missing_skills: z.array(
    z.object({
      name: z.string(),
      priority: z.enum(['high', 'medium', 'low']).or(z.string()),
      reason: z.string(),
      target_level: z.string()
    })
  ),
  improvement_skills: z.array(
    z.object({
      name: z.string(),
      current_level: z.string(),
      target_level: z.string()
    })
  ),
  learning_priority: z.array(z.string()),
  recommendation: z.string()
});

export const learningRoadmapOutputSchema = z.object({
  skill_name: z.string(),
  current_level: z.string(),
  target_level: z.string(),
  estimated_duration: z.string(),
  learning_stages: z.array(
    z.object({
      week: z.number().or(z.string()),
      title: z.string(),
      objectives: z.array(z.string()),
      activities: z.array(z.string()),
      practical_exercise: z.string()
    })
  ),
  projects: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']).or(z.string())
    })
  ),
  success_criteria: z.array(z.string())
});

export const resumeImprovementOutputSchema = z.object({
  overall_feedback: z.string(),
  improvements: z.array(
    z.object({
      section: z.string(),
      original_text: z.string(),
      suggested_text: z.string(),
      reason: z.string(),
      priority: z.enum(['high', 'medium', 'low']).or(z.string())
    })
  ),
  keyword_recommendations: z.array(z.string()),
  formatting_suggestions: z.array(z.string()),
  missing_information: z.array(z.string())
});

export const careerGuidanceOutputSchema = z.object({
  career_summary: z.string(),
  recommended_roles: z.array(
    z.object({
      job_title: z.string(),
      suitability: z.enum(['high', 'medium', 'low']).or(z.string()),
      reason: z.string(),
      matching_skills: z.array(z.string()),
      missing_skills: z.array(z.string()),
      recommended_projects: z.array(z.string()),
      career_progression: z.array(z.string())
    })
  ),
  next_steps: z.array(z.string())
});

export const jobPreparationOutputSchema = z.object({
  target_role: z.string(),
  duration: z.string(),
  weekly_plan: z.array(
    z.object({
      week: z.number().or(z.string()),
      focus: z.string(),
      tasks: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          category: z.string(),
          priority: z.enum(['high', 'medium', 'low']).or(z.string())
        })
      )
    })
  ),
  interview_preparation: z.array(
    z.object({
      category: z.string(),
      topics: z.array(z.string())
    })
  ),
  portfolio_recommendations: z.array(z.string()),
  job_search_strategy: z.array(z.string()),
  success_checklist: z.array(z.string())
});

