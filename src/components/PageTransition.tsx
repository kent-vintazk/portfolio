"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function PageTransition() {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the initial page load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const overlay = overlayRef.current;
    if (!overlay) return;

    gsap
      .timeline()
      .set(overlay, { scaleY: 0, transformOrigin: "bottom" })
      .to(overlay, { scaleY: 1, duration: 0.35, ease: "power3.in" })
      .set(overlay, { transformOrigin: "top" })
      .to(overlay, { scaleY: 0, duration: 0.35, ease: "power3.out" });
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] pointer-events-none bg-[#4d65ff]"
      style={{ transform: "scaleY(0)" }}
    />
  );
}
