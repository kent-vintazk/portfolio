import Hero from "@/components/Hero";
import ProjectCard from "@/components/ProjectCard";
import KENTO_O from "@/components/KENTO_O";
import Link from "next/link";
import { getFeaturedProjects } from "@/data/projects";

export default function Home() {
  const featuredProjects = getFeaturedProjects();

  return (
    <>
      <KENTO_O />
      <Hero />

      {/* Featured Projects */}
      <section className="py-32" id="work">
        <div className="container-custom">
          <div className="mb-16">
            <h2 className="section-title" data-reveal-heading>Featured Work</h2>
            <p className="section-subtitle" data-reveal-blur>
              A selection of projects I&apos;m proud of.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-reveal-stagger>
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} {...project} />
            ))}
          </div>

          <div className="mt-16 text-center" data-reveal>
            <Link href="/projects" className="link-underline text-sm uppercase tracking-widest font-medium">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-32 border-t border-white/5">
        <div className="container-custom">
          <div className="mb-16">
            <h2 className="section-title" data-reveal-heading>Skills & Tools</h2>
            <p className="section-subtitle" data-reveal-blur>Technologies I work with.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" data-reveal-stagger>
            {[
              "TypeScript", "React", "Next.js", "Node.js",
              "Python", "PostgreSQL", "Docker", "Git",
              "Tailwind CSS", "REST APIs", "GraphQL", "AWS",
            ].map((skill) => (
              <div key={skill} className="card text-center text-sm font-medium text-white/35 hover:text-white">
                {skill}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 border-t border-white/5">
        <div className="container-custom text-center">
          <h2 className="section-title" data-reveal-heading>Let&apos;s Work Together</h2>
          <p className="section-subtitle mx-auto mb-12" data-reveal-blur>
            Have a project in mind? I&apos;d love to hear from you.
          </p>
          <div data-reveal>
            <Link href="/contact" className="btn-primary">
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
