import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Textarea } from '../components/common/Textarea';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ProfileUpdateInput } from '@ai-resume/shared';
import {
  UserCheck,
  Mail,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Building,
  GraduationCap
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  const [fullName, setFullName] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [careerDomain, setCareerDomain] = useState('');
  const [careerInterest, setCareerInterest] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => api.getProfile()
  });

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setEducationLevel(profile.education_level || '');
      setExperienceLevel(profile.experience_level || '');
      setCareerDomain(profile.career_domain || '');
      setCareerInterest(profile.career_interest || '');
    } else if (user) {
      setFullName(user.user_metadata?.full_name || '');
    }
  }, [profile, user]);

  const updateMutation = useMutation({
    mutationFn: (data: ProfileUpdateInput) => api.updateProfile(data),
    onSuccess: (updated) => {
      setSuccessMsg('Profile settings updated successfully!');
      setErrorMsg(null);
      queryClient.setQueryData(['userProfile'], updated);
      setTimeout(() => setSuccessMsg(null), 3000);
    },
    onError: (err: any) => {
      setErrorMsg(err.message || 'Failed to update profile settings.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);
    updateMutation.mutate({
      fullName: fullName.trim() || undefined,
      educationLevel: educationLevel || undefined,
      experienceLevel: experienceLevel || undefined,
      careerDomain: careerDomain || undefined,
      careerInterest: careerInterest.trim() || undefined
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading profile preferences..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
          <UserCheck className="w-3.5 h-3.5" />
          <span>User Profile & Career Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Customize your career preferences, educational background, and domain focus. These settings seed automated AI resume scoring and personalized career guidance.
        </p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Profile Form */}
      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="e.g. Alex Johnson"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={updateMutation.isPending}
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 text-sm">
                <Mail className="w-4 h-4" />
                <span>{user?.email || 'user@example.com'}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 ml-auto bg-slate-200 px-1.5 py-0.5 rounded">
                  Verified
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Education Level"
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              disabled={updateMutation.isPending}
              options={[
                { value: "High School / Diploma", label: 'High School / Diploma' },
                { value: "Bachelor's Degree", label: "Bachelor's Degree" },
                { value: "Master's Degree", label: "Master's Degree" },
                { value: "PhD / Doctorate", label: 'PhD / Doctorate' },
                { value: "Bootcamp / Self-Taught", label: 'Bootcamp / Self-Taught' }
              ]}
              placeholder="Select Education"
            />

            <Select
              label="Experience Level"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              disabled={updateMutation.isPending}
              options={[
                { value: 'fresher', label: 'Fresh Graduate / Student' },
                { value: 'entry', label: 'Entry-Level (0 - 2 yrs)' },
                { value: 'mid', label: 'Mid-Level (2 - 5 yrs)' },
                { value: 'senior', label: 'Senior (5+ yrs)' },
                { value: 'switcher', label: 'Career Switcher' }
              ]}
              placeholder="Select Experience"
            />

            <Select
              label="Target Career Domain"
              value={careerDomain}
              onChange={(e) => setCareerDomain(e.target.value)}
              disabled={updateMutation.isPending}
              options={[
                { value: 'Software Development', label: 'Software Development' },
                { value: 'Data and Artificial Intelligence', label: 'Data & AI' },
                { value: 'Cloud and DevOps', label: 'Cloud & DevOps' },
                { value: 'Cybersecurity and Networking', label: 'Cybersecurity & Networking' },
                { value: 'Design and Digital Products', label: 'Design & UI/UX' },
                { value: 'Business and Management', label: 'Business & Management' }
              ]}
              placeholder="Select Domain"
            />
          </div>

          <Textarea
            label="Primary Career Interests & Aspirations"
            placeholder="e.g. Aspiring to transition into cloud architecture and microservices engineering..."
            value={careerInterest}
            onChange={(e) => setCareerInterest(e.target.value)}
            disabled={updateMutation.isPending}
            rows={2}
          />

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Isolated by PostgreSQL Row Level Security (RLS)</span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={updateMutation.isPending}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Account Security & Session */}
      <Card className="p-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Session & Authentication</h3>
          <p className="text-xs text-slate-500">
            Signed in as <span className="font-semibold text-slate-700">{user?.email}</span>
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => logout()}
          leftIcon={<LogOut className="w-4 h-4 text-rose-500" />}
        >
          Sign Out
        </Button>
      </Card>
    </div>
  );
};

