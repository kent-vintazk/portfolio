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

export default function IntroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrollPercent = Math.max(0, -rect.top / rect.height);

      // Fade out and move with scroll direction
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

  // Auto-slide projects
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projectScreenshots.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-auto overflow-hidden"
      style={{
        backgroundImage: `url(${IntroImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "scroll",
        minHeight: "100vh",
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Large KENTO_O Text - Top */}
      <div className="absolute top-2 left-0 right-0 z-10 pt-12 flex justify-center">
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
      <div className="absolute top-16 left-0 right-0 z-20 px-8" data-reveal>
        <p className="text-center text-sm sm:text-base max-w-2xl mx-auto text-white/60 leading-relaxed">
          Design is not just what it looks like and feels like. Design is how it works.
        </p>
      </div>

      {/* Bottom Section - Bio & Tools with Slideshow */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black via-black/95 to-transparent pt-20 pb-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
            {/* Left - Bio & Tools */}
            <div data-reveal className="space-y-8">
              {/* Bio Card */}
              <div className="pb-8 border-b border-white/10">
                <p className="text-xs uppercase tracking-widest text-white/40 mb-4">About Me</p>
                <p className="text-lg sm:text-xl font-light leading-relaxed text-white/75">
                  A BSIT student at WMSU, with academic and professional experience in development, operation management and communication.
                </p>
              </div>

              {/* Tools Section */}
              <div>
                <p className="text-xs uppercase tracking-widest text-white/40 mb-5">Tech Stack</p>
                <div className="overflow-hidden">
                  <div className="flex gap-8 animate-marquee whitespace-nowrap">
                    {/* First set */}
                    <Code size={24} className="text-white/60 hover:text-white transition-colors flex-shrink-0" />
                    <Smartphone size={24} className="text-white/60 hover:text-white transition-colors flex-shrink-0" />
                    <GitBranch size={24} className="text-white/60 hover:text-white transition-colors flex-shrink-0" />
                    <Zap size={24} className="text-white/60 hover:text-white transition-colors flex-shrink-0" />
                    <Code2 size={24} className="text-white/60 hover:text-white transition-colors flex-shrink-0" />
                    <Database size={24} className="text-white/60 hover:text-white transition-colors flex-shrink-0" />
                    <Square size={24} className="text-white/60 hover:text-white transition-colors flex-shrink-0" />
                    <Palette size={24} className="text-white/60 hover:text-white transition-colors flex-shrink-0" />
                    <Command size={24} className="text-white/60 hover:text-white transition-colors flex-shrink-0" />
                    <Workflow size={24} className="text-white/60 hover:text-white transition-colors flex-shrink-0" />

                    {/* Duplicate for seamless loop */}
                    <Code size={24} className="text-white/60 hover:text-white transition-colors flex-shrink-0" />
                    <Smartphone size={24} className="text-white/60 hover:text-white transition-colors flex-shrink-0" />
                    <GitBranch size={24} className="text-white/60 hover:text-white transition-colors flex-shrink-0" />
                    <Zap size={24} className="text-white/60 hover:text-white transition-colors flex-shrink-0" />
                    <Code2 size={24} className="text-white/60 hover:text-white transition-colors flex-shrink-0" />
                    <Database size={24} className="text-white/60 hover:text-white transition-colors flex-shrink-0" />
                    <Square size={24} className="text-white/60 hover:text-white transition-colors flex-shrink-0" />
                    <Palette size={24} className="text-white/60 hover:text-white transition-colors flex-shrink-0" />
                    <Command size={24} className="text-white/60 hover:text-white transition-colors flex-shrink-0" />
                    <Workflow size={24} className="text-white/60 hover:text-white transition-colors flex-shrink-0" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Project Slideshow */}
            <div data-reveal className="relative h-48 sm:h-56 rounded-lg overflow-hidden bg-white/5 border border-white/10">
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

              {/* Slide indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {projectScreenshots.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === currentSlide
                        ? "bg-white w-6"
                        : "bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
