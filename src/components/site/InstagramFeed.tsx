import { useEffect, useRef } from "react";
import { Instagram } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./Sections";
import { STUDIO } from "@/data/site";

// Replace these placeholder shortcodes with your actual Instagram post URLs.
// To get a post URL: open the post on Instagram → ⋮ → Embed → copy the permalink.
export const INSTAGRAM_POSTS = [
  "https://www.instagram.com/p/PLACEHOLDER_POST_1/",
  "https://www.instagram.com/p/PLACEHOLDER_POST_2/",
];

interface InstagramEmbedProps {
  permalink: string;
}

function InstagramEmbed({ permalink }: InstagramEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const embedHtml = `<blockquote class="instagram-media" data-instgrm-permalink="${permalink}" data-instgrm-version="14" style="margin: 1px; min-width: 100%;">
    <a href="${permalink}" target="_blank" rel="noopener noreferrer">View this post on Instagram</a>
    <p>A post shared by <a href="${STUDIO.instagram}" target="_blank" rel="noopener noreferrer">Kloche interiors & Construction</a> (@klocheinteriors_construction)</p>
  </blockquote>`;

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const process = () => {
      if ((window as Window & { instgrm?: { Embeds: { process: () => void } } }).instgrm?.Embeds) {
        window.instgrm.Embeds.process();
      }
    };

    if (!document.getElementById("instagram-embed-script")) {
      const script = document.createElement("script");
      script.id = "instagram-embed-script";
      script.async = true;
      script.src = "https://www.instagram.com/embed.js";
      script.onload = process;
      document.body.appendChild(script);
    } else {
      process();
    }
  }, [permalink]);

  return (
    <div
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: embedHtml }}
      className="instagram-embed-container min-w-0"
    />
  );
}

export function InstagramFeed() {
  return (
    <section className="section-y bg-secondary/50">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="On Instagram"
            title="Follow our work"
            body="A glimpse of recent spaces, before-and-after moments and studio life."
          />
          <Reveal delay={0.1}>
            <a
              href={STUDIO.instagram}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 text-[0.75rem] uppercase tracking-[0.2em] text-accent"
            >
              <Instagram size={16} />
              @klocheinteriors_construction
            </a>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {INSTAGRAM_POSTS.map((permalink, i) => (
            <Reveal key={permalink} delay={i * 0.1}>
              <div className="overflow-hidden rounded-3xl bg-card shadow-soft transition-shadow hover:shadow-lift">
                <InstagramEmbed permalink={permalink} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
