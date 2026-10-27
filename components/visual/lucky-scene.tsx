"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type Vec3 = [number, number, number];

type Segment = {
  a: Vec3;
  b: Vec3;
  depth: number;
  alpha: number;
  width: number;
  gold?: boolean;
};

const TAU = Math.PI * 2;
const LOBES = [
  { cx: -0.36, cy: -0.36, z: -0.04, alpha: 0.78 },
  { cx: 0.36, cy: -0.36, z: 0.05, alpha: 1 },
  { cx: 0.36, cy: 0.36, z: 0.1, alpha: 0.88 },
  { cx: -0.36, cy: 0.36, z: 0.01, alpha: 0.66 },
];
const RING_RADIUS = 0.48;
const CAMERA = 3.6;

function rotate(point: Vec3, ax: number, ay: number): Vec3 {
  const [x, y, z] = point;
  const cosY = Math.cos(ay);
  const sinY = Math.sin(ay);
  const x1 = x * cosY + z * sinY;
  const z1 = -x * sinY + z * cosY;
  const cosX = Math.cos(ax);
  const sinX = Math.sin(ax);
  return [x1, y * cosX - z1 * sinX, y * sinX + z1 * cosX];
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rotX: number,
  rotY: number,
  time: number,
) {
  ctx.clearRect(0, 0, width, height);

  const scale = Math.min(width, height) * 0.37;
  const cx = width * 0.5;
  const cy = height * 0.5;

  function project(point: Vec3) {
    const rotated = rotate(point, rotX, rotY);
    const perspective = CAMERA / (CAMERA + rotated[2]);
    return {
      x: cx + rotated[0] * scale * perspective,
      y: cy + rotated[1] * scale * perspective,
      z: rotated[2],
      perspective,
    };
  }

  const segments: Segment[] = [];
  const segmentsPerRing = 58;

  for (const lobe of LOBES) {
    for (let index = 0; index < segmentsPerRing; index += 1) {
      const start = (index / segmentsPerRing) * TAU;
      const end = ((index + 1) / segmentsPerRing) * TAU;
      const a: Vec3 = [
        lobe.cx + Math.cos(start) * RING_RADIUS,
        lobe.cy + Math.sin(start) * RING_RADIUS,
        lobe.z + Math.sin(start * 2 + time * 0.0004) * 0.018,
      ];
      const b: Vec3 = [
        lobe.cx + Math.cos(end) * RING_RADIUS,
        lobe.cy + Math.sin(end) * RING_RADIUS,
        lobe.z + Math.sin(end * 2 + time * 0.0004) * 0.018,
      ];
      const ra = rotate(a, rotX, rotY);
      const rb = rotate(b, rotX, rotY);
      segments.push({
        a,
        b,
        depth: (ra[2] + rb[2]) / 2,
        alpha: lobe.alpha,
        width: 1,
      });
    }
  }

  // Stem: a short curved line under the four leaves.
  const stemPoints: Vec3[] = [];
  for (let index = 0; index <= 18; index += 1) {
    const t = index / 18;
    stemPoints.push([Math.sin(t * 2.4) * 0.12, 0.72 + t * 0.62, 0]);
  }
  for (let index = 0; index < stemPoints.length - 1; index += 1) {
    const a = stemPoints[index];
    const b = stemPoints[index + 1];
    const ra = rotate(a, rotX, rotY);
    const rb = rotate(b, rotX, rotY);
    segments.push({
      a,
      b,
      depth: (ra[2] + rb[2]) / 2,
      alpha: 0.72,
      width: 1.35,
      gold: true,
    });
  }

  segments.sort((a, b) => b.depth - a.depth);

  ctx.lineCap = "round";
  ctx.globalCompositeOperation = "lighter";

  for (const segment of segments) {
    const a = project(segment.a);
    const b = project(segment.b);
    const depthFade = Math.max(0.1, Math.min(1, 0.5 - a.z * 0.24));
    const alpha = segment.alpha * depthFade;
    ctx.strokeStyle = segment.gold
      ? `rgba(230, 199, 123, ${alpha * 0.9})`
      : `rgba(86, 235, 178, ${alpha})`;
    ctx.lineWidth = segment.width * Math.max(0.6, (a.perspective + b.perspective) / 2);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  // Four small gold nodes at the leaf intersections.
  const nodes: Vec3[] = [
    [-0.36, -0.36, 0.02],
    [0.36, -0.36, 0.02],
    [0.36, 0.36, 0.02],
    [-0.36, 0.36, 0.02],
  ];
  for (const node of nodes) {
    const point = project(node);
    ctx.fillStyle = `rgba(232, 202, 132, ${0.35 + point.perspective * 0.25})`;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 2.2 * point.perspective, 0, TAU);
    ctx.fill();
  }

  // A small golden core.
  const core = project([0, 0, 0.16]);
  ctx.fillStyle = "rgba(240, 215, 154, 0.85)";
  ctx.beginPath();
  ctx.arc(core.x, core.y, 3.1 * core.perspective, 0, TAU);
  ctx.fill();

  // Orbiting dust.
  for (let index = 0; index < 54; index += 1) {
    const seed = index * 12.9898 + 4.1414;
    const theta = (seed % 1) * TAU + time * 0.00004 * (index % 2 === 0 ? 1 : -1);
    const radius = 1.1 + ((seed * 7) % 0.9);
    const height = (Math.sin(seed * 2) * 0.9 + Math.cos(seed) * 0.2) * 0.9;
    const point = project([Math.cos(theta) * radius, height, Math.sin(theta) * radius]);
    const alpha = 0.1 + Math.max(0, point.perspective - 0.45) * 0.7;
    ctx.fillStyle = `rgba(152, 232, 205, ${alpha})`;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 1.15 * point.perspective, 0, TAU);
    ctx.fill();
  }

  ctx.globalCompositeOperation = "source-over";
}

export function LuckyScene({
  className,
  variant = "hero",
}: {
  className?: string;
  variant?: "hero" | "compact";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvasRef.current;
    if (!element) return;

    const context = element.getContext("2d");
    if (!context) return;

    const canvas: HTMLCanvasElement = element;
    const ctx: CanvasRenderingContext2D = context;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let width = 0;
    let height = 0;
    let rotX = -0.28;
    let rotY = 0.46;
    let targetX = rotX;
    let targetY = rotY;
    let lastTime = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawScene(ctx, width, height, rotX, rotY, reduced ? 900 : performance.now());
      if (reduced) return;
      if (!frame) frame = requestAnimationFrame(tick);
    }

    function tick(now: number) {
      frame = 0;
      if (document.hidden) return;
      const delta = Math.min(48, now - (lastTime || now));
      lastTime = now;
      const ease = reduced ? 1 : Math.min(1, delta / 420);
      rotX += (targetX - rotX) * ease * 0.5;
      rotY += (targetY - rotY) * ease * 0.5;
      drawScene(ctx, width, height, rotX, rotY, now);
      frame = requestAnimationFrame(tick);
    }

    function handlePointer(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      targetY = 0.46 + nx * 0.5;
      targetX = -0.28 + ny * 0.34;
    }

    function resetPointer() {
      targetX = -0.28;
      targetY = 0.46;
    }

    function handleVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else if (!frame && !reduced) {
        frame = requestAnimationFrame(tick);
      }
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    canvas.addEventListener("pointermove", handlePointer);
    canvas.addEventListener("pointerleave", resetPointer);
    document.addEventListener("visibilitychange", handleVisibility);
    resize();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointermove", handlePointer);
      canvas.removeEventListener("pointerleave", resetPointer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "block h-full w-full",
        variant === "compact" ? "min-h-[120px]" : "min-h-[220px]",
        className,
      )}
    />
  );
}
