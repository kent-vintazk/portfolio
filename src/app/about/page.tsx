import type { Metadata } from "next";
import Link from "next/link";
import ExperienceTimeline from "@/components/ExperienceTimeline";

export const metadata: Metadata = {
  title: "About | KENTO_O",
  description: "Learn more about me, my background, and what drives my work.",
};

const experiences = [
  {
    role: "Senior Developer",
    company: "Company Name",
    period: "2022 — Present",
    description:
      "Led development of key product features, improved performance by 40%, mentored junior developers.",
  },
  {
    role: "Frontend Developer",
    company: "Another Company",
    period: "2020 — 2022",
    description:
      "Built responsive UIs with React and TypeScript, collaborated closely with design and backend teams.",
  },
  {
    role: "Junior Developer",
    company: "Startup Name",
    period: "2018 — 2020",
    description:
      "Full-stack development using Node.js and React, shipped multiple customer-facing features.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Intro */}
      <section className="pt-32 pb-24">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1
              className="font-black text-white leading-[0.95] mb-8 tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}
              data-reveal-heading
            >
              About Me
            </h1>
            <div className="space-y-5 text-lg leading-relaxed" style={{ color: "var(--fg-muted)" }}>
              <p data-reveal-blur>
                Hi, I&apos;m <span className="text-white font-medium">KENTO_O</span> — a creative developer
                based in [City, Country]. I build fast, accessible, and well-crafted web experiences.
              </p>
              <p data-reveal-blur>
                I&apos;ve been writing code professionally for over 5 years, working across the full stack
                with a particular love for React, TypeScript, and clean system design. I care deeply
                about developer experience and shipping things that actually work for users.
              </p>
              <p data-reveal-blur>
                Outside of work I enjoy [your hobbies], which keeps me sane and often sparks unexpected
                ideas for projects.
              </p>
            </div>
            <div className="mt-10 flex items-center gap-8" data-reveal>
              <Link href="/contact" className="btn-primary">Contact Me</Link>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-sm uppercase tracking-widest font-medium"
              >
                Download CV
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal scroll experience timeline */}
      <ExperienceTimeline experiences={experiences} />

      {/* Education */}
      <section className="py-32">
        <div className="container-custom">
          <h2 className="section-title" data-reveal-heading>Education</h2>
          <div className="mt-10 card p-8 flex flex-col sm:flex-row gap-6 max-w-2xl" data-reveal-blur>
            <div className="sm:w-40 shrink-0 text-white/20 text-xs uppercase tracking-widest font-medium pt-1">
              2014 — 2018
            </div>
            <div>
              <h3 className="text-white font-bold text-xl">B.Sc. Computer Science</h3>
              <p className="text-[#ff6a00] text-sm mb-3">University Name</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                Graduated with honors. Focused on algorithms, software engineering, and distributed systems.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
