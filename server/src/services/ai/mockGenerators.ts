import {
  ResumeAnalysisOutput,
  SkillGapOutput,
  LearningRoadmapOutput,
  ResumeImprovementOutput,
  CareerGuidanceOutput,
  JobPreparationOutput
} from '@ai-resume/shared';

export function generateMockResumeAnalysis(params: {
  targetJobRole?: string;
  experienceLevel?: string;
  resumeText: string;
}): ResumeAnalysisOutput {
  const role = params.targetJobRole || 'Full Stack Developer';

  return {
    overall_score: 78,
    ats_score: 74,
    summary: `Strong foundational technical background with relevant experience in web technologies. The resume demonstrates clear development capabilities for ${role}, though quantitative business impacts and cloud deployment certifications could be enhanced.`,
    sections: [
      {
        name: 'Technical Skills',
        status: 'good',
        feedback: 'Modern web development stack listed clearly with frontend and backend frameworks.',
        suggestions: ['Group skills by domain (e.g. Frontend, Backend, Database, Cloud/DevOps).']
      },
      {
        name: 'Work Experience',
        status: 'needs_improvement',
        feedback: 'Responsibilities are well described, but metrics (e.g. % performance increase, users served) are sparse.',
        suggestions: ['Use the STAR method (Situation, Task, Action, Result) with numerical outcomes for key achievements.']
      },
      {
        name: 'Education',
        status: 'good',
        feedback: 'Degree, institution, and graduation timeline are properly articulated.',
        suggestions: ['Include relevant coursework or academic honors if applicable.']
      },
      {
        name: 'Projects',
        status: 'good',
        feedback: 'Projects highlight hands-on application of React and Node.js.',
        suggestions: ['Provide live deployment links and GitHub repository URLs.']
      }
    ],
    skills: {
      technical: ['TypeScript', 'JavaScript', 'React', 'Node.js', 'Express.js', 'PostgreSQL', 'Git', 'REST APIs', 'HTML5', 'CSS3'],
      soft: ['Problem Solving', 'Team Collaboration', 'Technical Communication', 'Agile/Scrum'],
      inferred: ['Full Stack Architecture', 'State Management', 'Relational Database Design']
    },
    strengths: [
      {
        title: 'Solid Full-Stack Foundation',
        description: 'Demonstrates end-to-end competency across modern React frontend and Node.js backend.'
      },
      {
        title: 'Clear Project Demonstrations',
        description: 'Features functional web applications that showcase realistic problem solving.'
      },
      {
        title: 'Modern Tooling Adoption',
        description: 'Proficiency in TypeScript and Git aligns with current industry engineering standards.'
      }
    ],
    weaknesses: [
      {
        title: 'Lack of Quantified Achievements',
        description: 'Experience bullet points describe tasks rather than measurable business or performance metrics.'
      },
      {
        title: 'Missing Containerization & CI/CD',
        description: 'No explicit mention of Docker, automated pipelines, or cloud deployment infrastructure.'
      }
    ],
    missing_information: [
      'Cloud platform experience (AWS/GCP/Azure)',
      'Industry certifications',
      'Production deployment metrics and performance benchmarks'
    ],
    ats_feedback: {
      keyword_relevance: 'high',
      formatting: 'good',
      readability: 'good',
      recommendations: [
        'Incorporate standard industry keywords: CI/CD, Containerization, Unit Testing, Microservices',
        'Maintain a single-column clean layout for optimal parser text extraction'
      ]
    },
    improvement_suggestions: [
      {
        priority: 'high',
        section: 'Work Experience',
        suggestion: 'Revise bullet points to include percentages, user volume, or load-time improvements.',
        reason: 'Recruiters and hiring managers prioritize demonstrated measurable impact over passive duty lists.'
      },
      {
        priority: 'high',
        section: 'Professional Summary',
        suggestion: `Tailor the opening 3-line summary directly to target ${role} positions.`,
        reason: 'Immediately hooks recruiters in the 6-second initial scan window.'
      },
      {
        priority: 'medium',
        section: 'Skills',
        suggestion: 'Add Docker and Cloud services after completing brief practical containerization projects.',
        reason: 'Significantly expands interview qualification rates for mid-level opportunities.'
      }
    ]
  };
}

export function generateMockSkillGap(params: {
  targetJobRole: string;
  careerDomain: string;
  currentSkills: string;
}): SkillGapOutput {
  const role = params.targetJobRole || 'Full Stack Developer';

  return {
    target_role: role,
    readiness_score: 72,
    matching_skills: [
      { name: 'React', reason: 'Industry standard library for interactive user interfaces.' },
      { name: 'Node.js', reason: 'Core requirement for scalable backend microservices and APIs.' },
      { name: 'TypeScript', reason: 'Essential for robust, type-safe enterprise codebases.' },
      { name: 'SQL & PostgreSQL', reason: 'Primary database technology for relational data models.' }
    ],
    missing_skills: [
      {
        name: 'Docker',
        priority: 'high',
        reason: 'Containerization is required for consistent development and cloud deployments.',
        target_level: 'intermediate'
      },
      {
        name: 'Automated Testing (Jest / Vitest)',
        priority: 'high',
        reason: 'Production teams require automated unit and integration tests for release reliability.',
        target_level: 'intermediate'
      },
      {
        name: 'CI/CD Pipelines (GitHub Actions)',
        priority: 'medium',
        reason: 'Automates testing, linting, and cloud deployments on git push.',
        target_level: 'intermediate'
      },
      {
        name: 'Redis Caching',
        priority: 'low',
        reason: 'High-throughput caching for distributed API performance.',
        target_level: 'beginner'
      }
    ],
    improvement_skills: [
      { name: 'REST API Design', current_level: 'intermediate', target_level: 'advanced' },
      { name: 'System Architecture', current_level: 'beginner', target_level: 'intermediate' }
    ],
    learning_priority: [
      'Docker',
      'Automated Testing (Jest / Vitest)',
      'CI/CD Pipelines (GitHub Actions)',
      'System Architecture',
      'Redis Caching'
    ],
    recommendation: `You have an excellent core development foundation. Prioritize containerizing your existing applications with Docker and adding automated unit tests to achieve 90%+ readiness for ${role} roles.`
  };
}

export function generateMockLearningRoadmap(params: {
  skillName: string;
  currentLevel: string;
  targetLevel: string;
  availableTime: string;
}): LearningRoadmapOutput {
  const skill = params.skillName;

  return {
    skill_name: skill,
    current_level: params.currentLevel,
    target_level: params.targetLevel,
    estimated_duration: params.availableTime || '4 weeks',
    learning_stages: [
      {
        week: 1,
        title: `${skill} Core Fundamentals & Setup`,
        objectives: [
          `Master fundamental architecture and terminology of ${skill}`,
          'Set up local development environment and CLI tooling'
        ],
        activities: [
          'Read official documentation quickstart',
          'Execute standard initialization exercises and command line workflows',
          'Explore basic configuration files and runtime options'
        ],
        practical_exercise: `Build and run a verified minimal setup demonstrating core features of ${skill}.`
      },
      {
        week: 2,
        title: `Practical Implementation & Patterns`,
        objectives: [
          'Implement industry-standard design patterns',
          'Connect with persistent storage or external service dependencies'
        ],
        activities: [
          'Deconstruct open-source reference implementations',
          'Implement structured logging and error recovery strategies',
          'Benchmark performance and resource consumption'
        ],
        practical_exercise: `Refactor an existing web project to incorporate ${skill} for daily workflows.`
      },
      {
        week: 3,
        title: `Advanced Configuration & Optimization`,
        objectives: [
          'Harden security and access configurations',
          'Implement multi-environment builds and caching'
        ],
        activities: [
          'Audit against common security vulnerabilities and best practices',
          'Optimize build times and execution footprint'
        ],
        practical_exercise: `Create automated health checks, metrics inspection, and automated failure restarts.`
      },
      {
        week: 4,
        title: `Portfolio Capstone & Deployment`,
        objectives: [
          'Publish a comprehensive capstone repository on GitHub',
          'Document architectural decisions with an in-depth README'
        ],
        activities: [
          'Write integration tests validating all edge cases',
          'Deploy to cloud hosting and record a 2-minute demonstration walkthrough'
        ],
        practical_exercise: `Submit portfolio project with architectural diagram and step-by-step reproduction instructions.`
      }
    ],
    projects: [
      {
        title: `${skill} Production-Ready Microservice`,
        description: `An end-to-end service featuring automated builds, robust validation, and containerized deployment demonstrating hands-on mastery of ${skill}.`,
        difficulty: params.targetLevel === 'expert' ? 'advanced' : 'intermediate'
      }
    ],
    success_criteria: [
      `Independently explain architecture and trade-offs of ${skill} in a technical interview`,
      `Deliver a tested, documented open-source repository showcasing ${skill}`,
      `Successfully solve practical troubleshooting challenges without documentation lookup`
    ]
  };
}

export function generateMockResumeImprovement(params: {
  targetJobRole?: string;
  improvementFocus: string[];
}): ResumeImprovementOutput {
  const role = params.targetJobRole || 'Software Engineer';

  return {
    overall_feedback: `Your resume has strong fundamentals. By transforming passive job duty descriptions into high-impact, metric-driven accomplishment statements tailored for ${role}, your interview invitation rate will increase substantially.`,
    improvements: [
      {
        section: 'Professional Summary',
        original_text: 'Passionate developer with experience in React and Node looking for a software engineering position.',
        suggested_text: `Results-driven ${role} with hands-on expertise building responsive React frontends and scalable Node.js/PostgreSQL APIs. Proven track record of improving web performance and shipping clean, maintainable code in collaborative agile environments.`,
        reason: 'Replaces generic aspirations with specific technical competencies and measurable value propositions.',
        priority: 'high'
      },
      {
        section: 'Work Experience - Bullet Point 1',
        original_text: 'Worked on backend APIs for user authentication and data processing.',
        suggested_text: 'Architected and deployed secure RESTful authentication and authorization microservices using Node.js and JWT, reducing average API response latency by 28% across 10,000+ monthly active requests.',
        reason: 'Applies the Google XYZ formula ("Accomplished [X], as measured by [Y], by doing [Z]").',
        priority: 'high'
      },
      {
        section: 'Projects - Description',
        original_text: 'Built an e-commerce website with React and MongoDB where users can buy products.',
        suggested_text: 'Engineered a full-featured e-commerce platform with React, TypeScript, and MongoDB featuring real-time inventory tracking, Stripe payment gateway integration, and responsive Tailwind UI.',
        reason: 'Highlights specific technical depth, modern toolchain, and realistic commercial integrations.',
        priority: 'medium'
      }
    ],
    keyword_recommendations: [
      'RESTful Architecture',
      'TypeScript',
      'React Hook Form',
      'PostgreSQL',
      'Docker',
      'CI/CD Pipelines',
      'Agile/Scrum',
      'Unit Testing'
    ],
    formatting_suggestions: [
      'Ensure standard date formats (e.g. "Jun 2023 - Present") throughout all sections.',
      'Maintain 0.5 to 0.75 inch margins with consistent sans-serif typography (e.g. Inter or Roboto).',
      'Place Technical Skills immediately below the Professional Summary for maximum visual prominence.'
    ],
    missing_information: [
      'Links to live portfolio websites or GitHub repositories with active contribution graphs.',
      'Quantified business impacts (revenue, time saved, performance gains, error reductions).'
    ]
  };
}

export function generateMockCareerGuidance(params: {
  education: string;
  skills: string;
  careerInterest: string;
  preferredDomain: string;
}): CareerGuidanceOutput {
  return {
    career_summary: `Based on your background in ${params.preferredDomain} and technical foundation in ${params.skills.slice(0, 50)}, you possess high alignment for versatile engineering roles with clear upward mobility.`,
    recommended_roles: [
      {
        job_title: 'Full Stack Software Engineer',
        suitability: 'high',
        reason: 'Strong existing synergy across React frontend interfaces and Node.js REST API services.',
        matching_skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'Git'],
        missing_skills: ['Docker', 'CI/CD Pipelines', 'Automated Testing'],
        recommended_projects: [
          'Real-time collaborative workspace dashboard with WebSocket updates and PostgreSQL persistence.',
          'Full-featured AI-assisted SaaS portal with authentication and role-based access control.'
        ],
        career_progression: [
          'Junior Full Stack Developer',
          'Full Stack Software Engineer',
          'Senior Full Stack Engineer',
          'Engineering Tech Lead'
        ]
      },
      {
        job_title: 'Frontend Engineer',
        suitability: 'high',
        reason: 'Expertise in modern component libraries, responsive design, and state management.',
        matching_skills: ['React', 'TypeScript', 'HTML5/CSS3', 'Tailwind CSS', 'Git'],
        missing_skills: ['Web Accessibility (WCAG)', 'End-to-end Testing (Playwright)'],
        recommended_projects: [
          'High-performance design system component library published to NPM.',
          'Analytics dashboard featuring real-time data streaming and accessible charts.'
        ],
        career_progression: [
          'Frontend Developer',
          'Senior Frontend Engineer',
          'Frontend Architect',
          'Principal UI Engineer'
        ]
      },
      {
        job_title: 'Backend API Developer',
        suitability: 'medium',
        reason: 'Solid grasp of server runtimes, data modeling, and relational database schema design.',
        matching_skills: ['Node.js', 'Express.js', 'PostgreSQL', 'REST APIs', 'Git'],
        missing_skills: ['Redis Caching', 'Microservice Message Brokers (Kafka/RabbitMQ)'],
        recommended_projects: [
          'High-concurrency rate-limited payment processing API with idempotent transaction handling.',
          'Distributed background worker queue for document parsing and OCR extraction.'
        ],
        career_progression: [
          'Backend Developer',
          'Senior Backend Engineer',
          'Distributed Systems Architect'
        ]
      }
    ],
    next_steps: [
      'Complete a production-ready full-stack capstone project with Docker containerization.',
      'Deploy the capstone project live with HTTPS and custom domain on Vercel and Render.',
      'Update your LinkedIn headline to clearly state your target role and core tech stack.'
    ]
  };
}

export function generateMockJobPreparation(params: {
  targetJobRole: string;
  preparationDuration: string;
  interviewTypes: string[];
}): JobPreparationOutput {
  const role = params.targetJobRole || 'Software Engineer';
  const duration = params.preparationDuration || '6 weeks';

  return {
    target_role: role,
    duration,
    weekly_plan: [
      {
        week: 1,
        focus: 'Resume Optimization & Core Fundamentals',
        tasks: [
          {
            title: 'ATS Resume Polish',
            description: 'Refactor resume bullet points to include quantified impact metrics and align keywords.',
            category: 'Resume',
            priority: 'high'
          },
          {
            title: 'Core Language Fundamentals',
            description: 'Review JavaScript event loop, closures, promises, TypeScript generics, and type narrowing.',
            category: 'Technical',
            priority: 'high'
          }
        ]
      },
      {
        week: 2,
        focus: 'Data Structures & Algorithmic Problem Solving',
        tasks: [
          {
            title: 'Core Data Structures',
            description: 'Implement and practice Hash Maps, Two Pointers, Sliding Window, and Binary Search.',
            category: 'Technical',
            priority: 'high'
          },
          {
            title: 'GitHub & Portfolio Cleanliness',
            description: 'Ensure top 3 pinned repositories have crisp READMEs, architecture diagrams, and live demos.',
            category: 'Portfolio',
            priority: 'medium'
          }
        ]
      },
      {
        week: 3,
        focus: 'System Design & Web Architecture',
        tasks: [
          {
            title: 'Web System Architecture',
            description: 'Study caching strategies (CDN, Redis), database indexing, connection pooling, and load balancing.',
            category: 'Technical',
            priority: 'high'
          },
          {
            title: 'LinkedIn Outreach Setup',
            description: 'Connect with 15 engineering recruiters and alumni working at target companies.',
            category: 'Networking',
            priority: 'medium'
          }
        ]
      },
      {
        week: 4,
        focus: 'Behavioral & Live Mock Interviews',
        tasks: [
          {
            title: 'Behavioral STAR Story Preparation',
            description: 'Draft 5 stories covering technical disagreements, project challenges, leadership, and tight deadlines.',
            category: 'Behavioral',
            priority: 'high'
          },
          {
            title: 'Live Coding Mock Sessions',
            description: 'Perform 2 timed live coding mock sessions speaking thoughts out loud.',
            category: 'Interview',
            priority: 'high'
          }
        ]
      }
    ],
    interview_preparation: [
      {
        category: 'Frontend & UI Architecture',
        topics: [
          'React reconciliation, Virtual DOM, and rendering optimization',
          'Custom hooks and global state management trade-offs',
          'Web vital performance metrics (LCP, INP, CLS)'
        ]
      },
      {
        category: 'Backend & Database Systems',
        topics: [
          'RESTful design principles and status codes',
          'Database normalization vs denormalization and query optimization',
          'Authentication mechanisms: JWT, OAuth2, and session management'
        ]
      },
      {
        category: 'Behavioral & Culture Fit',
        topics: [
          'Handling conflicting product requirements under tight deadlines',
          'Communicating technical trade-offs to non-technical stakeholders',
          'Learning from production incidents and retrospective post-mortems'
        ]
      }
    ],
    portfolio_recommendations: [
      'Deploy 1 comprehensive full-stack application with live authentication and database persistence.',
      'Include an interactive architecture diagram and API documentation (Swagger/Postman) in the repository.'
    ],
    job_search_strategy: [
      'Submit 10 targeted applications weekly directly through company career pages or employee referrals.',
      'Follow up on submitted applications within 5 business days with a tailored LinkedIn note.',
      'Engage daily in relevant developer communities (GitHub discussions, Discord developer groups).'
    ],
    success_checklist: [
      'Tailored ATS-optimized resume in PDF format under 5MB',
      'Portfolio website with live project links and contact form',
      'Clean LinkedIn profile with comprehensive skills and headline',
      'Completed 5 behavioral STAR answer outlines',
      'Practiced 30+ domain technical interview questions'
    ]
  };
}

