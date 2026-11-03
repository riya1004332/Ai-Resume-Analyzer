import { Request, Response, NextFunction } from 'express';
import { dbService } from '../services/database/dbService';
import { generateAIResponse } from '../services/ai/geminiService';
import { generateMockResumeAnalysis } from '../services/ai/mockGenerators';
import { buildResumeAnalysisPrompt } from '../prompts/resumePrompts';
import { resumeAnalysisOutputSchema, ResumeAnalysisOutput } from '@ai-resume/shared';
import { env } from '../config/env';

export const analysisController = {
  async analyzeResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { resumeId } = req.params;
      const { targetJobRole, experienceLevel, careerDomain } = req.body || {};

      // 1. Verify resume existence and user ownership
      const resume = await dbService.getResumeById(resumeId, userId);
      if (!resume) {
        res.status(404).json({
          success: false,
          message: 'Resume document not found or access denied.',
          error: { code: 'NOT_FOUND' }
        });
        return;
      }

      if (!resume.extracted_text) {
        res.status(400).json({
          success: false,
          message: 'Resume contains no readable text to analyze.',
          error: { code: 'EMPTY_RESUME' }
        });
        return;
      }

      // 2. Build prompt matching Section 15.1
      const prompt = buildResumeAnalysisPrompt({
        targetJobRole,
        experienceLevel,
        resumeText: resume.extracted_text
      });

      // 3. Call AI Service with strict Zod validation
      const analysisResult = await generateAIResponse<ResumeAnalysisOutput>({
        prompt,
        schema: resumeAnalysisOutputSchema,
        moduleName: 'ResumeAnalyzer',
        mockFallback: () => generateMockResumeAnalysis({
          targetJobRole,
          experienceLevel,
          resumeText: resume.extracted_text || ''
        })
      });

      // 4. Save analysis to PostgreSQL
      const savedAnalysis = await dbService.createResumeAnalysis({
        user_id: userId,
        resume_id: resumeId,
        target_job_role: targetJobRole || 'Software Professional',
        overall_score: analysisResult.overall_score,
        ats_score: analysisResult.ats_score,
        analysis_result: analysisResult,
        model_name: env.GEMINI_MODEL,
        prompt_version: 'v1.0'
      });

      // 5. Automatically sync extracted technical skills into user_skills table
      if (analysisResult.skills?.technical?.length) {
        await dbService.syncUserSkills(userId, analysisResult.skills.technical, 'intermediate');
      }

      res.status(201).json({
        success: true,
        message: 'Resume analysis completed successfully',
        data: savedAnalysis
      });
    } catch (error) {
      next(error);
    }
  },

  async getAnalysis(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const analysis = await dbService.getAnalysisById(id, userId);
      if (!analysis) {
        res.status(404).json({
          success: false,
          message: 'Analysis report not found or access denied.',
          error: { code: 'NOT_FOUND' }
        });
        return;
      }

      res.json({
        success: true,
        message: 'Analysis report retrieved successfully',
        data: analysis
      });
    } catch (error) {
      next(error);
    }
  },

  async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const limit = parseInt(req.query.limit as string, 10) || 20;

      const history = await dbService.listUserAnalyses(userId, limit);

      res.json({
        success: true,
        message: 'Analysis history retrieved successfully',
        data: history
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteAnalysis(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const deleted = await dbService.deleteAnalysis(id, userId);
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Analysis record not found or access denied.',
          error: { code: 'NOT_FOUND' }
        });
        return;
      }

      res.json({
        success: true,
        message: 'Analysis record deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

