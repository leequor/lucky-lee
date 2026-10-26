import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(value: string | null | undefined) {
  if (!value) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function initials(value: string) {
  return value
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function safeNextPath(value: string | null, fallback = "/") {
  if (!value) {
    return fallback;
  }

  const next = value.trim();

  if (
    !next.startsWith("/") ||
    next.startsWith("//") ||
    /[\\\u0000-\u001f\u007f]/.test(next)
  ) {
    return fallback;
  }

  try {
    const parsed = new URL(next, "http://lucky-patcher.local");

    if (parsed.origin !== "http://lucky-patcher.local") {
      return fallback;
    }
  } catch {
    return fallback;
  }

  return next;
}
