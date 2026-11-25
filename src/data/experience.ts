export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string;
  duration: string;
  isCurrent?: boolean;
  summary: string;
  responsibilities: string[];
  technologies: string[];
}

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'de-maithan-ispat',
    company: 'De-maithan Ispat Limited',
    position: 'Software Developer',
    location: 'Bhubaneswar, Odisha',
    duration: 'May 18, 2026 – Present',
    isCurrent: true,
    summary:
      'Developing AI-powered ERP solutions, context-aware assistants, and full-stack enterprise workflows integrated with SAP and Tally ERP.',
    responsibilities: [
      'Develop AI-powered ERP solutions using LLMs, Machine Learning and RAG for intelligent business applications and context-aware assistants.',
      'Build AI features for business-data retrieval, contextual Q&A and operational decision support.',
      'Design full-stack ERP features using React.js, Python and Django; develop scalable APIs and interactive interfaces for enterprise workflows.',
      'Work across Procurement, Sales, Finance and Payment Management modules.',
      'Integrate SAP and Tally ERP for data synchronization and accounting workflows.',
      'Use Redis for caching and performance optimization, and Docker for containerization and consistent development environments.',
    ],
    technologies: [
      'LLMs',
      'RAG',
      'Machine Learning',
      'React.js',
      'Python',
      'Django',
      'SAP',
      'Tally ERP',
      'Redis',
      'Docker',
    ],
  },
  {
    id: 'logic-square-technologies',
    company: 'Logic Square Technologies',
    position: 'Backend Developer',
    location: 'Kolkata, West Bengal',
    duration: 'June 2024 – May 2026',
    summary:
      'Engineered scalable backend services, published reusable NPM packages, and optimized cloud infrastructure supporting a 50K+ user platform.',
    responsibilities: [
      'Supported Augusta Rule, a platform with 50K+ users, improving backend performance through database query optimization, API profiling and caching.',
      'Designed and published reusable NPM packages: Stripe payment integration and node-inbound-mail for Mailgun/AWS SES email sending and inbound processing without manual webhook setup.',
      'Built a scalable inbound-email processing pipeline with MIME parsing, attachment extraction, domain routing, optional S3 storage and event-driven workflows, reducing integration setup time.',
      'Integrated Twilio SMS, Mailgun and push notifications; implemented Redis caching and session handling.',
      'Deployed and worked with highly available AWS EC2, Load Balancer and S3 infrastructure.',
      'Applied API design, third-party integrations and database optimization; refactored legacy code and reduced technical debt for maintainability and faster delivery.',
    ],
    technologies: [
      'Node.js',
      'Express.js',
      'Stripe',
      'AWS EC2',
      'AWS S3',
      'Load Balancer',
      'Redis',
      'Mailgun',
      'AWS SES',
      'Twilio',
      'NPM Packages',
    ],
  },
  {
    id: 'hyscaler',
    company: 'Hyscaler',
    position: 'Apprentice',
    location: 'Bhubaneswar',
    duration: 'Aug 2023 – Jan 2024',
    summary:
      'Built real-time social and multi-sport engagement features and validated dashboard interfaces for the KhelNow live-sports platform.',
    responsibilities: [
      'Developed KhelNow live-sports platform features using Node.js.',
      'Implemented real-time comments, likes and dynamic multi-sport score updates.',
      'Developed follow/unfollow functionality and secure, validated dashboard interfaces.',
      'Optimized backend scalability and reliable real-time data delivery.',
    ],
    technologies: ['Node.js', 'Real-Time APIs', 'JavaScript', 'Backend Scalability', 'Dashboards'],
  },
];
