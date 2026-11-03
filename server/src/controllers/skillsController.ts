import { Request, Response, NextFunction } from 'express';
import { dbService } from '../services/database/dbService';
import { generateAIResponse } from '../services/ai/geminiService';
import { generateMockSkillGap, generateMockLearningRoadmap } from '../services/ai/mockGenerators';
import { buildSkillGapPrompt, buildSkillImprovementPrompt } from '../prompts/resumePrompts';
import {
  skillGapOutputSchema,
  SkillGapOutput,
  learningRoadmapOutputSchema,
  LearningRoadmapOutput
} from '@ai-resume/shared';

export const skillsController = {
  async generateSkillGap(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { targetJobRole, careerDomain, experienceLevel, currentSkills, resumeAnalysisId } = req.body;

      // Collect user skills
      let skillsText = currentSkills || '';
      if (!skillsText) {
        const userSkills = await dbService.getUserSkills(userId);
        if (userSkills.length > 0) {
          skillsText = userSkills.map((u) => u.skill?.name || '').filter(Boolean).join(', ');
        }
      }

      if (!skillsText && resumeAnalysisId) {
        const analysis = await dbService.getAnalysisById(resumeAnalysisId, userId);
        if (analysis?.analysis_result?.skills?.technical) {
          skillsText = analysis.analysis_result.skills.technical.join(', ');
        }
      }

      const prompt = buildSkillGapPrompt({
        targetJobRole,
        careerDomain,
        currentSkills: skillsText || 'General software development fundamentals',
        experienceLevel
      });

      const result = await generateAIResponse<SkillGapOutput>({
        prompt,
        schema: skillGapOutputSchema,
        moduleName: 'SkillGapAnalyzer',
        mockFallback: () => generateMockSkillGap({
          targetJobRole,
          careerDomain,
          currentSkills: skillsText
        })
      });

      const savedGap = await dbService.createSkillGapAnalysis({
        user_id: userId,
        resume_analysis_id: resumeAnalysisId || null,
        target_job_role: targetJobRole,
        career_domain: careerDomain,
        result
      });

      res.status(201).json({
        success: true,
        message: 'Skill gap analysis generated successfully',
        data: savedGap
      });
    } catch (error) {
      next(error);
    }
  },

  async getSkillGap(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const gap = await dbService.getSkillGapAnalysisById(id, userId);
      if (!gap) {
        res.status(404).json({
          success: false,
          message: 'Skill gap report not found or access denied.',
          error: { code: 'NOT_FOUND' }
        });
        return;
      }

      res.json({
        success: true,
        message: 'Skill gap analysis retrieved successfully',
        data: gap
      });
    } catch (error) {
      next(error);
    }
  },

  async getUserSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const skills = await dbService.getUserSkills(userId);

      res.json({
        success: true,
        message: 'User skills retrieved successfully',
        data: skills
      });
    } catch (error) {
      next(error);
    }
  },

  async generateRoadmap(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { skillName, currentLevel, targetLevel, availableTime, learningPreference } = req.body;

      const prompt = buildSkillImprovementPrompt({
        skillName,
        currentLevel,
        targetLevel,
        availableTime,
        learningPreference
      });

      const roadmap = await generateAIResponse<LearningRoadmapOutput>({
        prompt,
        schema: learningRoadmapOutputSchema,
        moduleName: 'SkillImprovementAdvisor',
        mockFallback: () => generateMockLearningRoadmap({
          skillName,
          currentLevel,
          targetLevel,
          availableTime
        })
      });

      const savedRoadmap = await dbService.createLearningRoadmap({
        user_id: userId,
        skill_name: skillName,
        current_level: currentLevel,
        target_level: targetLevel,
        roadmap,
        estimated_duration: availableTime
      });

      res.status(201).json({
        success: true,
        message: 'Learning roadmap created successfully',
        data: savedRoadmap
      });
    } catch (error) {
      next(error);
    }
  },

  async listRoadmaps(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const roadmaps = await dbService.listLearningRoadmaps(userId);

      res.json({
        success: true,
        message: 'Learning roadmaps retrieved successfully',
        data: roadmaps
      });
    } catch (error) {
      next(error);
    }
  },

  async getRoadmap(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const roadmap = await dbService.getLearningRoadmapById(id, userId);
      if (!roadmap) {
        res.status(404).json({
          success: false,
          message: 'Roadmap not found or access denied.',
          error: { code: 'NOT_FOUND' }
        });
        return;
      }

      res.json({
        success: true,
        message: 'Roadmap retrieved successfully',
        data: roadmap
      });
    } catch (error) {
      next(error);
    }
  }
};

