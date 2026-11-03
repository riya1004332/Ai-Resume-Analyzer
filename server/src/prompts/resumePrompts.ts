// Prompt templates matching Section 15 exactly

export function buildResumeAnalysisPrompt(params: {
  targetJobRole?: string;
  experienceLevel?: string;
  resumeText: string;
}): string {
  return `Analyze the following resume.

Target Job Role: ${params.targetJobRole || 'Not specified (infer from content)'}
Experience Level: ${params.experienceLevel || 'Not specified'}

Resume Content:
${params.resumeText}

Evaluate:
- Professional summary
- Education
- Work experience
- Technical skills
- Soft skills
- Projects
- Certifications
- ATS readability
- Keyword relevance
- Resume strengths
- Resume weaknesses
- Missing information
- Improvement opportunities

Generate a score from 0 to 100 using a consistent evaluation rubric.
Ensure overall_score and ats_score are numbers between 0 and 100.
Do not invent information.

Return structured JSON only matching the schema:
{
  "overall_score": 75,
  "ats_score": 70,
  "summary": "Resume evaluation summary",
  "sections": [
    {
      "name": "Technical Skills",
      "status": "good",
      "feedback": "Relevant technical skills are listed",
      "suggestions": ["Group skills by category"]
    }
  ],
  "skills": {
    "technical": ["React", "Node.js"],
    "soft": ["Communication"],
    "inferred": []
  },
  "strengths": [
    {
      "title": "Project Experience",
      "description": "Relevant project experience is included"
    }
  ],
  "weaknesses": [
    {
      "title": "Missing Achievements",
      "description": "Some experience lacks measurable outcomes"
    }
  ],
  "missing_information": [
    "Relevant certifications"
  ],
  "ats_feedback": {
    "keyword_relevance": "moderate",
    "formatting": "good",
    "readability": "good",
    "recommendations": ["Include relevant role-specific keywords"]
  },
  "improvement_suggestions": [
    {
      "priority": "high",
      "section": "Professional Summary",
      "suggestion": "Make the summary more role-specific",
      "reason": "Improves relevance to the target position"
    }
  ]
}`;
}

export function buildSkillGapPrompt(params: {
  targetJobRole: string;
  careerDomain: string;
  currentSkills: string;
  experienceLevel: string;
}): string {
  return `Compare the user's current skills with the requirements of the target job role.

Target Role: ${params.targetJobRole}
Career Domain: ${params.careerDomain}
Current Skills: ${params.currentSkills}
Experience: ${params.experienceLevel}

Identify:
- Matching skills
- Missing skills
- Skills requiring improvement
- Recommended proficiency levels
- Priority of each skill gap
- Learning recommendations

Return JSON only matching the schema:
{
  "target_role": "${params.targetJobRole}",
  "readiness_score": 65,
  "matching_skills": [
    {
      "name": "React",
      "reason": "Relevant frontend technology"
    }
  ],
  "missing_skills": [
    {
      "name": "Docker",
      "priority": "high",
      "reason": "Useful for application deployment",
      "target_level": "intermediate"
    }
  ],
  "improvement_skills": [
    {
      "name": "Node.js",
      "current_level": "beginner",
      "target_level": "intermediate"
    }
  ],
  "learning_priority": [
    "Docker",
    "Node.js"
  ],
  "recommendation": "Focus on backend development and deployment"
}`;
}

export function buildSkillImprovementPrompt(params: {
  skillName: string;
  currentLevel: string;
  targetLevel: string;
  availableTime: string;
  learningPreference?: string;
}): string {
  return `Create a personalized learning roadmap.

Skill: ${params.skillName}
Current Level: ${params.currentLevel}
Target Level: ${params.targetLevel}
Available Time: ${params.availableTime}
Learning Preference: ${params.learningPreference || 'Self-paced practical'}

Provide:
- Learning objectives
- Step-by-step learning plan
- Practical exercises
- Project ideas
- Assessment methods
- Estimated duration

Return JSON only matching the schema:
{
  "skill_name": "${params.skillName}",
  "current_level": "${params.currentLevel}",
  "target_level": "${params.targetLevel}",
  "estimated_duration": "${params.availableTime}",
  "learning_stages": [
    {
      "week": 1,
      "title": "Fundamentals",
      "objectives": ["Understand core concepts"],
      "activities": ["Read documentation", "Practice exercises"],
      "practical_exercise": "Build a simple prototype"
    }
  ],
  "projects": [
    {
      "title": "Demonstration Project",
      "description": "Build an end-to-end practical application showcasing the skill",
      "difficulty": "intermediate"
    }
  ],
  "success_criteria": [
    "Successfully build and explain the project"
  ]
}`;
}

export function buildResumeImprovementPrompt(params: {
  resumeText: string;
  targetJobRole?: string;
  improvementFocus: string[];
  additionalInstructions?: string;
}): string {
  return `Review the supplied resume and generate specific improvement recommendations.

Resume Content:
${params.resumeText}

Target Role: ${params.targetJobRole || 'Software Professional'}
Improvement Focus: ${params.improvementFocus.join(', ')}
${params.additionalInstructions ? `Additional Notes: ${params.additionalInstructions}` : ''}

Provide:
- Current content evaluation
- Suggested rewritten content
- Explanation of improvement
- ATS keyword recommendations
- Grammar and clarity corrections

Never add fictional achievements or qualifications.

Return JSON only matching the schema:
{
  "overall_feedback": "Resume improvement summary",
  "improvements": [
    {
      "section": "Professional Summary",
      "original_text": "Original text snippet from resume",
      "suggested_text": "Improved professional version",
      "reason": "Clearer professional positioning and impact",
      "priority": "high"
    }
  ],
  "keyword_recommendations": [
    "REST API",
    "React",
    "SQL"
  ],
  "formatting_suggestions": [
    "Use consistent section headings"
  ],
  "missing_information": [
    "Add relevant project outcomes if available"
  ]
}`;
}

export function buildCareerGuidancePrompt(params: {
  education: string;
  skills: string;
  experience: string;
  careerInterest: string;
  preferredDomain: string;
}): string {
  return `Analyze the user's education, skills, interests, and experience.

Education: ${params.education}
Skills: ${params.skills}
Experience: ${params.experience}
Career Interest: ${params.careerInterest}
Preferred Domain: ${params.preferredDomain}

Recommend suitable career paths.

Explain:
- Why each role is suitable
- Required skills
- Existing skill matches
- Missing skills
- Suggested projects
- Career progression

Return JSON only matching the schema:
{
  "career_summary": "Personalized career guidance",
  "recommended_roles": [
    {
      "job_title": "Frontend Developer",
      "suitability": "high",
      "reason": "Existing frontend development knowledge",
      "matching_skills": [
        "HTML",
        "CSS",
        "React"
      ],
      "missing_skills": [
        "Testing"
      ],
      "recommended_projects": [
        "Responsive dashboard application"
      ],
      "career_progression": [
        "Frontend Developer",
        "Senior Frontend Developer",
        "Frontend Architect"
      ]
    }
  ],
  "next_steps": [
    "Improve fundamentals",
    "Build portfolio projects"
  ]
}`;
}

export function buildJobPreparationPrompt(params: {
  targetJobRole: string;
  experienceLevel: string;
  preparationDuration: string;
  interviewTypes: string[];
  preparationLevel: string;
}): string {
  return `Create a practical job preparation roadmap.

Target Role: ${params.targetJobRole}
Experience: ${params.experienceLevel}
Duration: ${params.preparationDuration}
Interview Types: ${params.interviewTypes.join(', ')}
Preparation Level: ${params.preparationLevel}

Include:
- Resume preparation
- Portfolio development
- Technical preparation
- Interview preparation
- HR preparation
- Job search strategies
- Networking
- Application planning
- Weekly milestones

Return JSON only matching the schema:
{
  "target_role": "${params.targetJobRole}",
  "duration": "${params.preparationDuration}",
  "weekly_plan": [
    {
      "week": 1,
      "focus": "Programming Fundamentals & Resume",
      "tasks": [
        {
          "title": "Revise core concepts",
          "description": "Practice core domain concepts",
          "category": "technical",
          "priority": "high"
        }
      ]
    }
  ],
  "interview_preparation": [
    {
      "category": "Technical",
      "topics": [
        "System Architecture",
        "Problem Solving"
      ]
    }
  ],
  "portfolio_recommendations": [
    "Build a production-ready end-to-end project"
  ],
  "job_search_strategy": [
    "Apply to relevant target positions weekly"
  ],
  "success_checklist": [
    "Complete resume",
    "Complete portfolio"
  ]
}`;
}

