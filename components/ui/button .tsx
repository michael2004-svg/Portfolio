"use client";

import { cn } from "@/lib/utils";

export default function Button({
  children,
  variant = "primary",
  onClick,
  className,
  href,
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  onClick?: () => void;
  className?: string;
  href?: string;
}) {
  const classes = cn(
    "inline-block rounded-full px-7 py-3.5 text-center font-mono text-sm tracking-wide transition-transform duration-200 hover:scale-[1.03]",
    variant === "primary"
      ? "bg-violet-500 text-bg hover:bg-violet-300"
      : "glass text-ice hover:border-violet-300/50",
    className
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}