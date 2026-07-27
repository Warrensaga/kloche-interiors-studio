import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES, PROJECTS, type Category } from "@/data/site";
import { Reveal } from "@/components/site/Reveal";
import { PageHero, CtaBanner, SectionHeading } from "@/components/site/Sections";
import { BeforeAfter } from "@/components/site/BeforeAfter";

const HERO = PROJECTS[1].cover;

export const Route = createFileRoute("/portfolio/")({
  head: () => ({
    meta: [
      { title: "Portfolio — Kloche Interiors Nairobi" },
      {
        name: "description",
        content:
          "Residential, commercial, kitchen and living space projects designed by Kloche Interiors across Nairobi and Kenya.",
      },
      { property: "og:title", content: "Portfolio — Kloche Interiors" },
      {
        property: "og:description",
        content: "Selected interior design projects across Nairobi and Kenya.",
      },
      { property: "og:image", content: HERO },
      { name: "twitter:image", content: HERO },
    ],
  }),
  component: Portfolio,
});

function Portfolio() {
  const [filter, setFilter] = useState<Category | "All">("All");
  const projects = useMemo(
    () => (filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.categories.includes(filter))),
    [filter],
  );
  const baProject = PROJECTS.find((p) => p.beforeAfter)!;

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Spaces we've shaped"
        subtitle="Homes, kitchens and workplaces across Nairobi — each one built around a specific way of living."
        image={HERO}
      />

      <section className="section-y">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal className="flex flex-wrap gap-2">
            {(["All", ...CATEGORIES] as const).map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.18em] transition-colors ${
                  filter === c
                    ? "bg-accent text-accent-foreground"
                    : "border border-border text-muted-foreground hover:border-accent hover:text-accent"
                }`}
              >
                {c}
              </button>
            ))}
          </Reveal>

          <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.08}>
                <Link
                  to="/portfolio/$projectId"
                  params={{ projectId: p.id }}
                  className="group block overflow-hidden rounded-3xl bg-card shadow-soft transition-transform duration-500 hover:-translate-y-1"
                >
                  <div className="aspect-4/3 overflow-hidden">
                    <img
                      src={p.cover}
                      alt={`${p.name}, ${p.location}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-start justify-between gap-4 p-6">
                    <div className="min-w-0">
                      <h2 className="truncate font-display text-xl">{p.name}</h2>
                      <p className="mt-1 text-xs text-muted-foreground">{p.location}</p>
                      <span className="mt-4 inline-flex rounded-full bg-secondary px-3 py-1 text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
                        {p.style}
                      </span>
                    </div>
                    <ArrowUpRight
                      size={20}
                      className="shrink-0 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          {projects.length === 0 && (
            <p className="mt-16 text-center text-sm text-muted-foreground">
              No projects in this category yet — more coming soon.
            </p>
          )}
        </div>
      </section>

      <section className="section-y bg-secondary/50">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <SectionHeading
            eyebrow="Before & After"
            title={baProject.name}
            body="Drag the handle to see the ground floor before we opened it up."
            align="center"
          />
          <Reveal delay={0.1} className="mt-12">
            <BeforeAfter
              before={baProject.beforeAfter!.before}
              after={baProject.beforeAfter!.after}
            />
          </Reveal>
          <Reveal delay={0.2} className="mt-8 text-center">
            <Link
              to="/portfolio/$projectId"
              params={{ projectId: baProject.id }}
              className="inline-flex rounded-full border border-border px-7 py-3.5 text-[0.72rem] uppercase tracking-[0.2em] transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              View this project
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaBanner title="See something you like?" />
    </>
  );
}
