"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 2.8 }); // Wait for KENTO_O splash

    // Heading: line-by-line clip reveal
    if (headlineRef.current) {
      const lines = headlineRef.current.querySelectorAll("span");
      tl.fromTo(
        lines,
        { clipPath: "inset(100% 0 0 0)", y: 50 },
        {
          clipPath: "inset(0% 0 0 0)",
          y: 0,
          duration: 0.95,
          ease: "power3.out",
          stagger: 0.15,
        }
      );
    }

    // Subtitle: fade + blur
    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 18, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" },
        "-=0.4"
      );
    }

    // CTA buttons
    if (ctaRef.current) {
      tl.fromTo(
        ctaRef.current.children,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.12 },
        "-=0.4"
      );
    }
  }, []);

  return (
    <section className="relative flex items-center min-h-screen">
      <div className="container-custom">
        <div className="max-w-4xl">
          {/* Headline — each line wrapped for staggered clip reveal */}
          <h1
            ref={headlineRef}
            className="font-black text-white leading-[0.95] mb-8 tracking-tight"
            style={{ fontSize: "clamp(3rem, 10vw, 7rem)" }}
          >
            <span className="block overflow-hidden">
              <span className="block" style={{ clipPath: "inset(100% 0 0 0)" }}>Creative</span>
            </span>
            <span className="block overflow-hidden">
              <span className="block" style={{ clipPath: "inset(100% 0 0 0)" }}>Developer</span>
            </span>
          </h1>

          {/* Subheadline */}
          <p
            ref={subtitleRef}
            className="text-xl sm:text-2xl leading-relaxed mb-12 max-w-xl opacity-0"
            style={{ color: "var(--fg-muted)" }}
          >
            Building refined digital experiences with precision and purpose.
          </p>

          {/* CTA */}
          <div ref={ctaRef} className="flex items-center gap-8">
            <Link href="/projects" className="btn-primary opacity-0">
              View Work
            </Link>
            <Link href="/contact" className="link-underline text-sm uppercase tracking-widest font-medium opacity-0">
              Get In Touch
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20 text-xs uppercase tracking-widest">
        <svg className="w-4 h-4 mx-auto animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
