"use client";

import { useMemo, useState, useEffect } from "react";

interface EmberProps {
  count?: number;
}

export default function Embers({ count = 40 }: EmberProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 20,
        duration: Math.random() * 25 + 15,
        hue: Math.random() > 0.5 ? "#FF5722" : "#FFC107",
        opacity: Math.random() * 0.4 + 0.25,
      })),
    [count]
  );

  if (!mounted) return null;

  return (
    <div
      aria-hidden
      data-suck
      data-testid="embers-layer"
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            bottom: "-10vh",
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: p.hue,
            boxShadow: `0 0 ${p.size * 3}px ${p.hue}`,
            ["--ember-op" as string]: p.opacity,
            animation: `float-ember ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}