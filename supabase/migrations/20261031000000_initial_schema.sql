-- ==============================================================================
-- AI Resume Analyzer & Career Development Platform - Production Schema Migration
-- ==============================================================================

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Reusable timestamp update function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    education_level TEXT,
    experience_level TEXT,
    career_domain TEXT,
    career_interest TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for profile updated_at
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Automatic profile creation trigger on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Resumes Table
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'docx')),
    file_size BIGINT NOT NULL CHECK (file_size > 0 AND file_size <= 5242880),
    extracted_text TEXT,
    processing_status TEXT NOT NULL DEFAULT 'uploaded'
        CHECK (processing_status IN ('uploaded', 'processing', 'completed', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Resume Analyses Table
CREATE TABLE IF NOT EXISTS public.resume_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    target_job_role TEXT,
    overall_score NUMERIC(5,2) CHECK (overall_score BETWEEN 0 AND 100),
    ats_score NUMERIC(5,2) CHECK (ats_score BETWEEN 0 AND 100),
    analysis_result JSONB NOT NULL,
    model_name TEXT,
    prompt_version TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Skills Table (Global Dictionary)
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    category TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. User Skills Table
CREATE TABLE IF NOT EXISTS public.user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    proficiency_level TEXT NOT NULL
        CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert', 'unknown')),
    assessment_source TEXT DEFAULT 'ai_inferred'
        CHECK (assessment_source IN ('ai_inferred', 'user_confirmed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

-- 6. Skill Gap Analyses Table
CREATE TABLE IF NOT EXISTS public.skill_gap_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resume_analysis_id UUID REFERENCES public.resume_analyses(id) ON DELETE SET NULL,
    target_job_role TEXT NOT NULL,
    career_domain TEXT,
    result JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Learning Roadmaps Table
CREATE TABLE IF NOT EXISTS public.learning_roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    current_level TEXT,
    target_level TEXT,
    roadmap JSONB NOT NULL,
    estimated_duration TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Progress Tasks Table
CREATE TABLE IF NOT EXISTS public.progress_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    roadmap_id UUID REFERENCES public.learning_roadmaps(id) ON DELETE CASCADE,
    task_title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'in_progress', 'completed')),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Career Recommendations Table
CREATE TABLE IF NOT EXISTS public.career_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resume_analysis_id UUID REFERENCES public.resume_analyses(id) ON DELETE SET NULL,
    recommendations JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Job Preparation Plans Table
CREATE TABLE IF NOT EXISTS public.job_preparation_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    target_job_role TEXT NOT NULL,
    preparation_duration TEXT,
    plan JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_resumes_user ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_user ON public.resume_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_resume ON public.resume_analyses(resume_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created ON public.resume_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_skills_user ON public.user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_gaps_user ON public.skill_gap_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmaps_user ON public.learning_roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON public.progress_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_career_user ON public.career_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_job_plans_user ON public.job_preparation_plans(user_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_gap_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_preparation_plans ENABLE ROW LEVEL SECURITY;

-- Profile Policies
DROP POLICY IF EXISTS "Users manage own profile" ON public.profiles;
CREATE POLICY "Users manage own profile"
    ON public.profiles FOR ALL
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Resume Policies
DROP POLICY IF EXISTS "Users manage own resumes" ON public.resumes;
CREATE POLICY "Users manage own resumes"
    ON public.resumes FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Resume Analyses Policies
DROP POLICY IF EXISTS "Users manage own analyses" ON public.resume_analyses;
CREATE POLICY "Users manage own analyses"
    ON public.resume_analyses FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Skills Policies (Read-only for all authenticated, manageable by system/service-role)
DROP POLICY IF EXISTS "All authenticated users view skills" ON public.skills;
CREATE POLICY "All authenticated users view skills"
    ON public.skills FOR SELECT
    TO authenticated
    USING (true);

-- User Skills Policies
DROP POLICY IF EXISTS "Users manage own skills" ON public.user_skills;
CREATE POLICY "Users manage own skills"
    ON public.user_skills FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Skill Gap Policies
DROP POLICY IF EXISTS "Users manage own skill gaps" ON public.skill_gap_analyses;
CREATE POLICY "Users manage own skill gaps"
    ON public.skill_gap_analyses FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Learning Roadmaps Policies
DROP POLICY IF EXISTS "Users manage own roadmaps" ON public.learning_roadmaps;
CREATE POLICY "Users manage own roadmaps"
    ON public.learning_roadmaps FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Progress Tasks Policies
DROP POLICY IF EXISTS "Users manage own progress tasks" ON public.progress_tasks;
CREATE POLICY "Users manage own progress tasks"
    ON public.progress_tasks FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Career Recommendations Policies
DROP POLICY IF EXISTS "Users manage own career recommendations" ON public.career_recommendations;
CREATE POLICY "Users manage own career recommendations"
    ON public.career_recommendations FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Job Preparation Policies
DROP POLICY IF EXISTS "Users manage own job plans" ON public.job_preparation_plans;
CREATE POLICY "Users manage own job plans"
    ON public.job_preparation_plans FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- Storage Bucket & Policies for 'resumes'
-- Path convention: {user_id}/{resume_id}/{filename}
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'resumes',
    'resumes',
    false,
    5242880,
    ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

-- Storage RLS Policies
DROP POLICY IF EXISTS "Users upload their own resumes" ON storage.objects;
CREATE POLICY "Users upload their own resumes"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'resumes' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Users read their own resumes" ON storage.objects;
CREATE POLICY "Users read their own resumes"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'resumes' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

DROP POLICY IF EXISTS "Users delete their own resumes" ON storage.objects;
CREATE POLICY "Users delete their own resumes"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'resumes' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

