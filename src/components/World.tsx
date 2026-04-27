"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * WORLD.tsx
 *
 * The page the user lands on after passing through the portal.
 * Emerges from white light — starts with a full-screen radial white-blue
 * overlay that fades out to reveal the world below.
 *
 * Usage (App Router): place this file at  app/world/page.tsx
 *                     or render <WORLD /> as your destination component.
 *
 * Add your actual portfolio content inside the <main> tag below.
 */
export default function WORLD() {
  const [mounted, setMounted]   = useState(false);
  const [revealed, setRevealed] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const rafRef    = useRef<number>(0);

  // ── Mount gate ─────────────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    // Hold the fire-burst overlay long enough for the portal's vortex overlay
    // to have fully crossfaded in — then begin the ceremonial emergence fade.
    const t = setTimeout(() => setRevealed(true), 350);
    return () => clearTimeout(t);
  }, []);

  // ── Ambient particle field (Three.js) ──────────────────────────────────────
  // A gentle starfield / floating dust that reacts to the emergence
  useEffect(() => {
    const mount = canvasRef.current;
    if (!mount) return;

    const w = window.innerWidth, h = window.innerHeight;

    const scene    = new THREE.Scene();
    const cam      = new THREE.PerspectiveCamera(60, w / h, 0.1, 200);
    cam.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0, 0);
    mount.appendChild(renderer.domElement);

    const onResize = () => {
      cam.aspect = window.innerWidth / window.innerHeight;
      cam.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // Floating particles that drift gently
    const N = 3000;
    const pos = new Float32Array(N * 3);
    const vel = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      vel[i * 3]     = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002 + 0.0005;
      vel[i * 3 + 2] = 0;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: 0xff8a1a, size: 0.025, transparent: true,
        opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false,
      })
    );
    scene.add(pts);

    // Slow ring that expands — echoes the portal mouth
    const ringGeo = new THREE.BufferGeometry().setFromPoints(
      Array.from({ length: 129 }, (_, i) => {
        const a = (i / 128) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(a), Math.sin(a), 0);
      })
    );
    const ring = new THREE.Line(ringGeo, new THREE.LineBasicMaterial({
      color: 0xff4400, transparent: true, opacity: 0.22,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    ring.scale.setScalar(0.01);
    scene.add(ring);

    const timer = new THREE.Timer();
    let ringExpanded = false;

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      timer.update();
      const t  = timer.getElapsed();
      const dt = Math.min(timer.getDelta(), 0.05);

      // Drift particles
      for (let i = 0; i < N; i++) {
        pos[i * 3]     += vel[i * 3];
        pos[i * 3 + 1] += vel[i * 3 + 1];
        // Wrap
        if (pos[i * 3 + 1] > 9)  pos[i * 3 + 1] = -9;
        if (pos[i * 3]     > 15) pos[i * 3]     = -15;
        if (pos[i * 3]     < -15) pos[i * 3]    =  15;
      }
      geo.attributes.position.needsUpdate = true;

      // Expand portal echo ring from center outward
      if (!ringExpanded) {
        const s = ring.scale.x + dt * 1.5;
        ring.scale.setScalar(s);
        (ring.material as THREE.LineBasicMaterial).opacity = Math.max(0, 0.18 - s * 0.022);
        if (s > 8) ringExpanded = true;
      }

      // Slow camera drift
      cam.position.x = Math.sin(t * 0.04) * 0.3;
      cam.position.y = Math.cos(t * 0.055) * 0.18;

      renderer.render(scene, cam);
    };
    loop();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#0a0300] overflow-hidden">

      {/* Three.js ambient canvas */}
      <div
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* ── Emergence overlay: fades from fire burst to transparent ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 50,
          background:
            "radial-gradient(ellipse at center, #ffffff 0%, #ffd27a 25%, #ff6a00 55%, #4a0a00 100%)",
          opacity: revealed ? 0 : 1,
          transition: "opacity 2s cubic-bezier(0.4, 0, 0.6, 1)",
        }}
      />

      {/* ── World content ──────────────────────────────────────────── */}
      <main
        className="relative flex flex-col items-center justify-center min-h-screen px-6"
        style={{ zIndex: 10 }}
      >
        {/* Content fades in after the emergence overlay */}
        <div
          style={{
            opacity:    revealed ? 1 : 0,
            transform:  revealed ? "translateY(0) scale(1)" : "translateY(32px) scale(0.96)",
            transition: "opacity 1.6s ease-out 1.1s, transform 1.8s cubic-bezier(0.22, 1, 0.36, 1) 1.1s, filter 1.6s ease-out 1.1s",
            filter:     revealed ? "blur(0px)" : "blur(6px)",
          }}
          className="text-center"
        >
          {/*
           ╔══════════════════════════════════════╗
           ║  PUT YOUR PORTFOLIO CONTENT HERE     ║
           ║  This is the "WORLD" the user        ║
           ║  enters after the portal transit.    ║
           ╚══════════════════════════════════════╝
          */}

          {/* ── Example shell — replace with your actual content ── */}
          <p
            className="text-white/20 text-[10px] uppercase tracking-[0.6em] mb-8"
            style={{ letterSpacing: "0.55em" }}
          >
            you have entered
          </p>

          <h1
            className="text-white font-light text-6xl sm:text-8xl mb-6"
            style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", letterSpacing: "-0.02em" }}
          >
            WORLD
          </h1>

          <p className="text-white/40 text-xs uppercase tracking-[0.4em]">
            — the portfolio of{" "}
            <span className="text-[#ff6a00]">kendrick</span>
          </p>
        </div>
      </main>

    </div>
  );
}