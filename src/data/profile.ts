export interface NavItem {
  id: string;
  label: string;
}

export interface ProfileData {
  name: string;
  shortName: string;
  initials: string;
  headline: string;
  subheadline: string;
  roles: string[];
  location: string;
  fullAddress: string;
  email: string;
  resumeUrl: string;
  resumeFileName: string;
  socials: {
    linkedin: string;
    github: string;
  };
  floatingTech: string[];
  about: {
    summary: string[];
    highlights: {
      id: string;
      title: string;
      description: string;
      tags: string[];
    }[];
  };
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

export const PROFILE: ProfileData = {
  name: 'Ritik Kumar Sahoo',
  shortName: 'Ritik Sahoo',
  initials: 'RS',
  headline: 'Building Intelligent Systems. Engineering Scalable Solutions.',
  subheadline:
    "I'm Ritik Kumar Sahoo, a Software Developer focused on building AI-powered applications, scalable backend systems and intelligent enterprise solutions.",
  roles: [
    'Software Developer',
    'Full-Stack Engineer',
    'AI/ML Enthusiast',
    'ERP Application Developer',
  ],
  location: 'Bhubaneswar, Odisha, India',
  fullAddress: 'Bhubaneswar, Odisha 751019',
  email: 'ritiksahoo133@gmail.com',
  resumeUrl: '/resume/Ritik_Sahoo.pdf',
  resumeFileName: 'Ritik_Sahoo.pdf',
  socials: {
    // Verified directly from Ritik_Sahoo.pdf embedded links
    linkedin: 'https://www.linkedin.com/in/ritik-sahoo-7658801a7/',
    github: 'https://github.com/ritiksahoo133',
  },
  floatingTech: [
    'LLMs & RAG',
    'React.js',
    'Python / Django',
    'Node.js',
    'AWS & Docker',
    'Redis',
    'SAP & Tally ERP',
  ],
  about: {
    summary: [
      'I am a Software Developer specializing in full-stack application development, AI-powered enterprise software, and high-reliability backend engineering. My work bridges modern web interfaces with resilient backend architectures and intelligent automation.',
      'Currently at De-maithan Ispat Limited, I develop AI-powered ERP solutions leveraging LLMs, Machine Learning, and Retrieval-Augmented Generation (RAG) alongside full-stack React.js, Python, and Django modules integrated with SAP and Tally ERP.',
      'Previously, I engineered backend systems supporting 50K+ users at Logic Square Technologies—publishing reusable NPM packages, building event-driven inbound-email pipelines, and tuning AWS and Redis infrastructure—after building real-time sports platform features at Hyscaler.',
    ],
    highlights: [
      {
        id: 'ai-erp',
        title: 'AI-Powered Enterprise Applications',
        description:
          'Building context-aware assistants with LLMs, Machine Learning, and RAG for business-data retrieval, contextual Q&A, and operational decision support.',
        tags: ['LLMs', 'RAG', 'Machine Learning', 'AI Assistants'],
      },
      {
        id: 'fullstack-erp',
        title: 'Full-Stack & ERP Workflows',
        description:
          'Designing end-to-end enterprise modules across Procurement, Sales, Finance, and Payment Management with React.js, Python, Django, SAP, and Tally ERP.',
        tags: ['React.js', 'Django', 'SAP', 'Tally ERP'],
      },
      {
        id: 'backend-scale',
        title: 'Backend Engineering & Optimization',
        description:
          'Optimizing database queries, profiling APIs, refactoring legacy codebases, and implementing Redis caching and containerized Docker environments.',
        tags: ['Node.js', 'NestJS', 'Redis', 'Docker'],
      },
      {
        id: 'integrations',
        title: 'APIs, Cloud & Enterprise Integrations',
        description:
          'Architecting payment, messaging, and inbound-email pipelines using Stripe, Razorpay, Twilio, Mailgun, AWS SES, EC2, Load Balancer, and S3.',
        tags: ['AWS', 'Stripe', 'Razorpay', 'Mailgun'],
      },
    ],
  },
};
