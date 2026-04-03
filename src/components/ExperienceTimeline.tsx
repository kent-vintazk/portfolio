"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

export default function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const ctx = gsap.context(() => {
      const scrollWidth = track.scrollWidth - container.clientWidth;

      gsap.to(track, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${scrollWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Fade in each card as it enters
      gsap.utils.toArray<HTMLElement>(".timeline-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: gsap.getById("timelineScroll") || undefined,
              start: "left 80%",
              once: true,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="h-screen overflow-hidden">
      <div
        ref={trackRef}
        className="flex items-center h-full gap-8 sm:gap-12 pl-6 sm:pl-10 pr-[20vw]"
        style={{ width: "max-content" }}
      >
        {/* Title card */}
        <div className="shrink-0 w-[300px] sm:w-[400px]">
          <h2 className="section-title">Experience</h2>
          <p className="section-subtitle">Scroll to explore my journey.</p>
        </div>

        {/* Timeline line */}
        {experiences.map((exp, i) => (
          <div
            key={exp.role + exp.company}
            className="timeline-card shrink-0 w-[320px] sm:w-[400px] card p-8 relative"
          >
            {/* Timeline dot */}
            <div className="absolute -top-3 left-8 w-2 h-2 rounded-full bg-[#4d65ff]" />

            <span className="text-white/20 text-xs font-medium uppercase tracking-widest">
              {exp.period}
            </span>
            <h3 className="text-white font-bold text-xl sm:text-2xl mt-4 mb-1">
              {exp.role}
            </h3>
            <p className="text-[#4d65ff] text-sm mb-4">{exp.company}</p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
              {exp.description}
            </p>

            {/* Connector line to next card */}
            {i < experiences.length - 1 && (
              <div className="absolute top-[-7px] left-[calc(2rem+4px)] w-[calc(100%+2rem)] h-px bg-white/10" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
