import type { AppRole } from "@/lib/auth/types";
import { cn } from "@/lib/utils";

const LABELS: Record<AppRole, string> = {
  superadmin: "Superadmin",
  admin: "Admin",
  user: "User",
};

const STYLES: Record<AppRole, string> = {
  superadmin: "border-ink bg-ink text-paper",
  admin: "border-signal-600/40 bg-signal-100 text-signal-700",
  user: "border-ink/25 bg-transparent text-muted",
};

export function RoleBadge({ role, className }: { role: AppRole; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-1 font-mono text-[10px] font-medium uppercase leading-none tracking-[0.14em]",
        STYLES[role],
        className,
      )}
    >
      {LABELS[role]}
    </span>
  );
}
