import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AlertTone = "error" | "success" | "info";

const TONES: Record<AlertTone, string> = {
  error: "border-l-signal-600 bg-signal-50 text-ink",
  success: "border-l-ink bg-wash text-ink",
  info: "border-l-ink/30 bg-surface text-ink/75",
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
      className={cn(
        "rounded-[2px] border-y-0 border-r-0 border-l-[3px] px-4 py-3 text-[13px] leading-5",
        TONES[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}
