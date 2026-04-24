"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type Phase = "init" | "loading" | "denied" | "active" | "done";
type Landmark = { x: number; y: number; z: number };
type HandResult = { landmarks?: Landmark[][] };
type Detector = {
  detectForVideo: (v: HTMLVideoElement, t: number) => HandResult;
  close: () => void;
};

const MP_VERSION = "0.10.34";
const WASM_PATH = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VERSION}/wasm`;
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

export default function KENTO_O() {
  const [phase, setPhase] = useState<Phase>("init");
  const [error, setError] = useState<string | null>(null);
  const [handCount, setHandCount] = useState(0);

  const mountRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<Detector | null>(null);
  const landmarksRef = useRef<Landmark[][]>([]);
  const rafRef = useRef<number>(0);
  // Stable ref so the RAF loop always sees the latest setter without re-creating the loop
  const setPhaseRef = useRef(setPhase);
  useEffect(() => { setPhaseRef.current = setPhase; }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 1280, height: 720 },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }

        setPhase("loading");

        const { HandLandmarker, FilesetResolver } = await import(
          "@mediapipe/tasks-vision"
        );
        const vision = await FilesetResolver.forVisionTasks(WASM_PATH);
        const detector = (await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
          runningMode: "VIDEO",
          numHands: 2,
        })) as unknown as Detector;

        if (cancelled) {
          detector.close();
          return;
        }
        detectorRef.current = detector;
        setPhase("active");
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Camera access failed");
        setPhase("denied");
      }
    })();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      detectorRef.current?.close();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase !== "active") return;
    const mount = mountRef.current;
    const video = videoRef.current;
    const detector = detectorRef.current;
    if (!mount || !video || !detector) return;

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    cam.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.debug.checkShaderErrors = false;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const starfield = makeStarfield();
    scene.add(starfield);

    const c1 = buildCircle(scene, 0xffcc33, 0xff7722);
    const c2 = buildCircle(scene, 0x44ffdd, 0x3366ff);

    let arcLine: THREE.Line | null = null;

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    const timer = new THREE.Timer();
    let lastVideoTime = -1;
    let portalFired = false;

    // ── Explosion system ────────────────────────────────────────────────────
    const ECOUNT = 500;
    const eBuf    = new Float32Array(ECOUNT * 3);
    const eColBuf = new Float32Array(ECOUNT * 3);
    type EVel = { x: number; y: number; z: number };
    const eVels: EVel[] = Array.from({ length: ECOUNT }, () => ({ x: 0, y: 0, z: 0 }));
    const eGeo = new THREE.BufferGeometry();
    eGeo.setAttribute("position", new THREE.BufferAttribute(eBuf, 3));
    eGeo.setAttribute("color",    new THREE.BufferAttribute(eColBuf, 3));
    const eMat = new THREE.PointsMaterial({
      size: 0.18, sizeAttenuation: true, vertexColors: true,
      transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const eParticles = new THREE.Points(eGeo, eMat);
    scene.add(eParticles);

    const flashMat = new THREE.MeshBasicMaterial({
      color: 0xfff4cc, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    });
    const flashMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), flashMat);
    scene.add(flashMesh);

    let combFired  = false;
    let combActive = false;
    let combT      = 0;
    const combOrigin = new THREE.Vector3();
    const combRings: { line: THREE.Line; age: number }[] = [];

    const triggerCombination = (mid: THREE.Vector3) => {
      combFired  = true;
      combActive = true;
      combT      = 0;
      combOrigin.copy(mid);
      flashMesh.position.copy(mid);

      for (let i = 0; i < ECOUNT; i++) {
        eBuf[i * 3] = mid.x; eBuf[i * 3 + 1] = mid.y; eBuf[i * 3 + 2] = mid.z;
        const theta = Math.random() * Math.PI * 2;
        const phi   = Math.acos(2 * Math.random() - 1);
        const spd   = 2.5 + Math.random() * 10;
        eVels[i] = {
          x: Math.sin(phi) * Math.cos(theta) * spd,
          y: Math.sin(phi) * Math.sin(theta) * spd,
          z: Math.cos(phi) * spd * 0.25,
        };
        const hot = Math.random();
        eColBuf[i * 3]     = 1;
        eColBuf[i * 3 + 1] = 0.4 + hot * 0.55;
        eColBuf[i * 3 + 2] = hot > 0.5 ? 0.45 : 0;
      }
      eGeo.attributes.position.needsUpdate = true;
      eGeo.attributes.color.needsUpdate    = true;
      eMat.opacity = 1;
    };
    // ────────────────────────────────────────────────────────────────────────

    const onTripleCircle = () => {
      if (portalFired) return;
      portalFired = true;
      setPhaseRef.current("done");
    };

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);

      if (video.readyState >= 2 && video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        const res = detector.detectForVideo(video, performance.now());
        landmarksRef.current = res.landmarks ?? [];
        setHandCount(landmarksRef.current.length);
      }

      timer.update();
      const dt = Math.min(timer.getDelta(), 0.05);
      const t = timer.getElapsed();
      const halfH = Math.tan((cam.fov / 2) * (Math.PI / 180)) * cam.position.z;
      const halfW = halfH * cam.aspect;

      const lm = landmarksRef.current;
      tickCircle(c1, lm[0] ?? null, t, dt, halfW, halfH, onTripleCircle);
      tickCircle(c2, lm[1] ?? null, t, dt, halfW, halfH, onTripleCircle);

      if (arcLine) {
        scene.remove(arcLine);
        arcLine.geometry.dispose();
        (arcLine.material as THREE.Material).dispose();
        arcLine = null;
      }
      if (!combFired && c1.userData.alive && c2.userData.alive) {
        const mid = c1.position.clone().add(c2.position).multiplyScalar(0.5);
        mid.z += 1.0;
        const curve = new THREE.QuadraticBezierCurve3(
          c1.position.clone(),
          mid,
          c2.position.clone()
        );
        const pts = curve.getPoints(60);
        arcLine = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(pts),
          new THREE.LineBasicMaterial({
            color: 0xffee66,
            transparent: true,
            opacity: 0.55 + 0.15 * Math.sin(t * 4),
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
        );
        scene.add(arcLine);

        // Trigger explosion when sigils overlap
        if (c1.position.distanceTo(c2.position) < 2.4) {
          triggerCombination(c1.position.clone().add(c2.position).multiplyScalar(0.5));
        }
      }

      // ── Explosion update ──────────────────────────────────────────────────
      if (combActive) {
        combT += dt;

        // Particle physics
        for (let i = 0; i < ECOUNT; i++) {
          eBuf[i * 3]     += eVels[i].x * dt;
          eBuf[i * 3 + 1] += eVels[i].y * dt;
          eBuf[i * 3 + 2] += eVels[i].z * dt;
          eVels[i].x *= 1 - dt * 1.6;
          eVels[i].y *= 1 - dt * 1.6;
          eVels[i].z *= 1 - dt * 1.6;
        }
        eGeo.attributes.position.needsUpdate = true;
        eMat.opacity = Math.max(0, 1 - combT / 1.1);

        // Flash sphere
        const fScale = combT < 0.2
          ? (combT / 0.2) * 8
          : 8 * Math.max(0, 1 - (combT - 0.2) / 0.7);
        flashMesh.scale.setScalar(fScale);
        flashMat.opacity = combT < 0.14
          ? (combT / 0.14) * 0.88
          : Math.max(0, 0.88 - (combT - 0.14) / 0.55);

        // Shockwave rings
        const ringEvery = 0.12;
        if (combT < 0.6 && Math.floor(combT / ringEvery) > Math.floor((combT - dt) / ringEvery)) {
          const rLine = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(circPts(1, 80)),
            new THREE.LineBasicMaterial({
              color: 0xffdd44, transparent: true, opacity: 0.9,
              blending: THREE.AdditiveBlending, depthWrite: false,
            })
          );
          rLine.position.copy(combOrigin);
          rLine.scale.setScalar(0.05);
          scene.add(rLine);
          combRings.push({ line: rLine, age: 0 });
        }
        for (let i = combRings.length - 1; i >= 0; i--) {
          combRings[i].age += dt;
          const { line, age } = combRings[i];
          line.scale.setScalar(0.05 + age * 8);
          (line.material as THREE.LineBasicMaterial).opacity = Math.max(0, 0.9 - age * 2.8);
          if (age > 0.38) {
            scene.remove(line);
            line.geometry.dispose();
            (line.material as THREE.LineBasicMaterial).dispose();
            combRings.splice(i, 1);
          }
        }

        // Shrink both sigils
        const ud1 = c1.userData as CircleUserData;
        const ud2 = c2.userData as CircleUserData;
        ud1.smoothScale = Math.max(0, ud1.smoothScale - dt * 5);
        ud2.smoothScale = Math.max(0, ud2.smoothScale - dt * 5);
        c1.scale.setScalar(ud1.smoothScale);
        c2.scale.setScalar(ud2.smoothScale);

        if (combT > 1.6 && !portalFired) {
          portalFired = true;
          setPhaseRef.current("done");
        }
      }
      // ─────────────────────────────────────────────────────────────────────

      starfield.rotation.z = t * 0.01;
      renderer.render(scene, cam);
    };
    loop();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        const anyObj = obj as THREE.Mesh & { material?: unknown };
        anyObj.geometry?.dispose?.();
        const m = anyObj.material as
          | THREE.Material
          | THREE.Material[]
          | undefined;
        if (Array.isArray(m)) m.forEach((x) => x.dispose());
        else m?.dispose?.();
      });
      renderer.dispose();
    };
  }, [phase]);

  if (phase === "done") return null;

  const statusLabel =
    phase === "init"
      ? "Requesting camera"
      : phase === "loading"
      ? "Loading hand model"
      : phase === "denied"
      ? "Camera unavailable"
      : handCount === 0
      ? "Awaiting gesture"
      : handCount === 1
      ? "1 hand detected"
      : "2 hands detected";

  return (
    <div className="fixed inset-0 z-[9999] bg-black overflow-hidden">
      {/* Camera feed — hidden from view, still used by MediaPipe */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className="absolute invisible"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 70%, #000 100%)",
        }}
      />

      <div ref={mountRef} className="absolute inset-0 pointer-events-none" />

      <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 pointer-events-none">
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffcc33] animate-pulse" />
            <span className="text-white/80 text-[10px] sm:text-xs uppercase tracking-[0.35em]">
              Mystic Arts · Live Capture
            </span>
          </div>
          <span className="text-white/50 text-[10px] sm:text-xs uppercase tracking-[0.35em]">
            {statusLabel}
          </span>
        </header>

        <div className="flex justify-center">
          {(phase === "init" || phase === "loading") && (
            <p className="text-white/70 text-xs sm:text-sm uppercase tracking-[0.3em] text-center">
              {phase === "init"
                ? "Allow camera access"
                : "Summoning sigils…"}
            </p>
          )}
          {phase === "active" && handCount === 0 && (
            <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-[0.4em] text-center">
              Raise your hand to summon a sigil
            </p>
          )}
        </div>

        <footer className="flex items-end justify-between gap-4">
          <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-[0.25em] max-w-[20rem] leading-relaxed">
            Open palm — summon. Close fist — dismiss. Peace sign — spin ×2 to
            enter. Two hands — channel a portal.
          </p>
          <button
            onClick={() => setPhase("done")}
            className="pointer-events-auto text-white text-[10px] sm:text-xs uppercase tracking-[0.35em] border border-white/30 px-5 py-3 hover:border-white hover:bg-white/5 transition-colors"
          >
            Enter Portfolio →
          </button>
        </footer>
      </div>

      {phase === "denied" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-sm text-center px-6 pointer-events-auto">
            <p className="text-white text-sm uppercase tracking-[0.3em] mb-3">
              Camera access denied
            </p>
            <p className="text-white/40 text-xs mb-8 leading-relaxed">
              {error ?? "The gesture interface needs camera permission."}
            </p>
            <button
              onClick={() => setPhase("done")}
              className="text-white text-xs uppercase tracking-[0.35em] border border-white/30 px-6 py-3 hover:border-white transition-colors"
            >
              Continue without tracking →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

type SparkSeed = {
  axis: THREE.Vector3;
  ortho: THREE.Vector3;
  angle: number;
  r: number;
  speed: number;
  zPhase: number;
};

type EmberSeed = {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
};

type Spinner = {
  obj: THREE.Object3D;
  axis: THREE.Vector3;
  speed: number;
};

type CircleUserData = {
  spinners: Spinner[];
  sparks: THREE.Points;
  sparkGeo: THREE.BufferGeometry;
  sparkPos: Float32Array;
  sparkData: SparkSeed[];
  embers: THREE.Points;
  emberGeo: THREE.BufferGeometry;
  emberPos: Float32Array;
  emberCol: Float32Array;
  emberData: EmberSeed[];
  smoothPos: THREE.Vector3;
  smoothScale: number;
  targetScale: number;
  alive: boolean;
  spinAngle: number;
  spinVelocity: number;
  prevFingerAngle: number | null;
  gestureActive: boolean;
  /** Accumulated absolute rotation (radians) while two-finger gesture is active */
  spinTotal: number;
};

const EMBER_RADIUS = 1.9;
/** 2 full circles = 4π radians (more reliable than 3 due to frame-level flicker) */
const TRIPLE_CIRCLE_THRESHOLD = 4 * Math.PI;

function spawnEmber(e: EmberSeed) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  e.pos.set(
    EMBER_RADIUS * Math.sin(phi) * Math.cos(theta),
    EMBER_RADIUS * Math.sin(phi) * Math.sin(theta),
    EMBER_RADIUS * Math.cos(phi)
  );
  e.vel
    .copy(e.pos)
    .normalize()
    .multiplyScalar(0.2 + Math.random() * 0.35);
  e.vel.y += 0.55 + Math.random() * 0.4;
  e.life = 0;
  e.maxLife = 0.9 + Math.random() * 1.3;
}

function addMat(color: number, opacity = 1) {
  return new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}

function lineMat(color: number, opacity = 0.6) {
  return new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

function makeGlowTex() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,220,120,1)");
  g.addColorStop(0.3, "rgba(255,160,40,0.7)");
  g.addColorStop(1, "rgba(255,80,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function makeFireGlowTex() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,230,1)");
  g.addColorStop(0.15, "rgba(255,230,140,0.95)");
  g.addColorStop(0.45, "rgba(255,130,30,0.55)");
  g.addColorStop(0.8, "rgba(220,50,0,0.18)");
  g.addColorStop(1, "rgba(120,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function makeStarfield() {
  const positions = new Float32Array(4500);
  for (let i = 0; i < 4500; i++) positions[i] = (Math.random() - 0.5) * 60;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      color: 0x4477ff,
      size: 0.022,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
}

function greatCirclePoints(
  radius: number,
  plane: "xy" | "xz" | "yz",
  segments = 128
) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const c = Math.cos(a) * radius;
    const s = Math.sin(a) * radius;
    if (plane === "xy") pts.push(new THREE.Vector3(c, s, 0));
    else if (plane === "xz") pts.push(new THREE.Vector3(c, 0, s));
    else pts.push(new THREE.Vector3(0, c, s));
  }
  return pts;
}

// ─── flat geometry helpers ────────────────────────────────────────────────────

function circPts(r: number, seg = 128): THREE.Vector3[] {
  return Array.from({ length: seg + 1 }, (_, i) => {
    const a = (i / seg) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0);
  });
}

function polyPts(r: number, sides: number, rot = 0): THREE.Vector3[] {
  return Array.from({ length: sides + 1 }, (_, i) => {
    const a = (i / sides) * Math.PI * 2 + rot;
    return new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0);
  });
}

function starPts(outer: number, inner: number, n: number, rot = -Math.PI / 2): THREE.Vector3[] {
  return Array.from({ length: n * 2 + 1 }, (_, i) => {
    const a = (i / (n * 2)) * Math.PI * 2 + rot;
    const rr = i % 2 === 0 ? outer : inner;
    return new THREE.Vector3(Math.cos(a) * rr, Math.sin(a) * rr, 0);
  });
}

/** Returns a Float32Array of LineSegments vertices simulating runic glyphs */
function makeRunicPositions(innerR: number, outerR: number, clusterCount: number): Float32Array {
  const verts: number[] = [];
  const bandH = outerR - innerR;
  let seed = 77331;
  const rng = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };
  for (let c = 0; c < clusterCount; c++) {
    const baseAngle = (c / clusterCount) * Math.PI * 2;
    const slotW = (Math.PI * 2 / clusterCount) * 0.65;
    const strokes = Math.floor(rng() * 3) + 1;
    for (let s = 0; s < strokes; s++) {
      const ang = baseAngle + (s / Math.max(strokes, 1) - 0.5) * slotW;
      const h = 0.022 + rng() * bandH * 0.68;
      const sr = innerR + rng() * bandH * 0.15;
      const er = sr + h;
      const cos = Math.cos(ang), sin = Math.sin(ang);
      verts.push(cos * sr, sin * sr, 0, cos * er, sin * er, 0);
      if (rng() > 0.42) {
        const mr = (sr + er) * 0.5;
        const cw = 0.011 + rng() * 0.016;
        verts.push(
          cos * mr - sin * cw, sin * mr + cos * cw, 0,
          cos * mr + sin * cw, sin * mr - cos * cw, 0,
        );
      }
      if (rng() > 0.6) {
        const hook = 0.01 + rng() * 0.012;
        verts.push(
          cos * er, sin * er, 0,
          cos * er - sin * hook * 0.7 + cos * hook * 0.3,
          sin * er + cos * hook * 0.7 + sin * hook * 0.3, 0,
        );
      }
    }
  }
  return new Float32Array(verts);
}

// ─────────────────────────────────────────────────────────────────────────────

function buildCircle(scene: THREE.Scene, primary: number, accent: number) {
  const g = new THREE.Group();
  const R = 1.9;
  const spinners: Spinner[] = [];

  const addL = (parent: THREE.Object3D, pts: THREE.Vector3[], color: number, opacity: number) => {
    parent.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat(color, opacity)));
  };
  const addLS = (parent: THREE.Object3D, positions: Float32Array, color: number, opacity: number) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    parent.add(new THREE.LineSegments(geo, lineMat(color, opacity)));
  };

  // ── 3D orbital rings (tilt-spinning around Y) ─────────────────────────────
  const orbital = new THREE.Group();
  addL(orbital, greatCirclePoints(R, "xy"), primary, 0.55);
  addL(orbital, greatCirclePoints(R, "xz"), primary, 0.4);
  addL(orbital, greatCirclePoints(R, "yz"), primary, 0.4);
  const t1 = new THREE.Group(); addL(t1, greatCirclePoints(R, "xy"), accent, 0.35); t1.rotation.x = Math.PI / 4; orbital.add(t1);
  const t2 = new THREE.Group(); addL(t2, greatCirclePoints(R, "xy"), accent, 0.35); t2.rotation.x = -Math.PI / 4; orbital.add(t2);
  g.add(orbital);
  spinners.push({ obj: orbital, axis: new THREE.Vector3(0, 1, 0), speed: 0.06 });

  // ── Layer 1: Outer runic band (slow CW) ───────────────────────────────────
  const runicRing = new THREE.Group();
  addL(runicRing, circPts(R * 0.998), primary, 0.95);
  addL(runicRing, circPts(R * 0.932), primary, 0.75);
  addLS(runicRing, makeRunicPositions(R * 0.935, R * 0.994, 72), primary, 0.5);
  g.add(runicRing);
  spinners.push({ obj: runicRing, axis: new THREE.Vector3(0, 0, 1), speed: -0.035 });

  // ── Layer 2: Diamond-tile band (medium CCW) ───────────────────────────────
  const bandRing = new THREE.Group();
  const bR = R * 0.885;
  addL(bandRing, circPts(bR), primary, 0.8);
  addL(bandRing, circPts(bR * 0.926), primary, 0.6);
  const tileCount = 30, midR = bR * 0.963, hw = 0.025, hh = 0.024;
  for (let i = 0; i < tileCount; i++) {
    const a = (i / tileCount) * Math.PI * 2;
    const cos = Math.cos(a), sin = Math.sin(a);
    addL(bandRing, [
      new THREE.Vector3(cos * (midR + hh), sin * (midR + hh), 0),
      new THREE.Vector3(cos * midR - sin * hw, sin * midR + cos * hw, 0),
      new THREE.Vector3(cos * (midR - hh), sin * (midR - hh), 0),
      new THREE.Vector3(cos * midR + sin * hw, sin * midR - cos * hw, 0),
      new THREE.Vector3(cos * (midR + hh), sin * (midR + hh), 0),
    ], i % 5 === 0 ? accent : primary, 0.5);
  }
  g.add(bandRing);
  spinners.push({ obj: bandRing, axis: new THREE.Vector3(0, 0, 1), speed: 0.08 });

  // ── Layer 3: Outer polygon mandala — 10× nonagons (slow CCW) ─────────────
  const mandalaOuter = new THREE.Group();
  addL(mandalaOuter, circPts(R * 0.755), accent, 0.55);
  for (let i = 0; i < 10; i++)
    addL(mandalaOuter, polyPts(R * 0.69, 9, (i / 10) * Math.PI * 2), primary, 0.42);
  g.add(mandalaOuter);
  spinners.push({ obj: mandalaOuter, axis: new THREE.Vector3(0, 0, 1), speed: -0.065 });

  // ── Layer 4: Inner polygon mandala — 8× heptagons (medium CW) ────────────
  const mandalaInner = new THREE.Group();
  addL(mandalaInner, circPts(R * 0.565), primary, 0.65);
  addL(mandalaInner, circPts(R * 0.505), accent, 0.4);
  for (let i = 0; i < 8; i++)
    addL(mandalaInner, polyPts(R * 0.515, 7, (i / 8) * Math.PI * 2), accent, 0.48);
  g.add(mandalaInner);
  spinners.push({ obj: mandalaInner, axis: new THREE.Vector3(0, 0, 1), speed: 0.1 });

  // ── Layer 5: Hexagram — two overlapping triangles (medium CCW) ───────────
  const hexGroup = new THREE.Group();
  addL(hexGroup, circPts(R * 0.415), primary, 0.7);
  addL(hexGroup, polyPts(R * 0.39, 3, -Math.PI / 2), primary, 0.95);   // △
  addL(hexGroup, polyPts(R * 0.39, 3,  Math.PI / 2), accent,  0.95);   // ▽
  // inner small circle inscribed in hexagram
  addL(hexGroup, circPts(R * 0.22), accent, 0.55);
  // connecting lines from each triangle vertex through center
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    hexGroup.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(a) * R * 0.39, Math.sin(a) * R * 0.39, 0),
      ]),
      lineMat(primary, 0.3),
    ));
  }
  g.add(hexGroup);
  spinners.push({ obj: hexGroup, axis: new THREE.Vector3(0, 0, 1), speed: -0.16 });

  // ── Layer 6: Central star — 8-pt outer + 6-pt inner (fast CW) ────────────
  const starGroup = new THREE.Group();
  addL(starGroup, starPts(R * 0.195, R * 0.085, 8), primary, 1.0);
  addL(starGroup, circPts(R * 0.155, 64), accent, 0.75);
  addL(starGroup, starPts(R * 0.13,  R * 0.055, 6, 0), accent, 0.9);
  addL(starGroup, circPts(R * 0.068, 32), primary, 0.85);
  g.add(starGroup);
  spinners.push({ obj: starGroup, axis: new THREE.Vector3(0, 0, 1), speed: 0.32 });

  // ── Glow center spheres ───────────────────────────────────────────────────
  g.add(new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), addMat(0xffffff, 0.95)));
  g.add(new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), addMat(primary,  0.35)));

  const glowTex = makeGlowTex();
  const N = 1400;
  const sparkPos = new Float32Array(N * 3);
  const sparkData: SparkSeed[] = Array.from({ length: N }, () => {
    const axis = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();
    const seed = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    );
    const ortho = new THREE.Vector3().crossVectors(axis, seed).normalize();
    return {
      axis,
      ortho,
      angle: Math.random() * Math.PI * 2,
      r: 0.6 + Math.random() * 1.4,
      speed: (Math.random() * 0.02 + 0.003) * (Math.random() < 0.5 ? 1 : -1),
      zPhase: Math.random() * Math.PI * 2,
    };
  });
  const tmp = new THREE.Vector3();
  sparkData.forEach((p, i) => {
    tmp.copy(p.ortho).applyAxisAngle(p.axis, p.angle).multiplyScalar(p.r);
    sparkPos[i * 3] = tmp.x;
    sparkPos[i * 3 + 1] = tmp.y;
    sparkPos[i * 3 + 2] = tmp.z;
  });
  const sparkGeo = new THREE.BufferGeometry();
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
  const sparks = new THREE.Points(
    sparkGeo,
    new THREE.PointsMaterial({
      map: glowTex,
      size: 0.08,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      alphaTest: 0.01,
    })
  );
  g.add(sparks);

  const emberCount = 350;
  const emberPos = new Float32Array(emberCount * 3);
  const emberCol = new Float32Array(emberCount * 3);
  const emberData: EmberSeed[] = Array.from({ length: emberCount }, () => ({
    pos: new THREE.Vector3(),
    vel: new THREE.Vector3(),
    life: Math.random() * 2.0,
    maxLife: 0.9 + Math.random() * 1.3,
  }));
  emberData.forEach((e, i) => {
    spawnEmber(e);
    emberPos[i * 3] = e.pos.x;
    emberPos[i * 3 + 1] = e.pos.y;
    emberPos[i * 3 + 2] = e.pos.z;
  });
  const fireTex = makeFireGlowTex();
  const emberGeo = new THREE.BufferGeometry();
  emberGeo.setAttribute("position", new THREE.BufferAttribute(emberPos, 3));
  emberGeo.setAttribute("color", new THREE.BufferAttribute(emberCol, 3));
  const embers = new THREE.Points(
    emberGeo,
    new THREE.PointsMaterial({
      map: fireTex,
      size: 0.18,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      alphaTest: 0.01,
    })
  );
  g.add(embers);

  g.scale.setScalar(0);
  const userData: CircleUserData = {
    spinners,
    sparks,
    sparkGeo,
    sparkPos,
    sparkData,
    embers,
    emberGeo,
    emberPos,
    emberCol,
    emberData,
    smoothPos: new THREE.Vector3(),
    smoothScale: 0,
    targetScale: 0,
    alive: false,
    spinAngle: 0,
    spinVelocity: 0,
    prevFingerAngle: null,
    gestureActive: false,
    spinTotal: 0,
  };
  g.userData = userData;

  scene.add(g);
  return g;
}

function isTwoFingerGesture(lm: Landmark[]): boolean {
  const d = (a: Landmark, b: Landmark) =>
    Math.hypot(a.x - b.x, a.y - b.y);
  const wrist = lm[0];
  const indexExtended = d(wrist, lm[8]) > d(wrist, lm[6]) * 1.1;
  const middleExtended = d(wrist, lm[12]) > d(wrist, lm[10]) * 1.1;
  const ringCurled = d(wrist, lm[16]) < d(wrist, lm[14]) * 1.1;
  const pinkyCurled = d(wrist, lm[20]) < d(wrist, lm[18]) * 1.1;
  return indexExtended && middleExtended && ringCurled && pinkyCurled;
}

function isClosedFist(lm: Landmark[]): boolean {
  const d = (a: Landmark, b: Landmark) =>
    Math.hypot(a.x - b.x, a.y - b.y);
  const wrist = lm[0];
  const curl = (tip: number, pip: number) =>
    d(wrist, lm[tip]) < d(wrist, lm[pip]) * 1.05;
  return curl(8, 6) && curl(12, 10) && curl(16, 14) && curl(20, 18);
}

function tickCircle(
  circ: THREE.Group,
  landmarks: Landmark[] | null,
  t: number,
  dt: number,
  halfW: number,
  halfH: number,
  onTripleCircle: () => void
) {
  const ud = circ.userData as CircleUserData;

  if (landmarks) {
    const palm = landmarks[9];
    const wrist = landmarks[0];
    const tip = landmarks[12];
    const wx = (1 - palm.x) * 2 * halfW - halfW;
    const wy = (0.5 - palm.y) * 2 * halfH;
    ud.smoothPos.lerp(new THREE.Vector3(wx, wy, 0), 0.18);

    if (isClosedFist(landmarks)) {
      ud.targetScale = 0;
      ud.alive = false;
      ud.gestureActive = false;
      ud.prevFingerAngle = null;
      // Reset spin accumulation on fist so they have to redo the gesture
      ud.spinTotal = 0;
    } else {
      const span = Math.hypot(tip.x - wrist.x, tip.y - wrist.y);
      ud.targetScale = THREE.MathUtils.clamp(0.4 + span * 3.0, 0.2, 1.6);
      ud.alive = true;

      ud.gestureActive = isTwoFingerGesture(landmarks);
      // Always compute finger angle so we don't get a huge discontinuous
      // jump when the gesture briefly flickers off and back on
      const ix = (landmarks[8].x + landmarks[12].x) / 2;
      const iy = (landmarks[8].y + landmarks[12].y) / 2;
      const ax = (1 - ix) - (1 - palm.x);
      const ay = -(iy - palm.y);
      const currentAngle = Math.atan2(ay, ax);

      if (ud.prevFingerAngle !== null) {
        let delta = currentAngle - ud.prevFingerAngle;
        if (delta > Math.PI) delta -= Math.PI * 2;
        if (delta < -Math.PI) delta += Math.PI * 2;

        if (ud.gestureActive) {
          ud.spinVelocity = ud.spinVelocity * 0.5 + delta * 0.9;
          // Only accumulate toward portal when peace-sign is active
          ud.spinTotal += Math.abs(delta);
          if (ud.spinTotal >= TRIPLE_CIRCLE_THRESHOLD) {
            ud.spinTotal = 0;
            onTripleCircle();
          }
        }
      }
      // Always update prevFingerAngle so resuming the gesture has no jump
      ud.prevFingerAngle = currentAngle;
    }
  } else {
    ud.targetScale = 0;
    ud.alive = false;
    ud.gestureActive = false;
    ud.prevFingerAngle = null;
  }

  ud.spinAngle += ud.spinVelocity;
  ud.spinVelocity *= ud.gestureActive ? 1 : 0.94;
  if (Math.abs(ud.spinVelocity) < 0.0002) ud.spinVelocity = 0;
  circ.rotation.z = ud.spinAngle;

  circ.position.copy(ud.smoothPos);
  ud.smoothScale += (ud.targetScale - ud.smoothScale) * 0.08;
  circ.scale.setScalar(Math.max(0, ud.smoothScale));

  ud.spinners.forEach(({ obj, axis, speed }) => {
    obj.setRotationFromAxisAngle(axis, t * speed);
  });

  const pos = ud.sparkPos;
  const tmp = new THREE.Vector3();
  ud.sparkData.forEach((p, i) => {
    p.angle += p.speed;
    const flicker = 0.04 * Math.sin(t * 5 + i * 1.1);
    tmp
      .copy(p.ortho)
      .applyAxisAngle(p.axis, p.angle)
      .multiplyScalar(p.r + flicker);
    pos[i * 3] = tmp.x;
    pos[i * 3 + 1] = tmp.y;
    pos[i * 3 + 2] = tmp.z;
  });
  ud.sparkGeo.attributes.position.needsUpdate = true;

  const ep = ud.emberPos;
  const ec = ud.emberCol;
  const ed = ud.emberData;
  for (let i = 0; i < ed.length; i++) {
    const e = ed[i];
    e.life += dt;
    if (e.life > e.maxLife) spawnEmber(e);
    e.pos.addScaledVector(e.vel, dt);
    e.vel.y += dt * 0.25;
    e.vel.multiplyScalar(1 - dt * 0.4);

    const tn = e.life / e.maxLife;
    const bright = tn < 0.12 ? tn / 0.12 : Math.max(0, 1 - (tn - 0.12) / 0.88);
    const flick = 0.85 + 0.15 * Math.sin(t * 18 + i * 0.7);
    const b = bright * flick;

    ep[i * 3] = e.pos.x;
    ep[i * 3 + 1] = e.pos.y;
    ep[i * 3 + 2] = e.pos.z;
    ec[i * 3] = b;
    ec[i * 3 + 1] = b * (0.75 - 0.45 * tn);
    ec[i * 3 + 2] = b * 0.25 * (1 - tn);
  }
  ud.emberGeo.attributes.position.needsUpdate = true;
  ud.emberGeo.attributes.color.needsUpdate = true;
}