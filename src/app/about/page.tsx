import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | Portfolio",
  description: "Learn more about me, my background, and what drives my work.",
};

const experiences = [
  {
    role: "Senior Developer",
    company: "Company Name",
    period: "2022 — Present",
    description: "Led development of key product features, improved performance by 40%, mentored junior developers.",
  },
  {
    role: "Frontend Developer",
    company: "Another Company",
    period: "2020 — 2022",
    description: "Built responsive UIs with React and TypeScript, collaborated closely with design and backend teams.",
  },
  {
    role: "Junior Developer",
    company: "Startup Name",
    period: "2018 — 2020",
    description: "Full-stack development using Node.js and React, shipped multiple customer-facing features.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-24 pb-24">
      <div className="container-custom">

        {/* Intro */}
        <div className="max-w-3xl mb-20">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">About Me</h1>
          <div className="space-y-4 text-white/70 text-lg leading-relaxed">
            <p>
              Hi, I&apos;m <span className="text-white font-medium">Your Name</span> — a full-stack developer
              based in [City, Country]. I build fast, accessible, and well-crafted web experiences.
            </p>
            <p>
              I&apos;ve been writing code professionally for over 5 years, working across the full stack
              with a particular love for React, TypeScript, and clean system design. I care deeply
              about developer experience and shipping things that actually work for users.
            </p>
            <p>
              Outside of work I enjoy [your hobbies], which keeps me sane and often sparks unexpected
              ideas for projects.
            </p>
          </div>
          <div className="mt-8 flex gap-4">
            <Link href="/contact" className="btn-primary">Contact Me</Link>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-outline">
              Download CV
            </a>
          </div>
        </div>

        {/* Experience */}
        <section className="mb-20">
          <h2 className="section-title">Experience</h2>
          <div className="mt-8 space-y-6">
            {experiences.map((exp) => (
              <div key={exp.role + exp.company} className="card flex flex-col sm:flex-row gap-4">
                <div className="sm:w-40 shrink-0 text-white/40 text-sm pt-0.5">{exp.period}</div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{exp.role}</h3>
                  <p className="text-indigo-400 text-sm mb-2">{exp.company}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="section-title">Education</h2>
          <div className="mt-8 card flex flex-col sm:flex-row gap-4">
            <div className="sm:w-40 shrink-0 text-white/40 text-sm pt-0.5">2014 — 2018</div>
            <div>
              <h3 className="text-white font-semibold text-lg">B.Sc. Computer Science</h3>
              <p className="text-indigo-400 text-sm mb-2">University Name</p>
              <p className="text-white/60 text-sm">Graduated with honors. Focused on algorithms, software engineering, and distributed systems.</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
