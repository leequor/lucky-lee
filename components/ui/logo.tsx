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
      <span className="grid h-8 w-8 shrink-0 place-items-center border border-signal-500 bg-signal-500 font-mono text-[11px] font-bold tracking-[0.02em] text-ink">
        LP
      </span>
      {!markOnly ? (
        <span className="flex flex-col gap-1">
          <span className="text-[15px] font-semibold leading-none tracking-[-0.03em] text-current">
            {APP_NAME}
          </span>
          <span className="font-mono text-[10px] uppercase leading-none tracking-[0.16em] text-current opacity-55">
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
