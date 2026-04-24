"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
  slug?: string;
  title: string;
  description: string;
  tags: string[];
  image?: string;
  href?: string;
  repo?: string;
}

export default function ProjectCard({ slug, title, description, tags, image, href, repo }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    glow.style.opacity = "1";
    glow.style.background = `radial-gradient(350px circle at ${x}px ${y}px, rgba(255,106,0,0.15), transparent 70%)`;
  };

  const handleMouseLeave = () => {
    if (glowRef.current) {
      glowRef.current.style.opacity = "0";
    }
  };

  return (
    <article
      ref={cardRef}
      className="card flex flex-col group relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cursor-tracking glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none"
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Project image */}
        {image && (
          <div className="relative w-full aspect-video mb-6 overflow-hidden -mx-6 -mt-6" style={{ width: "calc(100% + 3rem)" }}>
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="flex items-start justify-between mb-6">
          {/* Folder icon (shown when no image) */}
          {!image && (
            <svg className="w-7 h-7 text-[#ff6a00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
              />
            </svg>
          )}
          {image && <div />}

          {/* Links */}
          <div className="flex items-center gap-3">
            {repo && (
              <a
                href={repo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
                className="text-white/25 hover:text-white transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.6-4.04-1.6-.54-1.38-1.32-1.75-1.32-1.75-1.08-.74.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.06 1.82 2.78 1.3 3.46.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02.004 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            )}
            {href && (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Live demo"
                className="text-white/25 hover:text-white transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>

        <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-[#ff6a00] transition-colors duration-300">
          {slug ? (
            <Link href={`/projects/${slug}`} className="hover:text-[#ff6a00]">
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: "var(--fg-muted)" }}>
          {description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 border border-white/10 text-white/50 text-xs font-medium tracking-wide"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
