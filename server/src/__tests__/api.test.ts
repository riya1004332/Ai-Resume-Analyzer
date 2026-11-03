import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../app';
import { requireAuth } from '../middleware/auth';
import { dbService } from '../services/database/dbService';
import {
  resumeAnalysisOutputSchema,
  skillGapOutputSchema,
  learningRoadmapOutputSchema,
  resumeImprovementOutputSchema,
  careerGuidanceOutputSchema,
  jobPreparationOutputSchema,
  registerSchema,
  loginSchema,
  skillGapSchema,
  learningSchema
} from '@ai-resume/shared';
import {
  generateMockResumeAnalysis,
  generateMockSkillGap,
  generateMockLearningRoadmap,
  generateMockResumeImprovement,
  generateMockCareerGuidance,
  generateMockJobPreparation
} from '../services/ai/mockGenerators';

describe('AI Resume Analyzer API & Service Test Suite', () => {
  describe('1. Health Check Endpoint', () => {
    it('app is instantiated and configures routes properly', () => {
      const app = createApp();
      assert.ok(app);
      assert.equal(typeof app.listen, 'function');
    });
  });

  describe('2. Authentication Security & Middleware', () => {
    it('should reject unauthenticated request with missing Bearer token', async () => {
      let statusCode = 0;
      let responseBody: any = null;

      const req: any = { headers: {} };
      const res: any = {
        status: (code: number) => {
          statusCode = code;
          return {
            json: (body: any) => {
              responseBody = body;
            }
          };
        }
      };

      let nextCalled = false;
      await requireAuth(req, res, () => {
        nextCalled = true;
      });

      assert.equal(nextCalled, false);
      assert.equal(statusCode, 401);
      assert.equal(responseBody.success, false);
      assert.equal(responseBody.error.code, 'UNAUTHORIZED');
    });

    it('should accept dev-token and populate authenticated user', async () => {
      const req: any = {
        headers: {
          authorization: 'Bearer dev-token'
        }
      };
      const res: any = {};

      let nextCalled = false;
      await requireAuth(req, res, () => {
        nextCalled = true;
      });

      assert.equal(nextCalled, true);
      assert.ok(req.user);
      assert.equal(req.user.id, '00000000-0000-0000-0000-000000000001');
      assert.equal(req.user.email, 'developer@example.com');
    });
  });

  describe('3. Zod Input Validation Rules', () => {
    it('should reject invalid registration passwords under 8 characters', () => {
      const invalid = {
        fullName: 'Alex Johnson',
        email: 'alex@example.com',
        password: 'short'
      };
      const result = registerSchema.safeParse(invalid);
      assert.equal(result.success, false);
    });

    it('should accept valid registration payloads', () => {
      const valid = {
        fullName: 'Alex Johnson',
        email: 'alex@example.com',
        password: 'securePassword123'
      };
      const result = registerSchema.safeParse(valid);
      assert.equal(result.success, true);
    });

    it('should validate login schema with valid email', () => {
      const valid = {
        email: 'user@example.com',
        password: 'password123'
      };
      const result = loginSchema.safeParse(valid);
      assert.equal(result.success, true);
    });

    it('should validate skill gap request schemas properly', () => {
      const valid = {
        targetJobRole: 'Full Stack Developer',
        careerDomain: 'Software Development',
        experienceLevel: 'entry' as const,
        preferredSkillLevel: 'intermediate' as const
      };
      const result = skillGapSchema.safeParse(valid);
      assert.equal(result.success, true);
    });

    it('should validate learning roadmap input schema', () => {
      const valid = {
        skillName: 'Docker',
        currentLevel: 'beginner' as const,
        targetLevel: 'intermediate' as const,
        availableTime: '5-8 hours per week'
      };
      const result = learningSchema.safeParse(valid);
      assert.equal(result.success, true);
    });
  });

  describe('4. AI Advisory Output Schema Conformance', () => {
    it('Resume Analysis Mock adheres to strict Zod schema', () => {
      const mock = generateMockResumeAnalysis({
        targetJobRole: 'Software Engineer',
        experienceLevel: 'entry',
        resumeText: 'Experienced developer'
      });
      const parsed = resumeAnalysisOutputSchema.safeParse(mock);
      assert.equal(parsed.success, true, 'Resume analysis must pass strict schema');
      assert.ok(mock.overall_score >= 0 && mock.overall_score <= 100);
      assert.ok(mock.ats_score >= 0 && mock.ats_score <= 100);
      assert.ok(mock.skills.technical.length > 0);
      assert.ok(mock.sections.length > 0);
    });

    it('Skill Gap Mock adheres to strict Zod schema', () => {
      const mock = generateMockSkillGap({
        targetJobRole: 'DevOps Engineer',
        careerDomain: 'Cloud & DevOps',
        currentSkills: 'Linux, Git, Python'
      });
      const parsed = skillGapOutputSchema.safeParse(mock);
      assert.equal(parsed.success, true, 'Skill gap must pass strict schema');
      assert.ok(mock.missing_skills.length > 0);
      assert.ok(mock.readiness_score >= 0 && mock.readiness_score <= 100);
    });

    it('Learning Roadmap Mock adheres to strict Zod schema', () => {
      const mock = generateMockLearningRoadmap({
        skillName: 'Docker',
        currentLevel: 'beginner',
        targetLevel: 'intermediate',
        availableTime: '4 weeks'
      });
      const parsed = learningRoadmapOutputSchema.safeParse(mock);
      assert.equal(parsed.success, true, 'Learning roadmap must pass strict schema');
      assert.ok(mock.learning_stages.length > 0);
      assert.ok(mock.projects.length > 0);
    });

    it('Resume Improvement Mock adheres to strict Zod schema', () => {
      const mock = generateMockResumeImprovement({
        targetJobRole: 'React Developer',
        improvementFocus: ['Professional Summary', 'Work Experience']
      });
      const parsed = resumeImprovementOutputSchema.safeParse(mock);
      assert.equal(parsed.success, true, 'Resume improvement must pass strict schema');
      assert.ok(mock.improvements.length > 0);
      assert.ok(mock.improvements[0].suggested_text.length > 0);
      assert.ok(mock.keyword_recommendations.length > 0);
    });

    it('Career Guidance Mock adheres to strict Zod schema', () => {
      const mock = generateMockCareerGuidance({
        education: "Bachelor's Degree",
        skills: 'JavaScript, React, Node.js',
        careerInterest: 'Web Development',
        preferredDomain: 'Software Development'
      });
      const parsed = careerGuidanceOutputSchema.safeParse(mock);
      assert.equal(parsed.success, true, 'Career guidance must pass strict schema');
      assert.ok(mock.recommended_roles.length > 0);
      assert.ok(mock.next_steps.length > 0);
    });

    it('Job Preparation Mock adheres to strict Zod schema', () => {
      const mock = generateMockJobPreparation({
        targetJobRole: 'Full Stack Developer',
        preparationDuration: '8 weeks',
        interviewTypes: ['Technical', 'Behavioral']
      });
      const parsed = jobPreparationOutputSchema.safeParse(mock);
      assert.equal(parsed.success, true, 'Job preparation must pass strict schema');
      assert.ok(mock.weekly_plan.length > 0);
      assert.ok(mock.success_checklist.length > 0);
    });
  });

  describe('5. Database Operations, Progress Tasks & Metrics', () => {
    const testUserId = 'test-user-001';

    it('should create, list, and update progress tasks in dbService', async () => {
      // Create task
      const task = await dbService.createProgressTask({
        user_id: testUserId,
        roadmap_id: null,
        task_title: 'Complete TypeScript generics exercise',
        description: 'Understand keyof, typeof, and conditional types',
        status: 'pending'
      });

      assert.ok(task.id);
      assert.equal(task.task_title, 'Complete TypeScript generics exercise');
      assert.equal(task.status, 'pending');

      // Update status
      const updated = await dbService.updateProgressTaskStatus(task.id, testUserId, 'completed');
      assert.ok(updated);
      assert.equal(updated.status, 'completed');
      assert.ok(updated.completed_at);

      // List tasks
      const tasks = await dbService.listProgressTasks(testUserId);
      assert.ok(tasks.some((t) => t.id === task.id));

      // Compute Dashboard Metrics
      const metrics = await dbService.getDashboardMetrics(testUserId);
      assert.ok(metrics);
      assert.equal(metrics.completedTasksCount, 1);
      assert.equal(metrics.pendingTasksCount, 0);

      // Delete task
      const deleted = await dbService.deleteProgressTask(task.id, testUserId);
      assert.equal(deleted, true);
    });

    it('should create and retrieve resume analyses and sync skills in dbService', async () => {
      // Sync user skills
      await dbService.syncUserSkills(testUserId, ['TypeScript', 'React', 'Docker'], 'advanced');
      const skills = await dbService.getUserSkills(testUserId);
      assert.ok(skills.length >= 3);
      assert.ok(skills.some((s) => s.skill?.name === 'TypeScript'));

      // Create resume
      const resume = await dbService.createResume({
        user_id: testUserId,
        file_name: 'test_resume.pdf',
        storage_path: `${testUserId}/resumes/test_resume.pdf`,
        file_type: 'pdf',
        file_size: 102400,
        extracted_text: 'Experienced Full Stack Developer with TypeScript and React.',
        processing_status: 'completed'
      });
      assert.ok(resume.id);

      // Create analysis
      const mockResult = generateMockResumeAnalysis({
        targetJobRole: 'Full Stack Developer',
        experienceLevel: 'entry',
        resumeText: 'Experienced Full Stack Developer with TypeScript and React.'
      });
      const analysis = await dbService.createResumeAnalysis({
        user_id: testUserId,
        resume_id: resume.id,
        target_job_role: 'Full Stack Developer',
        overall_score: mockResult.overall_score,
        ats_score: mockResult.ats_score,
        analysis_result: mockResult,
        model_name: 'gemini-1.5-flash',
        prompt_version: 'v1.0'
      });
      assert.ok(analysis.id);

      // Retrieve analysis
      const retrieved = await dbService.getAnalysisById(analysis.id, testUserId);
      assert.ok(retrieved);
      assert.equal(retrieved.target_job_role, 'Full Stack Developer');
      assert.equal(retrieved.overall_score, mockResult.overall_score);

      // Dashboard reflects real analysis
      const metrics = await dbService.getDashboardMetrics(testUserId);
      assert.equal(metrics.totalResumes, 1);
      assert.equal(metrics.totalAnalyses, 1);
      assert.equal(metrics.latestOverallScore, mockResult.overall_score);
    });
  });
});
