import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { IMAGES, PHILOSOPHY, PILLARS, PROJECTS, SERVICES, STUDIO, TESTIMONIALS, whatsappLink, type Project } from "@/data/site";
import { listPublishedProjects } from "@/lib/projects.functions";
import { Reveal } from "@/components/site/Reveal";
import { CtaBanner, SectionHeading } from "@/components/site/Sections";
import { absoluteUrl, breadcrumbLd, pageSeo } from "@/lib/seo";
import { getSeoMeta } from "@/lib/seo.functions";
import { safeLoad } from "@/lib/supabase-env";
import { SIZES, SmartImage } from "@/components/site/SmartImage";
import { imageAt, srcSet } from "@/lib/images";
import {
  DEFAULT_SECTIONS,
  listHomepageSections,
  type HomepageSection,
  type StatItem,
  type TestimonialItem,
} from "@/lib/homepage.functions";


export const Route = createFileRoute("/")({
  head: ({ loaderData }) => {
    const seo = pageSeo({
      path: "/",
      title: "Kloche Interiors | Luxury Interior Design Studio, Nairobi",
      description:
        "Bespoke interior design and renovation for Nairobi's most discerning homeowners. Residential, commercial and renovation design across Kenya.",
      ogTitle: "Kloche Interiors — Interiors that feel like home",
      ogDescription:
        "A Nairobi interior design studio creating warm, considered homes and workplaces across Kenya.",
      image: IMAGES.hero,
      override: loaderData?.seo,
    });
    return {
      meta: seo.meta,
      links: [
        ...seo.links,
        {
          rel: "preload",
          as: "image",
          href: imageAt(IMAGES.hero, 1920),
          imageSrcSet: srcSet(IMAGES.hero),
          imageSizes: "100vw",
          fetchPriority: "high",
        },
      ],
      scripts: [
        breadcrumbLd([]),
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HomeAndConstructionBusiness",
            name: "Kloche Interiors",
            url: absoluteUrl("/"),
            image: IMAGES.hero,
            telephone: STUDIO.phoneDisplay,
            email: STUDIO.email,
            address: {
              "@type": "PostalAddress",
              streetAddress: "Karuna Road",
              addressLocality: "Nairobi",
              addressCountry: "KE",
            },
            openingHours: ["Mo-Fr 09:00-18:00", "Sa 10:00-15:00"],
            sameAs: [STUDIO.instagram],
            priceRange: "$$$",
          }),
        },
        ...seo.scripts,
      ],
    };
  },
  loader: async () => {
    const [sections, projects, seo] = await Promise.all([
      safeLoad(() => listHomepageSections(), DEFAULT_SECTIONS),
      safeLoad(() => listPublishedProjects(), PROJECTS),
      safeLoad(() => getSeoMeta({ data: "home" }), null),
    ]);
    return { sections, projects, seo };
  },
  errorComponent: ({ error }) => (
    <div className="section-y mx-auto max-w-3xl px-5 text-center" role="alert">
      <h2 className="text-2xl">Something went wrong</h2>
      <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="section-y mx-auto max-w-3xl px-5 text-center">Page not found.</div>
  ),
  component: Home,
});

function Home() {
  const { sections, projects } = Route.useLoaderData() as {
    sections: HomepageSection[];
    projects: Project[];
  };

  return (
    <>
      {sections.map((s: HomepageSection) => (
        <SectionRenderer key={s.id} section={s} projects={projects} />
      ))}
    </>
  );
}

function SectionRenderer({ section: s, projects }: { section: HomepageSection; projects: Project[] }) {
  switch (s.kind) {
    case "hero":
      return <Hero section={s} />;
    case "richtext":
      return <StudioIntro section={s} />;
    case "projects":
      return <FeaturedProjects section={s} projects={projects} />;
    case "services":
      return <ServicesPreview section={s} />;
    case "pillars":
      return <Pillars section={s} />;
    case "stats":
      return <Stats section={s} />;
    case "philosophy":
      return <Philosophy section={s} />;
    case "testimonials":
      return <Testimonials section={s} />;
    case "cta":
      return <CtaBanner title={s.title || undefined} body={s.body || undefined} />;
    default:
      return null;
  }
}

function Hero({ section }: { section: HomepageSection }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yRaw = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fadeRaw = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = reduced ? undefined : yRaw;
  const fade = reduced ? undefined : fadeRaw;

  const heroSrc = section.content.imageUrl || IMAGES.hero;

  return (
    <section ref={heroRef} className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <motion.img
        style={{ y }}
        src={imageAt(heroSrc, 1920)}
        srcSet={srcSet(heroSrc)}
        sizes={SIZES.full}
        fetchPriority="high"
        decoding="sync"
        alt="A softly lit contemporary living room designed by Kloche Interiors"
        className="absolute inset-0 h-[118%] w-full bg-charcoal object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/55 via-charcoal/45 to-charcoal/90" />

      <motion.div
        style={{ opacity: fade }}
        className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-14 pt-28 md:px-8 md:pb-20 md:pt-32"
      >
        <Reveal delay={0.1}>
          <p className="eyebrow text-cream/85">{section.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.2}>
          <h1 className="mt-5 max-w-4xl text-4xl leading-[1.05] text-cream sm:text-5xl md:text-7xl">
            {section.title}
          </h1>
        </Reveal>
        <Reveal delay={0.32}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-cream/80">{section.body}</p>
        </Reveal>
        <Reveal delay={0.42}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-[0.75rem] uppercase tracking-[0.2em] text-accent-foreground transition-opacity hover:opacity-90"
            >
              {section.content.ctaLabel ?? "Start Your Transformation"} <ArrowRight size={15} />
            </Link>

            {section.content.showWhatsapp !== false && (
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-cream/40 px-7 py-4 text-[0.75rem] uppercase tracking-[0.2em] text-cream transition-colors hover:bg-cream/10"
              >
                <MessageCircle size={16} /> WhatsApp us
              </a>
            )}
          </div>
        </Reveal>
      </motion.div>
    </section>
  );
}

function StudioIntro({ section }: { section: HomepageSection }) {
  const paragraphs = section.content.paragraphs ?? (section.body ? [section.body] : []);
  return (
    <section className="section-y">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[0.9fr_1.1fr] md:px-8">
        <Reveal>
          <p className="eyebrow">{section.eyebrow}</p>
          <h2 className="mt-4 text-3xl md:text-4xl">{section.title}</h2>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col justify-center gap-5">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-muted-foreground">
              {p}
            </p>
          ))}
          {section.content.linkLabel && (
            <Link
              to="/about"
              className="group inline-flex w-fit items-center gap-2 text-[0.75rem] uppercase tracking-[0.2em] text-accent"
            >
              {section.content.linkLabel}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function FeaturedProjects({
  section,
  projects,
}: {
  section: HomepageSection;
  projects: Project[];
}) {
  const limit = section.content.limit ?? 6;
  return (
    <section className="section-y bg-secondary/50">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={section.eyebrow} title={section.title} body={section.body} />
          <Reveal delay={0.1}>
            <Link
              to="/portfolio"
              className="group inline-flex items-center gap-2 text-[0.75rem] uppercase tracking-[0.2em] text-accent"
            >
              {section.content.linkLabel ?? "View full portfolio"}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, limit).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <Link
                to="/portfolio/$projectId"
                params={{ projectId: p.id }}
                className="group block overflow-hidden rounded-3xl bg-card shadow-soft hover-lift"
              >
                <div className="aspect-4/5 overflow-hidden">
                  <SmartImage
                    src={p.cover}
                    alt={`${p.name} interior in ${p.location}`}
                    baseWidth={640}
                    sizes={SIZES.third}
                    ratio="4 / 5"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="font-display text-lg">{p.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{p.location}</p>
                  <span className="mt-4 inline-flex rounded-full bg-secondary px-3 py-1 text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
                    {p.style}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesPreview({ section }: { section: HomepageSection }) {
  return (
    <section className="section-y">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={section.eyebrow} title={section.title} body={section.body} />
          <Reveal delay={0.1}>
            <Link
              to="/services"
              className="group inline-flex items-center gap-2 text-[0.75rem] uppercase tracking-[0.2em] text-accent"
            >
              {section.content.linkLabel ?? "See all services"}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.07}>
              <div className="h-full rounded-3xl border border-border/70 bg-card p-7 shadow-soft hover-lift">
                <span className="font-display text-2xl text-accent">0{i + 1}</span>
                <h3 className="mt-4 text-xl">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.short}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pillars({ section }: { section: HomepageSection }) {
  return (
    <section className="section-y bg-secondary/50">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          body={section.body}
          align="center"
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="h-full rounded-3xl border border-border/70 bg-card p-7 shadow-soft hover-lift">
                <span className="font-display text-2xl text-accent">0{i + 1}</span>
                <h3 className="mt-4 text-xl">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats({ section }: { section: HomepageSection }) {
  const items = (section.content.items ?? []) as StatItem[];
  if (!items.length) return null;
  return (
    <section className="section-y">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {(section.eyebrow || section.title) && (
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            body={section.body}
            align="center"
          />
        )}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="rounded-3xl border border-border/70 bg-card p-7 text-center shadow-soft">
                <p className="font-display text-4xl text-accent">{it.value}</p>
                <p className="mt-3 text-sm text-muted-foreground">{it.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Philosophy({ section }: { section: HomepageSection }) {
  return (
    <section className="section-y">
      <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
        <Reveal>
          <p className="eyebrow">{section.eyebrow || PHILOSOPHY.eyebrow}</p>
          <h2 className="mt-4 text-3xl md:text-5xl">{section.title || PHILOSOPHY.title}</h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            {section.body || PHILOSOPHY.body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Testimonials({ section }: { section: HomepageSection }) {
  const items = ((section.content.items ?? []) as TestimonialItem[]).length
    ? (section.content.items as TestimonialItem[])
    : TESTIMONIALS;
  const [i, setI] = useState(0);
  const t = items[i % items.length]!;
  const go = (d: number) => setI((v) => (v + d + items.length) % items.length);

  return (
    <section className="section-y bg-secondary/50">
      <div className="mx-auto max-w-4xl px-5 text-center md:px-8">
        <Reveal>
          <p className="eyebrow">{section.eyebrow || "Kind Words"}</p>
          <motion.blockquote
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 font-display text-2xl leading-snug md:text-4xl"
          >
            “{t.quote}”
          </motion.blockquote>
          <p className="mt-8 text-sm">{t.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t.detail}</p>

          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              aria-label="Previous testimonial"
              onClick={() => go(-1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-border transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronLeft size={17} />
            </button>
            <div className="flex gap-1.5">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Testimonial ${idx + 1}`}
                  onClick={() => setI(idx)}
                  className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-accent" : "w-1.5 bg-border"}`}
                />
              ))}
            </div>
            <button
              aria-label="Next testimonial"
              onClick={() => go(1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-border transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

