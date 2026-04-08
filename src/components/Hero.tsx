"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ParticleBackground from "./ParticleBackground";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 2.8 });

    // Profile image reveal
    const profileEl = document.querySelector(".hero-profile");
    if (profileEl) {
      tl.fromTo(
        profileEl,
        { opacity: 0, scale: 1.1, filter: "blur(8px)" },
        {
          opacity: 0.85,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power2.out",
        }
      );
    }

    // Headline lines reveal
    if (headlineRef.current) {
      const lines = headlineRef.current.querySelectorAll(".hero-line");
      tl.fromTo(
        lines,
        { clipPath: "inset(100% 0 0 0)", y: 60 },
        {
          clipPath: "inset(0% 0 0 0)",
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.15,
        }
      );
    }

    // Subtitle fade in
    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.5"
      );
    }

    // Contact info
    if (contactRef.current) {
      const items = contactRef.current.querySelectorAll(".contact-item");
      tl.fromTo(
        items,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
        },
        "-=0.4"
      );
    }

    // Social links
    if (socialsRef.current) {
      const links = socialsRef.current.querySelectorAll(".social-link");
      tl.fromTo(
        links,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.08,
        },
        "-=0.3"
      );
    }
  }, []);

  return (
    <>
      {/* Import serif font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,700;0,6..96,900;1,6..96,400;1,6..96,700;1,6..96,900&display=swap');
      `}</style>

      <section
        ref={sectionRef}
        id="hero-section"
        className="relative z-20 flex flex-col justify-center items-center min-h-screen overflow-hidden bg-black"
      >
        {/* Blurred Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/images/bg3.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            filter: "blur(12px)",
            transform: "scale(1.05)",
          }}
        />
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 z-0 bg-black/40" />

        <ParticleBackground />

        {/* Main Content - Centered */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-6 sm:px-10 lg:px-20">
          {/* Big Headline with Profile Image */}
          <div className="relative">
            {/* Profile Image - sits behind the text */}
            <div
              className="hero-profile absolute top-1/2 left-0 -translate-x-[15%] -translate-y-[40%] w-[clamp(160px,22vw,320px)] aspect-[3/4] z-0 opacity-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/profile.png"
                alt="Kendrick Serrano"
                className="w-full h-full object-cover grayscale-[30%]"
                style={{
                  maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
                }}
              />
            </div>

            <h1
              ref={headlineRef}
              className="relative z-10"
              style={{
                fontFamily: "'Bodoni Moda', serif",
                fontWeight: 100,
                lineHeight: 0.9,
                color: "#F0EDE6",
                letterSpacing: "-0.20em"
              }}
            >
              <span
                className="hero-line block text-[clamp(2.5rem,8vw,7rem)] ml-20"
                style={{ clipPath: "inset(100% 0 0 0)" }}
              >
                LET&apos;S CREATE
              </span>
              <span
                className=" hero-line block text-[clamp(2.5rem,8vw,7rem)] ml-[20vw]"
                style={{ clipPath: "inset(100% 0 0 0)" }}
              >
                PROJECTS THAT
              </span>
              <span
                className="hero-line block text-[clamp(2.5rem,8vw,7rem)] ml-40"
                style={{ clipPath: "inset(100% 0 0 0)" }}
              >
                STAND OUT.
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="mt-8 sm:mt-12 text-center text-sm sm:text-base text-white/60 max-w-md leading-relaxed opacity-0"
            style={{ fontFamily: "sans-serif", letterSpacing: "0.02em" }}
          >
            Reach out for collaborations, commissions,
            <br />
            or just to connect.
          </p>

          {/* Contact Info */}
          <div
            ref={contactRef}
            className="mt-10 sm:mt-14 flex flex-col items-center gap-4"
          >
            <a
              href="mailto:your@email.com"
              className="contact-item text-[clamp(0.9rem,2.5vw,1.4rem)] font-semibold tracking-wider text-white/90 hover:text-white transition-colors duration-300 opacity-0"
              style={{
    fontFamily: "'Bodoni Moda', serif",
                    letterSpacing: "-0.01em",
              }}
            >
              kendrickserrano7@gmail.com
            </a>
            <p
              className="contact-item text-[clamp(0.9rem,2.5vw,1.3rem)] text-white/70 opacity-0"
              style={{
                fontFamily: "'Bodoni Moda', serif",
                letterSpacing: "0.05em",
              }}
            >
              Zamboanga City, Philippines
            </p>
          </div>
        </div>

        {/* Bottom Social Links */}
        <div
          ref={socialsRef}
          className="absolute bottom-0 left-0 right-0 z-"
        >
          <div className="flex items-center justify-between px-6 sm:px-10 lg:px-16 py-5">
            <a
              href="#"
              className="social-link text-xs sm:text-sm uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors duration-300 opacity-0"
            >
              Instagram
            </a>
            <a
              href="#"
              className="social-link text-xs sm:text-sm uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors duration-300 opacity-0"
            >
              GitHub
            </a>
            <a
              href="#"
              className="social-link text-xs sm:text-sm uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors duration-300 opacity-0"
            >
              LinkedIn
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest z-10"
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </section>
    </>
  );
}