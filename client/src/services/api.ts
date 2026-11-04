import {
  ApiResponse,
  Profile,
  ProfileUpdateInput,
  Resume,
  ResumeAnalysis,
  ResumeAnalyzeRequest,
  SkillGapInput,
  SkillGapAnalysis,
  LearningRoadmapInput,
  LearningRoadmap,
  ResumeImprovementRequest,
  ResumeImprovementOutput,
  CareerGuidanceRequest,
  CareerRecommendation,
  JobPreparationRequest,
  JobPreparationPlan,
  ProgressTask,
  CreateProgressTaskInput,
  DashboardMetrics,
  UserSkill
} from '@ai-resume/shared';

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? '/api/v1' : 'http://localhost:5000/api/v1');

class ApiClient {
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('auth_token') || 'dev-token';
    return {
      Authorization: `Bearer ${token}`
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      ...this.getAuthHeader(),
      ...(options.headers || {})
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    const data: ApiResponse<T> = await response.json().catch(() => ({
      success: false,
      message: `HTTP Error: ${response.status} ${response.statusText}`
    }));

    if (!response.ok || !data.success) {
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      const err = new Error(errorMsg);
      (err as any).response = data;
      throw err;
    }

    return data.data as T;
  }

  // Profile APIs
  async getProfile(): Promise<Profile> {
    return this.request<Profile>('/profile');
  }

  async updateProfile(input: ProfileUpdateInput): Promise<Profile> {
    return this.request<Profile>('/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
  }

  // Resume APIs
  async uploadResume(file: File): Promise<Resume> {
    const formData = new FormData();
    formData.append('resume', file);

    const url = `${BASE_URL}/resumes/upload`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: formData
    });

    const data: ApiResponse<Resume> = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to upload resume file.');
    }
    return data.data as Resume;
  }

  async listResumes(): Promise<Resume[]> {
    return this.request<Resume[]>('/resumes');
  }

  async getResume(id: string): Promise<Resume> {
    return this.request<Resume>(`/resumes/${id}`);
  }

  async deleteResume(id: string): Promise<void> {
    await this.request<void>(`/resumes/${id}`, { method: 'DELETE' });
  }

  // Resume Analysis APIs
  async analyzeResume(resumeId: string, params: ResumeAnalyzeRequest): Promise<ResumeAnalysis> {
    return this.request<ResumeAnalysis>(`/analysis/resume/${resumeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
  }

  async getAnalysis(id: string): Promise<ResumeAnalysis> {
    return this.request<ResumeAnalysis>(`/analysis/${id}`);
  }

  async getAnalysisHistory(): Promise<ResumeAnalysis[]> {
    return this.request<ResumeAnalysis[]>('/analysis/history');
  }

  async deleteAnalysis(id: string): Promise<void> {
    await this.request<void>(`/analysis/${id}`, { method: 'DELETE' });
  }

  // Skill Gap APIs
  async generateSkillGap(input: SkillGapInput): Promise<SkillGapAnalysis> {
    return this.request<SkillGapAnalysis>('/skills/gap-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
  }

  async getSkillGap(id: string): Promise<SkillGapAnalysis> {
    return this.request<SkillGapAnalysis>(`/skills/gap-analysis/${id}`);
  }

  async getUserSkills(): Promise<UserSkill[]> {
    return this.request<UserSkill[]>('/skills');
  }

  // Skill Improvement APIs
  async generateLearningRoadmap(input: LearningRoadmapInput): Promise<LearningRoadmap> {
    return this.request<LearningRoadmap>('/skills/improvement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
  }

  async listRoadmaps(): Promise<LearningRoadmap[]> {
    return this.request<LearningRoadmap[]>('/skills/roadmaps');
  }

  async getRoadmap(id: string): Promise<LearningRoadmap> {
    return this.request<LearningRoadmap>(`/skills/roadmaps/${id}`);
  }

  // Advisory APIs
  async generateResumeImprovement(input: ResumeImprovementRequest): Promise<ResumeImprovementOutput> {
    return this.request<ResumeImprovementOutput>('/advisory/resume-improvement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
  }

  async generateCareerGuidance(input: CareerGuidanceRequest): Promise<CareerRecommendation> {
    return this.request<CareerRecommendation>('/advisory/career-guidance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
  }

  async getCareerGuidance(): Promise<CareerRecommendation | null> {
    return this.request<CareerRecommendation | null>('/advisory/career-guidance');
  }

  async generateJobPreparation(input: JobPreparationRequest): Promise<JobPreparationPlan> {
    return this.request<JobPreparationPlan>('/advisory/job-preparation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
  }

  async getJobPreparation(): Promise<JobPreparationPlan | null> {
    return this.request<JobPreparationPlan | null>('/advisory/job-preparation');
  }

  // Progress APIs
  async createProgressTask(input: CreateProgressTaskInput): Promise<ProgressTask> {
    return this.request<ProgressTask>('/progress/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
  }

  async listProgress(): Promise<{ tasks: ProgressTask[]; total: number; completed: number; percentage: number }> {
    return this.request<{ tasks: ProgressTask[]; total: number; completed: number; percentage: number }>('/progress');
  }

  async updateProgressTaskStatus(id: string, status: 'pending' | 'in_progress' | 'completed'): Promise<ProgressTask> {
    return this.request<ProgressTask>(`/progress/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  }

  async deleteProgressTask(id: string): Promise<void> {
    await this.request<void>(`/progress/tasks/${id}`, { method: 'DELETE' });
  }

  // Dashboard API
  async getDashboard(): Promise<DashboardMetrics> {
    return this.request<DashboardMetrics>('/dashboard');
  }
}

export const api = new ApiClient();

