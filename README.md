# AI Resume Analyzer & Career Development Platform

A complete, production-grade AI-powered career platform designed to bridge the gap between candidates' qualifications and modern tech job opportunities. Built with **React 18**, **TypeScript**, **Express.js**, **Supabase (PostgreSQL, Auth & Private Storage)**, and **Google Gemini API** (`@google/genai`).

---

## 🌟 Key Product Modules & Features

1. **AI Resume Analyzer (`/analyzer`, `/analysis/:id`)**
   - Native parsing of PDF and DOCX files up to 5 MB with server-side signature validation.
   - Objective quality rubric (0–100) and ATS Readability Assessment based on transparent evaluation criteria.
   - Multi-section evaluation: Professional Summary, Education, Work Experience, Technical & Soft Skills, Projects, and Certifications.
   - Identification of strengths, quantifiable achievement gaps, and missing information.

2. **Skill Gap Analyzer (`/skill-gap`)**
   - Benchmarks verified resume skills directly against industry job roles (Frontend, Backend, DevOps, Data & AI, Security, etc.).
   - Computes Role Readiness score (0–100%).
   - Classifies missing competencies by priority (`high`, `medium`, `low`) and target proficiency.

3. **Skill Improvement Advisor (`/skill-improvement`)**
   - Generates weekly customized learning roadmaps with practical hands-on exercises.
   - Curates portfolio project blueprints with difficulty ratings and success criteria.
   - One-click scheduling into the Career Progress Tracker.

4. **Resume Improvement Advisor (`/resume-improvement`)**
   - High-impact before-and-after text rewrites using the Google XYZ achievement formula: *"Accomplished [X], as measured by [Y], by doing [Z]"*.
   - Target ATS keyword recommendations and layout best practices.

5. **Career Guidance Advisor (`/career-guidance`)**
   - Tailored job role recommendations based on education, experience level, existing skills, and career domain.
   - Displays suitability matches, missing skills, and multi-tier career progression trajectories.

6. **Job Preparation Advisor (`/job-preparation`)**
   - Structured 4 to 16-week job preparation roadmaps.
   - Comprehensive technical, HR/behavioral, and system design interview topics.
   - Recruiter outreach strategies and pre-application readiness checklists.

7. **Career Progress Tracker (`/progress`)**
   - Track skill development tasks and milestones across `pending`, `in_progress`, and `completed`.
   - Visual progress bar and milestone completion metrics.

8. **Historical Archive & Side-by-Side Comparison (`/history`)**
   - Historical preservation of resume evaluations.
   - Side-by-side comparison mode to benchmark score improvements across revisions.

9. **Dashboard (`/dashboard`)**
   - Real-time metrics backed by database records: total uploaded resumes, average score progression charts, recent analyses, identified skills, and pending tasks.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, React Router v7, TanStack Query v5, React Hook Form, Zod, Lucide React, Recharts |
| **Backend** | Node.js, Express.js, TypeScript, REST API, Zod, Multer, `pdf-parse`, `mammoth` |
| **Database & Auth** | Supabase PostgreSQL, Supabase Authentication, Supabase Storage, Row Level Security (RLS) |
| **AI Integration** | Google Gemini API via official `@google/genai` SDK, strict Zod response validation, 1-attempt repair fallback |
| **Monorepo Management** | pnpm workspaces |

---

## 📂 Project Architecture

```
ai-resume-analyzer/
├── client/                      # React 18 + Vite frontend
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── common/          # Button, Input, Select, Card, Tabs, Modal, etc.
│   │   │   ├── layout/          # Navbar, Sidebar, Layouts, ProtectedRoute
│   │   │   ├── resume/          # ResumeUploader, ScoreCard, Strengths, etc.
│   │   │   ├── skills/          # SkillGapComparison, LearningRoadmapView
│   │   │   ├── career/          # CareerRecommendationCard, JobPreparationView
│   │   │   └── dashboard/       # DashboardStats, ProgressChart, RecentAnalyses
│   │   ├── context/             # AuthContext (Supabase Auth + Session persistence)
│   │   ├── pages/               # Application route views (15 pages)
│   │   ├── services/            # API client connected to backend
│   │   ├── App.tsx              # Router setup with public and protected layouts
│   │   └── main.tsx             # React DOM root entry
├── server/                      # Express + TypeScript backend
│   ├── src/
│   │   ├── config/              # Environment, Supabase admin, AI client configuration
│   │   ├── controllers/         # API controllers for all modules
│   │   ├── middleware/          # JWT auth verification, file upload, error handling
│   │   ├── prompts/             # System prompt & structured AI prompt builders
│   │   ├── routes/              # Express API routers (/api/v1)
│   │   ├── services/
│   │   │   ├── ai/              # Gemini SDK service with schema validation & repair
│   │   │   ├── database/        # dbService (Supabase PostgreSQL + in-memory dev fallback)
│   │   │   └── resume/          # PDF & DOCX text extraction
│   │   ├── __tests__/           # Test suite (Zod validation, schemas, auth, DB)
│   │   ├── app.ts               # Express application builder
│   │   └── server.ts            # Server entry point
├── shared/                      # Shared package (@ai-resume/shared)
│   ├── src/
│   │   ├── schemas/             # Zod input schemas & AI output schemas
│   │   └── types/               # TypeScript interfaces & database entity types
├── supabase/
│   ├── migrations/              # Production PostgreSQL migration (RLS & Triggers)
│   └── seed.sql                 # Seed database with skills taxonomy
├── .env.example                 # Environment variables template
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ (Node v20 or v22 recommended)
- **pnpm** v9+ (executable included in `./tools/pnpm.exe` on Windows)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/ai-resume-analyzer.git
cd ai-resume-analyzer
pnpm install
```

### 2. Configure Environment Variables

Copy `.env.example` into `server/.env` and `client/.env`:

#### Backend (`server/.env`):
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Supabase Credentials (from https://supabase.com/dashboard/project/<id>/settings/api)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google Gemini API (from https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-1.5-flash

MAX_RESUME_SIZE=5242880
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (`client/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> **Note**: In local development without Supabase or Gemini keys configured, the application automatically operates using an integrated mock AI generator and an in-memory repository with dev authentication (`dev-token`).

### 3. Database Migration (Supabase)

1. Open your Supabase project dashboard -> **SQL Editor**.
2. Run the migration script in `supabase/migrations/20261031000000_initial_schema.sql`.
   - Creates all 10 tables (`profiles`, `resumes`, `resume_analyses`, `skills`, `user_skills`, `skill_gap_analyses`, `learning_roadmaps`, `progress_tasks`, `career_recommendations`, `job_preparation_plans`).
   - Enables Row Level Security (RLS) on all tables with user-isolation policies (`auth.uid() = user_id`).
   - Creates automatic profile creation trigger on signup and `updated_at` trigger.
   - Configures private `resumes` storage bucket with path isolation `{user_id}/{resume_id}/{filename}`.
3. Run `supabase/seed.sql` to populate the initial skills dictionary.

---

## 🏃 Running the Application

### Development Mode (Both Frontend & Backend)

```bash
# Run both server (port 5000) and client (port 5173) concurrently
pnpm dev
```

Or run them individually:

```bash
# Start backend server with tsx hot-reload
pnpm --filter server dev

# Start frontend Vite dev server
pnpm --filter client dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Running Automated Tests

Run the automated test suite covering Zod request validation, AI output schema conformance, auth middleware protection, and database operations:

```bash
pnpm test
```

---

## 🏗️ Building for Production

Compile both client and server packages:

```bash
pnpm build
```

This generates:
- Frontend static assets in `client/dist/`
- Backend compiled JavaScript in `server/dist/`
- Shared types and schemas in `shared/dist/`

---

## 🔒 Security & Data Privacy Implementation

- **Row Level Security (RLS)**: Enforced across every user-owned table. Users can only query, modify, or delete their own data.
- **Private Storage**: Resumes are stored in private Supabase Storage buckets under user-scoped paths (`{user_id}/{resume_id}/{filename}`).
- **Input Validation**: Every request is validated server-side using strict Zod schemas before processing.
- **Untrusted File Processing**: Document upload validates MIME types, file extensions, and file sizes (max 5 MB).
- **Prompt Injection Defense**: System instructions explicitly treat user resume content as untrusted data, preventing role-override attempts.
- **AI Response Validation**: AI outputs are parsed and strictly validated against Zod schemas. Malformed responses trigger an automated repair prompt before returning.

---

## 📄 License

MIT License. Designed and engineered for modern career development.

>>>>>>> a225384 (Complete implementation of AI Resume Analyzer & Career Development Platform)
