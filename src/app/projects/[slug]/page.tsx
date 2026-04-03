import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "@/data/projects";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} | KENTO_O`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="pt-32 pb-32">
      <div className="container-custom">
        {/* Back link */}
        <Link
          href="/projects"
          className="link-underline text-xs uppercase tracking-widest font-medium mb-12 inline-block"
        >
          Back to Projects
        </Link>

        {/* Header */}
        <header className="mb-12 max-w-3xl">
          <h1
            className="font-black text-white leading-[0.95] mb-4 tracking-tight"
            style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}
            data-reveal-heading
          >
            {project.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-6" data-reveal-blur>
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 border border-white/10 text-white/50 text-xs font-medium tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex items-center gap-6" data-reveal>
            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm"
              >
                Live Demo
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-sm uppercase tracking-widest font-medium"
              >
                Source Code
              </a>
            )}
          </div>
        </header>

        {/* Description */}
        <div className="max-w-3xl" data-reveal-blur>
          <p className="text-lg leading-relaxed" style={{ color: "var(--fg-muted)" }}>
            {project.longDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
