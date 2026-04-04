"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PageScaleTransitionProps {
  children: React.ReactNode;
}

export default function PageScaleTransition({ children }: PageScaleTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Start immediately with small box showing green background
    const tl = gsap.timeline();

    // Fade in small box
    tl.fromTo(
      container,
      {
        scale: 0.3,
        opacity: 0,
      },
      {
        scale: 0.3,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      },
      0
    );

    // Slowly increase/zoom in the small box over 2 seconds
    tl.to(
      container,
      {
        scale: 0.65,
        duration: 2,
        ease: "power1.inOut",
      },
      0.4
    );

    // Finally expand to full screen smoothly matching hero entrance
    tl.to(
      container,
      {
        scale: 1,
        duration: 1.2,
        ease: "power2.inOut",
      }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        transformOrigin: "center center",
        opacity: 0,
        scale: 0.3,
      }}
    >
      {children}
    </div>
  );
}
