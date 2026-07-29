import { createFileRoute } from "@tanstack/react-router";
import { ErrorState } from "@/components/site/ErrorState";
import { absoluteUrl } from "@/lib/seo";

export const Route = createFileRoute("/404")({
  head: () => ({
    meta: [
      { title: "Page not found — Kloche Interiors" },
      {
        name: "description",
        content:
          "The page you were looking for isn't here. Explore our interior design portfolio, services and studio contact details instead.",
      },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: "Page not found — Kloche Interiors" },
      {
        property: "og:description",
        content: "The page you were looking for isn't here.",
      },
      { property: "og:url", content: absoluteUrl("/404") },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotFoundPage,
});

function NotFoundPage() {
  return (
    <ErrorState
      code="404"
      eyebrow="Page not found"
      title="This room doesn't exist"
      body="The page you were looking for may have moved or never existed. Let's get you back to something beautiful."
    />
  );
}
