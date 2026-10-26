import type { AppRole } from "@/lib/auth/types";
import { cn } from "@/lib/utils";

const LABELS: Record<AppRole, string> = {
  superadmin: "Superadmin",
  admin: "Admin",
  user: "User",
};

const LIGHT: Record<AppRole, string> = {
  superadmin: "border-signal-500 bg-signal-500 text-ink",
  admin: "border-ink bg-ink text-paper",
  user: "border-ink/25 bg-transparent text-muted",
};

const DARK: Record<AppRole, string> = {
  superadmin: "border-signal-500 bg-signal-500 text-ink",
  admin: "border-paper/40 bg-paper text-ink",
  user: "border-paper/30 bg-transparent text-paper/75",
};

export function RoleBadge({
  role,
  tone = "light",
  className,
}: {
  role: AppRole;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-1 font-mono text-[10px] font-bold uppercase leading-none tracking-[0.14em]",
        tone === "dark" ? DARK[role] : LIGHT[role],
        className,
      )}
    >
      {LABELS[role]}
    </span>
  );
}
