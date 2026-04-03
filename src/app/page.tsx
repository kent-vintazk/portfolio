import Hero from "@/components/Hero";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";

const featuredProjects = [
  {
    title: "Project One",
    description: "A brief description of your first featured project and the problems it solves.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    href: "#",
    repo: "#",
  },
  {
    title: "Project Two",
    description: "A brief description of your second featured project and the tech used.",
    tags: ["React", "Node.js", "PostgreSQL"],
    href: "#",
    repo: "#",
  },
  {
    title: "Project Three",
    description: "A brief description of your third featured project and its impact.",
    tags: ["Python", "FastAPI", "Docker"],
    href: "#",
    repo: "#",
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* Featured Projects */}
      <section className="py-24" id="work">
        <div className="container-custom">
          <div className="mb-12">
            <h2 className="section-title">Featured Work</h2>
            <p className="section-subtitle">
              A selection of projects I&apos;m proud of. Each one taught me something new.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/projects" className="btn-outline">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-24 border-t border-white/10">
        <div className="container-custom">
          <div className="mb-12">
            <h2 className="section-title">Skills & Tools</h2>
            <p className="section-subtitle">Technologies I work with day-to-day.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              "TypeScript", "React", "Next.js", "Node.js",
              "Python", "PostgreSQL", "Docker", "Git",
              "Tailwind CSS", "REST APIs", "GraphQL", "AWS",
            ].map((skill) => (
              <div key={skill} className="card text-center text-sm font-medium text-white/70 hover:text-white">
                {skill}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-white/10">
        <div className="container-custom text-center">
          <h2 className="section-title">Let&apos;s Work Together</h2>
          <p className="section-subtitle mx-auto mb-8">
            Have a project in mind or want to chat? I&apos;d love to hear from you.
          </p>
          <Link href="/contact" className="btn-primary">
            Get In Touch
          </Link>
        </div>
      </section>
    </>
  );
}
