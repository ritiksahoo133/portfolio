export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  date: string;
  visualType: 'medist' | 'library';
  technologies: string[];
  summary: string;
  highlights: string[];
  githubLabel: string;
  // Verified directly from Ritik_Sahoo.pdf embedded links; update here if repo URLs change
  githubUrl: string;
}

export const PROJECTS: ProjectItem[] = [
  {
    id: 'medist',
    title: 'Medist',
    tagline: 'Location-Based Medication Delivery Platform',
    date: 'Jan 2023',
    visualType: 'medist',
    technologies: ['Django REST Framework', 'Python', 'SQLite', 'Razorpay'],
    summary:
      'A medication-delivery platform featuring location-based nearby-store discovery, structured REST APIs for authentication, ordering, and store operations, and Razorpay payment integration.',
    highlights: [
      'Built a medication-delivery platform with location-based nearby-store discovery.',
      'Developed authentication, ordering, and store management APIs using Django REST Framework.',
      'Integrated Razorpay for secure order payment workflows.',
      'Structured relational persistence with SQLite for clean API-driven order flows.',
    ],
    githubLabel: 'Medication',
    githubUrl: 'https://github.com/ritiksahoo133/Medication',
  },
  {
    id: 'library-management-system',
    title: 'Library Management System',
    tagline: 'CRUD Book Catalog & Integrity Web Application',
    date: 'Dec 2022',
    visualType: 'library',
    technologies: ['Django', 'Python', 'SQLite'],
    summary:
      'A full-featured Django library management web application supporting CRUD book management, a user-friendly interface, and structured validation and error handling for reliable data integrity.',
    highlights: [
      'Built a Django web application with complete CRUD-based book management.',
      'Designed a clean, user-friendly interface for catalog operations.',
      'Implemented request validation and error handling to maintain data integrity.',
      'Backed by Python and SQLite for straightforward, reliable persistence.',
    ],
    githubLabel: 'enotes-management-system',
    githubUrl: 'https://github.com/ritiksahoo133/enotes-management-system-',
  },
];
