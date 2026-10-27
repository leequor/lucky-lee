"use client";

import { ContactShadows, Grid, Line, RoundedBox, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type LayerId = "screen" | "battery" | "board" | "camera";

function ActiveGroup({
  active,
  baseY,
  lift = 0.16,
  children,
}: {
  active: boolean;
  baseY: number;
  lift?: number;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      active ? baseY + lift : baseY,
      7,
      delta,
    );
  });

  return (
    <group ref={group} position={[0, baseY, 0]}>
      {children}
    </group>
  );
}

function Screw({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.032, 20]} />
        <meshStandardMaterial color="#B9C2CA" metalness={0.95} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.018, 0]}>
        <boxGeometry args={[0.036, 0.008, 0.006]} />
        <meshBasicMaterial color="#2A3038" />
      </mesh>
    </group>
  );
}

function DisplayAssembly({ active }: { active: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = 0.35 + Math.sin(state.clock.elapsedTime * 0.35) * 0.018;
  });

  return (
    <ActiveGroup active={active} baseY={0.6} lift={0.2}>
      <group ref={group} position={[-2.55, 0, 0.35]} rotation={[0.03, 0.35, 0]}>
        <RoundedBox args={[2.34, 4.66, 0.15]} radius={0.22} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color="#8F99A3" metalness={0.92} roughness={0.24} />
        </RoundedBox>
        <RoundedBox
          args={[2.12, 4.42, 0.035]}
          radius={0.15}
          smoothness={4}
          position={[0, 0, 0.09]}
        >
          <meshStandardMaterial
            color="#071018"
            metalness={0.3}
            roughness={0.2}
            emissive="#0B1A24"
            emissiveIntensity={0.65}
          />
        </RoundedBox>
        <mesh position={[0, 2.02, 0.115]}>
          <boxGeometry args={[0.5, 0.055, 0.02]} />
          <meshBasicMaterial color="#020407" />
        </mesh>
        <mesh position={[0, 0.18, 0.115]}>
          <boxGeometry args={[0.62, 0.1, 0.018]} />
          <meshStandardMaterial color="#FF6B35" emissive="#FF6B35" emissiveIntensity={2.1} />
        </mesh>
        <mesh position={[0, 0.18, 0.115]}>
          <boxGeometry args={[0.1, 0.62, 0.018]} />
          <meshStandardMaterial color="#FF6B35" emissive="#FF6B35" emissiveIntensity={2.1} />
        </mesh>
        <mesh position={[0, 1.22, 0.115]}>
          <boxGeometry args={[1.28, 0.025, 0.014]} />
          <meshBasicMaterial color="#FF6B35" transparent opacity={0.55} />
        </mesh>
        <mesh position={[-0.78, 1.86, 0.115]}>
          <boxGeometry args={[0.34, 0.07, 0.014]} />
          <meshBasicMaterial color="#F2EFE7" transparent opacity={0.38} />
        </mesh>
        <mesh position={[0, -0.3, 0.115]}>
          <boxGeometry args={[1.42, 0.055, 0.014]} />
          <meshBasicMaterial color="#FF6B35" transparent opacity={0.72} />
        </mesh>
        <mesh position={[-0.12, -0.62, 0.115]}>
          <boxGeometry args={[1.16, 0.035, 0.014]} />
          <meshBasicMaterial color="#F2EFE7" transparent opacity={0.2} />
        </mesh>
        <mesh position={[-0.22, -0.86, 0.115]}>
          <boxGeometry args={[0.94, 0.035, 0.014]} />
          <meshBasicMaterial color="#F2EFE7" transparent opacity={0.14} />
        </mesh>
        <mesh position={[0, -1.4, 0.115]}>
          <boxGeometry args={[1.42, 0.035, 0.014]} />
          <meshBasicMaterial color="#020407" />
        </mesh>
        <mesh position={[-0.25, -1.4, 0.116]}>
          <boxGeometry args={[0.9, 0.035, 0.014]} />
          <meshBasicMaterial color="#FF6B35" transparent opacity={0.8} />
        </mesh>
        <mesh position={[0.35, 1.8, 0.12]} rotation={[0, 0, 0.34]}>
          <planeGeometry args={[1.35, 0.06]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.05} />
        </mesh>
        <mesh position={[0, 0.82, 0.115]}>
          <boxGeometry args={[1.05, 0.02, 0.014]} />
          <meshBasicMaterial color="#F2EFE7" transparent opacity={0.22} />
        </mesh>
        <mesh position={[0, -1.28, 0.115]}>
          <boxGeometry args={[1.32, 0.02, 0.014]} />
          <meshBasicMaterial color="#F2EFE7" transparent opacity={0.14} />
        </mesh>
        <mesh position={[0, -1.48, 0.115]}>
          <boxGeometry args={[0.92, 0.02, 0.014]} />
          <meshBasicMaterial color="#F2EFE7" transparent opacity={0.1} />
        </mesh>
        <Screw position={[-0.92, -2.08, 0.09]} scale={0.7} />
        <Screw position={[0.92, -2.08, 0.09]} scale={0.7} />
      </group>
    </ActiveGroup>
  );
}

function BatteryPack({ active }: { active: boolean }) {
  return (
    <ActiveGroup active={active} baseY={-1.7} lift={0.14}>
      <group position={[-0.5, 0, 0.56]}>
        <RoundedBox args={[1.18, 0.2, 1.66]} radius={0.06} smoothness={3} castShadow receiveShadow>
          <meshStandardMaterial color="#3B6C57" metalness={0.32} roughness={0.5} />
        </RoundedBox>
        <mesh position={[0, 0.11, 0]}>
          <boxGeometry args={[0.94, 0.018, 0.07]} />
          <meshStandardMaterial color="#FF6B35" emissive="#FF6B35" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[-0.31, 0.11, 0]}>
          <boxGeometry args={[0.016, 0.016, 1.28]} />
          <meshBasicMaterial color="#0A100D" transparent opacity={0.65} />
        </mesh>
        <mesh position={[0.31, 0.11, 0]}>
          <boxGeometry args={[0.016, 0.016, 1.28]} />
          <meshBasicMaterial color="#0A100D" transparent opacity={0.65} />
        </mesh>
        <mesh position={[0.42, 0.09, -0.66]}>
          <boxGeometry args={[0.14, 0.03, 0.1]} />
          <meshStandardMaterial color="#E7B45A" metalness={0.85} roughness={0.24} />
        </mesh>
      </group>
    </ActiveGroup>
  );
}

function LogicBoard({ active }: { active: boolean }) {
  const chips: Array<[number, number, number, number]> = [
    [-0.4, 0.36, 0.26, 0.2],
    [0.32, 0.38, 0.2, 0.18],
    [-0.28, -0.08, 0.17, 0.15],
    [0.34, -0.18, 0.26, 0.2],
    [-0.03, -0.43, 0.38, 0.1],
  ];

  return (
    <ActiveGroup active={active} baseY={-1.69} lift={0.14}>
      <group position={[0.38, 0, -0.86]}>
        <RoundedBox args={[1.38, 0.08, 1.46]} radius={0.04} smoothness={2} castShadow receiveShadow>
          <meshStandardMaterial color="#1E5439" metalness={0.28} roughness={0.55} />
        </RoundedBox>
        {chips.map(([x, z, width, depth], index) => (
          <mesh key={index} position={[x, 0.06, z]} castShadow>
            <boxGeometry args={[width, 0.035, depth]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? "#688A75" : "#D0A45C"}
              metalness={0.62}
              roughness={0.35}
            />
          </mesh>
        ))}
        <mesh position={[0.46, 0.065, 0.48]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 20]} />
          <meshStandardMaterial color="#E7B45A" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[-0.53, 0.05, -0.48]}>
          <boxGeometry args={[0.12, 0.02, 0.36]} />
          <meshStandardMaterial color="#E7B45A" metalness={0.8} roughness={0.24} />
        </mesh>
        <mesh position={[0.52, 0.05, -0.48]}>
          <boxGeometry args={[0.12, 0.02, 0.4]} />
          <meshStandardMaterial color="#C7D1D8" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </ActiveGroup>
  );
}

function CameraModule({ active }: { active: boolean }) {
  const lenses: Array<[number, number]> = [
    [-0.16, 0.16],
    [0.16, 0.16],
    [-0.16, -0.16],
    [0.16, -0.16],
  ];

  return (
    <ActiveGroup active={active} baseY={-1.68} lift={0.14}>
      <group position={[0.5, 0, 1.5]}>
        <RoundedBox args={[0.74, 0.14, 0.74]} radius={0.06} smoothness={3} castShadow receiveShadow>
          <meshStandardMaterial color="#2B3744" metalness={0.75} roughness={0.25} />
        </RoundedBox>
        {lenses.map(([x, z], index) => (
          <group key={index} position={[x, 0.09, z]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.125, 0.125, 0.05, 24]} />
              <meshStandardMaterial color="#070B10" metalness={0.4} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.035]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.02, 24]} />
              <meshStandardMaterial color="#1D4E70" metalness={0.25} roughness={0.12} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 0.085, 0]}>
          <boxGeometry args={[0.54, 0.01, 0.01]} />
          <meshBasicMaterial color="#E7B45A" />
        </mesh>
      </group>
    </ActiveGroup>
  );
}

function RepairBench() {
  return (
    <group position={[0, -0.35, 0]}>
      <RoundedBox
        args={[9.6, 0.3, 6.4]}
        radius={0.16}
        smoothness={3}
        position={[0, -1.9, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#1B232C" metalness={0.22} roughness={0.78} />
      </RoundedBox>
      <mesh position={[0, -1.74, 0.02]}>
        <boxGeometry args={[9.25, 0.012, 6.05]} />
        <meshStandardMaterial color="#222C36" metalness={0.12} roughness={0.9} />
      </mesh>
      <Grid
        position={[0, -1.73, 0]}
        args={[9.5, 6.3]}
        cellSize={0.34}
        cellThickness={0.45}
        cellColor="#34414E"
        sectionSize={1.7}
        sectionThickness={0.8}
        sectionColor="#455566"
        fadeDistance={13}
        fadeStrength={1.5}
      />
      <mesh position={[0, -1.75, 3.18]}>
        <boxGeometry args={[9.4, 0.02, 0.03]} />
        <meshStandardMaterial color="#FF6B35" emissive="#FF6B35" emissiveIntensity={0.75} />
      </mesh>
    </group>
  );
}

function DeviceFrame() {
  return (
    <group position={[0.95, -1.82, 0]} rotation={[0, -0.04, 0]}>
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[2.2, 0.04, 4.32]} />
        <meshStandardMaterial color="#080C11" metalness={0.4} roughness={0.7} />
      </mesh>
      <RoundedBox args={[0.1, 0.16, 4.72]} radius={0.04} position={[-1.2, 0.03, 0]} castShadow>
        <meshStandardMaterial color="#8A95A0" metalness={0.94} roughness={0.24} />
      </RoundedBox>
      <RoundedBox args={[0.1, 0.16, 4.72]} radius={0.04} position={[1.2, 0.03, 0]} castShadow>
        <meshStandardMaterial color="#8A95A0" metalness={0.94} roughness={0.24} />
      </RoundedBox>
      <RoundedBox args={[2.5, 0.16, 0.1]} radius={0.04} position={[0, 0.03, 2.3]} castShadow>
        <meshStandardMaterial color="#8A95A0" metalness={0.94} roughness={0.24} />
      </RoundedBox>
      <RoundedBox args={[2.5, 0.16, 0.1]} radius={0.04} position={[0, 0.03, -2.3]} castShadow>
        <meshStandardMaterial color="#8A95A0" metalness={0.94} roughness={0.24} />
      </RoundedBox>
      <mesh position={[0, 0.045, -1.78]}>
        <boxGeometry args={[0.72, 0.05, 0.3]} />
        <meshStandardMaterial color="#1A2028" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.075, -1.78]}>
        <boxGeometry args={[0.5, 0.02, 0.18]} />
        <meshStandardMaterial color="#0A0E13" metalness={0.2} roughness={0.8} />
      </mesh>
      <Screw position={[-0.9, 0.1, 2.02]} scale={0.9} />
      <Screw position={[0.9, 0.1, 2.02]} scale={0.9} />
      <Screw position={[-0.9, 0.1, -2.02]} scale={0.9} />
      <Screw position={[0.9, 0.1, -2.02]} scale={0.9} />
      <Line
        points={[
          [-2.15, 0.25, 0.8],
          [-1.7, 0.15, 0.35],
          [-1.1, 0.08, -0.2],
          [-0.4, 0.06, -0.55],
        ]}
        color="#FF6B35"
        lineWidth={1.8}
        transparent
        opacity={0.85}
      />
    </group>
  );
}

function Tools() {
  return (
    <group>
      <group position={[3.15, -1.76, 1.2]} rotation={[0, -0.35, Math.PI / 2.7]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.075, 0.075, 1.02, 18]} />
          <meshStandardMaterial color="#FF6B35" metalness={0.45} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.73, 0]}>
          <cylinderGeometry args={[0.026, 0.026, 0.48, 12]} />
          <meshStandardMaterial color="#D3DBE2" metalness={0.96} roughness={0.16} />
        </mesh>
        <mesh position={[0, 0.98, 0]}>
          <boxGeometry args={[0.045, 0.06, 0.012]} />
          <meshStandardMaterial color="#F2F4F6" metalness={0.9} roughness={0.18} />
        </mesh>
      </group>
      <group position={[-3.3, -1.72, -1.1]} rotation={[0, 0.25, 0.08]}>
        <RoundedBox args={[0.14, 0.035, 1.5]} radius={0.04} smoothness={3} castShadow>
          <meshStandardMaterial color="#D6DDE2" metalness={0.2} roughness={0.3} />
        </RoundedBox>
        <RoundedBox args={[0.17, 0.04, 0.44]} radius={0.04} smoothness={3} position={[0, 0.005, -0.7]}>
          <meshStandardMaterial color="#FF6B35" metalness={0.3} roughness={0.45} />
        </RoundedBox>
      </group>
      <group position={[3.5, -1.76, -1.55]}>
        <RoundedBox args={[1.25, 0.08, 1.2]} radius={0.08} smoothness={3} castShadow receiveShadow>
          <meshStandardMaterial color="#1A222B" metalness={0.6} roughness={0.4} />
        </RoundedBox>
        <mesh position={[0, 0.055, 0]}>
          <boxGeometry args={[1.06, 0.012, 1.0]} />
          <meshStandardMaterial color="#0B0F14" metalness={0.3} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.061, 0.48]}>
          <boxGeometry args={[1.06, 0.012, 0.02]} />
          <meshStandardMaterial color="#FF6B35" emissive="#FF6B35" emissiveIntensity={0.5} />
        </mesh>
        <Screw position={[-0.25, 0.075, 0.12]} scale={0.7} />
        <Screw position={[0.24, 0.075, -0.1]} scale={0.7} />
        <Screw position={[0.02, 0.075, -0.36]} scale={0.55} />
      </group>
      {[
        [-2.7, -1.78, 2.15],
        [-2.1, -1.78, 2.4],
        [3.35, -1.78, -1.55],
        [2.55, -1.78, 2.5],
      ].map(([x, y, z], index) => (
        <Screw key={index} position={[x, y, z]} scale={0.75} />
      ))}
    </group>
  );
}

function Scene({ activeLayer, reduced }: { activeLayer: LayerId; reduced: boolean }) {
  const rig = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!rig.current || reduced) return;
    rig.current.rotation.y = THREE.MathUtils.damp(
      rig.current.rotation.y,
      state.pointer.x * 0.03,
      3,
      delta,
    );
    rig.current.rotation.x = THREE.MathUtils.damp(
      rig.current.rotation.x,
      state.pointer.y * 0.014,
      3,
      delta,
    );
  });

  return (
    <group ref={rig}>
      <RepairBench />
      <DeviceFrame />
      <BatteryPack active={activeLayer === "battery"} />
      <LogicBoard active={activeLayer === "board"} />
      <CameraModule active={activeLayer === "camera"} />
      <DisplayAssembly active={activeLayer === "screen"} />
      <Tools />
      <Sparkles
        count={30}
        scale={[8, 2.6, 5]}
        position={[0, -0.6, 0]}
        size={1.4}
        speed={0.12}
        color="#FF6B35"
        opacity={0.28}
      />
    </group>
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
      dpr={[1, 1.75]}
      camera={{ position: compact ? [5.2, 5.8, 8.6] : [5.6, 6.1, 9.2], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
      onCreated={({ camera }) => camera.lookAt(0, -0.35, 0)}
    >
      <ambientLight intensity={1.1} />
      <directionalLight
        castShadow
        position={[4.5, 8, 6]}
        intensity={4.6}
        color="#FFF1DF"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={20}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
      />
      <directionalLight position={[-5, 3, 4]} intensity={1.6} color="#FF6B35" />
      <pointLight position={[-2.5, 1.2, 2]} intensity={12} color="#FF6B35" distance={8} />
      <pointLight position={[-2.5, -0.2, 0.6]} intensity={5} color="#6E9AC1" distance={5} />
      <pointLight position={[3, 2, -4]} intensity={8} color="#6E9AC1" distance={10} />
      <Scene activeLayer={activeLayer} reduced={reduced} />
      <ContactShadows
        position={[0, -2.08, 0]}
        opacity={0.55}
        scale={13}
        blur={2.6}
        far={6}
        color="#000000"
      />
    </Canvas>
  );
}
