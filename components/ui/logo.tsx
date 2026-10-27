import Link from "next/link";

import { APP_NAME } from "@/lib/config";
import { cn } from "@/lib/utils";

function PatchMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("h-5 w-5", className)}
      fill="none"
    >
      <rect x="3" y="3" width="12" height="12" rx="3" fill="currentColor" opacity="0.9" />
      <rect x="17" y="3" width="12" height="12" rx="3" fill="currentColor" opacity="0.42" />
      <rect x="3" y="17" width="12" height="12" rx="3" fill="currentColor" opacity="0.62" />
      <rect x="17" y="17" width="12" height="12" rx="3" fill="#FF6B35" />
      <path
        d="M16 4.5V27.5M4.5 16H27.5"
        stroke="#08090B"
        strokeWidth="1.4"
        strokeDasharray="2 2"
      />
    </svg>
  );
}

export function Logo({
  className,
  href = "/",
  markOnly = false,
}: {
  className?: string;
  href?: string;
  markOnly?: boolean;
}) {
  const content = (
    <>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-line bg-wash text-ink">
        <PatchMark />
      </span>
      {!markOnly ? (
        <span className="text-[15px] font-semibold tracking-[-0.015em] text-ink">{APP_NAME}</span>
      ) : null}
    </>
  );

  if (!href) {
    return <div className={cn("flex items-center gap-2.5", className)}>{content}</div>;
  }

  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2.5", className)}
      aria-label={`${APP_NAME} home`}
    >
      {content}
    </Link>
  );
}
