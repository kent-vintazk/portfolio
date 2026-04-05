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
  const manifestoRef = useRef<HTMLDivElement>(null);
  const [scrollOpacity, setScrollOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      const opacity = Math.max(0, 1 - scrollY / (heroHeight * 1.2));
      setScrollOpacity(opacity);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 2.8 });

    // Manifesto text reveal
    if (manifestoRef.current) {
      const rows = manifestoRef.current.querySelectorAll(".manifesto-row");
      tl.fromTo(
        rows,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.2,
        }
      );

      // Dots pop in
      const dots = manifestoRef.current.querySelectorAll(".manifesto-dot");
      tl.fromTo(
        dots,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.4,
          ease: "back.out(3)",
          stagger: 0.05,
        },
        "-=0.6"
      );
    }

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

    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 18, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" },
        "-=0.4"
      );
    }

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

        const dx = letterX - mouseX;
        const dy = letterY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

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
      <ParticleBackground />

      {/* Manifesto Text - Upper Middle */}
      <div
        ref={manifestoRef}
        className="absolute top-[12%] left-1/2 -translate-x-1/2 z-10 w-full max-w-xl px-6 pointer-events-none"
      >
        {/* Row 1 */}
        <div className="manifesto-row flex items-start justify-between gap-4 mb-8 opacity-0">
          <span className="manifesto-dot w-2 h-2 bg-white/80 mt-2 flex-shrink-0" />
          <p
            className="text-center font-black text-lg leading-tight"
            style={{ color: "#F5F5F5" }}
          >
            Design shapes the world
            <br />
            not as decoration, but as a
            <br />
            force that leaves a mark.
          </p>
          <span className="manifesto-dot w-2 h-2 bg-white/80 mt-2 flex-shrink-0" />
        </div>

        {/* Row 2 */}
        <div className="manifesto-row flex items-start justify-between gap-4 mb-8 opacity-0">
          <span className="manifesto-dot w-2 h-2 bg-white/80 mt-3 flex-shrink-0" />
          <p
            className="text-center font-black text-lg leading-tight"
            style={{ color: "#F5F5F5" }}
          >
            It defines how your
            <br />
            brand is perceived and
            <br />
            how it&apos;s experienced.
          </p>
          <span className="manifesto-dot w-2 h-2 bg-white/80 mt-3 flex-shrink-0" />
        </div>

        {/* Row 3 */}
        <div className="manifesto-row flex items-start justify-between gap-4 opacity-0">
          <span className="manifesto-dot w-2 h-2 bg-white/80 mt-1 flex-shrink-0" />
          <p
            className="text-center font-black text-lg leading-tight"
            style={{ color: "#F5F5F5" }}
          >
            Leave yours.
          </p>
          <span className="manifesto-dot w-2 h-2 bg-white/80 mt-1 flex-shrink-0" />
        </div>
      </div>

      {/* Location - Fixed to very right */}
      <div className="absolute bottom-12 right-8 z-10 text-right">
        <p className="text-xs uppercase tracking-widest text-white/40 mb-2">Location</p>
        <p className="text-sm text-white">
          Zamboanga City
          <br />
          Philippines
        </p>
      </div>

      {/* Bottom Section - Glass Box */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/10">
        <div className="container-custom py-12">
          <div
            style={{
              border: "1px solid rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              maxWidth: "400px",
            }}
          >
            <h3 className="text-sm sm:text-base font-black text-white leading-tight mb-6">
              Designed & developed
              <br />
              by Kendrick Serrano
              <br />
              <span className="text-white/50">ケンドリック・セラーノ</span>
            </h3>
            <div className="border-t border-white/20 my-4" />
            <p className="text-xs text-white/50 leading-relaxed">
              Crafting refined digital experiences with precision and purpose.
            </p>
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