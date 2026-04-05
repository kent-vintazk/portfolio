"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import IntroImage from "@/Images/frameblur.png";
import {
  Code,
  Smartphone,
  GitBranch,
  Zap,
  Code2,
  Database,
  Square,
  Palette,
  Command,
  Workflow,
} from "lucide-react";

const projectScreenshots = [
  "/images/projects/Screenshot%202024-09-12%20131056.png",
  "/images/projects/Screenshot%202024-10-18%20230025.png",
  "/images/projects/Screenshot%202024-10-29%20175143.png",
  "/images/projects/Screenshot%202025-01-23%20174939.png",
  "/images/projects/Screenshot%202025-02-07%20095800.png",
  "/images/projects/Screenshot%202025-04-16%20112218.png",
  "/images/projects/Screenshot%202025-04-16%20121617.png",
  "/images/projects/Screenshot%202025-07-03%20184020.png",
];

const techIcons = [Code, Smartphone, GitBranch, Zap, Code2, Database, Square, Palette, Command, Workflow];

export default function IntroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrollPercent = Math.max(0, -rect.top / rect.height);

      gsap.to(section, {
        opacity: Math.max(0, 1 - scrollPercent),
        y: window.scrollY * 0.5,
        duration: 0.1,
        ease: "none",
        overwrite: "auto",
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projectScreenshots.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        backgroundImage: `url(${IntroImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "scroll",
        minHeight: "100vh",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* ===== MOBILE LAYOUT (flow-based, visible below md) ===== */}
      <div className="relative z-10 flex flex-col min-h-screen md:hidden">
        {/* Top — Quote + Title */}
        <div className="flex-shrink-0 pt-16 pb-6 px-5 text-center">
          <p className="text-xs max-w-md mx-auto text-white/60 leading-relaxed mb-5">
            Design is not just what it looks like and feels like. Design is how it works.
          </p>
          <h1
            className="font-black text-white leading-none pointer-events-none"
            style={{
              fontSize: "clamp(3rem, 18vw, 6rem)",
              textShadow: "0 0 40px rgba(0, 255, 136, 0.3)",
              letterSpacing: "-0.02em",
            }}
          >
            KENTO_O
          </h1>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom — Bio, Tools, Slideshow */}
        <div className="flex-shrink-0 bg-gradient-to-t from-black via-black/95 to-transparent pt-14 pb-8 px-5">
          {/* Bio */}
          <div className="pb-6 border-b border-white/10 mb-6">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-3">About Me</p>
            <p className="text-base font-light leading-relaxed text-white/75">
              A BSIT student at WMSU, with academic and professional experience in development, operation management and communication.
            </p>
          </div>

          {/* Tech Stack */}
          <div className="mb-6">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Tech Stack</p>
            <div className="overflow-hidden">
              <div className="flex gap-6 animate-marquee whitespace-nowrap">
                {[...techIcons, ...techIcons].map((Icon, i) => (
                  <Icon key={i} size={20} className="text-white/60 flex-shrink-0" />
                ))}
              </div>
            </div>
          </div>

          {/* Slideshow */}
          <div className="relative h-44 rounded-lg overflow-hidden bg-white/5 border border-white/10">
            {projectScreenshots.map((image, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  idx === currentSlide ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ))}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {projectScreenshots.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? "bg-white w-5" : "bg-white/30"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== DESKTOP LAYOUT (absolute positioned, visible from md up) ===== */}
      <>
        {/* Large KENTO_O Text */}
        <div className="hidden md:flex absolute top-2 left-0 right-0 z-10 pt-12 justify-center">
          <h1
            className="font-black text-white leading-none text-center pointer-events-none"
            style={{
              fontSize: "clamp(6rem, 20vw, 15rem)",
              textShadow: "0 0 40px rgba(0, 255, 136, 0.3)",
              letterSpacing: "-0.02em",
            }}
          >
            KENTO_O
          </h1>
        </div>

        {/* Top Quote */}
        <div className="hidden md:block absolute top-16 left-0 right-0 z-20 px-8">
          <p className="text-center text-sm sm:text-base max-w-2xl mx-auto text-white/60 leading-relaxed">
            Design is not just what it looks like and feels like. Design is how it works.
          </p>
        </div>

        {/* Bottom Section */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black via-black/95 to-transparent pt-20 pb-12">
          <div className="container-custom">
            <div className="grid grid-cols-2 gap-12 items-end">
              {/* Left — Bio & Tools */}
              <div className="space-y-8">
                <div className="pb-8 border-b border-white/10">
                  <p className="text-xs uppercase tracking-widest text-white/40 mb-4">About Me</p>
                  <p className="text-lg sm:text-xl font-light leading-relaxed text-white/75">
                    A BSIT student at WMSU, with academic and professional experience in development, operation management and communication.
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40 mb-5">Tech Stack</p>
                  <div className="overflow-hidden">
                    <div className="flex gap-8 animate-marquee whitespace-nowrap">
                      {[...techIcons, ...techIcons].map((Icon, i) => (
                        <Icon key={i} size={24} className="text-white/60 hover:text-white transition-colors flex-shrink-0" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — Slideshow */}
              <div className="relative h-56 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                {projectScreenshots.map((image, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      idx === currentSlide ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      backgroundImage: `url(${image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                ))}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {projectScreenshots.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        idx === currentSlide ? "bg-white w-6" : "bg-white/30 hover:bg-white/50"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </section>
  );
}