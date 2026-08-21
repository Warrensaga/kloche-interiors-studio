import { createFileRoute } from "@tanstack/react-router";
import { FOUNDER, IMAGES, PHILOSOPHY, STATS } from "@/data/site";
import { Reveal } from "@/components/site/Reveal";
import { CtaBanner, PageHero, SectionHeading } from "@/components/site/Sections";
import { absoluteUrl, breadcrumbLd, pageSeo } from "@/lib/seo";
import { getSeoMeta } from "@/lib/seo.functions";
import { safeLoad } from "@/lib/supabase-env";
import { SIZES, SmartImage } from "@/components/site/SmartImage";
import { listPageCopy } from "@/lib/content.functions";
import { copyOf, type PageCopy } from "@/lib/content-map";

export const Route = createFileRoute("/about")({
  loader: async () => {
    const [seo, copy] = await Promise.all([
      safeLoad(() => getSeoMeta({ data: "about" }), null),
      safeLoad(() => listPageCopy({ data: "about" }), [] as PageCopy[]),
    ]);
    return { seo, copy };
  },

  head: ({ loaderData }) => {
    const seo = pageSeo({
      path: "/about",
      title: "About the Studio — Kloche Interiors Nairobi",
      description:
        "Meet Keith Locho, founder and principal interior designer of Kloche Interiors — the story, philosophy and studio behind every project.",
      ogTitle: "About — Kloche Interiors",
      ogDescription:
        "The founder story, philosophy and studio behind Kloche Interiors in Nairobi.",
      image: IMAGES.studio1,
      override: loaderData?.seo,
    });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        breadcrumbLd([{ name: "About", path: "/about" }]),
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About Kloche Interiors",
            url: absoluteUrl("/about"),
            mainEntity: {
              "@type": "HomeAndConstructionBusiness",
              name: "Kloche Interiors",
              url: absoluteUrl("/"),
              founder: { "@type": "Person", name: "Keith Locho" },
            },
          }),
        },
        ...seo.scripts,
      ],
    };
  },
  component: About,
});

function About() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Meet the Founder"
        subtitle="Keith Locho — Founder & Creative Director, Kloche Interiors & Construction."
        image={IMAGES.studio2}
      />

      <section className="section-y">
        <div className="mx-auto grid max-w-7xl items-start gap-12 px-5 md:px-8 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow">Meet the Founder</p>
            <h2 className="mt-4 text-3xl md:text-5xl">{FOUNDER.name}</h2>
            <p className="mt-3 text-sm uppercase tracking-[0.18em] text-muted-foreground">
              {FOUNDER.role}
            </p>

            <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg md:leading-[1.85]">
              {FOUNDER.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <blockquote className="mt-8 border-l-2 border-accent pl-6 font-display text-xl italic text-foreground/80">
              “{FOUNDER.quote}”
            </blockquote>
          </Reveal>

          <Reveal delay={0.12}>
            <figure className="overflow-hidden rounded-3xl shadow-soft lg:sticky lg:top-28">
              <SmartImage
                src={IMAGES.furniture}
                alt="Handcrafted walnut furniture and linen textures in a Kloche Interiors room"
                baseWidth={900}
                sizes={SIZES.half}
                ratio="4 / 5"
                className="img-zoom aspect-4/5 w-full object-cover"
              />
            </figure>
          </Reveal>
        </div>
      </section>


      <section className="border-y border-border bg-secondary/50 py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 md:grid-cols-4 md:px-8">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <p className="font-display text-4xl text-accent md:text-5xl">{s.value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading
            eyebrow={PHILOSOPHY.eyebrow}
            title={PHILOSOPHY.title}
            body={PHILOSOPHY.body}
            align="center"
          />
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="eyebrow">Inside the Studio</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[IMAGES.studio1, IMAGES.studio3, IMAGES.studio4, IMAGES.studio2].map((src, i) => (
              <Reveal key={src} delay={i * 0.07}>
                <SmartImage
                  src={src}
                  alt="Behind the scenes at the Kloche Interiors studio"
                  baseWidth={600}
                  sizes={SIZES.quarter}
                  ratio="1 / 1"
                  className="aspect-square w-full rounded-3xl object-cover shadow-soft"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner title="Come and say hello." />
    </>
  );
}
