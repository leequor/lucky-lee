"use client";

import {
  ContactShadows,
  Environment,
  Lightformer,
  Line,
  MeshReflectorMaterial,
  PerspectiveCamera,
  RoundedBox,
  Sparkles,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type LayerId = "screen" | "battery" | "board" | "camera";

const ACCENT = "#FF6B35";
const TITANIUM = "#BAC4CE";
const damp = THREE.MathUtils.damp;

/* ------------------------------------------------------------------ */
/*  Small parts                                                        */
/* ------------------------------------------------------------------ */

function Screw({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.026, 20]} />
        <meshStandardMaterial color="#C3CCD5" metalness={1} roughness={0.24} />
      </mesh>
      <mesh position={[0, 0.014, 0]}>
        <boxGeometry args={[0.03, 0.006, 0.005]} />
        <meshBasicMaterial color="#1A1F26" />
      </mesh>
    </group>
  );
}

function Lens({ size = 0.15 }: { size?: number }) {
  return (
    <group>
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[size, size, 0.05, 32]} />
        <meshStandardMaterial color="#93A0AC" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[size * 0.8, size * 0.8, 0.02, 32]} />
        <meshPhysicalMaterial
          color="#04060A"
          metalness={0.85}
          roughness={0.06}
          clearcoat={1}
          clearcoatRoughness={0.04}
          iridescence={0.7}
          iridescenceIOR={1.7}
        />
      </mesh>
      <mesh position={[0, 0, 0.045]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[size * 0.4, size * 0.4, 0.008, 24]} />
        <meshStandardMaterial
          color="#173A55"
          metalness={0.6}
          roughness={0.12}
          emissive="#0A2333"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[-size * 0.28, size * 0.24, 0.052]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[size * 0.09, size * 0.09, 0.004, 12]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function Chip({
  position,
  size,
  color = "#151B21",
  metalness = 0.55,
  roughness = 0.4,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  metalness?: number;
  roughness?: number;
}) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Screen artwork                                                     */
/* ------------------------------------------------------------------ */

function useScreenTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const bg = ctx.createLinearGradient(0, 0, 0, 1024);
    bg.addColorStop(0, "#101821");
    bg.addColorStop(0.42, "#0A0F15");
    bg.addColorStop(1, "#05080B");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 1024);

    const warm = ctx.createRadialGradient(256, 300, 30, 256, 330, 430);
    warm.addColorStop(0, "rgba(255,107,53,0.42)");
    warm.addColorStop(0.45, "rgba(255,107,53,0.15)");
    warm.addColorStop(1, "rgba(255,107,53,0)");
    ctx.fillStyle = warm;
    ctx.fillRect(0, 0, 512, 1024);

    const cool = ctx.createRadialGradient(438, 880, 20, 438, 880, 380);
    cool.addColorStop(0, "rgba(90,140,190,0.16)");
    cool.addColorStop(1, "rgba(90,140,190,0)");
    ctx.fillStyle = cool;
    ctx.fillRect(0, 0, 512, 1024);

    const font = (weight: number, size: number) =>
      `${weight} ${size}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Arial, sans-serif`;

    // Status bar
    ctx.fillStyle = "#F2EFE7";
    ctx.font = font(600, 24);
    ctx.fillText("9:41", 38, 58);

    ctx.strokeStyle = "rgba(242,239,231,0.75)";
    ctx.lineWidth = 2;
    ctx.strokeRect(430, 40, 34, 17);
    ctx.fillStyle = "rgba(242,239,231,0.85)";
    ctx.fillRect(433, 43, 24, 11);
    ctx.fillRect(467, 45, 3, 7);

    ctx.fillStyle = "rgba(242,239,231,0.55)";
    for (let i = 0; i < 4; i += 1) {
      ctx.fillRect(368 + i * 10, 48 - i * 3, 6, 26 + i * 3);
    }

    // Wordmark
    ctx.fillStyle = ACCENT;
    ctx.font = font(700, 19);
    ctx.fillText("PATCHWORK", 38, 126);

    // Progress ring
    const cx = 256;
    const cy = 318;
    const radius = 118;

    ctx.lineWidth = 18;
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    const ringGradient = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
    ringGradient.addColorStop(0, "#FF6B35");
    ringGradient.addColorStop(1, "#FFC7A8");
    ctx.strokeStyle = ringGradient;
    ctx.lineCap = "round";
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.62);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = font(700, 80);
    ctx.fillText("62%", cx, cy + 20);
    ctx.fillStyle = "#FFB08B";
    ctx.font = font(600, 17);
    ctx.fillText("IN REPAIR", cx, cy + 58);
    ctx.textAlign = "left";

    // Ticket line
    ctx.textAlign = "center";
    ctx.fillStyle = "#F2EFE7";
    ctx.font = font(700, 36);
    ctx.fillText("PW-1041", 256, 512);
    ctx.fillStyle = "#9AA6B2";
    ctx.font = font(500, 20);
    ctx.fillText("iPhone 15 Pro · Maya Chen", 256, 548);
    ctx.textAlign = "left";

    // Detail card
    ctx.fillStyle = "rgba(10,15,20,0.72)";
    ctx.strokeStyle = "rgba(255,255,255,0.09)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(26, 590, 460, 350, 30);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#7F8B98";
    ctx.font = font(600, 16);
    ctx.fillText("NEXT STEP", 58, 636);

    ctx.fillStyle = "#F2EFE7";
    ctx.font = font(600, 27);
    ctx.fillText("Battery + display", 58, 672);

    ctx.fillStyle = "#8B97A3";
    ctx.font = font(500, 17);
    ctx.fillText("2 parts assigned · QA today", 58, 700);

    const steps = ["Intake", "Diagnosis", "Repair", "QA"];
    steps.forEach((label, index) => {
      const x = 82 + index * 116;
      const done = index < 2;
      const current = index === 2;
      ctx.beginPath();
      ctx.arc(x, 752, 10, 0, Math.PI * 2);
      ctx.fillStyle = done ? "#3E5A4B" : current ? ACCENT : "#1B242E";
      ctx.fill();
      if (current) {
        ctx.beginPath();
        ctx.arc(x, 752, 16, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,107,53,0.4)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.fillStyle = done || current ? "#F2EFE7" : "#68737F";
      ctx.font = font(500, 15);
      ctx.textAlign = "center";
      ctx.fillText(label, x, 786);
      ctx.textAlign = "left";
    });

    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.beginPath();
    ctx.moveTo(58, 812);
    ctx.lineTo(454, 812);
    ctx.stroke();

    ctx.fillStyle = "#7F8B98";
    ctx.font = font(600, 15);
    ctx.fillText("TECHNICIAN", 58, 848);
    ctx.fillText("EST. READY", 300, 848);

    ctx.fillStyle = "#F2EFE7";
    ctx.font = font(600, 20);
    ctx.fillText("Demo Admin", 58, 880);
    ctx.fillText("Today, 4:30 PM", 300, 880);

    ctx.fillStyle = "#39424C";
    ctx.beginPath();
    ctx.roundRect(196, 986, 120, 6, 3);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }, []);
}

/* ------------------------------------------------------------------ */
/*  Layout groups                                                      */
/* ------------------------------------------------------------------ */

function ActiveGroup({
  active,
  rest,
  lift,
  glow = 1.6,
  children,
}: {
  active: boolean;
  rest: [number, number, number];
  lift: [number, number, number];
  glow?: number;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    const targetX = rest[0] + (active ? lift[0] : 0);
    const targetY = rest[1] + (active ? lift[1] : 0);
    const targetZ = rest[2] + (active ? lift[2] : 0);
    group.current.position.x = damp(group.current.position.x, targetX, 6, delta);
    group.current.position.y = damp(group.current.position.y, targetY, 6, delta);
    group.current.position.z = damp(group.current.position.z, targetZ, 6, delta);

    if (light.current) {
      light.current.intensity = damp(light.current.intensity, active ? glow : 0, 5, delta);
    }
  });

  return (
    <group ref={group} position={rest}>
      {children}
      <pointLight
        ref={light}
        position={[0, 0, 0.5]}
        intensity={0}
        color={ACCENT}
        distance={2.6}
        decay={2}
      />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Display                                                            */
/* ------------------------------------------------------------------ */

function DisplayAssembly({ active }: { active: boolean }) {
  const screen = useScreenTexture();
  const glass = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!glass.current) return;
    glass.current.rotation.z = -0.055 + Math.sin(state.clock.elapsedTime * 0.4) * 0.006;
  });

  return (
    <ActiveGroup active={active} rest={[-2.5, 0.5, 0.9]} lift={[-0.22, 0.38, 0.7]}>
      <group ref={glass} rotation={[0.01, 0.16, -0.055]}>
        <RoundedBox
          args={[2.16, 4.4, 0.1]}
          radius={0.3}
          smoothness={5}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={TITANIUM} metalness={1} roughness={0.26} />
        </RoundedBox>

        <RoundedBox
          args={[2.04, 4.28, 0.03]}
          radius={0.24}
          smoothness={5}
          position={[0, 0, 0.055]}
        >
          <meshPhysicalMaterial
            color="#05080B"
            metalness={0.35}
            roughness={0.05}
            clearcoat={1}
            clearcoatRoughness={0.03}
          />
        </RoundedBox>

        {screen ? (
          <mesh position={[0, 0, 0.073]}>
            <planeGeometry args={[1.9, 4.12]} />
            <meshBasicMaterial map={screen} toneMapped={false} />
          </mesh>
        ) : null}

        <mesh position={[0, 1.94, 0.08]}>
          <capsuleGeometry args={[0.075, 0.3, 8, 24]} />
          <meshBasicMaterial color="#010304" />
        </mesh>

        <mesh position={[0.55, -2.18, 0.01]} rotation={[0.18, 0, 0]}>
          <boxGeometry args={[0.48, 0.1, 0.035]} />
          <meshStandardMaterial color={ACCENT} metalness={0.3} roughness={0.45} />
        </mesh>

        <Screw position={[-0.92, -2.02, 0.055]} scale={0.8} />
        <Screw position={[0.92, -2.02, 0.055]} scale={0.8} />
      </group>
    </ActiveGroup>
  );
}

/* ------------------------------------------------------------------ */
/*  Back panel                                                         */
/* ------------------------------------------------------------------ */

function BackPanel() {
  return (
    <group position={[2.5, 0.2, -0.9]} rotation={[0.01, -0.12, 0.045]}>
      <RoundedBox args={[2.24, 4.48, 0.1]} radius={0.32} smoothness={5} receiveShadow>
        <meshStandardMaterial color={TITANIUM} metalness={1} roughness={0.26} />
      </RoundedBox>

      <RoundedBox
        args={[2.14, 4.38, 0.06]}
        radius={0.3}
        smoothness={5}
        position={[0, 0, 0.045]}
      >
        <meshPhysicalMaterial
          color="#333C46"
          metalness={0.7}
          roughness={0.24}
          clearcoat={1}
          clearcoatRoughness={0.16}
          envMapIntensity={1.35}
        />
      </RoundedBox>

      <group position={[0.58, 1.62, 0.09]}>
        <RoundedBox args={[0.82, 0.82, 0.05]} radius={0.16} smoothness={4} castShadow>
          <meshStandardMaterial color="#3A434D" metalness={0.9} roughness={0.22} />
        </RoundedBox>
        <group position={[-0.17, 0.17, 0.03]}>
          <Lens size={0.15} />
        </group>
        <group position={[-0.17, -0.17, 0.03]}>
          <Lens size={0.15} />
        </group>
        <group position={[0.19, 0, 0.03]}>
          <Lens size={0.15} />
        </group>
        <mesh position={[0.2, 0.26, 0.032]}>
          <boxGeometry args={[0.08, 0.08, 0.012]} />
          <meshStandardMaterial color="#F4E9D2" emissive="#FFD9A0" emissiveIntensity={0.5} />
        </mesh>
      </group>

      <group position={[0, -0.3, 0.088]}>
        {[
          [-0.09, 0.09],
          [0.09, 0.09],
          [-0.09, -0.09],
          [0.09, -0.09],
        ].map(([x, y], index) => (
          <mesh key={index} position={[x, y, 0]}>
            <boxGeometry args={[0.12, 0.12, 0.012]} />
            <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.35} />
          </mesh>
        ))}
      </group>

      <mesh position={[0, -2.06, 0.08]}>
        <boxGeometry args={[0.7, 0.02, 0.012]} />
        <meshBasicMaterial color="#11161B" />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Chassis + internals                                                */
/* ------------------------------------------------------------------ */

function Chassis() {
  return (
    <group>
      <RoundedBox args={[2.24, 4.5, 0.42]} radius={0.32} smoothness={5} castShadow receiveShadow>
        <meshStandardMaterial color={TITANIUM} metalness={1} roughness={0.25} />
      </RoundedBox>

      <RoundedBox
        args={[2.1, 4.36, 0.34]}
        radius={0.26}
        smoothness={4}
        position={[0, 0, 0.02]}
      >
        <meshStandardMaterial color="#2A333D" metalness={0.62} roughness={0.44} />
      </RoundedBox>

      <mesh position={[0, 0, 0.196]}>
        <boxGeometry args={[2.02, 4.3, 0.012]} />
        <meshStandardMaterial color="#333D48" metalness={0.7} roughness={0.42} />
      </mesh>

      {/* rails + contacts */}
      <mesh position={[0, 2.05, 0.21]}>
        <boxGeometry args={[1.72, 0.05, 0.02]} />
        <meshStandardMaterial color="#C8A96B" metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[0, -2.12, 0.21]}>
        <boxGeometry args={[0.9, 0.03, 0.02]} />
        <meshStandardMaterial color="#0A0E12" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* edge buttons */}
      <mesh position={[1.14, 0.82, 0]}>
        <boxGeometry args={[0.045, 0.34, 0.14]} />
        <meshStandardMaterial color={TITANIUM} metalness={1} roughness={0.22} />
      </mesh>
      <mesh position={[1.14, 0.34, 0]}>
        <boxGeometry args={[0.045, 0.5, 0.14]} />
        <meshStandardMaterial color={TITANIUM} metalness={1} roughness={0.22} />
      </mesh>
      <mesh position={[1.14, -0.26, 0]}>
        <boxGeometry args={[0.045, 0.5, 0.14]} />
        <meshStandardMaterial color={TITANIUM} metalness={1} roughness={0.22} />
      </mesh>

      {/* bottom edge: USB-C, speaker, mic */}
      <mesh position={[0, -2.27, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.52, 0.045, 0.16]} />
        <meshStandardMaterial color="#05080B" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, -2.273, 0]}>
        <boxGeometry args={[0.4, 0.02, 0.1]} />
        <meshStandardMaterial color="#020304" metalness={0.2} roughness={0.58} />
      </mesh>
      {[-0.52, -0.44, -0.36, 0.36, 0.44, 0.52].map((x, index) => (
        <mesh key={index} position={[x, -2.275, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.02, 12]} />
          <meshStandardMaterial color="#05080B" metalness={0.3} roughness={0.6} />
        </mesh>
      ))}

      {/* antenna lines */}
      <mesh position={[0, 1.62, 0.212]}>
        <boxGeometry args={[2.02, 0.012, 0.004]} />
        <meshStandardMaterial color="#2D353E" metalness={0.3} roughness={0.8} />
      </mesh>
      <mesh position={[0, -1.5, 0.212]}>
        <boxGeometry args={[2.02, 0.012, 0.004]} />
        <meshStandardMaterial color="#2D353E" metalness={0.3} roughness={0.8} />
      </mesh>

      {/* taptic engine */}
      <group position={[0.5, -1.62, 0.22]}>
        <RoundedBox args={[0.52, 0.4, 0.09]} radius={0.05} smoothness={2} castShadow>
          <meshStandardMaterial color="#3E464F" metalness={0.85} roughness={0.32} />
        </RoundedBox>
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[0.38, 0.26, 0.012]} />
          <meshStandardMaterial color="#171D24" metalness={0.5} roughness={0.6} />
        </mesh>
        <mesh position={[0.14, 0.1, 0.052]}>
          <boxGeometry args={[0.08, 0.05, 0.008]} />
          <meshStandardMaterial color="#C8A96B" metalness={1} roughness={0.28} />
        </mesh>
      </group>

      <Screw position={[-0.92, 2.02, 0.2]} scale={0.9} />
      <Screw position={[0.92, 2.02, 0.2]} scale={0.9} />
      <Screw position={[-0.92, -2.02, 0.2]} scale={0.9} />
      <Screw position={[0.92, -2.02, 0.2]} scale={0.9} />
    </group>
  );
}

function BatteryPack({ active }: { active: boolean }) {
  return (
    <ActiveGroup active={active} rest={[-0.48, -0.92, 0.22]} lift={[-0.05, 1.0, 0.7]}>
      <RoundedBox args={[0.96, 1.86, 0.1]} radius={0.07} smoothness={3} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#48515C"
          metalness={0.62}
          roughness={0.38}
          clearcoat={0.6}
          clearcoatRoughness={0.3}
        />
      </RoundedBox>

      <mesh position={[0, 0.72, 0.056]}>
        <boxGeometry args={[0.8, 0.1, 0.008]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.55} />
      </mesh>

      <mesh position={[-0.23, -0.1, 0.057]}>
        <boxGeometry args={[0.008, 1.2, 0.006]} />
        <meshBasicMaterial color="#171C22" />
      </mesh>
      <mesh position={[0.23, -0.1, 0.057]}>
        <boxGeometry args={[0.008, 1.2, 0.006]} />
        <meshBasicMaterial color="#171C22" />
      </mesh>

      <mesh position={[0, -0.34, 0.057]}>
        <boxGeometry args={[0.62, 0.42, 0.004]} />
        <meshStandardMaterial color="#505A65" metalness={0.35} roughness={0.55} />
      </mesh>
      <mesh position={[0, -0.34, 0.06]}>
        <boxGeometry args={[0.4, 0.012, 0.004]} />
        <meshBasicMaterial color="#9AA5B1" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, -0.38, 0.06]}>
        <boxGeometry args={[0.3, 0.012, 0.004]} />
        <meshBasicMaterial color="#9AA5B1" transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, -0.42, 0.06]}>
        <boxGeometry args={[0.24, 0.012, 0.004]} />
        <meshBasicMaterial color="#9AA5B1" transparent opacity={0.3} />
      </mesh>

      <mesh position={[0, -0.8, 0.06]}>
        <boxGeometry args={[0.52, 0.08, 0.014]} />
        <meshStandardMaterial color="#C8A96B" metalness={1} roughness={0.28} />
      </mesh>

      <mesh position={[0.36, -0.94, 0.06]}>
        <boxGeometry args={[0.1, 0.04, 0.01]} />
        <meshStandardMaterial color="#0A0E12" metalness={0.4} roughness={0.6} />
      </mesh>

      <mesh position={[0.44, 0.86, 0.05]}>
        <boxGeometry args={[0.06, 0.16, 0.012]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.35} />
      </mesh>

      <mesh position={[-0.24, -1.0, 0.03]} rotation={[0, 0, 0.12]}>
        <boxGeometry args={[0.14, 0.18, 0.012]} />
        <meshStandardMaterial color="#0D1116" metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[0.02, -1.0, 0.03]} rotation={[0, 0, -0.12]}>
        <boxGeometry args={[0.14, 0.18, 0.012]} />
        <meshStandardMaterial color="#0D1116" metalness={0.3} roughness={0.6} />
      </mesh>
    </ActiveGroup>
  );
}

function LogicBoard({ active }: { active: boolean }) {
  const capacitors: Array<[number, number]> = [
    [-0.34, -0.62],
    [-0.22, -0.62],
    [-0.1, -0.62],
    [0.3, -0.64],
    [0.38, -0.64],
    [-0.34, 0.14],
    [0.32, 0.2],
    [0.38, 0.05],
    [-0.3, -0.18],
  ];

  return (
    <ActiveGroup active={active} rest={[0.48, 0.35, 0.22]} lift={[0.05, 1.05, 0.7]}>
      <RoundedBox args={[0.94, 2.02, 0.06]} radius={0.03} smoothness={2} castShadow receiveShadow>
        <meshStandardMaterial color="#1A4F3C" metalness={0.35} roughness={0.55} />
      </RoundedBox>

      <mesh position={[0, 0, 0.035]}>
        <boxGeometry args={[0.86, 1.94, 0.004]} />
        <meshStandardMaterial color="#174C39" metalness={0.4} roughness={0.6} />
      </mesh>

      <mesh position={[-0.39, 0.4, 0.046]}>
        <boxGeometry args={[0.032, 1.2, 0.012]} />
        <meshStandardMaterial color="#B87333" metalness={1} roughness={0.28} />
      </mesh>

      {[0.62, 0.42, 0.22, 0.02, -0.2, -0.42].map((y, index) => (
        <mesh key={index} position={[0.04 + (index % 2) * 0.18, y, 0.042]}>
          <boxGeometry args={[0.3, 0.008, 0.004]} />
          <meshStandardMaterial color="#C8A96B" metalness={0.8} roughness={0.36} />
        </mesh>
      ))}

      {/* shield cans */}
      <RoundedBox
        args={[0.38, 0.3, 0.05]}
        radius={0.02}
        smoothness={2}
        position={[-0.2, 0.66, 0.055]}
        castShadow
      >
        <meshStandardMaterial color="#6E7B88" metalness={1} roughness={0.32} />
      </RoundedBox>
      <RoundedBox
        args={[0.26, 0.22, 0.045]}
        radius={0.02}
        smoothness={2}
        position={[0.22, 0.28, 0.05]}
        castShadow
      >
        <meshStandardMaterial color="#5F6C79" metalness={1} roughness={0.36} />
      </RoundedBox>

      <group position={[0.28, 0.52, 0.05]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.11, 0.018, 24]} />
          <meshStandardMaterial color="#B87333" metalness={1} roughness={0.3} />
        </mesh>
        {[0.038, 0.07, 0.1].map((radius, index) => (
          <mesh key={index} position={[0, 0, 0.014]}>
            <torusGeometry args={[radius, 0.006, 8, 32]} />
            <meshStandardMaterial color="#7A4A22" metalness={0.9} roughness={0.34} />
          </mesh>
        ))}
      </group>

      <Chip position={[-0.18, -0.12, 0.05]} size={[0.22, 0.18, 0.04]} color="#0C1116" />
      <Chip position={[0.2, -0.3, 0.05]} size={[0.14, 0.12, 0.035]} color="#C8A96B" metalness={0.9} />
      <Chip position={[-0.22, 0.2, 0.05]} size={[0.11, 0.09, 0.03]} color="#0B1015" />
      <Chip position={[0.26, 0.72, 0.045]} size={[0.08, 0.1, 0.03]} color="#C8A96B" metalness={0.9} />
      <Chip position={[0.02, 0.58, 0.05]} size={[0.06, 0.06, 0.03]} color="#0B1015" />
      <Chip position={[-0.3, -0.5, 0.05]} size={[0.08, 0.12, 0.028]} color="#0B1015" />
      <Chip position={[0.3, -0.56, 0.05]} size={[0.06, 0.08, 0.026]} color="#1A222A" />
      <Chip position={[0.12, -0.68, 0.05]} size={[0.09, 0.06, 0.026]} color="#C8A96B" metalness={0.85} />

      {[-0.28, -0.24, -0.2, -0.16, -0.12].map((x, index) => (
        <mesh key={index} position={[x, -0.225, 0.056]}>
          <boxGeometry args={[0.014, 0.028, 0.006]} />
          <meshStandardMaterial color="#D8B266" metalness={1} roughness={0.24} />
        </mesh>
      ))}

      {capacitors.map(([x, y], index) => (
        <mesh key={index} position={[x, y, 0.045]}>
          <boxGeometry args={[0.05, 0.03, 0.022]} />
          <meshStandardMaterial color="#C7B48E" metalness={0.3} roughness={0.6} />
        </mesh>
      ))}

      <mesh position={[0, 0.94, 0.05]}>
        <boxGeometry args={[0.54, 0.04, 0.02]} />
        <meshStandardMaterial color="#C8A96B" metalness={1} roughness={0.26} />
      </mesh>
      <mesh position={[0, -0.94, 0.05]}>
        <boxGeometry args={[0.62, 0.05, 0.02]} />
        <meshStandardMaterial color="#0A0E12" metalness={0.5} roughness={0.5} />
      </mesh>
    </ActiveGroup>
  );
}

function CameraModule({ active }: { active: boolean }) {
  return (
    <ActiveGroup active={active} rest={[0.52, 1.68, 0.22]} lift={[0.05, 0.95, 0.75]}>
      <RoundedBox args={[0.72, 0.72, 0.1]} radius={0.1} smoothness={3} castShadow receiveShadow>
        <meshStandardMaterial color="#2C333B" metalness={0.92} roughness={0.24} />
      </RoundedBox>

      <group position={[-0.15, 0.15, 0.06]}>
        <Lens size={0.135} />
      </group>
      <group position={[0.16, 0.15, 0.06]}>
        <Lens size={0.135} />
      </group>
      <group position={[-0.15, -0.16, 0.06]}>
        <Lens size={0.135} />
      </group>

      <mesh position={[0.18, -0.17, 0.06]}>
        <boxGeometry args={[0.1, 0.1, 0.012]} />
        <meshStandardMaterial color="#F2E3C8" emissive="#FFD9A0" emissiveIntensity={0.7} />
      </mesh>

      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[0.56, 0.56, 0.03]} />
        <meshStandardMaterial color="#0A0E12" metalness={0.4} roughness={0.6} />
      </mesh>
    </ActiveGroup>
  );
}

/* ------------------------------------------------------------------ */
/*  Stage                                                              */
/* ------------------------------------------------------------------ */

function GuideLines({ showBack = true }: { showBack?: boolean }) {
  return (
    <group>
      <Line
        points={[
          [-1.4, -1.62, 0.9],
          [-1.1, -1.9, 0.26],
        ]}
        color={ACCENT}
        lineWidth={1.1}
        dashed
        dashSize={0.08}
        gapSize={0.06}
        transparent
        opacity={0.32}
      />
      <Line
        points={[
          [-1.4, 2.52, 0.9],
          [-1.1, 2.2, 0.26],
        ]}
        color={ACCENT}
        lineWidth={1.1}
        dashed
        dashSize={0.08}
        gapSize={0.06}
        transparent
        opacity={0.32}
      />
      {showBack ? (
        <>
          <Line
            points={[
              [1.12, -1.95, 0.26],
              [1.45, -1.9, -0.8],
            ]}
            color={ACCENT}
            lineWidth={1.1}
            dashed
            dashSize={0.08}
            gapSize={0.06}
            transparent
            opacity={0.24}
          />
          <Line
            points={[
              [1.12, 2.2, 0.26],
              [1.45, 2.3, -0.8],
            ]}
            color={ACCENT}
            lineWidth={1.1}
            dashed
            dashSize={0.08}
            gapSize={0.06}
            transparent
            opacity={0.24}
          />
        </>
      ) : null}
    </group>
  );
}

function StageGlow() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const glow = ctx.createRadialGradient(256, 256, 10, 256, 256, 250);
    glow.addColorStop(0, "rgba(255,196,158,0.18)");
    glow.addColorStop(0.45, "rgba(255,124,76,0.07)");
    glow.addColorStop(1, "rgba(255,107,53,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 512, 512);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  if (!texture) return null;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.1, -2.328, 0]}>
      <planeGeometry args={[13, 9]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function Stage({ compact }: { compact: boolean }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.34, 0]} receiveShadow>
        <planeGeometry args={[36, 36]} />
        {compact ? (
          <meshStandardMaterial color="#0A0D11" metalness={0.35} roughness={0.75} />
        ) : (
          <MeshReflectorMaterial
            blur={[180, 55]}
            resolution={512}
            mixBlur={0.9}
            mixStrength={6}
            roughness={0.58}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#10161C"
            metalness={0.5}
          />
        )}
      </mesh>

      <StageGlow />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.2, -2.325, 0.1]}>
        <ringGeometry args={[3.35, 3.375, 128]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.35} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.2, -2.324, 0.1]}>
        <ringGeometry args={[4.2, 4.215, 128]} />
        <meshBasicMaterial color="#7E8B99" transparent opacity={0.16} />
      </mesh>
    </group>
  );
}

function Backdrop() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#05070A";
    ctx.fillRect(0, 0, 1024, 512);

    const glow = ctx.createRadialGradient(590, 210, 20, 590, 250, 560);
    glow.addColorStop(0, "#26323D");
    glow.addColorStop(0.42, "#121920");
    glow.addColorStop(1, "#05070A");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1024, 512);

    const accent = ctx.createRadialGradient(760, 120, 10, 760, 150, 430);
    accent.addColorStop(0, "rgba(255,107,53,0.20)");
    accent.addColorStop(0.5, "rgba(255,107,53,0.05)");
    accent.addColorStop(1, "rgba(255,107,53,0)");
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, 1024, 512);

    const cool = ctx.createRadialGradient(300, 300, 20, 300, 300, 380);
    cool.addColorStop(0, "rgba(110,154,193,0.10)");
    cool.addColorStop(1, "rgba(110,154,193,0)");
    ctx.fillStyle = cool;
    ctx.fillRect(0, 0, 1024, 512);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  if (!texture) return null;

  return (
    <mesh position={[0, 1.1, -12]}>
      <planeGeometry args={[42, 23]} />
      <meshBasicMaterial map={texture} toneMapped={false} depthWrite={false} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Scene                                                              */
/* ------------------------------------------------------------------ */

function CameraRig({ compact }: { compact: boolean }) {
  const { size } = useThree();

  const config = useMemo(() => {
    const aspect = Math.max(size.width, 1) / Math.max(size.height, 1);
    const narrow = aspect < 1.15;
    const fov = compact ? 30 : 28;
    const halfTan = Math.tan((fov * Math.PI) / 360);
    const fitHeight = (compact ? 5.9 : narrow ? 6.2 : 6.4) / (2 * halfTan);
    const fitWidth = (compact ? 5.9 : narrow ? 5.9 : 8.2) / (2 * halfTan * aspect);
    const distance = Math.max(fitHeight, fitWidth) * 1.05;
    const target = new THREE.Vector3(compact || narrow ? -1.15 : 0, narrow ? 0.42 : 0.2, 0);
    const direction = new THREE.Vector3(0.48, 0.22, 0.85).normalize();
    const position = target.clone().addScaledVector(direction, distance);

    const probe = new THREE.PerspectiveCamera(fov, aspect, 0.1, 100);
    probe.position.copy(position);
    probe.lookAt(target);

    return {
      fov,
      near: Math.max(0.1, distance / 50),
      far: distance * 8,
      position,
      quaternion: probe.quaternion.clone(),
    };
  }, [compact, size.height, size.width]);

  return (
    <PerspectiveCamera
      makeDefault
      fov={config.fov}
      near={config.near}
      far={config.far}
      position={config.position}
      quaternion={config.quaternion}
    />
  );
}

function Scene({
  activeLayer,
  reduced,
  compact,
}: {
  activeLayer: LayerId;
  reduced: boolean;
  compact: boolean;
}) {
  const rig = useRef<THREE.Group>(null);
  const { size } = useThree();
  const narrow = size.width / Math.max(size.height, 1) < 1.15;

  useFrame((state, delta) => {
    if (!rig.current) return;
    const t = state.clock.elapsedTime;
    const pointerX = reduced ? 0 : state.pointer.x;
    const pointerY = reduced ? 0 : state.pointer.y;
    const sway = reduced ? 0 : Math.sin(t * 0.28) * 0.018;
    rig.current.rotation.y = damp(rig.current.rotation.y, -0.05 + pointerX * 0.04 + sway, 3, delta);
    rig.current.rotation.x = damp(rig.current.rotation.x, 0.015 + pointerY * 0.016, 3, delta);
    rig.current.position.y = damp(
      rig.current.position.y,
      0.22 + (reduced ? 0 : Math.sin(t * 0.5) * 0.02),
      2.5,
      delta,
    );
  });

  return (
    <>
      <Backdrop />
      <group ref={rig} position={[0, 0.22, 0]}>
        <Stage compact={compact || narrow} />

        <Chassis />
        {!compact && !narrow ? <BackPanel /> : null}
        <BatteryPack active={activeLayer === "battery"} />
        <LogicBoard active={activeLayer === "board"} />
        <CameraModule active={activeLayer === "camera"} />
        <DisplayAssembly active={activeLayer === "screen"} />

        
        <GuideLines showBack={!compact && !narrow} />

        <Sparkles
          count={compact ? 18 : 34}
          scale={[9, 5, 6]}
          position={[0, 0.4, 0]}
          size={1.1}
          speed={0.12}
          color="#FFD8C4"
          opacity={0.22}
        />

        <ContactShadows
          position={[0, -2.33, 0]}
          opacity={0.7}
          scale={13}
          blur={2.4}
          far={5}
          resolution={512}
          color="#000000"
        />
      </group>
    </>
  );
}

export default function RepairScene({
  activeLayer,
  reduced = false,
  compact = false,
}: {
  activeLayer: LayerId;
  reduced?: boolean;
  compact?: boolean;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{
        position: compact ? [2.2, 1.6, 9] : [3.2, 2.1, 12],
        fov: compact ? 30 : 28,
      }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.12;
      }}
    >
      <CameraRig compact={compact} />
      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.6}
          color="#FFFFFF"
          position={[0, 7, 3]}
          scale={[9, 3, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#FF6B35"
          position={[-7, 1.5, 4]}
          scale={[3, 7, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.8}
          color="#7FA8CC"
          position={[7, 0.5, -2]}
          scale={[3, 6, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="ring"
          intensity={1.2}
          color="#FFFFFF"
          position={[0, 3, -7]}
          scale={5}
          target={[0, 0, 0]}
        />
      </Environment>

      <ambientLight intensity={0.4} />
      <directionalLight
        castShadow
        position={[3.5, 9, 7]}
        intensity={3.2}
        color="#FFF2E2"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={22}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
      />
      <directionalLight position={[-4, 3, 8]} intensity={0.9} color="#DCE6F0" />
      <directionalLight position={[-6, 3, 2]} intensity={1.8} color="#FF6B35" />
      <pointLight position={[-3, 0.4, 4]} intensity={3.5} color="#7FA8CC" distance={9} />
      <pointLight position={[4.2, 2.6, 1.6]} intensity={2.2} color="#FFD9C0" distance={7} />
      <pointLight position={[-0.2, 0.7, 3.4]} intensity={7} color="#FFF6EC" distance={7} />

      <Scene activeLayer={activeLayer} reduced={reduced} compact={compact} />

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.62}
          luminanceThreshold={0.82}
          luminanceSmoothing={0.4}
          mipmapBlur
          radius={0.72}
        />
        <Vignette offset={0.24} darkness={0.62} eskil={false} />
      </EffectComposer>
    </Canvas>
  );
}
