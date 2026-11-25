export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  duration: string;
  cgpa: string;
  location: string;
}

export const EDUCATION: EducationItem[] = [
  {
    id: 'trident-academy-of-technology',
    institution: 'Trident Academy of Technology',
    degree: 'B.Tech. in Computer Science',
    duration: 'Aug 2019 – Aug 2023',
    cgpa: '8.69',
    location: 'Bhubaneswar, Odisha',
  },
];
