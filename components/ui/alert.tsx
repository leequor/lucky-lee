import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AlertTone = "error" | "success" | "info";

const TONES: Record<AlertTone, string> = {
  error: "border-coral-500/25 bg-coral-100/70 text-coral-600",
  success: "border-clover-600/20 bg-clover-50 text-clover-800",
  info: "border-ink/10 bg-white/70 text-ink/70",
};

export function Alert({
  tone = "info",
  children,
  className,
}: {
  tone?: AlertTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn("rounded-2xl border px-4 py-3 text-sm leading-6", TONES[tone], className)}
    >
      {children}
    </div>
  );
}
