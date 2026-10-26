import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-clover-700 text-white shadow-soft hover:bg-clover-800 active:translate-y-px",
  secondary:
    "border border-ink/15 bg-white/80 text-ink hover:border-clover-700/30 hover:bg-white",
  ghost: "text-ink/65 hover:bg-ink/5 hover:text-ink",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clover-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:pointer-events-none disabled:opacity-60",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
}
