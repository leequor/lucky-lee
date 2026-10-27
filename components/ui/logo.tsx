import Link from "next/link";

import { APP_NAME } from "@/lib/config";
import { cn } from "@/lib/utils";

function Clover({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("h-5 w-5", className)}
      fill="none"
    >
      <g fill="currentColor">
        <path
          d="M16 16C16 11.6 12.8 8 8.8 8C6 8 4.4 9.8 4.8 12.1C5.2 14.7 8.4 16 12 16Z"
          opacity="0.62"
        />
        <path
          d="M16 16C16 11.6 12.8 8 8.8 8C6 8 4.4 9.8 4.8 12.1C5.2 14.7 8.4 16 12 16Z"
          opacity="0.88"
          transform="rotate(90 16 16)"
        />
        <path
          d="M16 16C16 11.6 12.8 8 8.8 8C6 8 4.4 9.8 4.8 12.1C5.2 14.7 8.4 16 12 16Z"
          transform="rotate(180 16 16)"
        />
        <path
          d="M16 16C16 11.6 12.8 8 8.8 8C6 8 4.4 9.8 4.8 12.1C5.2 14.7 8.4 16 12 16Z"
          opacity="0.78"
          transform="rotate(270 16 16)"
        />
      </g>
      <path
        d="M16 18.3C15.8 22 15 24.6 13.5 27"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="2.1" fill="#E6C77B" />
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
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-line bg-wash text-accent">
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
