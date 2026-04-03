"use client";

import { useEffect, useState } from "react";

type Phase = "loading" | "exiting" | "done";

export default function KENTO_O() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress: 0-100% over 2 seconds
    const startTime = Date.now();
    const loadingDuration = 2000; // 2 seconds for loading

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / loadingDuration) * 100, 100);
      setProgress(newProgress);

      // When loading reaches 100%, start exit animation
      if (newProgress >= 100) {
        clearInterval(progressInterval);
        setPhase("exiting");
      }
    }, 16); // ~60fps

    return () => clearInterval(progressInterval);
  }, []);

  // Exit animation after loading completes
  useEffect(() => {
    if (phase === "exiting") {
      const exitTimer = setTimeout(() => setPhase("done"), 750);
      return () => clearTimeout(exitTimer);
    }
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center gap-8"
      style={{
        transform: phase === "exiting" ? "translateY(-100%)" : "translateY(0)",
        transition: phase === "exiting" ? "transform 750ms cubic-bezier(0.76, 0, 0.24, 1)" : "none",
      }}
    >
      {/* Loading text with brightness effect */}
      <div className="relative select-none" style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}>
        {/* Background text (dim) */}
        <span
          className="absolute font-black uppercase tracking-[0.02em] text-white/20"
          style={{
            left: 0,
            top: 0,
          }}
        >
          KENTO_O
        </span>

        {/* Bright text with gradient overlay (0-100% width based on progress) */}
        <span
          className="absolute font-black uppercase tracking-[0.02em] text-white overflow-hidden"
          style={{
            left: 0,
            top: 0,
            width: `${progress}%`,
            transition: "width 0.05s linear",
          }}
        >
          KENTO_O
        </span>
      </div>

      {/* Percentage counter */}
      <div className="text-center">
        <span className="text-white/60 text-sm uppercase tracking-widest font-medium">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}
