"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type Phase = "loading" | "spreading" | "done";

export default function KENTO_O() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [progress, setProgress] = useState(0);
  const keRef = useRef<HTMLDivElement>(null);
  const ntRef = useRef<HTMLDivElement>(null);
  const ooRef = useRef<HTMLDivElement>(null);

  // Loading phase
  useEffect(() => {
    const startTime = Date.now();
    const loadingDuration = 2000;

    const animationInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(elapsed / loadingDuration, 1);
      setProgress(currentProgress);

      if (currentProgress >= 1) {
        clearInterval(animationInterval);
        setPhase("spreading");
      }
    }, 16);

    return () => clearInterval(animationInterval);
  }, []);

  // Spreading phase animation
  useEffect(() => {
    if (phase === "spreading") {
      const tl = gsap.timeline();

      // KE moves to farthest left
      tl.to(
        keRef.current,
        { x: -window.innerWidth * 0.65 ,duration: 1.2, ease: "power3.inOut" },
        0
      );

      // NT moves left to middle area
      tl.to(
        ntRef.current,
        { x: -window.innerWidth * 0.3,duration: 1.2, ease: "power3.inOut" },
        0
      );

      // O_O stays in place (no movement)
      tl.to(
        ooRef.current,
        { x: 0, duration: 1.2, ease: "power3.inOut" },
        0
      );

      // O_O blink animation (like blinking eyes)
      // Start blinking after text has spread (1.5s delay)
      gsap.delayedCall(1.5, () => {
        gsap.timeline({ repeat: 2 }).to(ooRef.current, {
          scaleY: 0.1,
          duration: 0.15,
          ease: "sine.inOut",
        })
          .to(ooRef.current, {
            scaleY: 1,
            duration: 0.15,
            ease: "sine.inOut",
          }, 0.2)
          .to({}, {}, 0.6); // Delay between blinks
      });

      // Stay spread for 2 seconds, then done
      const exitTimer = setTimeout(() => {
        // Fade out KENTO_O smoothly
        gsap.to([keRef.current, ntRef.current, ooRef.current], {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
        });

        // After fade out, mark as done
        setTimeout(() => {
          setPhase("done");
        }, 800);
      }, 3200);

      return () => clearTimeout(exitTimer);
    }
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black flex items-end justify-end p-8"
      style={{
        opacity: 1,
      }}
    >
      {/* KENTO_O complete word in lower right, then spreads */}
      <div className="flex gap-0 items-end">
        {/* KE */}
        <div
          ref={keRef}
          className="relative select-none font-black uppercase tracking-[0.02em]"
          style={{
            fontSize: "clamp(2rem, 6vw, 4rem)",
            lineHeight: 1,
          }}
        >
          <span className="block text-white/20">KE</span>
          <span
            className="absolute top-0 left-0 text-white overflow-hidden"
            style={{
              width: `${Math.min(progress * 100, 100)}%`,
              transition: "width 0.05s linear",
            }}
          >
            KE
          </span>
        </div>

        {/* NT */}
        <div
          ref={ntRef}
          className="relative select-none font-black uppercase tracking-[0.02em]"
          style={{
            fontSize: "clamp(2rem, 6vw, 4rem)",
            lineHeight: 1,
          }}
        >
          <span className="block text-white/20">NT</span>
          <span
            className="absolute top-0 left-0 text-white overflow-hidden"
            style={{
              width: `${Math.min(progress * 100, 100)}%`,
              transition: "width 0.05s linear",
            }}
          >
            NT
          </span>
        </div>

        {/* O_O */}
        <div
          ref={ooRef}
          className="relative select-none font-black uppercase tracking-[0.02em]"
          style={{
            fontSize: "clamp(2rem, 6vw, 4rem)",
            lineHeight: 1,
          }}
        >
          <span className="block text-white/20">O_O</span>
          <span
            className="absolute top-0 left-0 text-white overflow-hidden"
            style={{
              width: `${Math.min(progress * 100, 100)}%`,
              transition: "width 0.05s linear",
            }}
          >
            O_O
          </span>
        </div>
      </div>

      {/* Progress percentage during loading */}
      {phase === "loading" && (
        <div className="absolute bottom-8 right-8 text-white/50 text-sm uppercase tracking-widest">
          {Math.round(progress * 100)}%
        </div>
      )}
    </div>
  );
}
