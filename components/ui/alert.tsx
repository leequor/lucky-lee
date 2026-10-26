import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AlertTone = "error" | "success" | "info";

const TONES: Record<AlertTone, string> = {
  error: "bg-negative-soft text-negative-ink",
  success: "bg-positive-soft text-positive-ink",
  info: "bg-wash text-ink",
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
      className={cn("rounded-md px-3.5 py-3 text-[13px] leading-5", TONES[tone], className)}
    >
      {children}
    </div>
  );
}
