"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ParticleBackground from "./ParticleBackground";
import SpiralImage from "@/Images/spiral.png";

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
      id="hero-section"
      className="relative flex items-center min-h-screen overflow-hidden"
      style={{
        backgroundImage: "url('/images/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Particle animation layer */}
      <ParticleBackground />

      {/* Center Tagline */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center pointer-events-none" data-reveal>
        <p className="text-xs sm:text-sm uppercase tracking-widest text-white/25">
          Design with Purpose, Build with Precision
        </p>
      </div>

      {/* Bottom Section - Redesigned Layout */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10">
        <div className="container-custom py-12">
          <div className="grid grid-cols-3 gap-8 items-end">
            {/* Left - Social Links */}
            <div data-reveal>
              <div className="flex flex-col gap-3">
                <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Follow</p>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 hover:text-white transition-colors duration-300">
                  Instagram
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 hover:text-white transition-colors duration-300">
                  Facebook
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 hover:text-white transition-colors duration-300">
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Center - Glass Box */}
            <div
              data-reveal
              style={{
                border: "1px solid rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "240px",
              }}
            >
              <h3 className="text-sm sm:text-base font-black text-white leading-tight mb-6">
                Designed & developed<br />
                by Kendrick Serrano <br />
                <span className="text-white/50">ケンドリック・セラーノ</span>
              </h3>
              <div className="border-t border-white/20 my-4" />
              <p className="text-xs text-white/50 leading-relaxed">
                Crafting refined digital experiences with precision and purpose.
              </p>
            </div>

            {/* Right - Location */}
            <div data-reveal className="text-right">
              <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Location</p>
              <p className="text-sm text-white">Zamboanga City<br />Philippines</p>
            </div>
          </div>
        </div>
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
