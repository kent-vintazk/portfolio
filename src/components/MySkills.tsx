"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Custom Brand SVG Icons ─── */

const FigmaIcon = ({ size = 36, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M8 24c2.2 0 4-1.8 4-4v-4H8c-2.2 0-4 1.8-4 4s1.8 4 4 4z" fill="currentColor" opacity={0.8} />
    <path d="M4 12c0-2.2 1.8-4 4-4h4v8H8c-2.2 0-4-1.8-4-4z" fill="currentColor" opacity={0.6} />
    <path d="M4 4c0-2.2 1.8-4 4-4h4v8H8C5.8 8 4 6.2 4 4z" fill="currentColor" opacity={0.8} />
    <path d="M12 0h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4V0z" fill="currentColor" opacity={0.5} />
    <path d="M20 12c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4z" fill="currentColor" opacity={0.7} />
  </svg>
);

const ReactIcon = ({ size = 36, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="2.2" fill="currentColor" />
    <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.2" fill="none" />
    <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.2" fill="none" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.2" fill="none" transform="rotate(120 12 12)" />
  </svg>
);

const FlutterIcon = ({ size = 36, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M14.314 0L2 12.314l3.686 3.686L19.056 2.944V0h-4.742zM14.314 11.627L8.686 17.257l3.686 3.686 1.628 1.628h4.742v-2.944l-4.428-4.314z" opacity={0.8} />
    <path d="M8.686 17.257l3.314-3.314 3.314 3.314-3.314 3.314z" opacity={0.5} />
  </svg>
);

const PythonIcon = ({ size = 36, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.96 3.403 5.96h2.03v-2.867s-.109-3.403 3.35-3.403h5.766s3.24.052 3.24-3.134V3.195S18.28 0 11.914 0zM8.708 1.84a1.052 1.052 0 110 2.104 1.052 1.052 0 010-2.104z" opacity={0.8} />
    <path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752H11.98v-.826h8.121S24 18.211 24 12.031c0-6.18-3.403-5.96-3.403-5.96h-2.03v2.867s.109 3.403-3.35 3.403H9.451s-3.24-.052-3.24 3.134v5.33S5.72 24 12.086 24zm3.206-1.84a1.052 1.052 0 110-2.104 1.052 1.052 0 010 2.104z" opacity={0.6} />
  </svg>
);

/* ─── Data ─── */

const skills = [
  { label: "UI Design", percentage: 90 },
  { label: "App Development", percentage: 80 },
  { label: "User Research", percentage: 85 },
  { label: "Coding", percentage: 60 },
  { label: "No Code Tools", percentage: 65 },
];

const skillCategories = [
  { icon: FigmaIcon, label: "UI Design" },
  { icon: ReactIcon, label: "Web Dev" },
  { icon: FlutterIcon, label: "App Development" },
  { icon: PythonIcon, label: "Coding" },
];

const tools = [
  { name: "Figma", icon: "🎨" },
  { name: "Framer", icon: "✨" },
];

/* ─── Component ─── */

export default function MySkills() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Heading fade in
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Content fade in
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Skill bars animate width
      if (barsRef.current) {
        const bars = barsRef.current.querySelectorAll("[data-bar]");
        bars.forEach((bar) => {
          gsap.fromTo(
            bar,
            { width: "0%" },
            {
              width: (bar as HTMLElement).dataset.bar + "%",
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: barsRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
className="relative pb-20 md:pb-32 pt-6 overflow-hidden"    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('images/bg3.png')" }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 container-custom">
        {/* Section nav indicator */}
        
        <div className="flex items-center gap-4 mb-6 ">
          <span className="text-xs font-mono text-white/40 tracking-wider ml-4">004</span>
          <span className="w-12 h-px bg-white/20" />
          <span className="text-xs uppercase tracking-[0.2em] text-white/40">Skills</span>
        </div>

        {/* Glass card */}
        <div
          className="rounded-2xl p-8 md:p-12 border border-white/[0.12] shadow-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Top row — Title + Description + Icons */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left — Title & Description */}
            <div>
              <h2
                ref={headingRef}
                className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-white opacity-0"
              >
                <span className="italic font-light">My Professional</span>
                <br />
                Background Skills and
                <br />
                Accomplishments
              </h2>
              <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-md">
                I specialize in creating digital experiences through design and
                development. With expertise in UI/UX design, web development,
                and product design, I deliver thoughtful solutions that combine
                aesthetics with functionality.
              </p>
            </div>

            {/* Right — Skill category icons in a row */}
            <div
              ref={contentRef}
              className="flex items-center justify-center gap-5 md:gap-8 opacity-0"
            >
              {skillCategories.map((skill, idx) => {
                const Icon = skill.icon;
                return (
                  <div key={idx} className="flex flex-col items-center gap-3">
                    <div
                      className="w-20 h-28 md:w-24 md:h-32 rounded-[50%] border border-white/15 flex items-center justify-center
                                 hover:border-white/30 transition-all duration-300 group"
                      style={{
                        background:
                          "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.06), transparent 70%)",
                      }}
                    >
                      <Icon
                        size={36}
                        className="text-white/70 group-hover:text-white transition-colors"
                      />
                    </div>
                    <span className="text-xs md:text-sm text-white/50 text-center">
                      {skill.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skill bars */}
          <div ref={barsRef} className="mt-14 pt-10 border-t border-white/[0.08]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-7">
              {skills.map((skill, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-sm md:text-base text-white/80 font-medium">
                      {skill.label}
                    </span>
                    <span className="text-xs md:text-sm text-white/40 tabular-nums">
                      {skill.percentage}%
                    </span>
                  </div>
                  {/* Track */}
                  <div className="relative h-[5px] bg-white/10 rounded-full">
                    {/* Filled bar */}
                    <div
                      data-bar={skill.percentage}
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        width: "0%",
                        background: "none",
                        backgroundColor: skill.percentage >= 75 ? "#00e676" : "#ff3d3d",
                      }}
                    />
                    {/* Thumb circle */}
                    <div
                      className="absolute top-1/2 w-3.5 h-3.5 rounded-full border-2 border-white pointer-events-none"
                      style={{
                        left: `${skill.percentage}%`,
                        transform: "translate(-50%, -50%)",
                        backgroundColor: skill.percentage >= 75 ? "#00e676" : "#ff3d3d",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="mt-10 pt-10 border-t border-white/[0.08]">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-5">
              Tools & Platforms
            </p>
            <div className="flex flex-wrap gap-4">
              {tools.map((tool, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg border border-white/10
                             hover:border-white/25 hover:bg-white/[0.03] transition-all duration-300"
                >
                  <span className="text-lg">{tool.icon}</span>
                  <span className="text-sm text-white/60">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}