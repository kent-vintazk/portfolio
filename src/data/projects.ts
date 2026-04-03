export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  image?: string;
  href?: string;
  repo?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: "project-alpha",
    title: "Project Alpha",
    description: "A full-stack SaaS application with user authentication, payments, and a dashboard.",
    longDescription:
      "Project Alpha is a complete SaaS platform built from the ground up. It features secure user authentication with JWT, Stripe payment integration for subscriptions, and a real-time analytics dashboard. The backend uses PostgreSQL with Prisma ORM, and the frontend is built with Next.js and TypeScript for type safety across the stack.",
    tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
    href: "#",
    repo: "#",
    featured: true,
  },
  {
    slug: "project-beta",
    title: "Project Beta",
    description: "An open-source CLI tool that automates repetitive developer tasks.",
    longDescription:
      "Project Beta is a developer productivity CLI that automates common workflows — scaffolding new projects, running lint/format/test in sequence, and generating boilerplate code from templates. Written in TypeScript with a plugin architecture so users can extend it with custom commands.",
    tags: ["Node.js", "TypeScript", "CLI"],
    href: undefined,
    repo: "#",
    featured: true,
  },
  {
    slug: "project-gamma",
    title: "Project Gamma",
    description: "A real-time collaborative whiteboard built with WebSockets.",
    longDescription:
      "Project Gamma is a collaborative whiteboard where multiple users can draw, add sticky notes, and brainstorm together in real time. It uses Socket.io for WebSocket communication, the Canvas API for rendering, and a Node.js backend that syncs state across all connected clients with conflict resolution.",
    tags: ["React", "Socket.io", "Canvas API"],
    href: "#",
    repo: "#",
    featured: true,
  },
  {
    slug: "project-delta",
    title: "Project Delta",
    description: "A REST API service for managing inventory with role-based access control.",
    longDescription:
      "Project Delta is a backend API for inventory management built for a logistics company. It supports role-based access control (admin, manager, viewer), full CRUD operations on inventory items, audit logging, and CSV export. Built with Express and MongoDB, authenticated via JWT with refresh token rotation.",
    tags: ["Node.js", "Express", "MongoDB", "JWT"],
    href: undefined,
    repo: "#",
  },
  {
    slug: "project-epsilon",
    title: "Project Epsilon",
    description: "A Python data pipeline that processes and visualizes large CSV datasets.",
    longDescription:
      "Project Epsilon is a data processing pipeline that ingests large CSV files, cleans and transforms the data using Pandas, and serves interactive visualizations through a FastAPI web interface. It runs in Docker containers and can process datasets with millions of rows efficiently using chunked processing.",
    tags: ["Python", "Pandas", "FastAPI", "Docker"],
    href: "#",
    repo: "#",
  },
  {
    slug: "project-zeta",
    title: "Project Zeta",
    description: "A mobile-first e-commerce storefront with cart, checkout, and order tracking.",
    longDescription:
      "Project Zeta is a headless e-commerce frontend powered by the Shopify Storefront API. It features a mobile-first responsive design, persistent cart with local storage, real-time inventory checks, and order tracking. Built with Next.js and styled with Tailwind CSS for rapid iteration.",
    tags: ["Next.js", "Tailwind CSS", "Shopify API"],
    href: "#",
    repo: undefined,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
