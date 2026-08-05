import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { SIZES, SmartImage } from "./SmartImage";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
}) {
  return (
    <section className="relative flex min-h-[62svh] items-end overflow-hidden">
      <SmartImage
        src={image}
        alt=""
        priority
        baseWidth={1920}
        sizes={SIZES.full}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/50 to-charcoal/40" />
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-32 md:px-8 md:pb-24 md:pt-40">
        <Reveal>
          <p className="eyebrow text-cream/85">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl text-cream md:text-6xl">{title}</h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-cream/80">{subtitle}</p>
        </Reveal>
      </div>
    </section>
  );
}

export function CtaBanner({
  title = "Ready to transform your space?",
  body = "Tell us about your home or workplace. We'll come back within two working days with next steps and a realistic budget range.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="section-y bg-charcoal text-cream">
      <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
        <Reveal>
          <h2 className="text-3xl md:text-5xl">{title}</h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-cream/85 md:text-base">
            {body}
          </p>
          <Link
            to="/contact"
            className="mt-9 inline-flex rounded-full bg-accent px-8 py-4 text-[0.75rem] uppercase tracking-[0.2em] text-accent-foreground transition-opacity hover:opacity-90"
          >
            Start Your Transformation
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  body?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 text-3xl md:text-4xl">{title}</h2>
      {body && <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">{body}</p>}
    </Reveal>
  );
}
