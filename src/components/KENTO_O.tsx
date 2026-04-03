"use client";

import { useEffect, useState } from "react";

type Phase = "entering" | "visible" | "exiting" | "done";

export default function KENTO_O() {
  const [phase, setPhase] = useState<Phase>("entering");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("visible"), 600);
    const t2 = setTimeout(() => setPhase("exiting"), 1800);
    const t3 = setTimeout(() => setPhase("done"), 2650);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      style={{
        transform: phase === "exiting" ? "translateY(-100%)" : "translateY(0)",
        transition: phase === "exiting" ? "transform 750ms cubic-bezier(0.76, 0, 0.24, 1)" : "none",
      }}
    >
      <span
        className="text-white font-black uppercase tracking-[0.02em] select-none"
        style={{
          fontSize: "clamp(3rem, 10vw, 8rem)",
          opacity: phase === "entering" ? 0 : 1,
          transform: phase === "entering" ? "scale(0.88)" : "scale(1)",
          transition: "opacity 500ms ease, transform 500ms ease",
        }}
      >
       KENTO_O
      </span>
    </div>
  );
}
