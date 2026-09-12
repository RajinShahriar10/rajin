export type SkillSeedItem = {
  name: string;
  level: number;
  highlight?: boolean;
};

export type SkillCategorySeed = {
  name: string;
  slug: string;
  order: number;
  description: string;
  skills: SkillSeedItem[];
};

export const skillCategories: SkillCategorySeed[] = [
  {
    name: "Programming Languages",
    slug: "languages",
    order: 0,
    description: "Programming languages used day to day.",
    skills: [
      { name: "C#", level: 95, highlight: true },
      { name: "Java", level: 90 },
      { name: "TypeScript", level: 85 },
      { name: "Python", level: 70 },
      { name: "C++", level: 65 },
      { name: "C", level: 60 },
    ],
  },
  {
    name: "Web Technologies",
    slug: "web",
    order: 1,
    description: "Frontend technologies for building responsive interfaces.",
    skills: [
      { name: "HTML5", level: 95, highlight: true },
      { name: "CSS3", level: 92 },
      { name: "JavaScript", level: 88 },
      { name: "React", level: 80 },
      { name: "Next.js", level: 78 },
      { name: "Tailwind CSS", level: 85 },
      { name: "Bootstrap", level: 88 },
    ],
  },
  {
    name: "Database",
    slug: "database",
    order: 2,
    description: "Database engines and data modelling.",
    skills: [
      { name: "SQL Server", level: 92, highlight: true },
      { name: "PostgreSQL", level: 70 },
      { name: "Oracle Database", level: 60 },
    ],
  },
  {
    name: "Software Engineering",
    slug: "engineering",
    order: 3,
    description: "Core engineering, design and architecture skills.",
    skills: [
      { name: "OOP", level: 92, highlight: true },
      { name: "Clean Architecture", level: 78 },
      { name: "CQRS", level: 72 },
      { name: "Data Structures & Algorithms", level: 80 },
      { name: "Git", level: 88 },
    ],
  },
  {
    name: "Tools",
    slug: "tools",
    order: 4,
    description: "Tools and platforms I use to ship software.",
    skills: [
      { name: "Visual Studio", level: 90, highlight: true },
      { name: "VS Code", level: 85 },
      { name: "Netlify", level: 70 },
      { name: "GitHub", level: 85 },
    ],
  },
  {
    name: "CMS",
    slug: "cms",
    order: 5,
    description: "Content management systems I have worked with.",
    skills: [
      { name: "WordPress", level: 82, highlight: true },
      { name: "TutorLMS", level: 75 },
      { name: "Elementor", level: 80 },
    ],
  },
  {
    name: "Soft Skills",
    slug: "soft-skills",
    order: 6,
    description: "Interpersonal, leadership and collaboration skills.",
    skills: [
      { name: "Leadership", level: 80 },
      { name: "Teamwork", level: 90, highlight: true },
      { name: "Communication", level: 85 },
      { name: "Time Management", level: 82 },
    ],
  },
];