import type { Metadata } from "next";
import ProjectCard from "@/components/ProjectCard";

export const metadata: Metadata = {
  title: "Projects | Portfolio",
  description: "A full list of projects I've built.",
};

const projects = [
  {
    title: "Project Alpha",
    description: "A full-stack SaaS application with user authentication, payments, and a dashboard.",
    tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
    href: "#",
    repo: "#",
  },
  {
    title: "Project Beta",
    description: "An open-source CLI tool that automates repetitive developer tasks.",
    tags: ["Node.js", "TypeScript", "CLI"],
    href: undefined,
    repo: "#",
  },
  {
    title: "Project Gamma",
    description: "A real-time collaborative whiteboard built with WebSockets.",
    tags: ["React", "Socket.io", "Canvas API"],
    href: "#",
    repo: "#",
  },
  {
    title: "Project Delta",
    description: "A REST API service for managing inventory with role-based access control.",
    tags: ["Node.js", "Express", "MongoDB", "JWT"],
    href: undefined,
    repo: "#",
  },
  {
    title: "Project Epsilon",
    description: "A Python data pipeline that processes and visualizes large CSV datasets.",
    tags: ["Python", "Pandas", "FastAPI", "Docker"],
    href: "#",
    repo: "#",
  },
  {
    title: "Project Zeta",
    description: "A mobile-first e-commerce storefront with cart, checkout, and order tracking.",
    tags: ["Next.js", "Tailwind CSS", "Shopify API"],
    href: "#",
    repo: undefined,
  },
];

export default function ProjectsPage() {
  return (
    <div className="pt-24 pb-24">
      <div className="container-custom">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Projects</h1>
          <p className="section-subtitle">
            Things I&apos;ve built — from side projects to production systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </div>
    </div>
  );
}
