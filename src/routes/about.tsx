import { createFileRoute } from "@tanstack/react-router";
import { IMAGES, STATS, TEAM } from "@/data/site";
import { Reveal } from "@/components/site/Reveal";
import { CtaBanner, PageHero, SectionHeading } from "@/components/site/Sections";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Studio — Kloche Interiors Nairobi" },
      {
        name: "description",
        content:
          "Meet Cheryl Kloche and the Nairobi studio behind Kloche Interiors — our story, philosophy and the team delivering every project.",
      },
      { property: "og:title", content: "About — Kloche Interiors" },
      {
        property: "og:description",
        content: "The story, philosophy and people behind Kloche Interiors in Nairobi.",
      },
      { property: "og:image", content: IMAGES.studio1 },
      { name: "twitter:image", content: IMAGES.studio1 },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A small studio, deliberately"
        subtitle="We take on a limited number of projects each year so that every one gets the attention it was promised."
        image={IMAGES.studio2}
      />

      <section className="section-y">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-[0.85fr_1.15fr] md:gap-16 md:px-8">
          <Reveal>
            <img
              src={IMAGES.aboutFounder}
              alt="Cheryl Kloche, founder and principal designer"
              className="aspect-4/5 w-full rounded-3xl object-cover shadow-soft"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">Founder</p>
            <h2 className="mt-4 text-3xl md:text-4xl">Cheryl Kloche</h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                Cheryl trained in architecture at the University of Nairobi and spent six
                years between a residential practice in Nairobi and a furniture atelier in
                Cape Town before starting Kloche in 2018 — originally from the spare room of
                a Kilimani apartment.
              </p>
              <p>
                Her approach comes from growing up between a coastal Kenyan home full of
                carved wood and lime-washed walls, and a city flat where every square metre
                had to work twice. That tension — generosity and discipline — sits behind
                every layout the studio draws.
              </p>
              <p>
                Today she leads a team of four, works with over forty Kenyan artisans and
                still personally attends the first consultation on every project.
              </p>
            </div>
            <p className="mt-8 font-display text-xl italic text-foreground/80">
              “A good interior isn't the one that photographs best. It's the one you're
              relieved to come back to.”
            </p>
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
          <p className="eyebrow">The Team</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.07}>
                <div className="overflow-hidden rounded-3xl bg-card shadow-soft">
                  <img
                    src={m.photo}
                    alt={`${m.name}, ${m.role}`}
                    loading="lazy"
                    className="aspect-4/5 w-full object-cover"
                  />
                  <div className="p-5">
                    <p className="font-display text-lg">{m.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{m.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="eyebrow">Inside the Studio</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[IMAGES.studio1, IMAGES.studio3, IMAGES.studio4, IMAGES.studio2].map((src, i) => (
              <Reveal key={src} delay={i * 0.07}>
                <img
                  src={src}
                  alt="Behind the scenes at the Kloche Interiors studio"
                  loading="lazy"
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
