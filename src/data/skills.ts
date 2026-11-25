export interface SkillCategory {
  id: string;
  title: string;
  subtitle: string;
  icon:
    | 'code'
    | 'layout'
    | 'server'
    | 'sparkles'
    | 'database'
    | 'cloud'
    | 'building'
    | 'creditCard';
  span?: 'wide' | 'normal';
  skills: string[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'ai-ml',
    title: 'AI / ML',
    subtitle: 'Intelligent retrieval & enterprise assistants',
    icon: 'sparkles',
    span: 'wide',
    skills: ['Machine Learning', 'LLMs', 'RAG', 'AI Assistants'],
  },
  {
    id: 'backend',
    title: 'Backend',
    subtitle: 'Scalable APIs & service architectures',
    icon: 'server',
    span: 'wide',
    skills: ['Node.js', 'Express.js', 'NestJS', 'Django', 'Django REST Framework'],
  },
  {
    id: 'languages',
    title: 'Programming Languages',
    subtitle: 'Core application & web foundations',
    icon: 'code',
    span: 'normal',
    skills: ['JavaScript', 'Python', 'ES6+', 'HTML5', 'CSS'],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    subtitle: 'Interactive & responsive interfaces',
    icon: 'layout',
    span: 'normal',
    skills: ['React.js', 'Bootstrap'],
  },
  {
    id: 'databases',
    title: 'Databases',
    subtitle: 'Relational & document data stores',
    icon: 'database',
    span: 'normal',
    skills: ['MongoDB', 'SQL', 'SQLite'],
  },
  {
    id: 'tools-cloud',
    title: 'Tools & Cloud',
    subtitle: 'Infrastructure, caching & containers',
    icon: 'cloud',
    span: 'wide',
    skills: ['VS Code', 'Git', 'AWS', 'Docker', 'EC2', 'S3', 'Load Balancer', 'Redis'],
  },
  {
    id: 'erp-integrations',
    title: 'ERP & Integrations',
    subtitle: 'Enterprise modules & accounting sync',
    icon: 'building',
    span: 'wide',
    skills: ['SAP', 'Tally ERP', 'Procurement', 'Sales', 'Finance', 'Payment Management'],
  },
  {
    id: 'payments-notifications',
    title: 'Payments & Notifications',
    subtitle: 'Transactions, messaging & email pipelines',
    icon: 'creditCard',
    span: 'wide',
    skills: ['Stripe', 'Razorpay', 'Twilio', 'Mailgun', 'AWS SES', 'OneSignal'],
  },
];
