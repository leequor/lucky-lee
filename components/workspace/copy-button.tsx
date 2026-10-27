"use client";

import { useState } from "react";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[11px] text-muted transition-colors hover:border-[#3A414B] hover:text-ink"
      aria-label={`${label} ${value}`}
    >
      {copied ? "Copied" : label}
    </button>
  );
}
