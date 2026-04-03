"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    // Small delay so DOM is settled after route change
    const timeout = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Fade in + slide up
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                once: true,
              },
            }
          );
        });

        // Blur to clear + fade
        gsap.utils.toArray<HTMLElement>("[data-reveal-blur]").forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 18, filter: "blur(8px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                once: true,
              },
            }
          );
        });

        // Heading clip-path reveal
        gsap.utils.toArray<HTMLElement>("[data-reveal-heading]").forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: "inset(100% 0 0 0)", y: 40 },
            {
              clipPath: "inset(0% 0 0 0)",
              y: 0,
              duration: 0.95,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                once: true,
              },
            }
          );
        });

        // Stagger children with blur
        gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]").forEach((parent) => {
          const children = parent.children;
          gsap.fromTo(
            children,
            { opacity: 0, y: 30, filter: "blur(6px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.1,
              scrollTrigger: {
                trigger: parent,
                start: "top 88%",
                once: true,
              },
            }
          );
        });
      });

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
