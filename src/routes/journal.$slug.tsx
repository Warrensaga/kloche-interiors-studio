import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Reveal } from "@/components/site/Reveal";
import { SmartImage } from "@/components/site/SmartImage";
import { ErrorState } from "@/components/site/ErrorState";
import { getPublishedPost, type PostFull } from "@/lib/blog.functions";
import { absoluteUrl, breadcrumbLd } from "@/lib/seo";
import { safeLoad } from "@/lib/supabase-env";

export const Route = createFileRoute("/journal/$slug")({
  loader: async ({ params }) => {
    const post = await safeLoad(() => getPublishedPost({ data: { slug: params.slug } }), null as PostFull | null);
    if (!post) throw notFound();
    return post;
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Article not found — Kloche Interiors" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = loaderData.seo_title || `${loaderData.title} — Kloche Interiors`;
    const description = loaderData.seo_description || loaderData.excerpt;
    const url = absoluteUrl(`/journal/${params.slug}`);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(loaderData.cover_url
          ? [
              { property: "og:image", content: loaderData.cover_url },
              { name: "twitter:image", content: loaderData.cover_url },
            ]
          : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        breadcrumbLd([
          { name: "Journal", path: "/journal" },
          { name: loaderData.title, path: `/journal/${params.slug}` },
        ]),
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: loaderData.title,
            description,
            image: loaderData.cover_url || undefined,
            author: { "@type": "Organization", name: loaderData.author },
            datePublished: loaderData.published_at ?? undefined,
            mainEntityOfPage: url,
          }),
        },
      ],
    };
  },
  notFoundComponent: PostNotFound,
  component: JournalPost,
});

function PostNotFound() {
  return (
    <ErrorState
      code="404"
      eyebrow="Journal"
      title="This article doesn't exist"
      body="It may have been unpublished or moved. Browse the journal for the latest writing."
    />
  );
}

function JournalPost() {
  const post = Route.useLoaderData() as PostFull;
  const paragraphs = post.content.split(/\n{2,}/).filter(Boolean);

  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        <article className="mx-auto max-w-3xl px-5 md:px-8">
          <Reveal>
            <Link to="/journal" className="eyebrow hover:text-accent">
              ← Journal
            </Link>
            <h1 className="mt-5 font-display text-4xl md:text-5xl">{post.title}</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              {post.author}
              {post.published_at && ` · ${new Date(post.published_at).toLocaleDateString()}`}
              {post.category && ` · ${post.category}`}
            </p>
          </Reveal>

          {post.cover_url && (
            <Reveal className="mt-10">
              <SmartImage src={post.cover_url} alt={post.title} ratio="16/9" className="rounded-2xl" />
            </Reveal>
          )}

          <div className="mt-10 space-y-6">
            {paragraphs.map((p: string, i: number) => (
              <p key={i} className="text-lg leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </div>
        </article>
      </main>
    </>
  );
}
