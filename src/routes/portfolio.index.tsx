import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES, PROJECTS, type Category, type Project } from "@/data/site";
import { Reveal } from "@/components/site/Reveal";
import { PageHero, CtaBanner, SectionHeading } from "@/components/site/Sections";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { absoluteUrl, breadcrumbLd, pageSeo } from "@/lib/seo";
import { getSeoMeta } from "@/lib/seo.functions";
import { safeLoad } from "@/lib/supabase-env";
import { SIZES, SmartImage } from "@/components/site/SmartImage";
import { listPublishedProjects } from "@/lib/projects.functions";

const HERO = PROJECTS[1].cover;

export const Route = createFileRoute("/portfolio/")({
  loader: async () => {
    const [projects, seo] = await Promise.all([
      safeLoad(() => listPublishedProjects(), PROJECTS),
      safeLoad(() => getSeoMeta({ data: "portfolio" }), null),
    ]);
    return { projects, seo };
  },
  head: ({ loaderData }) => {
    const seo = pageSeo({
      path: "/portfolio",
      title: "Portfolio — Kloche Interiors Nairobi",
      description:
        "Residential, commercial, kitchen and living space projects designed by Kloche Interiors across Nairobi and Kenya.",
      ogTitle: "Portfolio — Kloche Interiors",
      ogDescription: "Selected interior design projects across Nairobi and Kenya.",
      image: HERO,
      override: loaderData?.seo,
    });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        breadcrumbLd([{ name: "Portfolio", path: "/portfolio" }]),
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Portfolio — Kloche Interiors",
          url: absoluteUrl("/portfolio"),
          mainEntity: {
            "@type": "ItemList",
            itemListElement: PROJECTS.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: p.name,
              url: absoluteUrl(`/portfolio/${p.id}`),
            })),
          },
        }),
        },
        ...seo.scripts,
      ],
    };
  },
  component: Portfolio,
});

function Portfolio() {
  const { projects: all } = Route.useLoaderData() as { projects: Project[] };
  const [filter, setFilter] = useState<Category | "All">("All");
  const projects = useMemo(
    () => (filter === "All" ? all : all.filter((p) => p.categories.includes(filter))),
    [filter, all],
  );
  const baProject = all.find((p) => p.beforeAfter) ?? PROJECTS.find((p) => p.beforeAfter)!;

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Spaces We've Transformed."
        subtitle="Every project begins with a vision and ends with a space that tells its own story. Explore a selection of our residential, commercial and hospitality projects, each shaped by thoughtful design, careful planning and considered execution."
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
              <Reveal key={p.id} delay={(i % 3) * 0.08} className="min-w-0">
                <Link
                  to="/portfolio/$projectId"
                  params={{ projectId: p.id }}
                  className="group block overflow-hidden rounded-3xl bg-card shadow-soft hover-lift"
                >
                  <div className="aspect-4/3 overflow-hidden bg-secondary">
                    {p.cover || p.gallery[0] ? (
                      <SmartImage
                        src={p.cover || p.gallery[0]}
                        alt={`${p.name}, ${p.location}`}
                        baseWidth={800}
                        sizes={SIZES.third}
                        ratio="4 / 3"
                        priority={i < 3}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
                        Image coming soon
                      </div>
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-4 p-6">
                    <div className="min-w-0">
                      <h2 className="truncate font-display text-xl">{p.name}</h2>
                      <p className="mt-1 text-xs text-muted-foreground">{p.location}</p>
                      <p className="mt-3 text-[0.7rem] uppercase tracking-[0.16em] text-accent">
                        {p.projectType}
                      </p>
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                        {p.scope.join(" • ")}
                      </p>
                      <span className="mt-4 inline-flex max-w-full break-words rounded-full bg-secondary px-3 py-1 text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
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
