export type SkillCategorySeed = {
  name: string;
  slug: string;
  order: number;
  description: string;
  skills: string[];
};

export const skillCategories: SkillCategorySeed[] = [
  {
    name: "Programming Languages",
    slug: "languages",
    order: 0,
    description: "Programming languages used day to day.",
    skills: ["C#", "Java", "TypeScript", "Python", "C++", "C"],
  },
  {
    name: "Web Technologies",
    slug: "web",
    order: 1,
    description: "Frontend technologies for building responsive interfaces.",
    skills: ["HTML5", "CSS3", "JavaScript", "React", "Next.js", "Tailwind CSS", "Bootstrap"],
  },
  {
    name: "Database",
    slug: "database",
    order: 2,
    description: "Database engines and data modelling.",
    skills: ["SQL Server", "PostgreSQL", "Oracle Database"],
  },
  {
    name: "Software Engineering",
    slug: "engineering",
    order: 3,
    description: "Core engineering, design and architecture skills.",
    skills: ["OOP", "Clean Architecture", "CQRS", "Data Structures & Algorithms", "Git"],
  },
  {
    name: "Tools",
    slug: "tools",
    order: 4,
    description: "Tools and platforms I use to ship software.",
    skills: ["Visual Studio", "VS Code", "Netlify", "GitHub"],
  },
  {
    name: "CMS",
    slug: "cms",
    order: 5,
    description: "Content management systems I have worked with.",
    skills: ["WordPress", "TutorLMS", "Elementor"],
  },
  {
    name: "Soft Skills",
    slug: "soft-skills",
    order: 6,
    description: "Interpersonal, leadership and collaboration skills.",
    skills: ["Leadership", "Teamwork", "Communication", "Time Management"],
  },
];