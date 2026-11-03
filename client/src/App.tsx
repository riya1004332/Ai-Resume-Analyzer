import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Protected Pages
import { DashboardPage } from './pages/Dashboard';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzer';
import { AnalysisReportPage } from './pages/AnalysisReport';
import { SkillGapPage } from './pages/SkillGap';
import { SkillImprovementPage } from './pages/SkillImprovement';
import { ResumeImprovementPage } from './pages/ResumeImprovement';
import { CareerGuidancePage } from './pages/CareerGuidance';
import { JobPreparationPage } from './pages/JobPreparation';
import { ProgressPage } from './pages/Progress';
import { HistoryPage } from './pages/History';
import { ProfilePage } from './pages/Profile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2, // 2 minutes
      retry: 1
    }
  }
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Layout Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            {/* Protected Dashboard Layout Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/analyzer" element={<ResumeAnalyzerPage />} />
                <Route path="/analysis/:id" element={<AnalysisReportPage />} />
                <Route path="/skill-gap" element={<SkillGapPage />} />
                <Route path="/skill-improvement" element={<SkillImprovementPage />} />
                <Route path="/resume-improvement" element={<ResumeImprovementPage />} />
                <Route path="/career-guidance" element={<CareerGuidancePage />} />
                <Route path="/job-preparation" element={<JobPreparationPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Route>

            {/* Fallback Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

