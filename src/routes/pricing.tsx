import { createFileRoute, Link } from "@tanstack/react-router";
import { IMAGES } from "@/data/site";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/Sections";
import { absoluteUrl } from "@/lib/seo";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "How We Price — Kloche Interiors Nairobi" },
      {
        name: "description",
        content:
          "Every project is priced individually. We create transparent quotes based on project size, scope, materials, customization, design needs and construction requirements.",
      },
      { property: "og:title", content: "How We Price — Kloche Interiors" },
      {
        property: "og:description",
        content:
          "Transparent pricing for interior design, renovations and construction in Nairobi. Get a tailored quote based on your project.",
      },
      { property: "og:image", content: IMAGES.studio4 },
      { name: "twitter:image", content: IMAGES.studio4 },
      { property: "og:url", content: absoluteUrl("/pricing") },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "How We Price — Kloche Interiors" },
      {
        name: "twitter:description",
        content:
          "Transparent pricing for interior design, renovations and construction in Nairobi. Get a tailored quote based on your project.",
      },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/pricing") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How does Kloche Interiors price a project?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Pricing is tailored to each project based on size, scope of work, materials, level of customization, design requirements and construction or installation requirements.",
              },
            },
            {
              "@type": "Question",
              name: "Can I get a fixed quote before starting?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "We provide a clear, itemised proposal after an initial consultation and site review, so the final quote reflects your exact requirements.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: Pricing,
});

const PRICING_FACTORS = [
  {
    number: "01",
    title: "Project size",
    description: "Square footage, number of rooms and overall scale set the baseline for time, labour and materials.",
  },
  {
    number: "02",
    title: "Scope of work",
    description: "A single room refresh requires a different investment than a full home or commercial fit-out.",
  },
  {
    number: "03",
    title: "Materials",
    description: "Natural stone, hardwoods, custom textiles and imported finishes affect both cost and final character.",
  },
  {
    number: "04",
    title: "Level of customization",
    description: "Bespoke joinery, built-in furniture and one-off pieces add detail and value, and are priced accordingly.",
  },
  {
    number: "05",
    title: "Design requirements",
    description: "Spatial planning, 3D visuals, finishes schedules and design revisions are scoped to your needs.",
  },
  {
    number: "06",
    title: "Construction and installation",
    description: "Civil works, electrical, plumbing, flooring and final installation are included where required.",
  },
];

function Pricing() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="How We Price"
        subtitle="Every project is unique. We build every quote around what you actually need, so you only pay for the work that brings your space to life."
        image={IMAGES.studio4}
      />

      <section className="section-y">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRICING_FACTORS.map((factor, i) => (
              <Reveal key={factor.title} delay={i * 0.09}>
                <div className="group hover-lift flex h-full flex-col rounded-3xl border border-border/70 bg-card p-8 shadow-soft">
                  <span className="font-display text-3xl text-terracotta/80 transition-colors group-hover:text-terracotta">
                    {factor.number}
                  </span>
                  <h2 className="mt-5 font-display text-xl">{factor.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {factor.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-secondary/50">
        <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
          <Reveal>
            <p className="eyebrow">Next step</p>
            <h2 className="mt-4 text-3xl md:text-4xl">Want a tailored estimate?</h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Tell us about your space, your timeline and what you want to achieve. We will come back with a
              realistic budget range and a clear path forward.
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

      <section className="section-y bg-charcoal text-cream">
        <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
          <Reveal>
            <h2 className="text-3xl md:text-5xl">Prefer to talk it through?</h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-cream/70 md:text-base">
              A quick call is often the easiest way to understand scope and budget. We are happy to walk
              you through how we approach pricing for projects like yours.
            </p>
            <Link
              to="/contact"
              className="mt-9 inline-flex rounded-full bg-accent px-8 py-4 text-[0.75rem] uppercase tracking-[0.2em] text-accent-foreground transition-opacity hover:opacity-90"
            >
              Get in touch
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
