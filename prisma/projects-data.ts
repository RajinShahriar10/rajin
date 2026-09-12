export type ProjectSeed = {
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  description: string;
  role: string;
  featured: boolean;
  published: boolean;
  order: number;
  status: string;
  completionDate: string;
  githubUrl: string | null;
  liveUrl: string | null;
  primaryImageUrl: string | null;
  primaryImageAlt: string | null;
  technologies: string[];
};

export const seedProjects: ProjectSeed[] = [
  {
    slug: "syncspace",
    title: "SyncSpace",
    category: "Full-Stack SaaS",
    shortDescription:
      "Enterprise-grade real-time collaboration platform uniting documents, kanban boards, team chat, cloud storage and an AI assistant in one workspace.",
    description:
      "SyncSpace is a full-stack, real-time collaboration platform built with **Clean Architecture**, "
      + "combining collaborative documents, kanban boards, team chat, cloud storage and an AI assistant "
      + "into a single premium workspace.\n\n"
      + "**Backend** — ASP.NET Core 10 Web API with CQRS and MediatR, Entity Framework Core, SignalR hubs "
      + "for real-time updates, ASP.NET Identity + JWT authentication, FluentValidation and a Result-based error model.\n\n"
      + "**Frontend** — Next.js 15 (App Router) with React 19, TypeScript, Tailwind CSS, Zustand for state "
      + "and Framer Motion for polish.\n\n"
      + "### Highlights\n"
      + "- Collaborative rich-text documents with live cursors, version history, comments and reactions\n"
      + "- Drag-and-drop kanban boards with labels, assignments, priorities, due dates and activity logs\n"
      + "- Channel-based team chat with threads, reactions and direct messages\n"
      + "- Cloud drive with Cloudinary-backed file storage, folders, previews and trash\n"
      + "- GPT-4o-powered AI assistant for summarisation, meeting notes, rewriting and task extraction\n"
      + "- Admin panel with user and workspace management, audit logs and storage analytics\n"
      + "- 170 automated tests across backend and frontend",
    role: "Solo Developer",
    featured: true,
    published: true,
    order: 0,
    status: "completed",
    completionDate: "2026-07-01",
    githubUrl: "https://github.com/RajinShahriar10/SyncSpace",
    liveUrl: "https://syncspace-work.vercel.app/",
    primaryImageUrl: null,
    primaryImageAlt: null,
    technologies: [
      "ASP.NET Core 10",
      "C#",
      "Clean Architecture",
      "CQRS",
      "MediatR",
      "SignalR",
      "Entity Framework Core",
      "Next.js 15",
      "React 19",
      "TypeScript",
      "PostgreSQL",
      "Redis",
      "Cloudinary",
      "OpenAI GPT-4o",
    ],
  },
  {
    slug: "devzfy",
    title: "Devzfy",
    category: "Web Agency Platform",
    shortDescription:
      "A production-ready web agency platform with an animated marketing site, full admin dashboard and dedicated order flows for student portfolios and business websites.",
    description:
      "Devzfy is a futuristic, full-featured web development agency platform built on Next.js 16. "
      + "It combines a visually rich, animated marketing site with a powerful admin backend and two "
      + "structured order flows.\n\n"
      + "### Order flows\n"
      + "- **Student orders** collect portfolio details — education, experience, skills, projects, awards, "
      + "certificates and research — with Cloudinary image uploads and unique tracking codes.\n"
      + "- **Business orders** capture branding, feature requirements, domain preferences and design style.\n\n"
      + "### Admin dashboard\n"
      + "NextAuth v5 credential login with management for hero content, projects, services, blog posts, "
      + "testimonials, technologies, site settings, messages and order status — built with Radix UI and "
      + "Tailwind CSS v4 in a shadcn-style component library.\n\n"
      + "### Public site\n"
      + "Animated landing page with particle backgrounds, glass-morphism cards and scroll-reveal animations "
      + "via Framer Motion; dedicated pages for about, services, pricing, projects, blog and contact; "
      + "full SEO with dynamic metadata, Open Graph and Twitter cards; light and dark mode.",
    role: "Solo Developer",
    featured: true,
    published: true,
    order: 1,
    status: "completed",
    completionDate: "2026-08-01",
    githubUrl: "https://github.com/RajinShahriar10/Devzfy",
    liveUrl: null,
    primaryImageUrl: null,
    primaryImageAlt: null,
    technologies: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "Prisma",
      "NextAuth v5",
      "PostgreSQL",
      "Cloudinary",
      "Framer Motion",
      "Zustand",
      "Radix UI",
    ],
  },
  {
    slug: "learnzfy",
    title: "Learnzfy",
    category: "E-Learning",
    shortDescription:
      "A full-featured e-learning platform with video lessons, quizzes, exams, verified certificates and a gamification layer of XP, levels, badges, streaks and rewards.",
    description:
      "Learnzfy is a modern e-learning platform connecting students with expert educators, built on "
      + "Next.js 16 with role-based dashboards for students, teachers and admins, plus a public REST API.\n\n"
      + "### Learning\n"
      + "Course player with modules, video lessons, progress tracking, notes and downloadable resources; "
      + "timed quizzes and proctored-style exams with attempt limits and passing scores; certificates "
      + "automatically issued on completion with QR-coded verification and a public verification page.\n\n"
      + "### Gamification\n"
      + "XP and levels, achievement badges, learning streaks, leaderboards and a rewards store backed by "
      + "sponsors — keeping learners engaged through progression and incentives.\n\n"
      + "### Community\n"
      + "Per-course and per-lesson discussions with nested replies, voting and pinning; full-text search "
      + "with live suggestions, recent queries and popular topics.\n\n"
      + "### Admin & super admin\n"
      + "Analytics dashboard, course and quiz management, review moderation, teacher application approvals, "
      + "certificate revocation and audit logs — everything needed to run a learning platform at scale.",
    role: "Solo Developer",
    featured: true,
    published: true,
    order: 2,
    status: "completed",
    completionDate: "2026-09-01",
    githubUrl: "https://github.com/RajinShahriar10/Learnzfy",
    liveUrl: null,
    primaryImageUrl: null,
    primaryImageAlt: null,
    technologies: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "Prisma",
      "NextAuth v5",
      "PostgreSQL",
      "TanStack Query",
      "Radix UI",
      "Recharts",
    ],
  },
  {
    slug: "digital-wallet-system",
    title: "Digital Wallet System",
    category: "Fintech",
    shortDescription:
      "A full-stack fintech application for digital payments, built with ASP.NET Core 8 and JWT-based authentication.",
    description:
      "A full-stack fintech application built with ASP.NET Core 8, C#, EF Core, SQL Server, JWT and "
      + "Bootstrap 5 — covering account management, transactions and secure API access.",
    role: "Solo Developer",
    featured: true,
    published: true,
    order: 3,
    status: "completed",
    completionDate: "2026-06-01",
    githubUrl: "https://github.com/RajinShahriar10/DigitalWallet",
    liveUrl: null,
    primaryImageUrl: null,
    primaryImageAlt: null,
    technologies: ["ASP.NET Core 8", "C#", "EF Core", "SQL Server", "JWT", "Bootstrap 5"],
  },
  {
    slug: "stockflow-inventory-pos",
    title: "StockFlow — Inventory & POS Management System",
    category: "Inventory & POS",
    shortDescription:
      "A desktop inventory and point-of-sale management system built with C# and a 3-layer architecture.",
    description:
      "A desktop-based inventory and point-of-sale management system built with C# (Windows Forms) and "
      + "SQL Server using a 3-layer architecture separating UI, business logic and data access.",
    role: "Solo Developer",
    featured: true,
    published: true,
    order: 4,
    status: "completed",
    completionDate: "2026-05-01",
    githubUrl: "https://github.com/RajinShahriar10/StockFlow",
    liveUrl: null,
    primaryImageUrl: null,
    primaryImageAlt: null,
    technologies: ["C#", "Windows Forms", "SQL Server", ".NET Framework"],
  },
  {
    slug: "bangladesh-airlines-reservation-portal",
    title: "Bangladesh Airlines Reservation Portal",
    category: "Java Desktop",
    shortDescription:
      "A Java desktop application for flight listing, seat availability and ticket booking.",
    description:
      "Built with Java Swing using OOP. Covers flight listing, seat availability and ticket booking, "
      + "with passenger data validation, booking history and file-based storage for all records.",
    role: "Solo Developer",
    featured: true,
    published: true,
    order: 5,
    status: "completed",
    completionDate: "2025-06-01",
    githubUrl: "https://github.com/RajinShahriar10/Bangladesh-Airlines-Reservation-Portal",
    liveUrl: null,
    primaryImageUrl: null,
    primaryImageAlt: null,
    technologies: ["Java", "Java Swing", "OOP"],
  },
];
