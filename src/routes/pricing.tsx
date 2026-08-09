import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { IMAGES, PROJECTS } from "@/data/site";
import { Reveal, Stagger, StaggerItem } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/Sections";
import { SIZES, SmartImage } from "@/components/site/SmartImage";
import { absoluteUrl, breadcrumbLd, pageSeo } from "@/lib/seo";
import { getSeoMeta } from "@/lib/seo.functions";

const PAGE_TITLE = "Investment Guide — Kloche Interiors Nairobi";
const PAGE_DESC =
  "How Kloche Interiors & Construction prices interior design, renovations, 3D visualisation and commercial fit-outs in Nairobi — plus what every project includes.";

export const Route = createFileRoute("/pricing")({
  loader: async () => ({ seo: await getSeoMeta({ data: "pricing" }) }),
  head: ({ loaderData }) => {
    const seo = pageSeo({
      path: "/pricing",
      title: PAGE_TITLE,
      description: PAGE_DESC,
      ogTitle: "Investment Guide — Kloche Interiors",
      ogDescription: PAGE_DESC,
      image: IMAGES.studio4,
      override: loaderData?.seo,
    });
    return {
    meta: seo.meta,
    links: seo.links,
    scripts: [
      breadcrumbLd([{ name: "Investment Guide", path: "/pricing" }]),
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Kloche Interiors — starting rates",
          url: absoluteUrl("/pricing"),
          itemListElement: OFFERINGS.filter((o) => o.from.startsWith("KSh")).map((o, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Service",
              name: o.title,
              description: o.blurb,
              areaServed: "Nairobi, Kenya",
              provider: { "@type": "HomeAndConstructionBusiness", name: "Kloche Interiors" },
              offers: {
                "@type": "Offer",
                priceCurrency: "KES",
                price: o.from.replace(/[^0-9]/g, ""),
                priceSpecification: {
                  "@type": "PriceSpecification",
                  priceCurrency: "KES",
                  minPrice: o.from.replace(/[^0-9]/g, ""),
                  valueAddedTaxIncluded: false,
                },
                availability: "https://schema.org/InStock",
                url: absoluteUrl("/pricing"),
              },
            },
          })),
        }),
      },
      ...seo.scripts,
    ],
    };
  },
  component: Pricing,
});

const FACTORS = [
  "Size of the space",
  "Scope of work",
  "Existing site conditions",
  "Materials and finishes selected",
  "Level of customization",
  "Furniture and décor requirements",
  "Construction complexity",
  "Project timeline",
  "Installation requirements",
];

/** Replace `from` with your published starting rates when ready. */
const OFFERINGS: {
  number: string;
  title: string;
  from: string;
  fromLabel: string;
  blurb: string;
  listLabel: string;
  items: string[];
}[] = [
  {
    number: "01",
    title: "Interior Design Consultation",
    from: "KSh 30,000",
    fromLabel: "Starting from",
    blurb:
      "Perfect for clients seeking professional design advice before starting a project.",
    listLabel: "Includes",
    items: [
      "Site visit",
      "Design discussion",
      "Project assessment",
      "Initial recommendations",
      "Budget guidance",
    ],
  },
  {
    number: "02",
    title: "Interior Design Package",
    from: "On request",
    fromLabel: "Starting from",
    blurb: "Ideal for clients who need a complete design concept before execution.",
    listLabel: "Includes",
    items: [
      "Space planning",
      "Moodboards",
      "Material selection",
      "Colour palette",
      "Furniture recommendations",
      "Lighting concepts",
      "Design presentation",
    ],
  },
  {
    number: "03",
    title: "3D Visualisation",
    from: "KSh 20,000",
    fromLabel: "Starting from",
    blurb: "See your future space before construction begins.",
    listLabel: "Includes",
    items: [
      "Photorealistic renders",
      "Multiple viewpoints",
      "Material visualisation",
      "Revision rounds",
    ],
  },
  {
    number: "04",
    title: "Bathroom Renovations",
    from: "KSh 150,000",
    fromLabel: "Projects typically start from",
    blurb: "A full wet-room rebuild, handled end to end by one team.",
    listLabel: "Typical scope may include",
    items: [
      "Demolition",
      "Waterproofing",
      "Plumbing",
      "Tiling",
      "Vanity installation",
      "Sanitary ware",
      "Lighting",
      "Painting",
      "Final finishes",
    ],
  },
  {
    number: "05",
    title: "Kitchen Renovations",
    from: "KSh 200,000",
    fromLabel: "Projects typically start from",
    blurb: "Investment depends on the level of joinery, surfaces and services involved.",
    listLabel: "Depending on",
    items: [
      "Cabinet design",
      "Countertops",
      "Appliances",
      "Plumbing",
      "Electrical works",
      "Backsplash",
      "Flooring",
      "Lighting",
    ],
  },
  {
    number: "06",
    title: "Interior Renovations",
    from: "Custom quoted",
    fromLabel: "Every project is",
    blurb:
      "Typical projects range depending on the size of the space and scope of work.",
    listLabel: "Our renovation services include",
    items: [
      "Flooring",
      "Ceiling works",
      "Gypsum features",
      "Wall finishes",
      "Paintworks",
      "Feature walls",
      "Electrical upgrades",
      "Plumbing coordination",
      "Joinery",
      "Custom installations",
    ],
  },
  {
    number: "07",
    title: "Commercial Fit-outs",
    from: "Tailored to your business",
    fromLabel: "Every commercial project is",
    blurb:
      "Pricing is prepared after understanding your business requirements and project scope.",
    listLabel: "Typical projects include",
    items: [
      "Offices",
      "Retail spaces",
      "Restaurants",
      "Hospitality spaces",
      "Airbnb properties",
      "Reception areas",
    ],
  },
];

const INCLUDED = [
  "Professional planning",
  "Transparent quotations",
  "Material sourcing support",
  "Quality workmanship",
  "Site supervision",
  "Regular project updates",
  "Attention to detail",
  "Final quality inspection",
];

const STEPS = [
  {
    n: "1",
    title: "Consultation",
    body: "We begin by understanding your vision, lifestyle and project requirements.",
  },
  {
    n: "2",
    title: "Design",
    body: "We develop concepts, layouts, materials and finishes that align with your goals.",
  },
  {
    n: "3",
    title: "Quotation",
    body: "You'll receive a detailed proposal outlining scope, costs and timelines.",
  },
  {
    n: "4",
    title: "Execution",
    body: "Our team coordinates procurement, construction and installation with careful attention to detail.",
  },
  {
    n: "5",
    title: "Completion",
    body: "We carry out final inspections, styling and handover to ensure every detail meets our standards.",
  },
];

const FAQS = [
  {
    q: "Do you charge for consultations?",
    a: "Yes. Our consultation fee covers a professional site visit, project assessment and expert guidance. If you proceed with the project, this may be credited toward your design package, depending on the agreed scope.",
  },
  {
    q: "Can you work within my budget?",
    a: "Absolutely. We tailor recommendations and material selections to help achieve the best outcome within your investment range.",
  },
  {
    q: "Do you supply materials?",
    a: "Yes. We can source, procure and coordinate materials and finishes on your behalf as part of the project.",
  },
  {
    q: "Do you offer design-only services?",
    a: "Yes. Clients may engage us purely for design, or choose our complete design-and-build service.",
  },
  {
    q: "Do you work outside Nairobi?",
    a: "Yes. We undertake projects across Kenya, subject to project scope and logistics.",
  },
  {
    q: "How long does a project take?",
    a: "Timelines vary depending on the complexity and scale of the project. A detailed programme is provided before work begins.",
  },
];

const BUDGETS = [
  "Under KES 300,000",
  "KES 300,000 – 1M",
  "KES 1M – 3M",
  "Above KES 3M",
];

const ctaClass =
  "inline-flex rounded-full bg-accent px-8 py-4 text-[0.75rem] uppercase tracking-[0.2em] text-accent-foreground transition-opacity hover:opacity-90";

function Pricing() {
  const [budget, setBudget] = useState<string>("");

  const quoteLink = (service?: string) => ({
    to: "/contact" as const,
    search: {
      ...(budget ? { budget } : {}),
      ...(service ? { service } : {}),
    },
  });

  return (
    <>
      <PageHero
        eyebrow="Investment Guide"
        title="Investing in Spaces That Last"
        subtitle="Every project is unique, and so is the investment behind it."
        image={IMAGES.studio4}
      />

      {/* Intro */}
      <section className="section-y">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <Reveal>
            <div className="space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              <p>
                At Kloche Interiors &amp; Construction, we don't believe in one-size-fits-all
                pricing. Every home, office or commercial space has its own requirements, and every
                client has a different vision.
              </p>
              <p>
                Our quotations are tailored to your project's size, scope, level of finish and
                overall goals.
              </p>
              <p>
                This guide is designed to help you understand how we price our services and what to
                expect before we prepare your personalised proposal.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How we price */}
      <section className="section-y bg-secondary/50">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <p className="eyebrow">How we price</p>
            <h2 className="mt-4 max-w-2xl text-3xl md:text-4xl">
              Your project investment is influenced by several factors
            </h2>
          </Reveal>
          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FACTORS.map((f, i) => (
              <StaggerItem key={f}>
                <div className="hover-lift flex h-full items-center gap-4 rounded-2xl border border-border/70 bg-card px-6 py-5 shadow-soft">
                  <span className="font-display text-lg text-terracotta/80">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm md:text-base">{f}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.15}>
            <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Every proposal is carefully prepared to ensure transparency, quality and value.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Budget selector */}
      <section className="section-y">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <Reveal>
            <div className="rounded-3xl border border-border/70 bg-card p-8 shadow-soft md:p-12">
              <p className="eyebrow">Budget range</p>
              <h2 className="mt-4 text-2xl md:text-3xl">What are you planning to invest?</h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Select a range and we'll carry it through to your enquiry, so our first
                recommendations already fit your budget.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {BUDGETS.map((b) => {
                  const active = budget === b;
                  return (
                    <button
                      key={b}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setBudget(active ? "" : b)}
                      className={`rounded-full border px-5 py-3 text-xs uppercase tracking-[0.14em] transition-all duration-300 ${
                        active
                          ? "border-accent bg-accent text-accent-foreground shadow-soft"
                          : "border-border/70 bg-background text-muted-foreground hover:border-accent/60 hover:text-foreground"
                      }`}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
              <Link {...quoteLink()} className={`${ctaClass} mt-9`}>
                Request a tailored quotation
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services & starting investment */}
      <section className="section-y bg-secondary/50">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <p className="eyebrow">Our services</p>
            <h2 className="mt-4 text-3xl md:text-4xl">Services &amp; starting investment</h2>
          </Reveal>

          <div className="mt-14 space-y-6">
            {OFFERINGS.map((o, i) => (
              <Reveal key={o.title} delay={i * 0.05}>
                <article className="hover-lift grid gap-8 rounded-3xl border border-border/70 bg-card p-8 shadow-soft md:grid-cols-[1fr_1.1fr] md:p-12">
                  <div>
                    <span className="font-display text-3xl text-terracotta/80">{o.number}</span>
                    <h3 className="mt-4 font-display text-2xl md:text-3xl">{o.title}</h3>
                    <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {o.fromLabel}
                    </p>
                    <p className="mt-1 font-display text-xl text-forest">{o.from}</p>
                    <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{o.blurb}</p>
                    <Link
                      {...quoteLink(o.title)}
                      className="link-underline mt-6 inline-flex text-xs uppercase tracking-[0.18em] text-terracotta"
                    >
                      Request a tailored quotation
                    </Link>
                  </div>
                  <div className="md:border-l md:border-border/60 md:pl-10">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {o.listLabel}
                    </p>
                    <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                      {o.items.map((it) => (
                        <li key={it} className="flex items-start gap-3 text-sm">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Included */}
      <section className="section-y">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <p className="eyebrow">Always included</p>
            <h2 className="mt-4 max-w-2xl text-3xl md:text-4xl">
              What's included in every Kloche project
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              No matter the size of your project, our commitment remains the same.
            </p>
          </Reveal>
          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INCLUDED.map((item) => (
              <StaggerItem key={item}>
                <div className="hover-lift flex h-full items-start gap-3 rounded-2xl border border-border/70 bg-card px-6 py-6 shadow-soft">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
                  <span className="text-sm">{item}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Process */}
      <section className="section-y bg-charcoal text-cream">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <p className="eyebrow text-cream/80">Our process</p>
            <h2 className="mt-4 text-3xl md:text-4xl">From first conversation to handover</h2>
          </Reveal>
          <div className="mt-14 grid gap-10 md:grid-cols-5">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="border-t border-cream/20 pt-6">
                  <span className="font-display text-3xl text-terracotta">{s.n}</span>
                  <h3 className="mt-3 font-display text-xl">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream/85">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-y">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <Reveal>
            <p className="eyebrow">FAQs</p>
            <h2 className="mt-4 text-3xl md:text-4xl">Frequently asked questions</h2>
          </Reveal>
          <div className="mt-12 divide-y divide-border/70 border-y border-border/70">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.05}>
                <details className="group py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                    <h3 className="font-display text-lg md:text-xl">{f.q}</h3>
                    <span className="shrink-0 text-terracotta transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-10 text-xs leading-relaxed text-muted-foreground">
              Please note: all figures above are starting points. Final quotations are provided
              after we understand your project scope and site conditions.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Recent projects strip */}
      <section className="section-y bg-secondary/50">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <p className="eyebrow">Recent projects</p>
            <h2 className="mt-4 text-3xl md:text-4xl">See what different investments achieve</h2>
          </Reveal>
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROJECTS.slice(0, 4).map((p) => (
              <StaggerItem key={p.id}>
                <Link
                  to="/portfolio/$projectId"
                  params={{ projectId: p.id }}
                  className="hover-lift group block overflow-hidden rounded-3xl bg-card shadow-soft"
                >
                  <div className="img-zoom overflow-hidden">
                    <SmartImage
                      src={p.cover}
                      alt={`${p.name} — ${p.projectType} in ${p.location}`}
                      ratio="4/3"
                      sizes={SIZES.quarter}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                      {p.projectType}
                    </p>
                    <h3 className="mt-2 font-display text-lg">{p.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{p.location}</p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-y bg-charcoal text-cream">
        <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
          <Reveal>
            <h2 className="text-3xl md:text-5xl">Ready to transform your space?</h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-cream/85 md:text-base">
              Whether you're planning a complete renovation, refreshing a single room or creating a
              commercial space from the ground up, we'd love to hear about your vision. Let's
              discuss your project and prepare a proposal tailored specifically to your needs.
            </p>
            <Link {...quoteLink()} className={`${ctaClass} mt-9`}>
              Start Your Transformation
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
