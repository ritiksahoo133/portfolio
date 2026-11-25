export interface StoryBlock {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
}

export interface IdentityDomain {
  id: string;
  code: string;
  label: string;
  shortLabel: string;
  headline: string;
  description: string;
  deliverables: string[];
  technologies: string[];
  accent: 'emerald' | 'cyan';
}

export interface PhilosophyPrinciple {
  id: string;
  index: string;
  title: string;
  description: string;
  accent: 'emerald' | 'cyan';
}

export interface ProcessStep {
  id: string;
  step: string;
  title: string;
  detail: string;
}

export interface CareerHighlight {
  id: string;
  domain: string;
  title: string;
  detail: string;
}

export const ABOUT_STORY: StoryBlock[] = [
  {
    id: 'what-i-do',
    eyebrow: 'What I Do',
    title: 'Full-stack, backend & AI application engineering',
    body: 'I work across the complete software lifecycle—designing interactive React.js interfaces, scalable Python/Django and Node.js/NestJS APIs, and AI-assisted enterprise workflows built for daily business operations.',
  },
  {
    id: 'what-i-build',
    eyebrow: 'What I Build',
    title: 'Intelligent ERP modules, RAG assistants & resilient pipelines',
    body: 'From context-aware LLM & RAG assistants and Procurement, Sales, Finance, and Payment modules integrated with SAP & Tally ERP to reusable NPM packages and event-driven inbound-email pipelines.',
  },
  {
    id: 'what-motivates',
    eyebrow: 'Engineering Mindset',
    title: 'Software that goes beyond basic functionality',
    body: 'I enjoy building software that solves practical business problems reliably—focusing on database query optimization, API profiling, Redis caching, clean architecture, and reducing technical debt.',
  },
];

export const IDENTITY_DOMAINS: IdentityDomain[] = [
  {
    id: 'fullstack',
    code: '01',
    label: 'Full-Stack Development',
    shortLabel: 'Full-Stack',
    headline: 'Cohesive web applications from UI to relational & document storage.',
    description:
      'Building responsive, production-oriented interfaces paired with structured REST APIs and validated data workflows across enterprise and web products.',
    deliverables: [
      'Interactive React.js interfaces for enterprise ERP workflows',
      'End-to-end Python, Django & Django REST Framework web applications',
      'Validated dashboards, CRUD systems, and reliable error handling',
    ],
    technologies: ['React.js', 'JavaScript', 'ES6+', 'Python', 'Django', 'HTML5', 'CSS', 'Bootstrap'],
    accent: 'emerald',
  },
  {
    id: 'ai',
    code: '02',
    label: 'AI & Intelligent Applications',
    shortLabel: 'AI & RAG',
    headline: 'Context-aware assistants grounded in real business data.',
    description:
      'Developing AI-powered ERP solutions using LLMs, Machine Learning, and Retrieval-Augmented Generation (RAG) to support business-data retrieval and operational decisions.',
    deliverables: [
      'RAG pipelines for structured business-data retrieval and contextual Q&A',
      'Context-aware AI assistants embedded into enterprise ERP workflows',
      'Practical ML & LLM features focused on operational decision support',
    ],
    technologies: ['LLMs', 'RAG', 'Machine Learning', 'AI Assistants', 'Python', 'Django'],
    accent: 'cyan',
  },
  {
    id: 'backend',
    code: '03',
    label: 'Backend & System Architecture',
    shortLabel: 'Backend & Cloud',
    headline: 'High-reliability APIs, caching layers & cloud infrastructure.',
    description:
      'Engineering performant backend services supporting high-traffic platforms through database optimization, API profiling, Redis caching, Docker containers, and AWS.',
    deliverables: [
      'Backend optimization for Augusta Rule (50K+ users) via profiling & caching',
      'Event-driven inbound-email pipeline with MIME parsing, routing & S3 storage',
      'Published reusable NPM packages (Stripe integration & node-inbound-mail)',
    ],
    technologies: [
      'Node.js',
      'Express.js',
      'NestJS',
      'Django REST Framework',
      'Redis',
      'Docker',
      'AWS EC2',
      'AWS S3',
      'Load Balancer',
    ],
    accent: 'emerald',
  },
  {
    id: 'erp',
    code: '04',
    label: 'ERP & Enterprise Solutions',
    shortLabel: 'ERP & Systems',
    headline: 'Connected enterprise modules synchronized with accounting & payments.',
    description:
      'Developing core business modules and third-party integrations that connect enterprise operations, accounting platforms, payment gateways, and messaging channels.',
    deliverables: [
      'Procurement, Sales, Finance & Payment Management ERP modules',
      'SAP and Tally ERP integrations for accounting & data synchronization',
      'Stripe, Razorpay, Twilio SMS, Mailgun, AWS SES & OneSignal integrations',
    ],
    technologies: [
      'SAP',
      'Tally ERP',
      'Procurement',
      'Sales',
      'Finance',
      'Payment Management',
      'Stripe',
      'Razorpay',
      'Twilio',
      'Mailgun',
    ],
    accent: 'cyan',
  },
];

export const ENGINEERING_PHILOSOPHY: PhilosophyPrinciple[] = [
  {
    id: 'purpose',
    index: '01',
    title: 'Build with Purpose',
    description:
      'Focus on solving real operational and user problems cleanly rather than introducing unnecessary complexity.',
    accent: 'emerald',
  },
  {
    id: 'systems',
    index: '02',
    title: 'Think in Systems',
    description:
      'Map data flows, API boundaries, third-party dependencies, scalability, and maintainability before writing code.',
    accent: 'cyan',
  },
  {
    id: 'intelligent',
    index: '03',
    title: 'Intelligent Engineering',
    description:
      'Apply LLMs, RAG, and event-driven automation where they genuinely improve retrieval accuracy and workflows.',
    accent: 'emerald',
  },
  {
    id: 'quality',
    index: '04',
    title: 'Quality First',
    description:
      'Prioritize clean code, database and API profiling, caching, and refactoring legacy debt for long-term reliability.',
    accent: 'cyan',
  },
];

export const WORKING_PROCESS: ProcessStep[] = [
  {
    id: 'understand',
    step: '01',
    title: 'Understand the Problem',
    detail: 'Clarify business context, user workflows, and operational bottlenecks.',
  },
  {
    id: 'analyze',
    step: '02',
    title: 'Analyze Requirements',
    detail: 'Define data models, integration touchpoints, and edge cases.',
  },
  {
    id: 'design',
    step: '03',
    title: 'Design Architecture',
    detail: 'Plan modular APIs, caching strategy, and clean separation of concerns.',
  },
  {
    id: 'implement',
    step: '04',
    title: 'Implement Solution',
    detail: 'Build maintainable full-stack, backend, and AI components cleanly.',
  },
  {
    id: 'optimize',
    step: '05',
    title: 'Test & Optimize',
    detail: 'Profile queries and endpoints, validate integrity, and tune performance.',
  },
  {
    id: 'deliver',
    step: '06',
    title: 'Deliver & Improve',
    detail: 'Deploy reliably with Docker/AWS and iterate from real usage.',
  },
];

export const CAREER_HIGHLIGHTS: CareerHighlight[] = [
  {
    id: 'hl-ai-erp',
    domain: 'AI & ERP · De-maithan Ispat Limited',
    title: 'AI-Powered Enterprise ERP & Context-Aware Assistants',
    detail:
      'Developing LLM, Machine Learning, and RAG-driven business features alongside React.js, Python, Django, SAP, and Tally ERP workflows.',
  },
  {
    id: 'hl-scale',
    domain: 'High-Scale Backend · Logic Square Technologies',
    title: 'Performance Engineering for 50K+ User Platform',
    detail:
      'Supported Augusta Rule through database query optimization, API profiling, Redis caching, and highly available AWS EC2, Load Balancer & S3 infrastructure.',
  },
  {
    id: 'hl-npm',
    domain: 'Developer Tooling · Reusable Packages',
    title: 'Published NPM Packages & Event-Driven Email Pipeline',
    detail:
      'Designed and published Stripe payment and node-inbound-mail packages (Mailgun/AWS SES) with MIME parsing, attachment extraction, domain routing, and S3 storage.',
  },
  {
    id: 'hl-realtime',
    domain: 'Real-Time Systems · Hyscaler',
    title: 'Live-Sports Engagement Features for KhelNow',
    detail:
      'Built Node.js real-time comments, likes, follow/unfollow workflows, dynamic multi-sport score updates, and validated dashboard interfaces.',
  },
];

export const EXPLORING_TOPICS: string[] = [
  'LLM Application Architecture',
  'Retrieval-Augmented Generation (RAG)',
  'Context-Aware Enterprise Assistants',
  'Scalable ERP Integrations',
  'Event-Driven Cloud Pipelines',
  'Backend Performance & Redis Tuning',
];
