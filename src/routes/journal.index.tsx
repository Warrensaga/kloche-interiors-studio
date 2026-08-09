import { Link, createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Reveal } from "@/components/site/Reveal";
import { SmartImage } from "@/components/site/SmartImage";
import { listPublishedPosts, type PostSummary } from "@/lib/blog.functions";
import { absoluteUrl, breadcrumbLd, pageSeo } from "@/lib/seo";
import { getSeoMeta } from "@/lib/seo.functions";

export const Route = createFileRoute("/journal/")({
  loader: async () => {
    const [posts, seo] = await Promise.all([listPublishedPosts(), getSeoMeta({ data: "journal" })]);
    return { posts, seo };
  },
  head: ({ loaderData }) => {
    const seo = pageSeo({
      path: "/journal",
      title: "Journal — Kloche Interiors",
      description:
        "Design notes, material stories and project diaries from the Kloche Interiors studio in Nairobi.",
      ogTitle: "Journal — Kloche Interiors",
      ogDescription: "Design notes and project diaries from Kloche Interiors, Nairobi.",
      override: loaderData?.seo,
    });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [breadcrumbLd([{ name: "Journal", path: "/journal" }]), ...seo.scripts],
    };
  },
  component: JournalIndex,
});

function JournalIndex() {
  const { posts } = Route.useLoaderData() as { posts: PostSummary[] };

  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <p className="eyebrow">Journal</p>
            <h1 className="mt-4 font-display text-4xl md:text-6xl">Notes from the studio</h1>
            <p className="mt-5 max-w-2xl text-muted-foreground">
              Material stories, project diaries and practical guidance on designing warm, lasting
              interiors in Kenya.
            </p>
          </Reveal>

          {!posts.length && (
            <p className="mt-16 text-sm text-muted-foreground">
              The first article is on its way — check back soon.
            </p>
          )}

          <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Reveal key={p.slug}>
                <Link to="/journal/$slug" params={{ slug: p.slug }} className="group block">
                  {p.cover_url && (
                    <div className="overflow-hidden rounded-2xl">
                      <SmartImage
                        src={p.cover_url}
                        alt={p.title}
                        ratio="4/3"
                        className="transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <p className="eyebrow mt-5">{p.category || "Journal"}</p>
                  <h2 className="mt-2 font-display text-2xl">{p.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
