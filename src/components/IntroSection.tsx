"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

const Portal3D = dynamic(() => import("./Portal3D"), { ssr: false });

const r4 = (n: number) => Math.round(n * 10000) / 10000;

// Pre-computed tick marks (avoids SSR/client float mismatch)
const TICK_MARKS = Array.from({ length: 48 }, (_, i) => {
  const a = (i / 48) * Math.PI * 2;
  const r1 = 278, r2 = i % 12 === 0 ? 260 : i % 4 === 0 ? 267 : 272;
  return { x1: r4(290 + r1 * Math.cos(a)), y1: r4(290 + r1 * Math.sin(a)), x2: r4(290 + r2 * Math.cos(a)), y2: r4(290 + r2 * Math.sin(a)) };
});

const DIAMOND_NODES = [0, 60, 120, 180, 240, 300].map(deg => {
  const a = (deg * Math.PI) / 180;
  return { x: r4(240 + 224 * Math.cos(a)), y: r4(240 + 224 * Math.sin(a)) };
});

// Full Elder Futhark rune sequence for the ancient text rings
const RUNES_OUTER = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ · ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ · ᚠᚢᚦᚨᚱᚲ ·";
const RUNES_INNER = "ᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟᚠᚢᚦᚨᚱᚲᚷᚹ · VINTAZK · ᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟᚠ ·";

export default function IntroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const particles = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2.5 + 0.5,
      duration: Math.random() * 8 + 4,
      delay: Math.random() * 6,
      opacity: Math.random() * 0.35 + 0.05,
    })),
  []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Bebas+Neue&display=swap');

        .intro-section {
          background: radial-gradient(ellipse at 50% 50%, #1c0800 0%, #0d0400 45%, #000 100%);
        }

        /* Ambient particles */
        @keyframes floatParticle {
          0%,100% { transform: translateY(0) translateX(0); opacity: var(--op); }
          50%      { transform: translateY(-15px) translateX(8px); }
        }
        .particle { animation: floatParticle var(--dur) ease-in-out infinite var(--delay); opacity: var(--op); }

        /* Spinning rings */
        @keyframes spinCW  { to { transform: translate(-50%,-50%) rotate(360deg);  } }
        @keyframes spinCCW { to { transform: translate(-50%,-50%) rotate(-360deg); } }
        @keyframes ringPulse { 0%,100% { opacity:.4; } 50% { opacity:.9; } }

        .ring-outer { animation: spinCW  70s linear infinite, ringPulse 6s ease-in-out infinite; }
        .ring-mid   { animation: spinCCW 45s linear infinite, ringPulse 4s ease-in-out infinite 1s; }
        .ring-inner { animation: spinCW  28s linear infinite, ringPulse 3s ease-in-out infinite .5s; }
        .ring-rune1 { animation: spinCCW 55s linear infinite; }
        .ring-rune2 { animation: spinCW  38s linear infinite; }

        /* Nebula glow */
        @keyframes nebulaBreath {
          0%,100% { opacity:.5; transform:translate(-50%,-50%) scale(1); }
          50%      { opacity:.8; transform:translate(-50%,-50%) scale(1.1); }
        }
        .nebula { animation: nebulaBreath 5s ease-in-out infinite; }

        /* Title entrance */
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(28px); filter:blur(8px); }
          to   { opacity:1; transform:translateY(0);    filter:blur(0);   }
        }
        .fade-up { animation: fadeUp 1.3s cubic-bezier(.16,1,.3,1) forwards; opacity:0; }

        @keyframes fadeLeft {
          from { opacity:0; transform:translateX(-32px); filter:blur(6px); }
          to   { opacity:1; transform:translateX(0);      filter:blur(0);   }
        }
        .fade-left { animation: fadeLeft 1.3s cubic-bezier(.16,1,.3,1) forwards; opacity:0; }

        @keyframes fadeRight {
          from { opacity:0; transform:translateX(32px); filter:blur(6px); }
          to   { opacity:1; transform:translateX(0);    filter:blur(0);   }
        }
        .fade-right { animation: fadeRight 1.3s cubic-bezier(.16,1,.3,1) forwards; opacity:0; }

        /* Fire gradient */
        .text-fire {
          background: linear-gradient(90deg,#ff6a00 0%,#ee9b00 40%,#94d82d 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }

        /* Scroll indicator */
        @keyframes scrollBounce {
          0%,100% { transform:translateY(0);   opacity:.5; }
          50%      { transform:translateY(8px); opacity:1;  }
        }
        .scroll-indicator { animation: scrollBounce 2s ease-in-out infinite; }

        /* Bottom info bar */
        .info-mono {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          color: rgba(255,255,255,0.28);
          text-transform: uppercase;
        }

        /* Runic SVG text */
        .rune-text-outer {
          font-family: serif;
          font-size: 13px;
          letter-spacing: 0.22em;
          fill: rgba(255,150,40,0.38);
        }
        .rune-text-inner {
          font-family: serif;
          font-size: 11px;
          letter-spacing: 0.18em;
          fill: rgba(255,190,60,0.28);
        }
        .orbit-text {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          letter-spacing: 0.3em;
          fill: rgba(255,190,80,0.35);
          text-transform: uppercase;
        }
      `}} />

      <section
        className="intro-section relative w-full overflow-hidden"
        style={{ height: "100vh", minHeight: "100vh" }}
      >
        {/* Ambient particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {mounted && particles.map(p => (
            <div key={p.id} className="particle absolute rounded-full bg-orange-200"
              style={{ left: p.left, top: p.top, width: p.size, height: p.size,
                "--op": p.opacity, "--dur": `${p.duration}s`, "--delay": `${p.delay}s`,
              } as React.CSSProperties} />
          ))}
        </div>

        {/* 3D Portal — rendered via fixed-position Portal3D */}
        {mounted && <Portal3D />}

        {/* ── CSS decorative rings centered over the portal ── */}
        <div className="absolute pointer-events-none"
          style={{ left: "50%", top: "50%", zIndex: 3 }}>

          {/* Warm nebula glow */}
          <div className="nebula" style={{
            position: "absolute", left: "50%", top: "50%",
            transform: "translate(-50%,-50%)",
            width: 380, height: 380, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,120,0,0.16) 0%, rgba(255,60,0,0.07) 50%, transparent 70%)",
          }} />

          {/* Outer dashed ring with heavy tick marks */}
          <svg className="ring-outer absolute"
            style={{ left:"50%", top:"50%", transform:"translate(-50%,-50%)" }}
            width={600} height={600} viewBox="0 0 580 580">
            <circle cx={290} cy={290} r={278} fill="none"
              stroke="rgba(255,130,0,0.28)" strokeWidth="1" strokeDasharray="3 9" />
            {TICK_MARKS.map((t, i) => (
              <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                stroke="rgba(255,150,40,0.45)"
                strokeWidth={i % 12 === 0 ? 2 : i % 4 === 0 ? 1.2 : 0.7} />
            ))}
          </svg>

          {/* Outer ancient rune ring — slow CCW */}
          <svg className="ring-rune1 absolute"
            style={{ left:"50%", top:"50%", transform:"translate(-50%,-50%)", overflow:"visible" }}
            width={620} height={620} viewBox="0 0 620 620">
            <defs>
              <path id="runePathOuter"
                d="M310,310 m-298,0 a298,298 0 1,1 596,0 a298,298 0 1,1 -596,0" />
            </defs>
            <text className="rune-text-outer">
              <textPath href="#runePathOuter" startOffset="0%">{RUNES_OUTER}</textPath>
            </text>
          </svg>

          {/* Mid dashed ring with diamond nodes */}
          <svg className="ring-mid absolute"
            style={{ left:"50%", top:"50%", transform:"translate(-50%,-50%)" }}
            width={500} height={500} viewBox="0 0 480 480">
            <circle cx={240} cy={240} r={228} fill="none"
              stroke="rgba(255,150,50,0.2)" strokeWidth="1" strokeDasharray="2 7" />
            {DIAMOND_NODES.map((d, i) => (
              <rect key={i} x={d.x-3.5} y={d.y-3.5} width={7} height={7}
                fill="none" stroke="rgba(255,200,80,0.6)" strokeWidth="1.2"
                transform={`rotate(45 ${d.x} ${d.y})`} />
            ))}
          </svg>

          {/* Inner rune ring — slow CW */}
          <svg className="ring-rune2 absolute"
            style={{ left:"50%", top:"50%", transform:"translate(-50%,-50%)", overflow:"visible" }}
            width={430} height={430} viewBox="0 0 430 430">
            <defs>
              <path id="runePathInner"
                d="M215,215 m-198,0 a198,198 0 1,1 396,0 a198,198 0 1,1 -396,0" />
            </defs>
            <text className="rune-text-inner">
              <textPath href="#runePathInner" startOffset="5%">{RUNES_INNER}</textPath>
            </text>
          </svg>

          {/* Innermost solid ring */}
          <svg className="ring-inner absolute"
            style={{ left:"50%", top:"50%", transform:"translate(-50%,-50%)" }}
            width={380} height={380} viewBox="0 0 370 370">
            <circle cx={185} cy={185} r={174} fill="none"
              stroke="rgba(255,130,0,0.15)" strokeWidth="0.8" strokeDasharray="1 5" />
          </svg>

          {/* Curved orbit info text */}
          <svg style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)", overflow:"visible" }}
            width={530} height={530} viewBox="0 0 530 530">
            <defs>
              <path id="orbitTop"    d="M265,265 m-240,0 a240,240 0 1,1 480,0" />
              <path id="orbitBottom" d="M265,265 m-215,0 a215,215 0 0,0 430,0" />
            </defs>
            <text className="orbit-text">
              <textPath href="#orbitTop" startOffset="10%">
                BSIT Student at WMSU · Full-Stack Developer · Zamboanga ·
              </textPath>
            </text>
            <text className="orbit-text" style={{ fill:"rgba(255,190,80,0.2)" }}>
              <textPath href="#orbitBottom" startOffset="18%">
                vintazk · designer · builder ·
              </textPath>
            </text>
          </svg>
        </div>

        {/* ── Title readability scrim — dims portal behind the text only ── */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(780px, 75vw)",
            height: "min(460px, 60vh)",
            zIndex: 9,
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.38) 40%, rgba(0,0,0,0.12) 65%, transparent 85%)",
          }}
        />

        {/* ── TITLE ── */}
        <div className="absolute pointer-events-none"
          style={{ left:"50%", top:"50%", transform:"translate(-50%,-50%)", zIndex:10, textAlign:"center", width:"100%" }}>

          <div className="fade-up" style={{
            fontFamily:"'Cormorant Garamond', serif", fontWeight:600,
            fontSize:"clamp(2.5rem,8vw,6rem)", color:"#ffffff",
            letterSpacing:"0.15em", lineHeight:1, textTransform:"uppercase",
            textShadow:"0 2px 18px rgba(0,0,0,0.85), 0 0 40px rgba(0,0,0,0.7), 0 0 80px rgba(255,120,0,0.35)",
            animationDelay:"0.1s", display:"block",
            marginBottom:"-0.05em",
          }}>Kendrick</div>

          <div style={{ display:"flex", alignItems:"baseline", justifyContent:"center", gap:"0.2em" }}>
            <span className="fade-left" style={{
              fontFamily:"'Cormorant Garamond', serif", fontStyle:"italic", fontWeight:300,
              fontSize:"clamp(2rem,7vw,5rem)", color:"rgba(255,200,130,1)",
              letterSpacing:"0.02em", lineHeight:1, animationDelay:"0.4s",
              textShadow:"0 2px 16px rgba(0,0,0,0.85), 0 0 30px rgba(0,0,0,0.6)",
            }}>Ken</span>

            <span className="fade-right text-fire" style={{
              fontFamily:"'Bebas Neue', sans-serif",
              fontSize:"clamp(3.5rem,14vw,10rem)", letterSpacing:"-0.02em",
              lineHeight:0.9, animationDelay:"0.6s",
              filter:"drop-shadow(0 2px 14px rgba(0,0,0,0.85)) drop-shadow(0 0 26px rgba(0,0,0,0.6))",
            }}>_O</span>
          </div>

          <div className="fade-up" style={{
            fontFamily:"'Cormorant Garamond', serif", fontStyle:"italic",
            fontSize:"clamp(0.7rem,1.5vw,0.95rem)", color:"rgba(255,220,170,0.85)",
            letterSpacing:"0.06em", marginTop:"1em", animationDelay:"1s", display:"block",
            textShadow:"0 1px 10px rgba(0,0,0,0.9), 0 0 18px rgba(0,0,0,0.7)",
          }}>
            "Design is not just what it looks like. Design is how it works."
          </div>
        </div>

        {/* ── Scroll indicator (above the bottom bar) ── */}
        <div className="absolute pointer-events-none scroll-indicator"
          style={{ bottom:"5rem", left:"50%", transform:"translateX(-50%)", zIndex:20,
            display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
          <div style={{
            fontFamily:"'Cormorant Garamond', serif", fontSize:10, letterSpacing:"0.35em",
            color:"rgba(255,255,255,0.22)", textTransform:"uppercase",
          }}>Scroll to Explore</div>
          <div style={{ width:1, height:36, background:"linear-gradient(to bottom, rgba(255,140,0,0.4), transparent)" }} />
        </div>

        {/* ── Bottom info bar — coordinates + address ── */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
          style={{ padding:"1rem 2.5rem", display:"flex", alignItems:"center", justifyContent:"space-between" }}>

          <div className="info-mono">14.1407° N &nbsp;·&nbsp; 122.1167° E</div>

          <div className="info-mono" style={{ textAlign:"center" }}>
            Developer &nbsp;·&nbsp; Designer &nbsp;·&nbsp; Builder
          </div>

          <div className="info-mono">WMSU &nbsp;—&nbsp; Zamboanga City</div>
        </div>
      </section>
    </>
  );
}