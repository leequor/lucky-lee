import Link from "next/link";

import { APP_NAME } from "@/lib/config";
import { cn } from "@/lib/utils";

function Clover({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={cn("h-5 w-5", className)}
      fill="currentColor"
    >
      <circle cx="6.7" cy="6.7" r="3.6" />
      <circle cx="13.3" cy="6.7" r="3.6" />
      <circle cx="6.7" cy="13.3" r="3.6" />
      <circle cx="13.3" cy="13.3" r="3.6" className="text-accent" />
      <rect x="9.4" y="13.2" width="1.2" height="5.6" rx="0.6" />
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
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-line bg-surface text-ink">
        <Clover />
      </span>
      {!markOnly ? (
        <span className="text-[15px] font-semibold tracking-[-0.01em] text-ink">{APP_NAME}</span>
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
