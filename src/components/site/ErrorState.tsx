import { Link } from "@tanstack/react-router";
import { IMAGES } from "@/data/site";
import { SIZES, SmartImage } from "./SmartImage";
import { Reveal } from "./Reveal";

const QUICK_LINKS = [
  { to: "/portfolio", label: "Portfolio" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
] as const;

export function ErrorState({
  code,
  eyebrow,
  title,
  body,
  onRetry,
}: {
  code?: string;
  eyebrow: string;
  title: string;
  body: string;
  onRetry?: () => void;
}) {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-charcoal">
      <SmartImage
        src={IMAGES.studio3}
        alt=""
        priority
        baseWidth={1920}
        sizes={SIZES.full}
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/85 to-charcoal/60" />

      <div className="relative mx-auto w-full max-w-3xl px-5 py-28 text-center md:px-8 md:py-36">
        <Reveal>
          <p className="eyebrow text-cream/80">{eyebrow}</p>
          {code ? (
            <p className="font-display mt-6 text-7xl leading-none text-accent md:text-8xl">
              {code}
            </p>
          ) : null}
          <h1 className="mt-5 text-3xl text-cream md:text-5xl">{title}</h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-cream/75 md:text-base">
            {body}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex rounded-full bg-accent px-8 py-4 text-[0.75rem] uppercase tracking-[0.2em] text-accent-foreground transition-opacity hover:opacity-90"
            >
              Back home
            </Link>
            {onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex rounded-full border border-cream/30 px-8 py-4 text-[0.75rem] uppercase tracking-[0.2em] text-cream transition-colors hover:bg-cream/10"
              >
                Try again
              </button>
            ) : (
              <Link
                to="/contact"
                className="inline-flex rounded-full border border-cream/30 px-8 py-4 text-[0.75rem] uppercase tracking-[0.2em] text-cream transition-colors hover:bg-cream/10"
              >
                Start Your Transformation
              </Link>
            )}
          </div>

          <nav aria-label="Site sections" className="mt-12">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {QUICK_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-[0.7rem] uppercase tracking-[0.2em] text-cream/80 transition-colors hover:text-cream"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>
      </div>
    </section>
  );
}
