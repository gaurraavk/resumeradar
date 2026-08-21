import { ResumeData, JobDescriptionData, MatchResult, OptimizationResult, AnalysisHistoryItem } from '../types';

export const SAMPLE_RESUMES: ResumeData[] = [
  {
    id: 'res-pm-1',
    name: 'Jane Doe',
    title: 'Senior Product Manager',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    summary: 'Product Manager with 6+ years of experience leading cross-functional teams to build scalable enterprise and consumer software.',
    fileName: 'Source Resume.pdf',
    fileSize: '1.2 MB',
    createdAt: '2024-08-15',
    skills: [
      'Agile',
      'Scrum',
      'Product Strategy',
      'User Research',
      'Data Analysis',
      'SQL'
    ],
    experience: [
      {
        id: 'exp-1',
        role: 'Product Manager',
        company: 'TechCorp Inc.',
        period: '2020 - Present',
        bullets: [
          'Led cross-functional teams to deliver enterprise software solutions.',
          'Increased user retention by 15% through data-driven feature prioritization.',
          'Managed the full product lifecycle from ideation to launch.'
        ]
      },
      {
        id: 'exp-2',
        role: 'Associate PM',
        company: 'Innovate LLC',
        period: '2017 - 2020',
        bullets: [
          'Conducted market research and competitor analysis.',
          'Collaborated with design and engineering to prototype new features.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'B.S. in Computer Science & Business',
        institution: 'University of California, Berkeley',
        year: '2017'
      }
    ]
  },
  {
    id: 'res-dev-1',
    name: 'Jane Doe',
    title: 'Software Engineer',
    email: 'jane.doe.dev@example.com',
    phone: '+1 (555) 345-6789',
    location: 'San Francisco, CA',
    summary: 'Frontend developer focused on building responsive web applications using React and modern JavaScript.',
    fileName: 'Jane_Doe_Resume_2024.pdf',
    fileSize: '1.4 MB',
    createdAt: '2024-08-18',
    skills: [
      'JavaScript',
      'React',
      'HTML5',
      'CSS3',
      'Git',
      'REST APIs'
    ],
    experience: [
      {
        id: 'exp-dev-1',
        role: 'Tech Corp - Developer',
        company: 'Tech Corp',
        period: '2020 - Present',
        bullets: [
          'Worked on the frontend of the main application.',
          'Helped improve loading times for users.',
          'Used React and CSS to build new features.'
        ]
      },
      {
        id: 'exp-dev-2',
        role: 'Junior Web Developer',
        company: 'Apex Digital Agency',
        period: '2018 - 2020',
        bullets: [
          'Built landing pages and client portals using HTML, CSS, and vanilla JavaScript.',
          'Assisted with cross-browser bug fixes and mobile responsiveness testing.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-2',
        degree: 'B.S. in Software Engineering',
        institution: 'University of Washington',
        year: '2018'
      }
    ]
  },
  {
    id: 'res-ds-1',
    name: 'Alex Rivera',
    title: 'Data Analyst & ML Specialist',
    email: 'alex.rivera@example.com',
    phone: '+1 (555) 789-0123',
    location: 'Austin, TX',
    summary: 'Data Analyst with 4+ years translating complex datasets into actionable business intelligence pipelines and predictive machine learning models.',
    fileName: 'Alex_Rivera_Data_Resume.pdf',
    fileSize: '980 KB',
    createdAt: '2024-08-19',
    skills: ['Python', 'SQL', 'Tableau', 'Pandas', 'Scikit-Learn', 'Statistical Modeling'],
    experience: [
      {
        id: 'exp-ds-1',
        role: 'Senior Data Analyst',
        company: 'FinMetrics Solutions',
        period: '2021 - Present',
        bullets: [
          'Constructed automated ETL pipelines querying Snowflake data warehouse.',
          'Developed churn prediction model identifying at-risk accounts with 84% accuracy.',
          'Presented weekly executive dashboards to VP of Strategy.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-3',
        degree: 'B.S. in Statistics & Data Science',
        institution: 'University of Texas at Austin',
        year: '2021'
      }
    ]
  }
];

export const SAMPLE_JOBS: JobDescriptionData[] = [
  {
    id: 'job-pm-1',
    title: 'Senior PM at CloudScale',
    company: 'CloudScale Technologies',
    location: 'San Francisco, CA (Hybrid)',
    description: `About CloudScale:
CloudScale is the next-generation cloud infrastructure orchestration platform. We empower over 20,000 global engineering teams to deploy microservices at lightning speed.

Role Overview:
We are seeking an experienced Senior Product Manager to lead our Core Infrastructure and Multi-Cloud telemetry suite. You will define the roadmap, drive product-led growth, and align engineering, sales, and customer success.

Key Responsibilities:
• Define product strategy for enterprise-grade Cloud Infrastructure and AWS ecosystem integrations.
• Lead cross-functional pods consisting of 12+ engineers, UI/UX designers, and data architects.
• Formulate comprehensive Go-to-market Strategy for newly introduced B2B SaaS features.
• Quantify impact across critical revenue and user retention KPIs, driving quantifiable ARR growth.
• Conduct deep competitive intelligence, user research, and customer interviews with enterprise CTOs.

Qualifications & Requirements:
• 5+ years of product management experience in B2B SaaS or Developer Tooling.
• Deep understanding of Cloud Infrastructure, AWS, Kubernetes, and distributed architectures.
• Proven track record executing high-impact Go-to-market strategies.
• Strong analytical and data manipulation capabilities with SQL, Tableau, or Amplitude.
• Outstanding stakeholder communication and executive presentation skills.`,
    extractedKeywords: [
      'Cloud Infrastructure',
      'AWS',
      'Go-to-market Strategy',
      'B2B SaaS',
      'Cross-functional',
      'Agile',
      'Data Analysis',
      'Product Strategy'
    ],
    createdAt: '2024-08-15'
  },
  {
    id: 'job-dev-1',
    title: 'Senior Frontend Developer',
    company: 'Tech Corp Enterprise',
    location: 'Remote / San Francisco, CA',
    description: `We are looking for a Senior Frontend Developer with 5+ years of experience in architecting scalable design systems and high-performance web applications.

Responsibilities:
• Architect and deploy scalable UI components for our core enterprise application using React.js and TypeScript.
• Optimize application performance to achieve sub-second load times and top-tier Core Web Vitals.
• Spearhead the migration to a modern Tailwind CSS design system, ensuring cross-browser consistency and responsive design.
• Partner closely with Product Managers and UX Designers to deliver accessible, WCAG AA compliant user interfaces.
• Mentor junior engineers, conduct code reviews, and establish frontend testing standards (Jest, React Testing Library, Cypress).

Requirements:
• 5+ years professional experience with React.js, TypeScript, and modern JavaScript (ES6+).
• Deep expertise in Tailwind CSS, CSS architecture, and responsive mobile-first layouts.
• Proven experience with web performance optimization, lazy loading, and bundle size reduction.
• Strong foundation in automated testing and CI/CD pipelines.`,
    extractedKeywords: [
      'React.js',
      'TypeScript',
      'Tailwind CSS',
      'Architected',
      'Optimized',
      'Spearheaded',
      'Performance',
      'Scalable UI',
      'Core Web Vitals'
    ],
    createdAt: '2024-08-18'
  },
  {
    id: 'job-ds-1',
    title: 'Lead Machine Learning & AI Engineer',
    company: 'Nexus Intelligence Labs',
    location: 'Austin, TX',
    description: `Nexus Intelligence is seeking a Lead ML Engineer to design predictive pipelines and fine-tune large foundation models for enterprise fintech workloads.

Requirements:
• 4+ years deploying production Python models using PyTorch, Scikit-Learn, and AWS SageMaker.
• Proven track record building end-to-end ETL pipelines with Snowflake, dbt, and Kafka.
• Strong background in statistical modeling, feature engineering, and MLOps monitoring.`,
    extractedKeywords: ['Python', 'PyTorch', 'AWS SageMaker', 'Snowflake', 'Statistical Modeling'],
    createdAt: '2024-08-19'
  }
];

export const INITIAL_MATCH_RESULT: MatchResult = {
  id: 'match-pm-1',
  jobTitle: 'Senior PM at CloudScale',
  companyName: 'CloudScale Technologies',
  overallScore: 72,
  atsReadinessLevel: 'Moderate Match',
  scoreBreakdown: {
    keywordMatch: 68,
    experienceRelevance: 78,
    impactQuantification: 62,
    formattingAtsCompliance: 92
  },
  missingKeywords: [
    { term: 'Cloud Infrastructure', impact: 'High Impact', added: false },
    { term: 'AWS', impact: 'High Impact', added: false },
    { term: 'Go-to-market Strategy', impact: 'High Impact', added: false }
  ],
  foundSkills: ['Agile', 'Cross-functional', 'Data Analysis'],
  recommendations: [
    {
      id: 'rec-1',
      category: 'quantify',
      title: 'Quantify Associate PM Impact',
      description: 'Quantify impact in the "Associate PM" role with metrics (e.g., revenue growth, user acquisition).',
      originalText: 'Conducted market research and competitor analysis.',
      suggestedText: 'Conducted market research and competitor analysis across 14 competing platforms, identifying product gaps that drove a $450K new ARR pipeline.',
      severity: 'high',
      selected: true
    },
    {
      id: 'rec-2',
      category: 'keyword',
      title: 'Highlight B2B SaaS Experience',
      description: 'Add explicit mention of "B2B SaaS" experience if applicable.',
      originalText: 'Led cross-functional teams to deliver enterprise software solutions.',
      suggestedText: 'Led cross-functional teams to deliver high-growth B2B SaaS and cloud-native software solutions for enterprise clients.',
      severity: 'high',
      selected: true
    },
    {
      id: 'rec-3',
      category: 'action_verb',
      title: 'Incorporate Cloud Infrastructure & AWS keywords',
      description: 'Demonstrate strategic oversight over cloud infrastructure and AWS tooling to align with CloudScale requirements.',
      originalText: 'Managed the full product lifecycle from ideation to launch.',
      suggestedText: 'Managed the full product lifecycle from ideation to launch for AWS-integrated cloud infrastructure tooling.',
      severity: 'medium',
      selected: false
    }
  ],
  executiveSummary: 'Your resume has solid foundational product management skills (Agile, Cross-functional collaboration, and Data Analysis). However, the target role at CloudScale heavily screens for Cloud Infrastructure, AWS, and explicit B2B SaaS Go-to-market metrics.',
  createdAt: '2024-08-20'
};

export const INITIAL_OPTIMIZATION_RESULT: OptimizationResult = {
  id: 'opt-dev-1',
  analysisId: 'match-dev-1',
  jobTitle: 'Senior Frontend Developer',
  originalScore: 72,
  optimizedScore: 94,
  matchRank: 'Top 5% Match',
  appliedRecommendationsCount: 3,
  highlightedKeywords: ['React.js', 'TypeScript', '40% reduction', 'Tailwind CSS'],
  highlightedActionVerbs: ['Architected', 'Optimized', 'Spearheaded'],
  timestamp: 'Just now',
  version: 1,
  originalResume: {
    id: 'orig-dev-1',
    name: 'Jane Doe',
    title: 'Software Engineer',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    summary: 'Software Engineer with experience in building web applications.',
    fileName: 'Jane_Doe_Resume_2024.pdf',
    fileSize: '1.2 MB',
    createdAt: '2024-08-20',
    skills: ['React', 'CSS', 'JavaScript', 'HTML'],
    experience: [
      {
        id: 'orig-exp-1',
        role: 'Tech Corp - Developer',
        company: 'Tech Corp',
        period: '2020 - Present',
        bullets: [
          'Worked on the frontend of the main application.',
          'Helped improve loading times for users.',
          'Used React and CSS to build new features.'
        ]
      }
    ]
  },
  optimizedResume: {
    id: 'opt-res-1',
    name: 'Jane Doe',
    title: 'Senior Frontend Engineer',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    summary: 'Senior Frontend Engineer specialized in architecting responsive, high-performance web applications with React.js, TypeScript, and modern design systems.',
    fileName: 'Jane_Doe_Optimized_Senior_Frontend_Developer.pdf',
    fileSize: '1.3 MB',
    createdAt: '2024-08-20',
    skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Performance Optimization', 'Core Web Vitals', 'REST APIs', 'UI/UX Design Systems'],
    experience: [
      {
        id: 'opt-exp-1',
        role: 'Tech Corp - Senior Frontend Developer',
        company: 'Tech Corp',
        period: '2020 - Present',
        bullets: [
          'Architected and deployed scalable UI components for the core enterprise application using React.js and TypeScript.',
          'Optimized application performance, resulting in a 40% reduction in initial load time and improving Core Web Vitals.',
          'Spearheaded the migration to a modern Tailwind CSS design system, ensuring cross-browser consistency and responsive design.'
        ]
      }
    ]
  }
};

export const INITIAL_HISTORY: AnalysisHistoryItem[] = [
  {
    id: 'hist-1',
    jobTitle: 'Senior Frontend Developer',
    company: 'Tech Corp Enterprise',
    resumeFileName: 'Jane_Doe_Resume_2024.pdf',
    initialScore: 72,
    finalScore: 94,
    date: '2024-08-20',
    status: 'Optimized',
    optimizationResult: INITIAL_OPTIMIZATION_RESULT
  },
  {
    id: 'hist-2',
    jobTitle: 'Senior PM at CloudScale',
    company: 'CloudScale Technologies',
    resumeFileName: 'Source Resume.pdf',
    initialScore: 72,
    date: '2024-08-20',
    status: 'Analyzed',
    matchResult: INITIAL_MATCH_RESULT
  },
  {
    id: 'hist-3',
    jobTitle: 'Staff Full Stack Architect',
    company: 'Stripe',
    resumeFileName: 'Senior_Engineer_2024.pdf',
    initialScore: 65,
    finalScore: 91,
    date: '2024-08-14',
    status: 'Optimized'
  },
  {
    id: 'hist-4',
    jobTitle: 'Lead AI Engineer',
    company: 'Anthropic Labs',
    resumeFileName: 'Alex_Rivera_Data_Resume.pdf',
    initialScore: 78,
    finalScore: 96,
    date: '2024-08-11',
    status: 'Optimized'
  }
];
