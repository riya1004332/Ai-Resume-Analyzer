import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { ResumeUploader } from '../components/resume/ResumeUploader';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  FileSearch,
  Sparkles,
  AlertCircle,
  FileText,
  Trash2,
  Play,
  Calendar,
  CheckCircle2,
  HardDrive
} from 'lucide-react';

export const ResumeAnalyzerPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetJobRole, setTargetJobRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<'fresher' | 'entry' | 'mid' | 'senior' | 'switcher'>('entry');
  const [careerDomain, setCareerDomain] = useState('Software Development');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // List existing resumes
  const {
    data: resumes,
    isLoading: isLoadingResumes,
    refetch: refetchResumes
  } = useQuery({
    queryKey: ['userResumes'],
    queryFn: () => api.listResumes()
  });

  // Delete resume mutation
  const deleteResumeMutation = useMutation({
    mutationFn: (id: string) => api.deleteResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userResumes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    }
  });

  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please select a PDF or DOCX resume document to upload.');
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);

    try {
      // Step 1: Upload resume to server / private storage
      const uploaded = await api.uploadResume(selectedFile);

      // Step 2: Trigger AI analysis
      const analysis = await api.analyzeResume(uploaded.id, {
        targetJobRole: targetJobRole.trim() || undefined,
        experienceLevel,
        careerDomain
      });

      // Step 3: Refresh queries & navigate to report
      await queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
      await queryClient.invalidateQueries({ queryKey: ['userResumes'] });
      navigate(`/analysis/${analysis.id}`);
    } catch (err: any) {
      console.error('Analysis workflow error:', err);
      setErrorMsg(err.message || 'Failed to process resume analysis. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyzeExisting = async (resumeId: string) => {
    setErrorMsg(null);
    setIsProcessing(true);
    try {
      const analysis = await api.analyzeResume(resumeId, {
        targetJobRole: targetJobRole.trim() || undefined,
        experienceLevel,
        careerDomain
      });
      await queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
      navigate(`/analysis/${analysis.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to analyze selected resume.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
          <FileSearch className="w-3.5 h-3.5" />
          <span>Intelligent Resume Parsing & Evaluation Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          AI Resume Analyzer
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Upload your resume in PDF or DOCX format. Our engine extracts sections, identifies technical and soft skills, grades ATS readability, and generates transparent scoring.
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Upload & Parameters Form */}
      <Card className="p-6 sm:p-8">
        <form onSubmit={handleStartAnalysis} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Upload Resume Document <span className="text-rose-500">*</span>
            </label>
            <ResumeUploader
              onFileSelect={(file) => setSelectedFile(file)}
              isLoading={isProcessing}
              selectedFile={selectedFile}
              onClearFile={() => setSelectedFile(null)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <Input
              label="Target Job Role (Optional)"
              placeholder="e.g. Full Stack Developer, Data Analyst"
              value={targetJobRole}
              onChange={(e) => setTargetJobRole(e.target.value)}
              disabled={isProcessing}
              helperText="Enables tailored role scoring and missing skill detection."
            />

            <Select
              label="Experience Level"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value as any)}
              disabled={isProcessing}
              options={[
                { value: 'fresher', label: 'Fresh Graduate / Student' },
                { value: 'entry', label: 'Entry-Level (0 - 2 Years)' },
                { value: 'mid', label: 'Mid-Level (2 - 5 Years)' },
                { value: 'senior', label: 'Senior Professional (5+ Years)' },
                { value: 'switcher', label: 'Career Switcher' }
              ]}
            />

            <Select
              label="Career Domain"
              value={careerDomain}
              onChange={(e) => setCareerDomain(e.target.value)}
              disabled={isProcessing}
              options={[
                { value: 'Software Development', label: 'Software Development' },
                { value: 'Data and Artificial Intelligence', label: 'Data & AI' },
                { value: 'Cloud and DevOps', label: 'Cloud & DevOps' },
                { value: 'Cybersecurity and Networking', label: 'Cybersecurity & Networking' },
                { value: 'Design and Digital Products', label: 'Design & UI/UX' },
                { value: 'Business and Management', label: 'Business & Management' },
                { value: 'General', label: 'Other / General' }
              ]}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Private encrypted storage • Transparent evaluation rubric</span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!selectedFile || isProcessing}
              isLoading={isProcessing}
              rightIcon={<Sparkles className="w-4 h-4" />}
            >
              Analyze Resume Now
            </Button>
          </div>
        </form>
      </Card>

      {/* Uploaded Resumes Library */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-indigo-600" />
            Your Uploaded Resumes
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {resumes?.length || 0} stored documents
          </span>
        </div>

        {isLoadingResumes ? (
          <div className="p-8 text-center">
            <LoadingSpinner size="md" text="Loading stored resumes..." />
          </div>
        ) : !resumes || resumes.length === 0 ? (
          <Card className="p-8 text-center text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold text-slate-700">No resumes uploaded yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Upload your first resume using the form above to run instant analysis.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resumes.map((resume) => (
              <Card key={resume.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                    {resume.file_type}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-800 truncate max-w-[220px]">
                      {resume.file_name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(resume.created_at).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{(resume.file_size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAnalyzeExisting(resume.id)}
                    disabled={isProcessing}
                    leftIcon={<Play className="w-3.5 h-3.5" />}
                  >
                    Analyze
                  </Button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${resume.file_name}"?`)) {
                        deleteResumeMutation.mutate(resume.id);
                      }
                    }}
                    title="Delete resume"
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

