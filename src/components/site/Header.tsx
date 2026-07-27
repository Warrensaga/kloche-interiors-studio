import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/site/Logo";
import { cn } from "@/lib/utils";
import { STUDIO } from "@/data/site";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header({ transparent = false }: { transparent?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = !transparent || scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid
          ? "bg-background/85 backdrop-blur-xl shadow-[0_1px_0_0_var(--color-border)]"
          : "bg-transparent",
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
              activeOptions={{ exact: item.to === "/" }}
              className={cn(
                "relative text-[0.8rem] uppercase tracking-[0.18em] transition-colors",
                solid
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-primary-foreground/80 hover:text-primary-foreground",
              )}
              activeProps={{
                className: cn(
                  "after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:bg-accent",
                  solid ? "text-foreground" : "text-primary-foreground",
                ),
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/contact"
            className="hidden rounded-full bg-accent px-5 py-2.5 text-[0.75rem] uppercase tracking-[0.18em] text-accent-foreground transition-all hover:opacity-90 lg:inline-flex"
          >
            Book a Consultation
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
          "overflow-hidden border-t border-border bg-background transition-[max-height,opacity] duration-500 lg:hidden",
          open ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0",
        )}
      >
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
            Book a Consultation
          </Link>
          <p className="py-4 text-xs text-muted-foreground">{STUDIO.phoneDisplay}</p>
        </nav>
      </div>
    </header>
  );
}
