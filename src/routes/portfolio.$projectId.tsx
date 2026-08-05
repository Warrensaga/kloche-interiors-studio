import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PROJECTS, type Project } from "@/data/site";
import { Reveal } from "@/components/site/Reveal";
import { CtaBanner } from "@/components/site/Sections";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { absoluteUrl } from "@/lib/seo";
import { SIZES, SmartImage } from "@/components/site/SmartImage";
import { imageAt, srcSet } from "@/lib/images";

export const Route = createFileRoute("/portfolio/$projectId")({
  loader: ({ params }) => {
    const project = PROJECTS.find((p) => p.id === params.projectId);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Project not found — Kloche Interiors" }, { name: "robots", content: "noindex" }],
      };
    }
    const p = loaderData.project;
    const title = `${p.name} | Interiors, ${p.location}`;
    return {
      meta: [
        { title },
        { name: "description", content: p.description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: p.description.slice(0, 155) },
        { property: "og:image", content: p.cover },
        { name: "twitter:image", content: p.cover },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: p.description.slice(0, 155) },
        { property: "og:type", content: "article" },
        { property: "og:url", content: absoluteUrl(`/portfolio/${p.id}`) },
      ],
      links: [
        { rel: "canonical", href: absoluteUrl(`/portfolio/${p.id}`) },
        {
          rel: "preload",
          as: "image",
          href: imageAt(p.cover, 1920),
          imageSrcSet: srcSet(p.cover),
          imageSizes: "100vw",
          fetchPriority: "high",
        },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: "Portfolio", item: absoluteUrl("/portfolio") },
              {
                "@type": "ListItem",
                position: 3,
                name: p.name,
                item: absoluteUrl(`/portfolio/${p.id}`),
              },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `${p.name} — ${p.projectType} in ${p.location}`,
            description: p.description,
            image: [p.cover],
            url: absoluteUrl(`/portfolio/${p.id}`),
            mainEntityOfPage: absoluteUrl(`/portfolio/${p.id}`),
            author: { "@type": "Organization", name: "Kloche Interiors" },
            publisher: {
              "@type": "Organization",
              name: "Kloche Interiors",
              url: absoluteUrl("/"),
            },
            about: {
              "@type": "Service",
              serviceType: p.projectType,
              areaServed: p.location,
              provider: { "@type": "Organization", name: "Kloche Interiors" },
            },
          }),
        },
      ],
    };
  },
  component: ProjectDetail,
});

function ProjectDetail() {
  const { project } = Route.useLoaderData() as { project: Project };

  return (
    <>
      <section className="relative flex min-h-[70svh] items-end overflow-hidden">
        <SmartImage
          src={project.cover}
          alt={project.name}
          priority
          baseWidth={1920}
          sizes={SIZES.full}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/45 to-charcoal/40" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-32 md:px-8 md:pb-24 md:pt-40">
          <Reveal>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-cream/85 transition-colors hover:text-cream"
            >
              <ArrowLeft size={14} /> All projects
            </Link>
            <h1 className="mt-6 max-w-3xl text-4xl text-cream md:text-6xl">{project.name}</h1>
            <p className="mt-4 text-sm uppercase tracking-[0.2em] text-cream/85">
              {project.location} · {project.style} · {project.year}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 md:grid-cols-[1.3fr_0.7fr] md:px-8">
          <Reveal>
            <h2 className="eyebrow">The Project</h2>
            <p className="mt-5 text-lg leading-relaxed text-foreground/85 md:text-xl">
              {project.description}
            </p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-3xl bg-secondary/70 p-8">
            <h2 className="eyebrow">Scope of Work</h2>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {project.scope.map((s) => (
                <li key={s} className="flex gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {s}
                </li>
              ))}
            </ul>
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6">
              <div className="col-span-2">
                <p className="eyebrow">Project Type</p>
                <p className="mt-2 font-display text-xl">{project.projectType}</p>
              </div>
              <div>
                <p className="eyebrow">Duration</p>
                <p className="mt-2 font-display text-xl">{project.duration}</p>
              </div>
              <div>
                <p className="eyebrow">Completed</p>
                <p className="mt-2 font-display text-xl">{project.year}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 md:grid-cols-2 md:px-8">
          {project.gallery.map((src, i) => (
            <Reveal
              key={src + i}
              delay={(i % 2) * 0.08}
              className={i % 3 === 0 ? "md:col-span-2" : undefined}
            >
              <SmartImage
                src={src}
                alt={`${project.name} — photograph ${i + 1}`}
                baseWidth={i % 3 === 0 ? 1400 : 900}
                sizes={i % 3 === 0 ? SIZES.full : SIZES.half}
                ratio={i % 3 === 0 ? "16 / 9" : "4 / 3"}
                className={`w-full rounded-3xl object-cover shadow-soft ${
                  i % 3 === 0 ? "aspect-16/9" : "aspect-4/3"
                }`}
              />
            </Reveal>
          ))}
        </div>
      </section>

      {project.beforeAfter && (
        <section className="section-y bg-secondary/50">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <Reveal className="mb-10 text-center">
              <p className="eyebrow">Before & After</p>
              <h2 className="mt-4 text-3xl md:text-4xl">The same room, twelve weeks apart</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <BeforeAfter before={project.beforeAfter.before} after={project.beforeAfter.after} />
            </Reveal>
          </div>
        </section>
      )}

      <section className="section-y">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <h2 className="eyebrow">Next projects</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.filter((p) => p.id !== project.id)
              .slice(0, 3)
              .map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <Link
                    to="/portfolio/$projectId"
                    params={{ projectId: p.id }}
                    className="group block overflow-hidden rounded-3xl bg-card shadow-soft"
                  >
                    <div className="aspect-4/3 overflow-hidden">
                      <SmartImage
                        src={p.cover}
                        alt={p.name}
                        baseWidth={700}
                        sizes={SIZES.third}
                        ratio="4 / 3"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <p className="font-display text-lg">{p.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{p.location}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
          </div>
        </div>
      </section>

      <CtaBanner title="Let's plan yours next." />
    </>
  );
}
