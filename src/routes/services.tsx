import { createFileRoute, Link } from "@tanstack/react-router";
import { Armchair, Building2, HardHat, Home, Ruler, type LucideIcon } from "lucide-react";
import { PILLARS, PROCESS, PROCESS_CLOSING, SERVICES } from "@/data/site";
import { Reveal } from "@/components/site/Reveal";
import { CtaBanner, PageHero, SectionHeading } from "@/components/site/Sections";
import { absoluteUrl } from "@/lib/seo";
import { SIZES, SmartImage } from "@/components/site/SmartImage";

const ICONS: Record<string, LucideIcon> = { Home, Ruler, Armchair, HardHat, Building2 };
const HERO = SERVICES[0].image;

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Interior Design Services in Nairobi — Kloche Interiors" },
      {
        name: "description",
        content:
          "Full home design, space planning, furniture sourcing and renovation consulting for homes and workplaces in Nairobi, Kenya.",
      },
      { property: "og:title", content: "Services — Kloche Interiors" },
      {
        property: "og:description",
        content: "Full home design, space planning, sourcing and renovation consulting in Nairobi.",
      },
      { property: "og:image", content: HERO },
      { name: "twitter:image", content: HERO },
      { property: "og:url", content: absoluteUrl("/services") },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Services — Kloche Interiors" },
      {
        name: "twitter:description",
        content: "Full home design, space planning, sourcing and renovation consulting in Nairobi.",
      },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/services") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Interior design services — Kloche Interiors",
          url: absoluteUrl("/services"),
          itemListElement: SERVICES.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Service",
              name: s.title,
              description: s.description,
              areaServed: "Nairobi, Kenya",
              provider: { "@type": "HomeAndConstructionBusiness", name: "Kloche Interiors" },
            },
          })),
        }),
      },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Four ways we work together"
        subtitle="From a single room that needs direction to a whole home delivered turnkey — pick the level of involvement that suits you."
        image={HERO}
      />

      <section className="section-y">
        <div className="mx-auto max-w-7xl space-y-24 px-5 md:px-8 md:space-y-32">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.icon] ?? Home;
            const flip = i % 2 === 1;
            return (
              <div
                key={s.id}
                className="grid items-center gap-10 md:grid-cols-2 md:gap-16"
                id={s.id}
              >
                <Reveal className={flip ? "md:order-2" : undefined}>
                  <SmartImage
                    src={s.image}
                    alt={`${s.title} project by Kloche Interiors`}
                    baseWidth={900}
                    sizes={SIZES.half}
                    ratio="4 / 3"
                    priority={i === 0}
                    className="aspect-4/3 w-full rounded-3xl object-cover shadow-soft"
                  />
                </Reveal>
                <Reveal delay={0.1} className={flip ? "md:order-1" : undefined}>
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-accent">
                    <Icon size={24} />
                  </span>
                  <h2 className="mt-6 text-3xl md:text-4xl">{s.title}</h2>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>
                  <p className="eyebrow mt-8">What's included</p>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {s.includes.map((item) => (
                      <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-y bg-secondary/50">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading
            eyebrow="How It Works"
            title="Our process"
            body="Four stages, clearly scoped, with an approval point before anything is ordered."
            align="center"
          />
          <div className="relative mt-16 grid gap-10 md:grid-cols-4">
            <div className="absolute left-0 right-0 top-6 hidden h-px bg-border md:block" />
            {PROCESS.map((p, i) => (
              <Reveal key={p.step} delay={i * 0.1} className="relative">
                <span className="relative z-10 grid h-12 w-12 place-items-center rounded-full bg-accent font-display text-sm text-accent-foreground">
                  {p.step}
                </span>
                <h3 className="mt-6 text-xl">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2} className="mt-16 text-center">
            <Link
              to="/pricing"
              className="inline-flex rounded-full border border-border px-7 py-3.5 text-[0.72rem] uppercase tracking-[0.2em] transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              See packages & pricing
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaBanner title="Not sure which service you need?" body="Book a consultation and we'll tell you honestly — including when the answer is 'less than you think'." />
    </>
  );
}
