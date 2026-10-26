import type { AppRole } from "@/lib/auth/types";
import { cn } from "@/lib/utils";

const LABELS: Record<AppRole, string> = {
  superadmin: "Superadmin",
  admin: "Admin",
  user: "User",
};

const LIGHT: Record<AppRole, string> = {
  superadmin: "bg-ink text-white",
  admin: "bg-wash text-ink",
  user: "border border-line bg-surface text-muted",
};

const DARK: Record<AppRole, string> = {
  superadmin: "bg-white text-ink",
  admin: "bg-white/15 text-white",
  user: "border border-white/25 bg-transparent text-white/70",
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
        "inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium leading-none",
        tone === "dark" ? DARK[role] : LIGHT[role],
        className,
      )}
    >
      {LABELS[role]}
    </span>
  );
}
