import type { AppRole } from "@/lib/auth/types";
import { cn } from "@/lib/utils";

const LABELS: Record<AppRole, string> = {
  superadmin: "Superadmin",
  admin: "Admin",
  user: "User",
};

const STYLES: Record<AppRole, string> = {
  superadmin: "bg-accent text-[#04150F]",
  admin: "bg-wash text-ink",
  user: "border border-line bg-transparent text-muted",
};

export function RoleBadge({ role, className }: { role: AppRole; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium leading-none",
        STYLES[role],
        className,
      )}
    >
      {LABELS[role]}
    </span>
  );
}
