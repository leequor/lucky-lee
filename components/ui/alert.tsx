import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AlertTone = "error" | "success" | "info";

const TONES: Record<AlertTone, string> = {
  error: "border-negative/25 bg-negative-soft text-negative-ink",
  success: "border-positive/25 bg-positive-soft text-positive-ink",
  info: "border-line bg-wash text-ink",
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
      className={cn("rounded-xl border px-3.5 py-3 text-[13px] leading-5", TONES[tone], className)}
    >
      {children}
    </div>
  );
}
