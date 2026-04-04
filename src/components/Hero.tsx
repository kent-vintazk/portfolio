"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ParticleBackground from "./ParticleBackground";

export default function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const [scrollOpacity, setScrollOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      // Smoother fade out gradient as you scroll past hero
      const opacity = Math.max(0, 1 - scrollY / (heroHeight * 1.2));
      setScrollOpacity(opacity);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Wave effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!headlineRef.current || lettersRef.current.length === 0) return;

      const rect = headlineRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      lettersRef.current.forEach((letterEl) => {
        if (!letterEl) return;

        const letterRect = letterEl.getBoundingClientRect();
        const letterX = letterRect.left - rect.left + letterRect.width / 2;
        const letterY = letterRect.top - rect.top + letterRect.height / 2;

        // Distance from mouse
        const dx = letterX - mouseX;
        const dy = letterY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Wave effect - letters move based on proximity
        const waveRadius = 150;
        const maxOffset = 25;

        if (distance < waveRadius) {
          const wave = Math.cos((distance / waveRadius) * Math.PI) * maxOffset;
          gsap.to(letterEl, {
            y: wave,
            rotation: (wave / maxOffset) * 12,
            duration: 0.2,
            ease: "power2.out",
            overwrite: "auto",
          });
        } else {
          gsap.to(letterEl, {
            y: 0,
            rotation: 0,
            duration: 0.5,
            ease: "elastic.out",
            overwrite: "auto",
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      className="relative flex items-center min-h-screen overflow-hidden"
      style={{
        backgroundImage: "url('/images/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        WebkitMaskImage: `linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,${Math.max(0, scrollOpacity * 0.5)}) 100%)`,
        maskImage: `linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,${Math.max(0, scrollOpacity * 0.5)}) 100%)`,
      }}
    >
      {/* Particle animation layer */}
      <ParticleBackground />

      {/* Background overlay for readability - minimal opacity */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.05)", zIndex: 2 }} />

      {/* Bottom Section - Design Credit, Tagline & Location */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10">
        <div className="container-custom py-8">
          <div className="grid grid-cols-2 gap-6 items-start">
            {/* Design Credit - Left with Glass Box */}
            <div
              data-reveal
              style={{
                border: "1px solid rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                padding: "1.25rem",
                maxWidth: "250px",
                minHeight: "280px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <h3 className="text-sm sm:text-base font-black text-white leading-tight mb-4 text-left">
                Designed & developed<br />
                by Kendrick Serrano <br />
                 ケンドリック・セラーノ

              </h3>
              <div className="border-t border-dashed border-white/30 my-4" />
              <p className="text-sm text-white/60 text-right">
                Crafting refined digital experiences with precision and purpose.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Location - Bottom Right */}
      <div className="absolute bottom-8 right-8 z-10" data-reveal>
        <p className="text-xs uppercase tracking-widest text-white/50 mb-2">Location</p>
        <p className="text-base text-white">Zamboanga City, Philippines</p>
      </div>


      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest z-10"
        style={{
          color: "rgba(0, 255, 136, 0.6)",
          textShadow: "0 0 10px rgba(0, 255, 136, 0.3)",
        }}
      >
        <svg
          className="w-4 h-4 mx-auto animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style={{ filter: "drop-shadow(0 0 8px rgba(0, 255, 136, 0.4))" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
