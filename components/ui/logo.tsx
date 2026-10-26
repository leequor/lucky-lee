import Link from "next/link";

import { APP_NAME } from "@/lib/config";
import { cn } from "@/lib/utils";

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
      <span className="grid h-8 w-8 shrink-0 place-items-center border border-ink bg-ink font-mono text-[10px] font-medium tracking-[0.04em] text-paper">
        LP
      </span>
      {!markOnly ? (
        <span className="flex flex-col gap-1">
          <span className="text-[14px] font-semibold leading-none tracking-[-0.02em] text-ink">
            {APP_NAME}
          </span>
          <span className="font-mono text-[10px] uppercase leading-none tracking-[0.16em] text-muted">
            Account system / S1
          </span>
        </span>
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
