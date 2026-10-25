"use client";

import { cn } from "@/lib/utils";

export default function Button({
  children,
  variant = "primary",
  onClick,
  className,
  href,
  track,
  type = "button",
  disabled,
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  onClick?: () => void;
  className?: string;
  href?: string;
  /** Analytics id recorded as a click in the admin dashboard. */
  track?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const classes = cn(
    "inline-block rounded-full px-7 py-3.5 text-center font-mono text-sm tracking-wide transition-transform duration-200 hover:scale-[1.03] disabled:pointer-events-none disabled:opacity-40",
    variant === "primary"
      ? "bg-violet-500 text-bg hover:bg-violet-300"
      : "glass text-ice hover:border-violet-300/50",
    className
  );

  if (href) {
    return (
      <a href={href} className={classes} data-track={track}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} data-track={track} disabled={disabled}>
      {children}
    </button>
  );
}
