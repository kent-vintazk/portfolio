"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "Disaster Response ",
    image: "/images/projects/Screenshot 2024-09-12 131056.png",
    tags: ["DEVELOPMENT", "UI/UX"],
  },
  {
    title: "VocabVoyage",
    image: "/images/projects/Screenshot 2024-10-18 230025.png",
    tags: ["DEVELOPMENT"],
  },
  {
    title: "Cooking Book",
    image: "/images/projects/Screenshot 2024-10-29 175143.png",
    tags: ["DEVELOPMENT", "DESIGN"],
  },
  {
    title: "Pentaxite",
    image: "/images/projects/Screenshot 2025-01-23 174939.png",
    tags: ["Project Design"],
  },
  {
    title: "Saas Catering",
    image: "/images/projects/Screenshot 2025-02-07 095800.png",
    tags: ["DEVELOPMENT", "DESIGN"],
  },
  {
    title: "The Eilish Vault",
    image: "/images/projects/Screenshot 2025-04-16 112218.png",
    tags: ["DEVELOPMENT", "BRANDING"],
  },
  {
    title: "Coffee Blog",
    image: "/images/projects/Screenshot 2025-04-16 121617.png",
    tags: ["DEVELOPMENT", "UI/UX"],
  },
  {
    title: "Figma Design",
    image: "/images/projects/Screenshot 2025-07-03 184020.png",
    tags: ["DESIGN"],
  },
];

// Scattered positions — slight overlaps, not too much
// Each card: top (px from container top), left (%), width (px)
const cardLayout = [
  { top: 40, left: 2, width: 340 },
  { top: 20, left: 35, width: 300 },
  { top: 60, left: 68, width: 320 },
  { top: 420, left: 10, width: 310 },
  { top: 380, left: 42, width: 340 },
  { top: 450, left: 72, width: 300 },
  { top: 780, left: 4, width: 330 },
  { top: 740, left: 38, width: 320 },
];

export default function MyWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Heading reveal
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, scale: 0.95, filter: "blur(6px)" },
        {
          opacity: 0.5,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 100%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Cards drop in
    cardsRef.current.forEach((card) => {
      if (!card) return;
      gsap.fromTo(
        card,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 95%",
            end: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Green glow
      const glow = card.querySelector(".card-glow");
      if (glow) {
        gsap.to(glow, {
          opacity: 1,
          scrollTrigger: {
            trigger: card,
            start: "top 60%",
            end: "top 10%",
            scrub: 1,
          },
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative"
      style={{ backgroundColor: "#0a0a0a", overflow: "clip" }}
    >
      {/* Background — stays still via backgroundAttachment: fixed */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/images/bg3.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          filter: "blur(12px)",
          transform: "scale(1.05)",
          opacity: 0.5,
        }}
      />
      <div className="absolute inset-0 z-0 bg-black/50 pointer-events-none" />

      {/* Section nav indicator */}
      <div className="relative z-30 flex items-center justify-between px-6 sm:px-10 lg:px-16 py-6">
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-white/40 tracking-wider">003</span>
          <span className="w-12 h-px bg-white/20" />
          <span className="text-xs uppercase tracking-[0.2em] text-white/40">Work</span>
        </div>
      </div>

      {/* Scrollable area — heading sticks, cards scroll over it */}
      <div className="relative min-h-screen">
        {/* Sticky MY WORK heading — locked to center, never moves */}
        <div className="sticky top-0 h-screen z-[1] flex items-center justify-center pointer-events-none">
          <h2
            ref={headingRef}
            className="text-center uppercase opacity-0"
            style={{
              fontFamily: "'Bodoni Moda', serif",
              fontWeight: 900,
              fontSize: "clamp(5rem, 15vw, 14rem)",
              lineHeight: 0.95,
              color: "#F0EDE6",
              letterSpacing: "-0.03em",
            }}
          >
            MY
            <br />
            WORK
          </h2>
        </div>

        {/* Scattered project cards — only these scroll */}
        <div
          className="relative z-10 mx-auto px-4 sm:px-8 lg:px-12"
          style={{ maxWidth: "1400px", marginTop: "-60vh" }}
        >
        <div className="relative" style={{ height: "1200px" }}>
          {projects.map((project, i) => (
            <div
              key={project.title}
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
              className="absolute opacity-0"
              style={{
                top: `${cardLayout[i].top}px`,
                left: `${cardLayout[i].left}%`,
                width: `min(${cardLayout[i].width}px, 85vw)`,
              }}
            >
              <div
                className="group cursor-pointer transition-transform duration-500 hover:scale-[1.03] hover:z-30 relative"
                style={{
                  backgroundColor: "#f5f5f0",
                  padding: "0.5rem",
                  boxShadow: "0 10px 50px rgba(0,0,0,0.5)",
                }}
              >
                {/* Green glow on top edge */}
                <div
                  className="card-glow absolute -top-2 -left-2 -right-2 h-20 pointer-events-none z-10 opacity-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(0, 255, 136, 0.4) 0%, rgba(0, 255, 136, 0.08) 50%, transparent 100%)",
                    filter: "blur(10px)",
                  }}
                />

                {/* Project image */}
                <div className="overflow-hidden aspect-[4/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Project info */}
                <div className="px-3 pt-4 pb-3">
                  <h3
                    className="text-lg sm:text-xl tracking-tight mb-4"
                    style={{
                      fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
                      color: "#1a1a1a",
                      fontWeight: 800,
                    }}
                  >
                    {project.title}
                  </h3>

                  {/* Tags with vertical dividers */}
                  <div className="flex items-center gap-0 flex-wrap">
                    {project.tags.map((tag) => (
                      <div key={tag} className="flex items-center">
                        <span className="w-px h-3 bg-neutral-400 mr-3" />
                        <span
                          className="text-[10px] sm:text-xs uppercase tracking-wider text-neutral-500 mr-3"
                          style={{ fontFamily: "sans-serif" }}
                        >
                          {tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

      {/* Bottom social bar */}
      <div className="relative z-20 border-t border-white/10">
        <div className="flex items-center justify-between px-6 sm:px-10 lg:px-16 py-4">
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors duration-300"
            >
              IG
            </a>
            <a
              href="#"
              className="text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors duration-300"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors duration-300"
            >
              Vimeo
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white/30" />
            <span className="text-xs uppercase tracking-[0.2em] text-white/40">REC</span>
          </div>
        </div>
      </div>
    </section>
  );
}