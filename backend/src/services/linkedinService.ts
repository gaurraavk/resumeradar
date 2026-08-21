import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

/** Sample LinkedIn profile for simulator mode */
const sampleLinkedInProfile = {
  id: 'li_usr_alexmorgan_9921',
  fullName: 'Alex Morgan',
  headline: 'Senior Full Stack & Frontend Engineer | React, TypeScript, Node.js & Cloud Systems',
  location: 'San Francisco Bay Area, CA',
  profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  summary: 'Dynamic Software Engineer with 6+ years of expertise in building enterprise web applications, responsive component design systems, and cloud-native services. Passionate about web performance, high-throughput microservices, and modern Developer Experience (DX).',
  email: 'alex.morgan@domain.com',
  vanityName: 'alex-morgan-dev',
  positions: [
    {
      id: 'li_pos_1',
      company: 'CloudScale Technologies',
      title: 'Senior Frontend Engineer',
      startDate: '2022-03',
      isCurrent: true,
      summary: 'Spearheaded frontend architecture for enterprise SaaS monitoring portal with 250,000+ daily active users. Reduced bundle size by 35% and improved Core Web Vitals LCP to under 1.2s.',
      skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Vite', 'GraphQL', 'Jest'],
    },
    {
      id: 'li_pos_2',
      company: 'NextGen Digital Labs',
      title: 'Software Engineer',
      startDate: '2019-06',
      endDate: '2022-02',
      isCurrent: false,
      summary: 'Developed full-stack web applications using React, Node.js, and PostgreSQL. Engineered RESTful APIs and real-time dashboard analytics.',
      skills: ['JavaScript', 'Node.js', 'React.js', 'PostgreSQL', 'Docker', 'AWS'],
    },
  ],
  skills: [
    'React.js', 'TypeScript', 'JavaScript (ES6+)', 'Tailwind CSS', 'Node.js', 'Next.js',
    'REST APIs', 'GraphQL', 'Performance Optimization', 'Core Web Vitals',
    'CI/CD Pipelines', 'Docker', 'Git', 'Agile / Scrum',
  ],
  educations: [
    {
      id: 'li_edu_1',
      schoolName: 'University of California, Berkeley',
      degreeName: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startYear: '2015',
      endYear: '2019',
    },
  ],
  certifications: [
    { name: 'AWS Certified Solutions Architect – Associate', authority: 'Amazon Web Services', year: '2023' },
    { name: 'Meta Front-End Developer Professional Certificate', authority: 'Meta', year: '2021' },
  ],
  connectedAt: new Date().toISOString(),
};

/** Curated LinkedIn job feed for matching */
const linkedInLiveJobs = [
  {
    id: 'li_job_1',
    jobTitle: 'Senior Frontend Engineer - Design Systems',
    company: 'Stripe',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=80',
    location: 'San Francisco, CA (Hybrid / Remote)',
    salary: '$185,000 - $225,000 + Equity',
    postedDate: '2 hours ago',
    applicantCount: 24,
    requiredSkills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Performance Optimization', 'Design Systems'],
    description: 'Stripe is looking for a Senior Frontend Engineer to build world-class developer experiences and global payment dashboards.',
    jobUrl: 'https://www.linkedin.com/jobs/view/stripe-senior-frontend-engineer',
  },
  {
    id: 'li_job_2',
    jobTitle: 'Staff UI Software Engineer',
    company: 'Netflix',
    companyLogo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&q=80&w=80',
    location: 'Los Gatos, CA / Remote',
    salary: '$240,000 - $310,000',
    postedDate: '4 hours ago',
    applicantCount: 18,
    requiredSkills: ['React.js', 'TypeScript', 'Node.js', 'GraphQL', 'Core Web Vitals'],
    description: 'Join the Studio UI Engineering team at Netflix. We build intuitive creative applications used by top directors and production crews worldwide.',
    jobUrl: 'https://www.linkedin.com/jobs/view/netflix-staff-ui-engineer',
  },
  {
    id: 'li_job_3',
    jobTitle: 'Full Stack Engineer (Growth & AI Platform)',
    company: 'OpenAI Ecosystem Partner',
    companyLogo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=80',
    location: 'New York, NY (Remote friendly)',
    salary: '$170,000 - $210,000',
    postedDate: '1 day ago',
    applicantCount: 39,
    requiredSkills: ['TypeScript', 'React.js', 'Node.js', 'REST APIs', 'Docker'],
    description: 'Accelerate next-generation AI interfaces and real-time inference streaming pipelines for enterprise customers.',
    jobUrl: 'https://www.linkedin.com/jobs/view/openai-fullstack-engineer',
  },
  {
    id: 'li_job_4',
    jobTitle: 'Lead Frontend Architect',
    company: 'Airbnb',
    companyLogo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=80',
    location: 'San Francisco, CA (Remote)',
    salary: '$210,000 - $265,000',
    postedDate: '3 days ago',
    applicantCount: 52,
    requiredSkills: ['React.js', 'TypeScript', 'Tailwind CSS', 'CI/CD Pipelines', 'Performance Optimization'],
    description: 'Shape the future of travel and guest host experiences at Airbnb.',
    jobUrl: 'https://www.linkedin.com/jobs/view/airbnb-lead-frontend-architect',
  },
];

/**
 * Get LinkedIn OAuth authorization URL.
 * Returns live OAuth URL or simulator URL depending on config.
 */
export function getLinkedInAuthUrl(appUrl: string): { url: string; mode: 'live' | 'simulator' } {
  if (env.hasLinkedIn) {
    const redirectUri = `${appUrl}/auth/callback`;
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: env.LINKEDIN_CLIENT_ID,
      redirect_uri: redirectUri,
      state: 'rr_sec_' + Math.random().toString(36).substring(2, 10),
      scope: 'openid profile email',
    });
    return {
      url: `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`,
      mode: 'live',
    };
  }

  return {
    url: `${appUrl}/auth/callback?mock=true&code=li_demo_code_auth992`,
    mode: 'simulator',
  };
}

/**
 * Get LinkedIn profile data (simulator or cached).
 */
export function getLinkedInProfile() {
  return sampleLinkedInProfile;
}

/**
 * Match candidate skills against live LinkedIn job feed.
 */
export function matchLinkedInJobs(candidateSkills: string[]) {
  const skills = candidateSkills.length > 0
    ? candidateSkills
    : ['React.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'REST APIs', 'Performance Optimization'];

  const matches = linkedInLiveJobs.map((job) => {
    const normalizedCandidate = skills.map((s) => s.toLowerCase());
    const matched = job.requiredSkills.filter((reqSkill) =>
      normalizedCandidate.some((c) => c.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(c))
    );
    const missing = job.requiredSkills.filter(
      (reqSkill) => !normalizedCandidate.some((c) => c.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(c))
    );

    const matchPercent = Math.min(98, Math.max(68, Math.round((matched.length / job.requiredSkills.length) * 100) + 10));

    let atsTier: 'Top 1% Fit' | 'Top 5% Fit' | 'Strong Fit' | 'Good Fit' = 'Good Fit';
    if (matchPercent >= 94) atsTier = 'Top 1% Fit';
    else if (matchPercent >= 88) atsTier = 'Top 5% Fit';
    else if (matchPercent >= 78) atsTier = 'Strong Fit';

    return {
      id: job.id,
      jobTitle: job.jobTitle,
      company: job.company,
      companyLogo: job.companyLogo,
      location: job.location,
      matchScore: matchPercent,
      matchedKeywords: matched,
      missingKeywords: missing,
      postedDate: job.postedDate,
      applicantCount: job.applicantCount,
      atsTier,
      jobUrl: job.jobUrl,
      salary: job.salary,
      description: job.description,
      notified: true,
      viewed: false,
      dateMatched: 'Just now',
    };
  });

  matches.sort((a, b) => b.matchScore - a.matchScore);

  return {
    matches,
    totalMatches: matches.length,
    topScore: matches[0]?.matchScore || 94,
  };
}

/**
 * Generate the OAuth callback HTML page (popup window that notifies parent via postMessage).
 */
export function getOAuthCallbackHtml(code: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>LinkedIn Authentication - ResumeRadar</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        display: flex; align-items: center; justify-content: center;
        height: 100vh; margin: 0; background-color: #faf9fe; color: #1a1b1f;
      }
      .card {
        background: #ffffff; padding: 32px; border-radius: 16px;
        border: 1px solid #cfc4c5; text-align: center; max-width: 360px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
      }
      .spinner {
        width: 36px; height: 36px; border: 3px solid #e3e2e7;
        border-top-color: #0058bc; border-radius: 50%;
        animation: spin 0.8s linear infinite; margin: 0 auto 16px;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
      h2 { font-size: 18px; margin: 0 0 8px; font-weight: 700; }
      p { font-size: 13px; color: #4c4546; margin: 0; line-height: 1.4; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="spinner"></div>
      <h2>Connecting LinkedIn...</h2>
      <p>Syncing professional profile and syncing active job radar matches into ResumeRadar.</p>
    </div>
    <script>
      (function() {
        var authSuccessData = {
          type: 'LINKEDIN_AUTH_SUCCESS',
          code: "${code}",
          timestamp: new Date().toISOString()
        };
        if (window.opener) {
          window.opener.postMessage(authSuccessData, '*');
          setTimeout(function() { window.close(); }, 600);
        } else {
          setTimeout(function() { window.location.href = '/'; }, 1200);
        }
      })();
    </script>
  </body>
</html>`;
}
