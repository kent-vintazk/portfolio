"use client";

import { useEffect, useState } from "react";

type Phase = "loading" | "exiting" | "done";

export default function KENTO_O() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [diceRotation, setDiceRotation] = useState({ x: 20, y: 30 });
  const [diceY, setDiceY] = useState(0);
  const [diceScale, setDiceScale] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const loadingDuration = 2000;

    const animationInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(elapsed / loadingDuration, 1);
      setProgress(currentProgress);

      setDiceRotation({
        x: 20 + currentProgress * 720,
        y: 30 + currentProgress * 720,
      });

      const bounceProgress = (currentProgress * 5) % 1;
      const easeOut = 1 - Math.pow(1 - bounceProgress, 3);
      const bounce = Math.sin(easeOut * Math.PI) * 60;
      setDiceY(-bounce);

      const squash = 0.85 + Math.sin(easeOut * Math.PI) * 0.15;
      setDiceScale(squash);

      if (currentProgress >= 1) {
        clearInterval(animationInterval);
        setPhase("exiting");
      }
    }, 16);

    return () => clearInterval(animationInterval);
  }, []);

  useEffect(() => {
    if (phase === "exiting") {
      const exitTimer = setTimeout(() => setPhase("done"), 750);
      return () => clearTimeout(exitTimer);
    }
  }, [phase]);

  if (phase === "done") return null;

  const renderDots = (count: number) => {
    const patterns: Record<number, [number, number][]> = {
      1: [[50, 50]],
      2: [[25, 25], [75, 75]],
      3: [[25, 25], [50, 50], [75, 75]],
      4: [[25, 25], [25, 75], [75, 25], [75, 75]],
      5: [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]],
      6: [[25, 25], [25, 50], [25, 75], [75, 25], [75, 50], [75, 75]],
    };

    return patterns[count]?.map((pos, idx) => (
      <div
        key={idx}
        style={{
          position: "absolute",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: "#d0303c",
          left: `${pos[0]}%`,
          top: `${pos[1]}%`,
          transform: "translate(-50%, -50%)",
        }}
      />
    ));
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
      style={{
        transform: phase === "exiting" ? "translateY(-100%)" : "translateY(0)",
        transition: phase === "exiting" ? "transform 750ms cubic-bezier(0.76, 0, 0.24, 1)" : "none",
      }}
    >
      <div
        style={{
          perspective: "1000px",
          marginBottom: "40px",
          width: "120px",
          height: "120px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "120px",
            height: "120px",
            transformStyle: "preserve-3d",
            transform: `rotateX(${diceRotation.x}deg) rotateY(${diceRotation.y}deg) translateY(${diceY}px) scale(${diceScale})`,
            transition: phase === "exiting" ? "transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)" : "none",
          }}
        >
          {/* Front Face - 1 dot */}
          <div
            style={{
              position: "absolute",
              width: "120px",
              height: "120px",
              background: "#ffffff",
              left: "-60px",
              top: "-60px",
              transform: "translateZ(60px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              {renderDots(1)}
            </div>
          </div>

          {/* Back Face - 6 dots */}
          <div
            style={{
              position: "absolute",
              width: "120px",
              height: "120px",
              background: "#cccccc",
              left: "-60px",
              top: "-60px",
              transform: "rotateY(180deg) translateZ(60px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              {renderDots(6)}
            </div>
          </div>

          {/* Right Face - 3 dots */}
          <div
            style={{
              position: "absolute",
              width: "120px",
              height: "120px",
              background: "#f0f0f0",
              left: "-60px",
              top: "-60px",
              transform: "rotateY(90deg) translateZ(60px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              {renderDots(3)}
            </div>
          </div>

          {/* Left Face - 4 dots */}
          <div
            style={{
              position: "absolute",
              width: "120px",
              height: "120px",
              background: "#e0e0e0",
              left: "-60px",
              top: "-60px",
              transform: "rotateY(-90deg) translateZ(60px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              {renderDots(4)}
            </div>
          </div>

          {/* Top Face - 5 dots */}
          <div
            style={{
              position: "absolute",
              width: "120px",
              height: "120px",
              background: "#eeeeee",
              left: "-60px",
              top: "-60px",
              transform: "rotateX(90deg) translateZ(60px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              {renderDots(5)}
            </div>
          </div>

          {/* Bottom Face - 2 dots */}
          <div
            style={{
              position: "absolute",
              width: "120px",
              height: "120px",
              background: "#dddddd",
              left: "-60px",
              top: "-60px",
              transform: "rotateX(-90deg) translateZ(60px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              {renderDots(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Loading text */}
      <div
        className="relative select-none font-black uppercase tracking-[0.02em]"
        style={{
          fontSize: "clamp(3rem, 10vw, 8rem)",
          lineHeight: 1,
        }}
      >
        <span className="block text-white/20">KENTO_O</span>
        <span
          className="absolute top-0 left-0 text-white overflow-hidden"
          style={{
            width: `${progress * 100}%`,
            transition: "width 0.05s linear",
          }}
        >
          KENTO_O
        </span>
      </div>
    </div>
  );
}
