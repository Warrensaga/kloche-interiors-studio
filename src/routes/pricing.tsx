import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { COMPARISON, FAQS, IMAGES, TIERS } from "@/data/site";
import { Reveal } from "@/components/site/Reveal";
import { PageHero, SectionHeading } from "@/components/site/Sections";
import { absoluteUrl } from "@/lib/seo";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing & Packages — Kloche Interiors Nairobi" },
      {
        name: "description",
        content:
          "Transparent interior design packages in KES: Essential, Signature and Bespoke, with a full comparison of what each tier includes.",
      },
      { property: "og:title", content: "Pricing — Kloche Interiors" },
      {
        property: "og:description",
        content: "Interior design packages in KES for homes and workplaces in Nairobi.",
      },
      { property: "og:image", content: IMAGES.studio4 },
      { name: "twitter:image", content: IMAGES.studio4 },
      { property: "og:url", content: absoluteUrl("/pricing") },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/pricing") }],
  }),
  component: Pricing,
});

function Pricing() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Clear packages, honest ranges"
        subtitle="Every project is different, so these are starting points rather than quotes. Your final figure comes after the first consultation."
        image={IMAGES.studio4}
      />

      <section className="section-y">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {TIERS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.09}>
                <div
                  className={`flex h-full flex-col rounded-3xl p-8 shadow-soft ${
                    t.highlighted
                      ? "bg-charcoal text-cream"
                      : "border border-border/70 bg-card"
                  }`}
                >
                  {t.highlighted && (
                    <span className="mb-5 w-fit rounded-full bg-accent px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-accent-foreground">
                      Most chosen
                    </span>
                  )}
                  <h2 className="font-display text-2xl">{t.name}</h2>
                  <p
                    className={`mt-3 text-sm leading-relaxed ${t.highlighted ? "text-cream/70" : "text-muted-foreground"}`}
                  >
                    {t.blurb}
                  </p>
                  <p className="mt-7 font-display text-3xl">{t.price}</p>
                  <p
                    className={`mt-1 text-xs uppercase tracking-[0.18em] ${t.highlighted ? "text-cream/60" : "text-muted-foreground"}`}
                  >
                    {t.unit}
                  </p>
                  <ul className="mt-7 flex-1 space-y-3">
                    {t.features.map((f) => (
                      <li key={f} className="flex gap-3 text-sm">
                        <Check size={16} className="mt-0.5 shrink-0 text-accent" />
                        <span className={t.highlighted ? "text-cream/85" : "text-muted-foreground"}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contact"
                    className={`mt-9 rounded-full py-3.5 text-center text-[0.72rem] uppercase tracking-[0.2em] transition-opacity hover:opacity-90 ${
                      t.highlighted
                        ? "bg-accent text-accent-foreground"
                        : "border border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    Enquire
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            All figures exclude VAT, furniture, and construction costs. Prices in Kenyan
            Shillings.
          </p>
        </div>
      </section>

      <section className="section-y bg-secondary/50">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <SectionHeading eyebrow="Compare" title="What's in each tier" align="center" />
          <p className="mt-4 text-center text-xs text-muted-foreground md:hidden">
            Swipe the table sideways to compare tiers
          </p>
          <Reveal
            delay={0.1}
            className="mt-8 overflow-x-auto rounded-3xl bg-card shadow-soft [-webkit-overflow-scrolling:touch] md:mt-12"
          >
            <table className="w-full min-w-160 text-left text-sm">

              <thead>
                <tr className="border-b border-border">
                  <th className="p-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Included
                  </th>
                  {TIERS.map((t) => (
                    <th key={t.name} className="p-5 font-display text-base font-medium">
                      {t.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.label} className="border-b border-border/60 last:border-0">
                    <td className="p-5 text-muted-foreground">{row.label}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className="p-5">
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <SectionHeading eyebrow="FAQ" title="Good things to know" align="center" />
          <Reveal delay={0.1} className="mt-10">
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`}>
                  <AccordionTrigger className="text-left font-display text-lg hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-charcoal text-cream">
        <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
          <Reveal>
            <h2 className="text-3xl md:text-5xl">Need something in between?</h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-cream/70 md:text-base">
              Most projects don't fit neatly in a box. Send us the details and we'll price
              your exact scope.
            </p>
            <Link
              to="/contact"
              className="mt-9 inline-flex rounded-full bg-accent px-8 py-4 text-[0.75rem] uppercase tracking-[0.2em] text-accent-foreground transition-opacity hover:opacity-90"
            >
              Get a custom quote
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
