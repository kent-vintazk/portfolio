"use client";

import { useRef, Suspense, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Torus, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

// ─── Types ────────────────────────────────────────────────────────────────────
interface MouseRef { x: number; y: number; }
interface SlingRingProps { mouse: React.MutableRefObject<MouseRef>; }

// ─── Constants ────────────────────────────────────────────────────────────────
const EMBER_COUNT = 600;

// ─── Ember Particle System ────────────────────────────────────────────────────
// 600 GPU-driven particles spawned on the ring edge with fire-color heat gradient
// and additive blending so they stack into a real fireball look.
function EmberSystem() {
  const pointsRef = useRef<THREE.Points>(null);

  // All per-particle CPU state lives here — allocated once
  const state = useMemo(() => {
    const pos  = new Float32Array(EMBER_COUNT * 3);
    const vel  = new Float32Array(EMBER_COUNT * 3);
    const life = new Float32Array(EMBER_COUNT);
    const maxL = new Float32Array(EMBER_COUNT);
    const col  = new Float32Array(EMBER_COUNT * 3);

    const spawnParticle = (i: number, randomLife = false) => {
      const a = Math.random() * Math.PI * 2;
      const r = 1.95 + (Math.random() - 0.5) * 0.5;
      pos[i * 3]     = Math.cos(a) * r;
      pos[i * 3 + 1] = Math.sin(a) * r;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;

      const spd = 1.0 + Math.random() * 3.5;
      // Outward radial + strong upward component = fire rising off the ring
      vel[i * 3]     = Math.cos(a) * spd * 0.25 + (Math.random() - 0.5) * spd * 0.5;
      vel[i * 3 + 1] = Math.sin(a) * spd * 0.25 + Math.random() * spd * 0.8;
      vel[i * 3 + 2] = (Math.random() - 0.5) * spd * 0.3;

      life[i] = randomLife ? Math.random() : 1.0;
      maxL[i] = 0.5 + Math.random() * 2.2;

      // Heat gradient: white core → yellow → orange → deep red
      const heat = Math.random();
      if      (heat > 0.88) { col[i*3]=1.0; col[i*3+1]=1.0;  col[i*3+2]=0.9; } // white-hot
      else if (heat > 0.65) { col[i*3]=1.0; col[i*3+1]=0.90; col[i*3+2]=0.0; } // bright yellow
      else if (heat > 0.38) { col[i*3]=1.0; col[i*3+1]=0.45; col[i*3+2]=0.0; } // orange
      else if (heat > 0.15) { col[i*3]=0.9; col[i*3+1]=0.12; col[i*3+2]=0.0; } // red-orange
      else                  { col[i*3]=0.6; col[i*3+1]=0.04; col[i*3+2]=0.0; } // deep red
    };

    for (let i = 0; i < EMBER_COUNT; i++) spawnParticle(i, true);
    return { pos, vel, life, maxL, col, spawnParticle };
  }, []);

  const [geo, mat] = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(state.pos, 3));
    g.setAttribute("color",    new THREE.BufferAttribute(state.col, 3));
    const m = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    return [g, m];
  }, [state]);

  useFrame((_, dt) => {
    const { pos, vel, life, maxL, spawnParticle } = state;
    let colorDirty = false;

    for (let i = 0; i < EMBER_COUNT; i++) {
      life[i] -= dt / maxL[i];

      if (life[i] <= 0) {
        spawnParticle(i, false);
        colorDirty = true;
      } else {
        pos[i*3]     += vel[i*3]     * dt;
        pos[i*3 + 1] += vel[i*3 + 1] * dt;
        pos[i*3 + 2] += vel[i*3 + 2] * dt;

        // Upward thermal drift + air drag
        vel[i*3 + 1] += dt * 0.55;
        vel[i*3]     *= 0.991;
        vel[i*3 + 2] *= 0.991;

        // Fade point size with life
        if (mat) mat.size = 0.065;
      }
    }

    geo.attributes.position.needsUpdate = true;
    if (colorDirty) geo.attributes.color.needsUpdate = true;
  });

  return <points ref={pointsRef} geometry={geo} material={mat} />;
}

// ─── Portal Vortex (GLSL ShaderMaterial) ──────────────────────────────────────
// Animated swirling rings + ember glow inside the portal hole.
function PortalVortex() {
  const matRef = useRef<THREE.ShaderMaterial | null>(null);

  const shader = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          varying vec2 vUv;

          void main() {
            vec2 uv   = vUv - 0.5;
            float d   = length(uv);
            float ang = atan(uv.y, uv.x);

            // Swirling ring bands
            float swirl = ang - uTime * 1.8 + d * 14.0;
            float rings = sin(d * 22.0 - uTime * 4.5) * 0.5 + 0.5;
            float pat   = sin(swirl * 5.0) * 0.5 + 0.5;

            // Radial fade: opaque at edge, open at center
            float edgeFade  = smoothstep(0.48, 0.30, d);
            float innerHole = smoothstep(0.18, 0.32, d);   // fade out dead center
            float alpha     = edgeFade * innerHole;

            // Fire color: deep red outer → orange → yellow inner
            vec3 outer = vec3(0.55, 0.08, 0.0);
            vec3 mid   = vec3(0.95, 0.35, 0.0);
            vec3 inner = vec3(1.0,  0.82, 0.1);
            vec3 col   = mix(outer, mid,   smoothstep(0.38, 0.22, d));
            col        = mix(col,   inner, smoothstep(0.22, 0.10, d));

            col *= 0.5 + pat * 0.35 + rings * 0.25;

            gl_FragColor = vec4(col, alpha * 0.88);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    []
  );

  matRef.current = shader;

  useFrame(({ clock }) => {
    shader.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh renderOrder={-1}>
      <circleGeometry args={[1.58, 128]} />
      <primitive object={shader} attach="material" />
    </mesh>
  );
}

// ─── Pulsing Inner Glow Orb ───────────────────────────────────────────────────
function GlowOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef  = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const pulse = 0.6 + Math.sin(t * 2.1) * 0.3 + Math.sin(t * 5.3) * 0.1;
    if (matRef.current) {
      matRef.current.emissiveIntensity = pulse * 3.5;
      matRef.current.opacity = 0.18 + pulse * 0.12;
    }
    if (meshRef.current) {
      const s = 1.0 + Math.sin(t * 1.7) * 0.04;
      meshRef.current.scale.setScalar(s);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.45, 48, 48]} />
      <meshStandardMaterial
        ref={matRef}
        color="#FF3D00"
        emissive="#FF6D00"
        emissiveIntensity={2.5}
        transparent
        opacity={0.22}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.BackSide}
        toneMapped={false}
      />
    </mesh>
  );
}

// ─── Flickering Point Lights ──────────────────────────────────────────────────
function FlickerLights() {
  const lightA = useRef<THREE.PointLight>(null);
  const lightB = useRef<THREE.PointLight>(null);
  const lightC = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (lightA.current)
      lightA.current.intensity = 3.5 + Math.sin(t * 7.3)  * 1.2 + Math.sin(t * 13.1) * 0.6;
    if (lightB.current)
      lightB.current.intensity = 1.8 + Math.sin(t * 5.9)  * 0.8 + Math.sin(t * 17.3) * 0.4;
    if (lightC.current)
      lightC.current.intensity = 1.0 + Math.sin(t * 11.7) * 0.5;
  });

  return (
    <>
      <pointLight ref={lightA} position={[0,  0,  3.5]} color="#FF5722" intensity={3.5} distance={12} decay={2} />
      <pointLight ref={lightB} position={[3, -2,  2.5]} color="#FFC107" intensity={1.8} distance={10} decay={2} />
      <pointLight ref={lightC} position={[-2, 2,  2.0]} color="#FF9800" intensity={1.0} distance={8}  decay={2} />
    </>
  );
}

// ─── Main Sling Ring ──────────────────────────────────────────────────────────
function SlingRing({ mouse }: SlingRingProps) {
  const ringGroup = useRef<THREE.Group>(null);
  const outerHalo = useRef<THREE.Mesh>(null);
  const coreRing  = useRef<THREE.Mesh>(null);
  const innerBand = useRef<THREE.Mesh>(null);
  const midRing   = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;

    if (ringGroup.current) {
      ringGroup.current.rotation.z += delta * 0.22;
      ringGroup.current.rotation.x = THREE.MathUtils.lerp(
        ringGroup.current.rotation.x,
        (mouse.current?.y ?? 0) * 0.35,
        0.05
      );
      ringGroup.current.rotation.y = THREE.MathUtils.lerp(
        ringGroup.current.rotation.y,
        (mouse.current?.x ?? 0) * 0.35,
        0.05
      );
    }

    if (outerHalo.current) outerHalo.current.rotation.z -= delta * 0.35;
    if (innerBand.current) innerBand.current.rotation.z += delta * 0.90;
    if (midRing.current)   midRing.current.rotation.z   -= delta * 0.55;

    // Pulse emissive on core ring
    if (coreRing.current) {
      const mat = coreRing.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 2.2 + Math.sin(t * 3.1) * 0.8 + Math.sin(t * 7.3) * 0.3;
    }
  });

  return (
    <group ref={ringGroup}>
      {/* ── Outermost wispy halo ring ── */}
      <Torus ref={outerHalo} args={[2.52, 0.018, 8, 180]}>
        <meshBasicMaterial color="#FF6D00" toneMapped={false} />
      </Torus>
      <Torus args={[2.38, 0.010, 8, 180]}>
        <meshBasicMaterial color="#FFD740" toneMapped={false} />
      </Torus>

      {/* ── Outer accent ring ── */}
      <Torus args={[2.22, 0.035, 8, 180]}>
        <meshBasicMaterial color="#FF5722" toneMapped={false} />
      </Torus>

      {/* ── Core glowing ring ── */}
      <Torus ref={coreRing} args={[1.95, 0.13, 20, 200]}>
        <meshStandardMaterial
          color="#FF4500"
          emissive="#FF5722"
          emissiveIntensity={2.2}
          roughness={0.15}
          metalness={0.85}
          toneMapped={false}
        />
      </Torus>

      {/* ── Mid counter-rotating band ── */}
      <Torus ref={midRing} args={[1.78, 0.022, 8, 160]}>
        <meshBasicMaterial color="#FFAB40" toneMapped={false} />
      </Torus>

      {/* ── Inner ember ring ── */}
      <Torus ref={innerBand} args={[1.60, 0.018, 8, 140]}>
        <meshBasicMaterial color="#FFE57F" toneMapped={false} />
      </Torus>

      {/* ── Innermost accent ── */}
      <Torus args={[1.45, 0.010, 8, 120]}>
        <meshBasicMaterial color="#FF9800" toneMapped={false} />
      </Torus>

      {/* ── Rune spokes (36 markers, alternating sizes) ── */}
      {Array.from({ length: 36 }).map((_, i) => {
        const angle   = (i / 36) * Math.PI * 2;
        const isMain  = i % 3 === 0;
        const isMid   = i % 3 === 1;
        const length  = isMain ? 0.20 : isMid ? 0.12 : 0.07;
        const color   = isMain ? "#FFD740" : isMid ? "#FFC107" : "#FF9800";
        const radius  = 1.87;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[length, isMain ? 0.025 : 0.015, 0.015]} />
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
        );
      })}

      {/* ── Outer diamond markers ── */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh
            key={`d${i}`}
            position={[Math.cos(angle) * 2.22, Math.sin(angle) * 2.22, 0]}
            rotation={[0, 0, angle + Math.PI / 4]}
          >
            <boxGeometry args={[0.08, 0.08, 0.02]} />
            <meshBasicMaterial color="#FFD740" toneMapped={false} />
          </mesh>
        );
      })}

      {/* ── Portal vortex center ── */}
      <PortalVortex />

      {/* ── Inner glow orb ── */}
      <GlowOrb />

      {/* ── Ember particle system ── */}
      <EmberSystem />
    </group>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene({ mouse }: SlingRingProps) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <FlickerLights />
      <Float speed={1.1} rotationIntensity={0.3} floatIntensity={0.5}>
        <SlingRing mouse={mouse} />
      </Float>
      <Suspense fallback={null}>
        <Environment preset="night" />
      </Suspense>
    </>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function Portal3D() {
  const mouse = useRef<MouseRef>({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      data-testid="portal-3d-canvas"
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw", height: "100vh",
        pointerEvents: "none",
      }}
    >
      <Canvas
        style={{ width: "100%", height: "100%", display: "block" }}
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        dpr={[1, 2]}
      >
        <Scene mouse={mouse} />
      </Canvas>
    </div>
  );
}