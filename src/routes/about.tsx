import { createFileRoute } from "@tanstack/react-router";
import { IMAGES, STATS } from "@/data/site";
import { Reveal } from "@/components/site/Reveal";
import { CtaBanner, PageHero, SectionHeading } from "@/components/site/Sections";
import { absoluteUrl } from "@/lib/seo";
import { SIZES, SmartImage } from "@/components/site/SmartImage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Studio — Kloche Interiors Nairobi" },
      {
        name: "description",
        content:
          "Meet Keith Locho, founder and principal interior designer of Kloche Interiors — the story, philosophy and studio behind every project.",
      },
      { property: "og:title", content: "About — Kloche Interiors" },
      {
        property: "og:description",
        content: "The founder story, philosophy and studio behind Kloche Interiors in Nairobi.",
      },
      { property: "og:image", content: IMAGES.studio1 },
      { name: "twitter:image", content: IMAGES.studio1 },
      { property: "og:url", content: absoluteUrl("/about") },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/about") }],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Keith Locho and the Soul of the Studio"
        subtitle="A return to honest, natural resources and a studio on Karuna Road that honors them."
        image={IMAGES.studio2}
      />

      <section className="section-y">
        <div className="mx-auto grid max-w-7xl items-start gap-12 px-5 md:px-8 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow">Founder Profile &amp; Story</p>
            <h2 className="mt-4 text-3xl md:text-5xl">Keith Locho</h2>

            <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg md:leading-[1.85]">
              <p>
                "I started Kloche Interiors with a simple realization: spaces are not just
                structures to occupy; they are canvases for the soul," says founder and
                principal interior designer <strong>Keith Locho</strong>. "After years of
                practicing design in sub-Saharan Africa, I felt a deep pull to return to
                honest, natural resources and create a studio on Karuna Road that honors
                them."
              </p>
              <p>
                Our studio rejects the cold, sterile assembly-line look that occupies much
                of modern design. Instead, we spend our days collaborating directly with
                local Kenyan wood artisans, veteran stonemasons, and textile curators.
                We seek physical depth over digital render aesthetics — focusing on how
                raw walnut furniture fits against fine-texture linen, and how light cascades
                across lime-wash wall formulations.
              </p>
            </div>
            <p className="mt-8 font-display text-xl italic text-foreground/80">
              "A good interior isn't the one that photographs best. It's the one you're
              relieved to come back to."
            </p>
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
            eyebrow="Philosophy"
            title="Warmth first, trends never"
            body="We design for the twenty years after the photographs. That means honest materials that age well, layouts that survive a growing family, and a palette that doesn't date the moment the season turns."
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
