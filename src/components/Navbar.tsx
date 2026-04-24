"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  // Wave effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (lettersRef.current.length === 0) return;

      lettersRef.current.forEach((letterEl) => {
        if (!letterEl) return;

        const letterRect = letterEl.getBoundingClientRect();
        const letterX = letterRect.left + letterRect.width / 2;
        const letterY = letterRect.top + letterRect.height / 2;

        // Distance from mouse
        const dx = letterX - e.clientX;
        const dy = letterY - e.clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Wave effect - letters move based on proximity
        const waveRadius = 120;
        const maxOffset = 20;

        if (distance < waveRadius) {
          const wave = Math.cos((distance / waveRadius) * Math.PI) * maxOffset;
          gsap.to(letterEl, {
            y: wave,
            rotation: (wave / maxOffset) * 10,
            duration: 0.15,
            ease: "power2.out",
            overwrite: "auto",
          });
        } else {
          gsap.to(letterEl, {
            y: 0,
            rotation: 0,
            duration: 0.4,
            ease: "elastic.out",
            overwrite: "auto",
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Home page: hide until Hero is visible. All other routes: always show.
  useEffect(() => {
    const isHome = pathname === "/";

    if (!isHome) {
      setShowNavbar(true);
      return;
    }

    const handleScroll = () => {
      const heroElement = document.getElementById("hero-section");
      if (!heroElement) {
        setShowNavbar(false);
        return;
      }
      const rect = heroElement.getBoundingClientRect();
      setShowNavbar(rect.top <= window.innerHeight && rect.bottom >= 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <header className={`fixed top-3 inset-x-0 z-50 bg-transparent transition-opacity duration-300 ${showNavbar ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
      <div className="container-custom flex items-center justify-center h-16 relative">

        {/* Desktop Nav - Centered */}
        <nav className="hidden md:flex items-center gap-8 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`link-underline text-sm font-medium tracking-wide uppercase ${
                pathname === link.href
                  ? "!text-[var(--foreground)] after:scale-x-100"
                  : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side - Theme Toggle (Absolute positioning) */}
        <div className="hidden md:flex absolute right-0">
          <ThemeToggle />
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white/50 hover:text-white transition-colors duration-300"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-lg border-t border-white/5">
          <nav className="container-custom py-8 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-medium uppercase tracking-wide transition-colors duration-300 ${
                  pathname === link.href ? "text-white" : "text-white/35 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
