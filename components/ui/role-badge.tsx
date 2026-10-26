import type { AppRole } from "@/lib/auth/types";
import { cn } from "@/lib/utils";

const LABELS: Record<AppRole, string> = {
  superadmin: "Superadmin",
  admin: "Admin",
  user: "User",
};

const STYLES: Record<AppRole, string> = {
  superadmin: "bg-clover-900 text-clover-50",
  admin: "bg-clover-100 text-clover-800",
  user: "bg-mist text-ink/70",
};

export function RoleBadge({ role, className }: { role: AppRole; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em]",
        STYLES[role],
        className,
      )}
    >
      {LABELS[role]}
    </span>
  );
}
