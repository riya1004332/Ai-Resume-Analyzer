import { Request, Response, NextFunction } from 'express';
import { dbService } from '../services/database/dbService';
import { generateAIResponse } from '../services/ai/geminiService';
import {
  generateMockResumeImprovement,
  generateMockCareerGuidance,
  generateMockJobPreparation
} from '../services/ai/mockGenerators';
import {
  buildResumeImprovementPrompt,
  buildCareerGuidancePrompt,
  buildJobPreparationPrompt
} from '../prompts/resumePrompts';
import {
  resumeImprovementOutputSchema,
  ResumeImprovementOutput,
  careerGuidanceOutputSchema,
  CareerGuidanceOutput,
  jobPreparationOutputSchema,
  JobPreparationOutput
} from '@ai-resume/shared';

export const advisoryController = {
  async generateResumeImprovement(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { resumeAnalysisId, targetJobRole, improvementFocus, additionalInstructions } = req.body;

      const analysis = await dbService.getAnalysisById(resumeAnalysisId, userId);
      if (!analysis) {
        res.status(404).json({
          success: false,
          message: 'Referenced resume analysis not found or access denied.',
          error: { code: 'NOT_FOUND' }
        });
        return;
      }

      const resumeText = analysis.resume?.extracted_text || 'Software engineering background with experience in web applications.';

      const prompt = buildResumeImprovementPrompt({
        resumeText,
        targetJobRole: targetJobRole || analysis.target_job_role || undefined,
        improvementFocus,
        additionalInstructions
      });

      const suggestions = await generateAIResponse<ResumeImprovementOutput>({
        prompt,
        schema: resumeImprovementOutputSchema,
        moduleName: 'ResumeImprovementAdvisor',
        mockFallback: () => generateMockResumeImprovement({
          targetJobRole: targetJobRole || analysis.target_job_role || undefined,
          improvementFocus
        })
      });

      res.json({
        success: true,
        message: 'Resume improvement suggestions generated successfully',
        data: suggestions
      });
    } catch (error) {
      next(error);
    }
  },

  async generateCareerGuidance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { educationLevel, careerInterest, existingSkills, experienceLevel, preferredDomain, resumeAnalysisId } = req.body;

      const prompt = buildCareerGuidancePrompt({
        education: educationLevel,
        skills: existingSkills,
        experience: experienceLevel,
        careerInterest,
        preferredDomain
      });

      const guidance = await generateAIResponse<CareerGuidanceOutput>({
        prompt,
        schema: careerGuidanceOutputSchema,
        moduleName: 'CareerGuidanceAdvisor',
        mockFallback: () => generateMockCareerGuidance({
          education: educationLevel,
          skills: existingSkills,
          careerInterest,
          preferredDomain
        })
      });

      const saved = await dbService.saveCareerRecommendations({
        user_id: userId,
        resume_analysis_id: resumeAnalysisId || null,
        recommendations: guidance
      });

      res.status(201).json({
        success: true,
        message: 'Career guidance recommendations generated successfully',
        data: saved
      });
    } catch (error) {
      next(error);
    }
  },

  async getCareerGuidance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const guidance = await dbService.getLatestCareerRecommendations(userId);

      res.json({
        success: true,
        message: 'Career guidance retrieved successfully',
        data: guidance
      });
    } catch (error) {
      next(error);
    }
  },

  async generateJobPreparation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { targetJobRole, experienceLevel, preparationDuration, interviewTypes, currentPreparationLevel } = req.body;

      const prompt = buildJobPreparationPrompt({
        targetJobRole,
        experienceLevel,
        preparationDuration,
        interviewTypes: interviewTypes || [],
        preparationLevel: currentPreparationLevel || 'beginner'
      });

      const plan = await generateAIResponse<JobPreparationOutput>({
        prompt,
        schema: jobPreparationOutputSchema,
        moduleName: 'JobPreparationAdvisor',
        mockFallback: () => generateMockJobPreparation({
          targetJobRole,
          preparationDuration,
          interviewTypes: interviewTypes || []
        })
      });

      const savedPlan = await dbService.saveJobPreparationPlan({
        user_id: userId,
        target_job_role: targetJobRole,
        preparation_duration: preparationDuration,
        plan
      });

      res.status(201).json({
        success: true,
        message: 'Job preparation plan generated successfully',
        data: savedPlan
      });
    } catch (error) {
      next(error);
    }
  },

  async getJobPreparation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const plan = await dbService.getLatestJobPreparationPlan(userId);

      res.json({
        success: true,
        message: 'Job preparation plan retrieved successfully',
        data: plan
      });
    } catch (error) {
      next(error);
    }
  }
};

