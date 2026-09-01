import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/site/Logo";
import { cn } from "@/lib/utils";
import { useNav, useSiteConfig } from "@/hooks/useCms";
import { ThemeToggle } from "@/components/site/ThemeToggle";


export function Header({ transparent = false }: { transparent?: boolean }) {
  const config = useSiteConfig();
  const nav = useNav("header");
  const NAV = nav.map((n) => ({ to: n.href as "/", label: n.label }));
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);


  const solid = !transparent || scrolled || open;

  return (
    <header
      style={{ willChange: "background-color, box-shadow" }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-out",
        solid
          ? "bg-background/85 shadow-[0_1px_0_0_var(--color-border)] backdrop-blur-xl"
          : "bg-transparent shadow-none",
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className={cn(
            "text-xl leading-none tracking-tight transition-colors md:text-2xl",
            solid ? "text-foreground" : "text-primary-foreground",
          )}
        >
          <Logo markClassName="h-7 w-7 md:h-8 md:w-8" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              preload="intent"
              activeOptions={{ exact: item.to === "/" }}
              className={cn(
                "relative py-2 text-[0.8rem] uppercase tracking-[0.18em] transition-colors",
                "after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-out hover:after:origin-left hover:after:scale-x-100",
                solid
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-primary-foreground/80 hover:text-primary-foreground",
              )}
              activeProps={{
                className: cn(
                  "after:scale-x-100",
                  solid ? "text-foreground" : "text-primary-foreground",
                ),
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle
            className={cn(
              solid
                ? "border-border text-foreground"
                : "border-primary-foreground/30 text-primary-foreground",
            )}
          />
          <Link
            to="/contact"
            className="hidden rounded-full bg-accent px-5 py-2.5 text-[0.75rem] uppercase tracking-[0.18em] text-accent-foreground transition-all hover:opacity-90 lg:inline-flex"
          >
            {config.headerCtaLabel}
          </Link>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors lg:hidden",
              solid
                ? "border-border text-foreground"
                : "border-primary-foreground/30 text-primary-foreground",
            )}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "grid overflow-hidden overscroll-contain border-border bg-background transition-[grid-template-rows,border-color,opacity] duration-400 ease-out lg:hidden",
          open
            ? "grid-rows-[1fr] border-t opacity-100"
            : "grid-rows-[0fr] border-t-0 opacity-0 pointer-events-none",
        )}
      >
        <div className="max-h-[calc(100svh-4.5rem)] min-h-0 overflow-y-auto">
        <nav className="flex flex-col px-5 py-4">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: item.to === "/" }}
              className="border-b border-border/70 py-4 font-display text-2xl text-foreground last:border-0"
              activeProps={{ className: "text-accent" }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="mt-5 rounded-full bg-accent px-5 py-3.5 text-center text-[0.75rem] uppercase tracking-[0.18em] text-accent-foreground"
          >
            {config.headerCtaLabel}
          </Link>
          <a href={`tel:${config.phoneLink}`} className="block py-4 text-xs text-muted-foreground hover:text-accent">
            {config.phoneDisplay}
          </a>
        </nav>
        </div>
      </div>
    </header>
  );
}
