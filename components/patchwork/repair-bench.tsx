"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

const RepairScene = dynamic(() => import("./repair-scene"), {
  ssr: false,
  loading: () => <BenchFallback />,
});

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerReducedMotion() {
  return false;
}

const subscribeMount = () => () => {};

const LAYERS = [
  { id: "screen", label: "Display", detail: "OLED · touch · frame" },
  { id: "battery", label: "Battery", detail: "Cell + health check" },
  { id: "board", label: "Logic board", detail: "Board-level repair" },
  { id: "camera", label: "Camera", detail: "Module + alignment" },
] as const;

type LayerId = (typeof LAYERS)[number]["id"];

function BenchFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="h-40 w-24 rounded-[22px] border border-line bg-raised" />
    </div>
  );
}

export function RepairBench({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const mounted = useSyncExternalStore(subscribeMount, () => true, () => false);
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  );
  const [active, setActive] = useState<LayerId>("screen");
  const positioned = className?.includes("absolute") || className?.includes("fixed");
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [everVisible, setEverVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), compact ? 1800 : 0);
    return () => window.clearTimeout(timer);
  }, [compact]);

  useEffect(() => {
    const element = rootRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      setEverVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries[0]?.isIntersecting ?? true;
        setVisible(intersecting);
        if (intersecting) setEverVisible(true);
      },
      { rootMargin: "160px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn(
        "overflow-hidden rounded-2xl border border-line bg-[#0B0D10]",
        positioned ? null : "relative",
        className,
      )}
    >
      <div className="scene-field pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />

      {mounted && ready && (visible || everVisible) ? (
        <RepairScene
          activeLayer={active}
          reduced={reduced}
          compact={compact}
          paused={!visible}
        />
      ) : (
        <BenchFallback />
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#07090C] via-[#07090C]/65 to-transparent" />

      <div className="pointer-events-none absolute inset-x-4 top-4 flex items-start justify-end gap-4">
        <span className="rounded-full border border-line bg-paper/70 px-2.5 py-1 text-[11px] text-muted">
          Live 3D
        </span>
      </div>

      {!compact ? (
        <>
          <div className="pointer-events-none absolute inset-x-4 bottom-[82px] hidden sm:block">
            <p className="text-[11px] text-muted">Teardown</p>
            <p className="mt-0.5 text-[13px] font-medium text-ink">
              iPhone 15 Pro <span className="text-muted">· exploded</span>
            </p>
          </div>

          <div className="absolute inset-x-4 bottom-4">
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {LAYERS.map((layer) => (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => setActive(layer.id)}
                  aria-pressed={active === layer.id}
                  className={cn(
                    "rounded-lg border px-2.5 py-2 text-left transition-colors",
                    active === layer.id
                      ? "border-accent/50 bg-[#2A1712]"
                      : "border-line bg-paper/75 hover:border-[#3A414B]",
                  )}
                >
                  <span
                    className={cn(
                      "block text-[11px] font-medium",
                      active === layer.id ? "text-[#FFB599]" : "text-ink",
                    )}
                  >
                    {layer.label}
                  </span>
                  <span className="mt-0.5 hidden text-[11px] text-muted sm:block">{layer.detail}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
