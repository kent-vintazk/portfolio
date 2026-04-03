import type { Metadata } from "next";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects | KENTO_O",
  description: "A full list of projects I've built.",
};

export default function ProjectsPage() {
  return (
    <div className="pt-32 pb-32">
      <div className="container-custom">
        <div className="mb-16">
          <h1
            className="font-black text-white leading-[0.95] mb-4 tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}
            data-reveal-heading
          >
            Projects
          </h1>
          <p className="section-subtitle" data-reveal-blur>
            Things I&apos;ve built — from side projects to production systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-reveal-stagger>
          {projects.map((project) => (
            <ProjectCard key={project.slug} {...project} />
          ))}
        </div>
      </div>
    </div>
  );
}
