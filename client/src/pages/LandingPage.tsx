import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  FileSearch,
  GitCompare,
  TrendingUp,
  FileCheck2,
  Compass,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
  BarChart3
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Next-Generation Career Intelligence & ATS Scoring</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Supercharge Your Resume.{' '}
          <span className="bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
            Bridge Your Skill Gaps.
          </span>{' '}
          Land Your Dream Job.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          AI-driven resume parsing, transparent ATS score validation, personalized learning roadmaps, and actionable job search strategy—all in one unified platform.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/analyzer">
            <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Analyze My Resume Free
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button size="lg" variant="outline">
              How It Works
            </Button>
          </a>
        </div>

        {/* Value Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Objective Rubric Scores
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Privacy-First Private Storage
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> PDF & DOCX Native Parsing
          </span>
        </div>
      </section>

      {/* Feature Modules Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Core Product Modules</h2>
          <h3 className="text-3xl font-extrabold text-slate-900">
            Engineered to Bridge the Gap Between Qualifications & Opportunity
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'AI Resume Analyzer',
              desc: 'Deep multi-section parsing, ATS readability rubric, section strengths, weaknesses, and quantifiable impact scoring.',
              icon: FileSearch,
              color: 'text-indigo-600',
              bgColor: 'bg-indigo-50'
            },
            {
              title: 'Skill Gap Analyzer',
              desc: 'Benchmark your current verified skills directly against real-world target job requirements with prioritization.',
              icon: GitCompare,
              color: 'text-emerald-600',
              bgColor: 'bg-emerald-50'
            },
            {
              title: 'Skill Improvement Advisor',
              desc: 'Generate weekly custom learning plans, practical coding exercises, and portfolio projects to master missing skills.',
              icon: TrendingUp,
              color: 'text-amber-600',
              bgColor: 'bg-amber-50'
            },
            {
              title: 'Resume Improvement Advisor',
              desc: 'Concrete before-and-after rewrite suggestions, power verbs, Google XYZ accomplishment formula, and ATS keyword tips.',
              icon: FileCheck2,
              color: 'text-sky-600',
              bgColor: 'bg-sky-50'
            },
            {
              title: 'Career Guidance Advisor',
              desc: 'Intelligent career path recommendations, suitability rankings, and realistic progression trajectories.',
              icon: Compass,
              color: 'text-purple-600',
              bgColor: 'bg-purple-50'
            },
            {
              title: 'Job Preparation Advisor',
              desc: 'A complete step-by-step roadmap: portfolio development, LinkedIn branding, technical mock prep, and outreach.',
              icon: Briefcase,
              color: 'text-rose-600',
              bgColor: 'bg-rose-50'
            }
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card key={idx} hover className="p-6">
                <div className={`w-12 h-12 rounded-xl ${feat.bgColor} ${feat.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-slate-100/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Simple Workflow</h2>
            <h3 className="text-3xl font-extrabold text-slate-900">How It Works in 4 Steps</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Upload Document',
                desc: 'Upload your existing resume in PDF or DOCX format under 5MB securely.'
              },
              {
                step: '02',
                title: 'AI Analysis',
                desc: 'Our engine extracts text and evaluates skills, ATS readability, and section quality.'
              },
              {
                step: '03',
                title: 'Identify Gaps',
                desc: 'Select your target job role and inspect exact missing skills and prioritized gaps.'
              },
              {
                step: '04',
                title: 'Execute & Progress',
                desc: 'Follow personalized roadmaps and track career milestones until interview ready.'
              }
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="text-4xl font-black text-indigo-200 mb-2">{step.step}</div>
                <h4 className="text-base font-bold text-slate-800 mb-1">{step.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-14 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to Accelerate Your Career?
          </h2>
          <p className="text-sm text-indigo-200 max-w-xl mx-auto mb-8">
            Join students, job seekers, and career switchers who optimize their resumes and master interview preparation with AI.
          </p>
          <Link to="/register">
            <Button size="lg" variant="primary" className="bg-white text-indigo-900 hover:bg-slate-100">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

