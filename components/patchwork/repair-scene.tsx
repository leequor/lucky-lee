"use client";

import { ContactShadows, Edges, Float, Grid, RoundedBox, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type LayerId = "screen" | "battery" | "board" | "camera";

type LayerProps = {
  active: boolean;
  baseZ: number;
  children: React.ReactNode;
};

function Layer({ active, baseZ, children }: LayerProps) {
  const group = useRef<THREE.Group>(null);
  const target = active ? baseZ + 0.34 : baseZ;

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.position.z = THREE.MathUtils.damp(
      group.current.position.z,
      target,
      8,
      delta,
    );
  });

  return (
    <group ref={group} position={[0, 0, baseZ]}>
      {children}
    </group>
  );
}

function ExplodedPhone({ activeLayer, reduced }: { activeLayer: LayerId; reduced: boolean }) {
  const rig = useRef<THREE.Group>(null);
  const screws = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!rig.current) return;
    if (!reduced) {
      rig.current.rotation.y = -0.82 + Math.sin(state.clock.elapsedTime * 0.32) * 0.06;
      rig.current.rotation.x = THREE.MathUtils.damp(
        rig.current.rotation.x,
        0.16 + state.pointer.y * 0.06,
        4,
        delta,
      );
      rig.current.rotation.z = THREE.MathUtils.damp(
        rig.current.rotation.z,
        -0.08 + state.pointer.x * 0.035,
        4,
        delta,
      );
      rig.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.06;
    }
    if (screws.current && !reduced) {
      screws.current.rotation.y -= delta * 0.12;
    }
  });

  return (
    <group ref={rig} rotation={[0.16, -0.82, -0.08]} scale={0.94} position={[-0.1, 0.05, 0]}>
      <Layer active={activeLayer === "screen"} baseZ={1.55}>
        <RoundedBox args={[2.46, 4.78, 0.12]} radius={0.24} smoothness={4}>
          <meshStandardMaterial color="#8C97A2" metalness={0.92} roughness={0.2} />
          <Edges scale={1.01} threshold={20} color="#5B6672" />
        </RoundedBox>
        <RoundedBox args={[2.34, 4.66, 0.08]} radius={0.2} smoothness={4} position={[0, 0, 0.04]}>
          <meshStandardMaterial color="#1A222B" metalness={0.55} roughness={0.2} />
        </RoundedBox>
        <RoundedBox args={[2.1, 4.4, 0.025]} radius={0.16} smoothness={4} position={[0, 0, 0.1]}>
          <meshStandardMaterial color="#0B1118" metalness={0.3} roughness={0.3} emissive="#16303D" emissiveIntensity={0.55} />
        </RoundedBox>
        <mesh position={[0, -2.02, 0.115]}>
          <boxGeometry args={[0.52, 0.035, 0.012]} />
          <meshBasicMaterial color="#F2EFE7" transparent opacity={0.45} />
        </mesh>
        <mesh position={[0, 0.3, 0.12]}>
          <boxGeometry args={[0.74, 0.105, 0.012]} />
          <meshStandardMaterial color="#FF6B35" emissive="#FF6B35" emissiveIntensity={1.4} />
        </mesh>
        <mesh position={[0, 0.3, 0.12]}>
          <boxGeometry args={[0.105, 0.74, 0.012]} />
          <meshStandardMaterial color="#FF6B35" emissive="#FF6B35" emissiveIntensity={1.4} />
        </mesh>
        <mesh position={[0, -1.18, 0.12]}>
          <boxGeometry args={[1.1, 0.035, 0.012]} />
          <meshBasicMaterial color="#FF6B35" transparent opacity={0.32} />
        </mesh>
      </Layer>

      <Layer active={activeLayer === "battery"} baseZ={0.48}>
        <RoundedBox args={[2.38, 4.72, 0.09]} radius={0.22} smoothness={4}>
          <meshStandardMaterial color="#3A424B" metalness={0.92} roughness={0.22} />
        </RoundedBox>
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[1.65, 2.15, 0.03]} />
          <meshStandardMaterial color="#3A424B" metalness={0.65} roughness={0.35} />
        </mesh>
      </Layer>

      <Layer active={activeLayer === "battery"} baseZ={-0.72}>
        <RoundedBox args={[1.72, 2.12, 0.13]} radius={0.08} smoothness={3} position={[0, -0.92, 0]}>
          <meshStandardMaterial color="#2C4A3C" metalness={0.35} roughness={0.5} />
        </RoundedBox>
        <mesh position={[0, -0.92, 0.075]}>
          <boxGeometry args={[1.42, 0.08, 0.015]} />
          <meshStandardMaterial color="#FF6B35" emissive="#FF6B35" emissiveIntensity={0.35} />
        </mesh>
        <mesh position={[-0.56, -0.92, 0.078]}>
          <boxGeometry args={[0.08, 1.7, 0.015]} />
          <meshBasicMaterial color="#0B0D10" transparent opacity={0.5} />
        </mesh>
      </Layer>

      <Layer active={activeLayer === "board"} baseZ={-1.8}>
        <RoundedBox args={[1.95, 2.25, 0.08]} radius={0.06} smoothness={3} position={[0, 0.68, 0]}>
          <meshStandardMaterial color="#1B3B2C" metalness={0.3} roughness={0.55} />
          <Edges scale={1.01} threshold={20} color="#3D6B52" />
        </RoundedBox>
        {[
          [-0.55, 1.15, 0.06, 0.34, 0.28],
          [0.42, 1.22, 0.06, 0.24, 0.2],
          [-0.45, 0.62, 0.06, 0.2, 0.16],
          [0.5, 0.5, 0.06, 0.32, 0.24],
          [0.05, 0.18, 0.06, 0.5, 0.12],
        ].map(([x, y, z, width, height], index) => (
          <mesh key={index} position={[x, y, z]}>
            <boxGeometry args={[width, height, 0.035]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? "#3C4A3F" : "#B68A4A"}
              metalness={0.55}
              roughness={0.4}
            />
          </mesh>
        ))}
        <mesh position={[0.68, 0.82, 0.07]}>
          <cylinderGeometry args={[0.09, 0.09, 0.02, 20]} />
          <meshStandardMaterial color="#E7B45A" metalness={0.8} roughness={0.28} />
        </mesh>
      </Layer>

      <Layer active={activeLayer === "camera"} baseZ={-1.9}>
        <group position={[0, 1.62, 0]}>
          <RoundedBox args={[0.92, 0.92, 0.18]} radius={0.08} smoothness={3}>
            <meshStandardMaterial color="#202831" metalness={0.7} roughness={0.3} />
          </RoundedBox>
          {[
            [-0.2, 0.2],
            [0.2, 0.2],
            [-0.2, -0.2],
            [0.2, -0.2],
          ].map(([x, y], index) => (
            <group key={index} position={[x, y, 0.1]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.14, 0.14, 0.06, 24]} />
                <meshStandardMaterial color="#090C10" metalness={0.5} roughness={0.3} />
              </mesh>
              <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.085, 0.085, 0.02, 24]} />
                <meshStandardMaterial color="#1E4C6E" metalness={0.2} roughness={0.15} />
              </mesh>
            </group>
          ))}
        </group>
      </Layer>

      <group ref={screws}>
        {[
          [-1.35, 2.35, 0.85],
          [1.35, 2.35, 0.85],
          [-1.35, -2.35, 0.85],
          [1.35, -2.35, 0.85],
          [1.65, 0.2, -1.2],
          [-1.65, -0.4, -1.2],
        ].map(([x, y, z], index) => (
          <Float key={index} speed={1.4 + index * 0.05} rotationIntensity={0.2} floatIntensity={0.35}>
            <mesh position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.075, 0.075, 0.06, 16]} />
              <meshStandardMaterial color="#A7B1BA" metalness={0.95} roughness={0.2} />
            </mesh>
          </Float>
        ))}
      </group>
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
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.2, compact ? 8.6 : 11.5], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 6, 8]} intensity={3.6} color="#FFF2E4" />
      <directionalLight position={[-6, -2, 4]} intensity={1.6} color="#FF6B35" />
      <pointLight position={[0, -3, 2]} intensity={16} color="#FF6B35" distance={9} />
      <ExplodedPhone activeLayer={activeLayer} reduced={reduced} />
      <Grid
        position={[0, -3.35, 0]}
        args={[16, 16]}
        cellSize={0.4}
        cellThickness={0.55}
        cellColor="#1A1F26"
        sectionSize={2}
        sectionThickness={0.9}
        sectionColor="#2A313A"
        fadeDistance={15}
        fadeStrength={1.2}
        infiniteGrid
      />
      <ContactShadows
        position={[0, -3.3, 0]}
        opacity={0.5}
        scale={12}
        blur={2.6}
        far={6}
        color="#000000"
      />
      <Sparkles count={34} scale={[7, 5, 4]} size={1.7} speed={0.18} color="#FF6B35" opacity={0.35} />
    </Canvas>
  );
}
