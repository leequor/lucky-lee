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
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-clover-800 text-clover-100 shadow-soft">
        <svg
          aria-hidden="true"
          viewBox="0 0 40 40"
          className="h-6 w-6"
          fill="none"
        >
          <path
            d="M20 19.4C17.9 14.7 14.3 12 10.7 12 7.2 12 4.5 14.7 4.5 18.1c0 3.1 2.1 5.5 5.1 6.2-3 .7-5.1 3.1-5.1 6.2 0 3.4 2.7 6.1 6.2 6.1 3.6 0 7.2-2.7 9.3-7.4 2.1 4.7 5.7 7.4 9.3 7.4 3.5 0 6.2-2.7 6.2-6.1 0-3.1-2.1-5.5-5.1-6.2 3-.7 5.1-3.1 5.1-6.2 0-3.4-2.7-6.1-6.2-6.1-3.6 0-7.2 2.7-9.3 7.4Z"
            fill="currentColor"
          />
          <path
            d="M20 20v14"
            stroke="#166534"
            strokeLinecap="round"
            strokeWidth="2.4"
          />
        </svg>
      </span>
      {!markOnly ? (
        <span className="font-display text-xl font-semibold tracking-tight text-ink">
          {APP_NAME}
        </span>
      ) : null}
    </>
  );

  if (!href) {
    return <div className={cn("flex items-center gap-3", className)}>{content}</div>;
  }

  return (
    <Link
      href={href}
      className={cn("flex items-center gap-3", className)}
      aria-label={`${APP_NAME} home`}
    >
      {content}
    </Link>
  );
}
