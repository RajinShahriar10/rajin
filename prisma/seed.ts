import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@rajinshahriar.dev";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "ChangeMe_Admin_123";

// Content below mirrors MD. Rajin Shahriar's CV (see /Md. Rajin Shahriar_CV.pdf)
// and the images copied from /Certificates & Awards into /public. Re-running the
// seed is destructive: it clears and rewrites most tables. Never run it against
// a production database that holds real data.

async function main() {
  console.log("Seeding portfolio database...");

  // --- Identity / Auth -----------------------------------------------------
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash, name: "MD. Rajin Shahriar", role: "admin" },
    create: {
      email: ADMIN_EMAIL,
      passwordHash,
      name: "MD. Rajin Shahriar",
      role: "admin",
    },
  });

  // --- Profile --------------------------------------------------------------
  const profileData = {
    name: "MD. Rajin Shahriar",
    title: "Software Engineer",
    tagline: "C# .NET Developer | Java Developer",
    summary:
      "Software Engineer with experience building secure full-stack, desktop, and database-driven applications using ASP.NET Core, C#, Java, SQL Server, and modern software engineering practices.",
    bio:
      "I am a Software Engineer with experience building secure full-stack, desktop and database-driven "
      + "applications using ASP.NET Core, C#, Java, SQL Server and modern software engineering practices.\n\n"
      + "I am currently pursuing a BSc in Computer Science & Engineering at American International "
      + "University-Bangladesh (AIUB), now in my 7th semester. My work spans Java desktop applications, "
      + "C# Windows Forms systems and ASP.NET Core full-stack applications, alongside responsive frontend "
      + "work with HTML5, CSS3, JavaScript, Tailwind CSS and Bootstrap.\n\n"
      + "I keep my fundamentals sharp — OOP, data structures, algorithms and database design — and enjoy "
      + "the full journey from schema design and API logic to the interfaces people use.",
    email: "rajinshahriar.official@gmail.com",
    phone: "+880 1863-056306",
    location: "Bashundhara R/A, Dhaka, Bangladesh",
    website: "https://rajinportfolio.netlify.app",
    availability: "Open to opportunities",
    resumeUrl: null,
    resumePublicId: null,
    profileImageUrl: null,
    profileImageAlt: null,
    seoTitle: "MD. Rajin Shahriar — Software Engineer",
    seoDescription:
      "Portfolio of MD. Rajin Shahriar, a Software Engineer specializing in C# .NET and Java development.",
  };

  await prisma.profile.upsert({
    where: { id: "main" },
    update: profileData,
    create: { id: "main", ...profileData },
  });

  // --- Hero ----------------------------------------------------------------
  await prisma.hero.upsert({
    where: { id: "main" },
    update: {
      eyebrow: "Hello, I'm",
      headline: "MD. Rajin Shahriar",
      subheadline: "C# .NET Developer | Java Developer",
      description:
        "Software Engineer building secure full-stack, desktop and database-driven applications with ASP.NET Core, C#, Java and SQL Server.",
      primaryCtaLabel: "View Projects",
      primaryCtaHref: "/projects",
      secondaryCtaLabel: "Contact Me",
      secondaryCtaHref: "/contact",
      profileImageUrl: null,
      profileImageAlt: null,
      background: null,
    },
    create: {
      id: "main",
      eyebrow: "Hello, I'm",
      headline: "MD. Rajin Shahriar",
      subheadline: "C# .NET Developer | Java Developer",
      description:
        "Software Engineer building secure full-stack, desktop and database-driven applications with ASP.NET Core, C#, Java and SQL Server.",
      primaryCtaLabel: "View Projects",
      primaryCtaHref: "/projects",
      secondaryCtaLabel: "Contact Me",
      secondaryCtaHref: "/contact",
      profileImageUrl: null,
      profileImageAlt: null,
      background: null,
    },
  });

  await prisma.heroStat.deleteMany({ where: { heroId: "main" } });
  await prisma.heroStat.createMany({
    data: [
      { heroId: "main", label: "Projects built", value: "4+", order: 0 },
      { heroId: "main", label: "Programming languages", value: "6", order: 1 },
      { heroId: "main", label: "Certificates earned", value: "4", order: 2 },
    ],
  });

  // --- About ----------------------------------------------------------------
  const aboutData = {
    heading: "About Me",
    content:
      "I am a Software Engineer with experience building secure full-stack, desktop and database-driven "
      + "applications using ASP.NET Core, C#, Java and SQL Server.\n\n"
      + "I am currently studying Computer Science & Engineering at American International "
      + "University-Bangladesh (AIUB), and I enjoy the full journey from schema design and API logic "
      + "to the interfaces people use.",
    focus: "ASP.NET Core, C#, Java, SQL Server",
    imageUrl: null,
    imageAlt: null,
    resumeUrl: null,
    resumePublicId: null,
  };

  await prisma.about.upsert({
    where: { id: "main" },
    update: aboutData,
    create: { id: "main", ...aboutData },
  });

  await prisma.aboutStat.deleteMany({ where: { aboutId: "main" } });
  await prisma.aboutStat.createMany({
    data: [
      { aboutId: "main", label: "Projects built", value: "4+", order: 0 },
      { aboutId: "main", label: "Programming languages", value: "6", order: 1 },
      { aboutId: "main", label: "Certificates earned", value: "4", order: 2 },
      { aboutId: "main", label: "Degrees & diplomas", value: "3", order: 3 },
    ],
  });

  await prisma.aboutPrinciple.deleteMany({ where: { aboutId: "main" } });
  await prisma.aboutPrinciple.createMany({
    data: [
      {
        title: "Object-Oriented Programming",
        summary:
          "Clean abstractions, encapsulation and SOLID-driven design that keep systems extensible.",
        order: 0,
      },
      {
        title: "Data Structures & Algorithms",
        summary:
          "Choosing the right structure and the right algorithm before writing the code.",
        order: 1,
      },
      {
        title: "Database Design",
        summary:
          "Normalised schemas, clear relationships and indexes that match real query patterns.",
        order: 2,
      },
      {
        title: "Secure Application Development",
        summary:
          "Security by default — validation, safe data access and least-privilege at every layer.",
        order: 3,
      },
      {
        title: "3-Layer Architecture",
        summary:
          "Separating UI, business logic and data access so desktop and web apps stay testable.",
        order: 4,
      },
    ],
  });

  // --- Skill categories & skills -------------------------------------------
  const skillCategories = [
    {
      name: "Programming Languages",
      slug: "languages",
      order: 0,
      description: "Programming languages used day to day.",
      skills: ["C#", "Java", "Python", "C++", "C"],
    },
    {
      name: "Web Technologies",
      slug: "web",
      order: 1,
      description: "Frontend technologies for building responsive interfaces.",
      skills: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS", "Bootstrap"],
    },
    {
      name: "Database",
      slug: "database",
      order: 2,
      description: "Database engines and data modelling.",
      skills: ["SQL Server", "Oracle Database"],
    },
    {
      name: "Software Engineering",
      slug: "engineering",
      order: 3,
      description: "Core engineering, design and architecture skills.",
      skills: [
        "Object-Oriented Programming",
        "Data Structures & Algorithms",
        "Database Design",
        "Git",
      ],
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
  ];

  await prisma.skillCategory.deleteMany();
  for (const cat of skillCategories) {
    const record = await prisma.skillCategory.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        order: cat.order,
        description: cat.description,
        visible: true,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        order: cat.order,
        description: cat.description,
        visible: true,
      },
    });

    await prisma.skill.deleteMany({ where: { categoryId: record.id } });
    if (cat.skills.length > 0) {
      await prisma.skill.createMany({
        data: cat.skills.map((name, i) => ({
          name,
          categoryId: record.id,
          order: i,
          visible: true,
        })),
      });
    }
  }

  // --- Projects --------------------------------------------------------------
  const projects = [
    {
      slug: "digital-wallet-system",
      title: "Digital Wallet System",
      category: "Fintech",
      shortDescription:
        "A full-stack fintech application for digital payments, built with ASP.NET Core 8 and JWT-based authentication.",
      description:
        "A full-stack fintech application built with ASP.NET Core 8, C#, EF Core, SQL Server, JWT and Bootstrap 5 — covering account management, transactions and secure API access.",
      role: "Solo Developer",
      featured: true,
      published: true,
      order: 0,
      status: "completed",
      completionDate: new Date("2026-06-01"),
      githubUrl: null,
      liveUrl: null,
      primaryImageUrl: null,
      primaryImageAlt: null,
      technologies: ["ASP.NET Core 8", "C#", "EF Core", "SQL Server", "JWT", "Bootstrap 5"],
    },
    {
      slug: "bangladesh-airlines-reservation-portal",
      title: "Bangladesh Airlines Reservation Portal",
      category: "Java Desktop",
      shortDescription:
        "A Java desktop application for flight listing, seat availability and ticket booking.",
      description:
        "Built with Java Swing using OOP. Covers flight listing, seat availability and ticket booking, with passenger data validation, booking history and file-based storage for all records.",
      role: "Solo Developer",
      featured: true,
      published: true,
      order: 1,
      status: "completed",
      completionDate: new Date("2025-06-01"),
      githubUrl: null,
      liveUrl: null,
      primaryImageUrl: null,
      primaryImageAlt: null,
      technologies: ["Java", "Java Swing", "OOP"],
    },
    {
      slug: "stockflow-inventory-pos",
      title: "StockFlow — Inventory & POS Management System",
      category: "Inventory & POS",
      shortDescription:
        "A desktop inventory and point-of-sale management system built with C# and a 3-layer architecture.",
      description:
        "A desktop-based inventory and point-of-sale management system built with C# (Windows Forms) and SQL Server using a 3-layer architecture separating UI, business logic and data access.",
      role: "Solo Developer",
      featured: true,
      published: true,
      order: 2,
      status: "completed",
      completionDate: new Date("2026-05-01"),
      githubUrl: null,
      liveUrl: null,
      primaryImageUrl: null,
      primaryImageAlt: null,
      technologies: ["C#", "Windows Forms", "SQL Server", ".NET Framework"],
    },
    {
      slug: "machang-studio",
      title: "Machang Studio — Architecture Firm Website",
      category: "Web",
      shortDescription:
        "A modern responsive website for an architecture firm with a project showcase.",
      description:
        "A modern responsive website for an architecture firm with a project showcase, clear visual hierarchy and cross-device compatibility, built with HTML5, CSS3, JavaScript and Tailwind CSS.",
      role: "Solo Developer",
      featured: false,
      published: true,
      order: 3,
      status: "completed",
      completionDate: new Date("2026-02-01"),
      githubUrl: null,
      liveUrl: null,
      primaryImageUrl: null,
      primaryImageAlt: null,
      technologies: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS"],
    },
  ];

  for (const project of projects) {
    const record = await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        title: project.title,
        category: project.category,
        shortDescription: project.shortDescription,
        description: project.description,
        role: project.role,
        featured: project.featured,
        published: project.published,
        order: project.order,
        status: project.status,
        completionDate: project.completionDate,
        githubUrl: project.githubUrl,
        liveUrl: project.liveUrl,
        primaryImageUrl: project.primaryImageUrl,
        primaryImageAlt: project.primaryImageAlt,
      },
      create: {
        slug: project.slug,
        title: project.title,
        category: project.category,
        shortDescription: project.shortDescription,
        description: project.description,
        role: project.role,
        featured: project.featured,
        published: project.published,
        order: project.order,
        status: project.status,
        completionDate: project.completionDate,
        githubUrl: project.githubUrl,
        liveUrl: project.liveUrl,
        primaryImageUrl: project.primaryImageUrl,
        primaryImageAlt: project.primaryImageAlt,
      },
    });

    await prisma.projectTechnology.deleteMany({ where: { projectId: record.id } });
    if (project.technologies.length > 0) {
      await prisma.projectTechnology.createMany({
        data: project.technologies.map((name, i) => ({
          name,
          projectId: record.id,
          order: i,
        })),
      });
    }
  }

  // --- Education -----------------------------------------------------------
  const education = [
    {
      degree: "BSc in Computer Science & Engineering",
      institution: "American International University-Bangladesh (AIUB)",
      location: "Dhaka, Bangladesh",
      startYear: "2024",
      endYear: "2028",
      score: "Currently in 7th Semester",
      description:
        "Focused on data structures, algorithms, OOP, database design and software engineering fundamentals.",
      current: true,
      order: 0,
      visible: true,
    },
    {
      degree: "Higher Secondary Certificate (HSC) — Science",
      institution: "Mirpur Cantonment Public School and College",
      location: "Dhaka, Bangladesh",
      startYear: "2021",
      endYear: "2023",
      score: "GPA 5.00 / 5.00",
      description: "Science group.",
      current: false,
      order: 1,
      visible: true,
    },
    {
      degree: "Secondary School Certificate (SSC) — Science",
      institution: "Mirpur Cantonment Public School and College",
      location: "Dhaka, Bangladesh",
      startYear: "2019",
      endYear: "2021",
      score: "GPA 5.00 / 5.00",
      description: "Science group.",
      current: false,
      order: 2,
      visible: true,
    },
  ];

  await prisma.education.deleteMany();
  await prisma.education.createMany({ data: education });

  // --- Social links ---------------------------------------------------------
  const socialLinks = [
    {
      platform: "github",
      label: "GitHub",
      url: "https://github.com/RajinShahriar10",
      order: 0,
      visible: true,
    },
    {
      platform: "linkedin",
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/md-rajin-Shahriar",
      order: 1,
      visible: true,
    },
  ];

  await prisma.socialLink.deleteMany();
  await prisma.socialLink.createMany({ data: socialLinks });

  // --- Site settings --------------------------------------------------------
  // Keys mirror what the app actually reads (src/lib/data/site.ts, metadata.ts,
  // footer, contact page). Stale rows are removed so the admin form stays tidy.
  const siteSettings = [
    { key: "siteName", value: "MD. Rajin Shahriar", description: "Site name" },
    {
      key: "siteDescription",
      value:
        "Portfolio of MD. Rajin Shahriar, a Software Engineer specializing in C# .NET and Java development.",
      description: "Default SEO description",
    },
    {
      key: "siteUrl",
      value: "https://rajinportfolio.netlify.app",
      description: "Canonical site URL used for metadata",
    },
    { key: "footerText", value: "Software Engineer · C# .NET · Java", description: "Footer blurb" },
    { key: "footerCopyright", value: "MD. Rajin Shahriar", description: "Footer copyright name" },
    { key: "navAbout", value: "About", description: "Navigation label" },
    { key: "navProjects", value: "Projects", description: "Navigation label" },
    { key: "navExperience", value: "Experience", description: "Navigation label" },
    { key: "navResearch", value: "Research", description: "Navigation label" },
    { key: "navCertificates", value: "Certificates", description: "Navigation label" },
    { key: "navContact", value: "Contact", description: "Navigation label" },
    {
      key: "contact_email",
      value: "rajinshahriar.official@gmail.com",
      description: "Contact email",
    },
    { key: "contact_phone", value: "+880 1863-056306", description: "Contact phone" },
    {
      key: "contact_location",
      value: "Bashundhara R/A, Dhaka, Bangladesh",
      description: "Contact location",
    },
  ];

  const validKeys = new Set(siteSettings.map((s) => s.key));
  await prisma.siteSetting.deleteMany({ where: { key: { notIn: [...validKeys] } } });

  for (const setting of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, description: setting.description },
      create: { key: setting.key, value: setting.value, description: setting.description },
    });
  }

  // --- Section settings -----------------------------------------------------
  const sectionOrder = [
    "hero",
    "marquee",
    "about",
    "skills",
    "projects",
    "experience",
    "education",
    "research",
    "certificates",
    "achievements",
    "contact",
  ];

  for (const [order, key] of sectionOrder.entries()) {
    await prisma.sectionSetting.upsert({
      where: { key },
      update: {
        label: key.charAt(0).toUpperCase() + key.slice(1),
        visible: true,
        order,
      },
      create: {
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        visible: true,
        order,
      },
    });
  }

  // --- Experience ------------------------------------------------------------
  // No professional roles on the CV yet — add them from /admin/experience.
  await prisma.experience.deleteMany();

  // --- Certificates ----------------------------------------------------------
  // Dates use the year from the CV (first day of the year); set exact issue
  // dates from the admin panel if you have them.
  const certificates = [
    {
      title: "Advanced Software Engineering Job Simulation",
      issuer: "Walmart USA",
      issueDate: new Date("2026-01-01"),
      imageUrl: "/certificates/walmart-usa.jpg",
      imageAlt: "Walmart Advanced Software Engineering Job Simulation certificate",
      description: "Advanced Software Engineering job simulation completed with Walmart USA.",
      order: 0,
      visible: true,
    },
    {
      title: "Technology Job Simulation",
      issuer: "Deloitte Australia",
      issueDate: new Date("2026-01-01"),
      imageUrl: "/certificates/deloitte-australia.jpg",
      imageAlt: "Deloitte Australia Technology Job Simulation certificate",
      description: "Technology job simulation completed with Deloitte Australia.",
      order: 1,
      visible: true,
    },
    {
      title: "Software Engineering Job Simulation",
      issuer: "JPMorganChase",
      issueDate: new Date("2026-01-01"),
      imageUrl: "/certificates/jpmorgan-chase.jpg",
      imageAlt: "JPMorganChase Software Engineering Job Simulation certificate",
      description: "Software Engineering job simulation completed with JPMorganChase.",
      order: 2,
      visible: true,
    },
    {
      title: "Professional Web Design & Development",
      issuer: "UY LAB",
      issueDate: new Date("2021-01-01"),
      imageUrl: "/certificates/uy-lab-web-design.jpg",
      imageAlt: "UY LAB Professional Web Design & Development certificate",
      description: "Professional Web Design & Development course completed with UY LAB.",
      order: 3,
      visible: true,
    },
    {
      title: "Higher Secondary Certificate (HSC) — Science",
      issuer: "Mirpur Cantonment Public School and College",
      issueDate: new Date("2023-01-01"),
      imageUrl: "/certificates/hsc-science.jpg",
      imageAlt: "Higher Secondary Certificate — Science",
      description: "GPA 5.00 / 5.00, Science group.",
      order: 4,
      visible: true,
    },
    {
      title: "Secondary School Certificate (SSC) — Science",
      issuer: "Mirpur Cantonment Public School and College",
      issueDate: new Date("2021-01-01"),
      imageUrl: "/certificates/ssc-science.jpg",
      imageAlt: "Secondary School Certificate — Science",
      description: "GPA 5.00 / 5.00, Science group.",
      order: 5,
      visible: true,
    },
  ];

  await prisma.certificate.deleteMany();
  await prisma.certificate.createMany({ data: certificates });

  // --- Achievements -----------------------------------------------------------
  // Dates follow the year in each award file name; images live in /public/achievements.
  const achievements = [
    {
      title: "MVP — Mirpur DOHS Football Tournament",
      category: "football",
      description: "Named Most Valuable Player of the tournament.",
      date: new Date("2021-01-01"),
      imageUrl: "/achievements/mvp-dohs-football-2021.jpg",
      imageAlt: "MVP trophy, Mirpur DOHS Football Tournament 2021",
      order: 0,
      visible: true,
    },
    {
      title: "Runners Up — Mirpur DOHS Football Tournament",
      category: "football",
      description: "Reached the final of the Mirpur DOHS Football Tournament.",
      date: new Date("2021-01-01"),
      imageUrl: "/achievements/runners-up-dohs-football-2021.jpg",
      imageAlt: "Runners Up trophy, Mirpur DOHS Football Tournament 2021",
      order: 1,
      visible: true,
    },
    {
      title: "Runners Up — Mirpur DOHS Football Fiesta",
      category: "football",
      description: "Reached the final of the Mirpur DOHS Football Fiesta.",
      date: new Date("2021-01-01"),
      imageUrl: "/achievements/runners-up-dohs-fiesta-2021.jpg",
      imageAlt: "Runners Up trophy, Mirpur DOHS Football Fiesta 2021",
      order: 2,
      visible: true,
    },
    {
      title: "2nd Runners Up — MCPSC EV Futsal Championship",
      category: "football",
      description: "Finished third at the Mirpur Cantonment Public School and College EV Futsal Championship.",
      date: new Date("2023-01-01"),
      imageUrl: "/achievements/second-runners-up-futsal-2023.jpg",
      imageAlt: "2nd Runners Up certificate, MCPSC EV Futsal Championship 2023",
      order: 3,
      visible: true,
    },
    {
      title: "Runners Up — Inter House Football Tournament",
      category: "football",
      description: "Runners Up in the Inter House Football Tournament at Mirpur Cantonment Public School and College.",
      date: new Date("2019-01-01"),
      imageUrl: "/achievements/runners-up-inter-house-2019.jpg",
      imageAlt: "Runners Up certificate, Inter House Football Tournament 2019",
      order: 4,
      visible: true,
    },
    {
      title: "1st Prize — 100 Meter Race",
      category: "athletics",
      description: "Won first prize in the 100 meter race at Monipur High School and College.",
      date: new Date("2011-01-01"),
      imageUrl: "/achievements/first-prize-100m-2011.jpg",
      imageAlt: "1st Prize certificate, 100 Meter Race, Monipur High School and College 2011",
      order: 5,
      visible: true,
    },
    {
      title: "1st Prize — 100 Meter Race",
      category: "athletics",
      description: "Won first prize in the 100 meter race at Chetona Model Academy.",
      date: new Date("2009-01-01"),
      imageUrl: "/achievements/first-prize-100m-2009.jpg",
      imageAlt: "1st Prize certificate, 100 Meter Race, Chetona Model Academy 2009",
      order: 6,
      visible: true,
    },
    {
      title: "Certificate of Participation — Book Reading Competition",
      category: "participation",
      description: "Certificate of participation from the British Council book reading competition.",
      date: null,
      imageUrl: "/achievements/british-council-reading.jpg",
      imageAlt: "British Council Book Reading competition certificate",
      order: 7,
      visible: true,
    },
    {
      title: "Certificate of Participation — Shwapno Ako",
      category: "participation",
      description: "Certificate of participation from Shwapno Ako.",
      date: null,
      imageUrl: "/achievements/shwapno-ako.jpg",
      imageAlt: "Shwapno Ako participation certificate",
      order: 8,
      visible: true,
    },
  ];

  await prisma.achievement.deleteMany();
  await prisma.achievement.createMany({ data: achievements });

  // --- Research ---------------------------------------------------------------
  const research = [
    {
      title: "Renewable Energy Transition Pathways for a Low-Carbon Future in Bangladesh",
      category: "Conference paper",
      authorPosition: "2nd Author",
      conference: "Intl. Conference on Regenerative Agriculture",
      institution: "Gazipur Agricultural University",
      summary:
        "Scenario analysis of Bangladesh's energy policy, grid infrastructure and low-carbon strategies towards a renewable energy transition.",
      details:
        "This study analyses Bangladesh's energy policy, grid infrastructure and low-carbon strategies, "
        + "outlining realistic pathways for transitioning to renewable energy while maintaining grid "
        + "stability and affordability.",
      tags: ["Renewable Energy", "Energy Policy", "Sustainability", "Bangladesh"],
      date: new Date("2025-12-01"),
      order: 0,
      visible: true,
      url: null,
    },
  ];

  await prisma.researchTag.deleteMany();
  await prisma.research.deleteMany();
  for (const r of research) {
    const { tags = [], ...data } = r;
    await prisma.research.create({
      data: {
        ...data,
        tags: { create: tags.map((name, order) => ({ name, order })) },
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
