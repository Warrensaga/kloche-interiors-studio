import { cn } from "@/lib/utils";

const PETAL = "M48 48 L48 25 A23 23 0 0 0 25 2 A23 23 0 0 0 2 25 A23 23 0 0 0 25 48 Z";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label="Kloche Interiors mark"
      className={cn("h-8 w-8", className)}
    >
      <path d={PETAL} fill="var(--color-forest)" />
      <g transform="rotate(90 50 50)">
        <path d={PETAL} fill="var(--color-terracotta)" />
      </g>
      <g transform="rotate(180 50 50)">
        <path d={PETAL} fill="var(--color-forest)" />
      </g>
      <g transform="rotate(270 50 50)">
        <path d={PETAL} fill="var(--color-forest)" />
      </g>
      <circle cx="70" cy="27" r="10" fill="var(--color-charcoal)" />
      <circle cx="86" cy="17" r="4.5" fill="var(--color-charcoal)" />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} />
      <span className="font-display leading-none tracking-tight">
        Kloche
        <span className="ml-1.5 align-middle text-[0.6rem] uppercase tracking-[0.35em] opacity-70">
          Interiors
        </span>
      </span>
    </span>
  );
}
