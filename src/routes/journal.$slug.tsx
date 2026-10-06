import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Reveal } from "@/components/site/Reveal";
import { SmartImage } from "@/components/site/SmartImage";
import { ErrorState } from "@/components/site/ErrorState";
import { getPublishedPost, listPublishedPosts, type PostFull, type PostSummary } from "@/lib/blog.functions";
import { absoluteUrl, breadcrumbLd } from "@/lib/seo";
import { safeLoad } from "@/lib/supabase-env";
import { JournalMarkdown } from "@/components/site/JournalMarkdown";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/data/site";

export const Route = createFileRoute("/journal/$slug")({
  loader: async ({ params }) => {
    const [post, posts] = await Promise.all([
      safeLoad(() => getPublishedPost({ data: { slug: params.slug } }), null as PostFull | null),
      safeLoad(() => listPublishedPosts(), [] as PostSummary[]),
    ]);
    if (!post) throw notFound();
    return { post, related: posts.filter((item) => item.slug !== post.slug).slice(0, 3) };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Article not found — Kloche Interiors" }, { name: "robots", content: "noindex" }],
      };
    }
    const { post } = loaderData;
    const title = post.seo_title || `${post.title} — Kloche Interiors`;
    const description = post.seo_description || post.excerpt;
    const url = absoluteUrl(`/journal/${params.slug}`);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(post.cover_url
          ? [
              { property: "og:image", content: post.cover_url },
              { name: "twitter:image", content: post.cover_url },
            ]
          : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        breadcrumbLd([
          { name: "Journal", path: "/journal" },
          { name: post.title, path: `/journal/${params.slug}` },
        ]),
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description,
            image: post.cover_url || undefined,
            author: { "@type": "Organization", name: post.author },
            publisher: { "@type": "Organization", name: "Kloche Interiors" },
            datePublished: post.published_at ?? undefined,
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
  const { post, related } = Route.useLoaderData() as { post: PostFull; related: PostSummary[] };

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
              <SmartImage src={post.cover_url} alt={post.cover_alt || `${post.title} interior design project`} ratio="16/9" className="rounded-2xl" />
            </Reveal>
          )}

          <div className="journal-prose prose prose-lg mt-10 max-w-none dark:prose-invert">
            <JournalMarkdown>{post.content}</JournalMarkdown>
          </div>

          {related.length > 0 && (
            <section className="mt-16 border-t border-border pt-12" aria-labelledby="related-posts">
              <h2 id="related-posts" className="font-display text-3xl text-accent">Related posts</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {related.map((item) => (
                  <Link key={item.slug} to="/journal/$slug" params={{ slug: item.slug }} className="group block">
                    {item.cover_url && <SmartImage src={item.cover_url} alt={item.cover_alt || `${item.title} interior design article`} ratio="4/3" className="rounded-lg object-cover" />}
                    <p className="eyebrow mt-4">{item.category || "Journal"}</p>
                    <h3 className="mt-2 font-display text-xl group-hover:text-accent">{item.title}</h3>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mt-16 border-t border-border pt-12" aria-labelledby="journal-consultation">
            <p className="eyebrow">Start your project</p>
            <h2 id="journal-consultation" className="mt-3 font-display text-3xl">Bring your space to life</h2>
            <p className="mt-3 text-muted-foreground">Tell us what you are planning and arrange a consultation with the Kloche Interiors team.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/contact">Book a consultation <ArrowRight /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={whatsappLink(`Hello Kloche Interiors, I'd like to discuss your article “${post.title}” and book a consultation.`)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle /> WhatsApp us
                </a>
              </Button>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
