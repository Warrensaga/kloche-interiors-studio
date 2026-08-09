import { useEffect, useState } from "react";
import { AlertTriangle, Check, ExternalLink, Globe, Share2 } from "lucide-react";
import { BASE_URL, absoluteUrl } from "@/lib/seo";

export type SeoDraft = {
  page_key: string;
  path: string;
  title: string;
  description: string;
  og_image: string;
  canonical: string;
  schema_json: string;
  noindex: boolean;
};

const DEFAULTS: Record<string, { title: string; description: string }> = {
  home: {
    title: "Kloche Interiors | Luxury Interior Design Studio, Nairobi",
    description:
      "Bespoke interior design and renovation for Nairobi's most discerning homeowners. Residential, commercial and renovation design across Kenya.",
  },
  portfolio: {
    title: "Portfolio — Kloche Interiors Nairobi",
    description:
      "Residential, commercial, kitchen and living space projects designed by Kloche Interiors across Nairobi and Kenya.",
  },
  services: {
    title: "Interior Design Services in Nairobi — Kloche Interiors",
    description:
      "Full home design, space planning, furniture sourcing and renovation consulting for homes and workplaces in Nairobi, Kenya.",
  },
  about: {
    title: "About the Studio — Kloche Interiors Nairobi",
    description:
      "Meet Keith Locho, founder and principal interior designer of Kloche Interiors — the story, philosophy and studio behind every project.",
  },
  pricing: {
    title: "Investment Guide — Kloche Interiors Nairobi",
    description:
      "How Kloche Interiors & Construction prices interior design, renovations, 3D visualisation and commercial fit-outs in Nairobi.",
  },
  contact: {
    title: "Contact — Kloche Interiors, Nairobi",
    description:
      "Book a consultation with Kloche Interiors in Westlands, Nairobi. Call, WhatsApp, email or send us your project details.",
  },
  journal: {
    title: "Journal — Kloche Interiors",
    description:
      "Design notes, material stories and project diaries from the Kloche Interiors studio in Nairobi.",
  },
};

/** What the public page will actually output once saved. */
export function resolveSeo(draft: SeoDraft) {
  const fallback = DEFAULTS[draft.page_key] ?? { title: "", description: "" };
  return {
    title: draft.title.trim() || fallback.title,
    description: draft.description.trim() || fallback.description,
    canonical: draft.canonical.trim() || absoluteUrl(draft.path),
    image: draft.og_image.trim(),
    usingDefaultTitle: !draft.title.trim(),
    usingDefaultDescription: !draft.description.trim(),
  };
}

function Meter({ value, min, max, label }: { value: number; min: number; max: number; label: string }) {
  const ok = value >= min && value <= max;
  return (
    <p className={`text-[0.7rem] ${ok ? "text-muted-foreground" : "text-destructive"}`}>
      {label}: {value} characters{ok ? "" : ` — aim for ${min}–${max}`}
    </p>
  );
}

function Issue({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-xs">
      {ok ? (
        <Check size={14} className="mt-0.5 shrink-0 text-accent" />
      ) : (
        <AlertTriangle size={14} className="mt-0.5 shrink-0 text-destructive" />
      )}
      <span className={ok ? "text-muted-foreground" : "text-destructive"}>{children}</span>
    </li>
  );
}

/** Google result + social card preview for one page's SEO record. */
export function SeoPreview({ draft }: { draft: SeoDraft }) {
  const r = resolveSeo(draft);
  const [imageOk, setImageOk] = useState(true);
  useEffect(() => setImageOk(true), [r.image]);

  let schemaValid = true;
  if (draft.schema_json.trim()) {
    try {
      JSON.parse(draft.schema_json);
    } catch {
      schemaValid = false;
    }
  }

  const host = BASE_URL.replace(/^https?:\/\//, "");
  const crumb = `${host}${draft.path === "/" ? "" : ` › ${draft.path.replace(/^\//, "").split("/").join(" › ")}`}`;

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-secondary/40 p-5">
      <div>
        <p className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
          <Globe size={13} /> Google result preview
        </p>
        <div className="mt-3 rounded-xl bg-background p-4">
          <p className="truncate text-xs text-muted-foreground">{crumb}</p>
          <p className="mt-1 line-clamp-2 text-[1.05rem] leading-snug text-[#1a0dab] dark:text-[#8ab4f8]">
            {r.title || "Untitled page"}
          </p>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {r.description || "No meta description set."}
          </p>
        </div>
        <div className="mt-2 space-y-1">
          <Meter label="Title" value={r.title.length} min={30} max={60} />
          <Meter label="Description" value={r.description.length} min={70} max={160} />
        </div>
      </div>

      <div>
        <p className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
          <Share2 size={13} /> Social share preview (WhatsApp / Facebook / X)
        </p>
        <div className="mt-3 overflow-hidden rounded-xl border border-border bg-background">
          <div className="aspect-[1.91/1] w-full bg-secondary">
            {r.image && imageOk ? (
              <img
                src={r.image}
                alt="Social share preview"
                className="h-full w-full object-cover"
                onError={() => setImageOk(false)}
              />
            ) : (
              <div className="grid h-full w-full place-items-center px-4 text-center text-xs text-muted-foreground">
                {r.image
                  ? "This image URL could not be loaded."
                  : "No custom share image — the page's built-in hero image is used."}
              </div>
            )}
          </div>
          <div className="p-3">
            <p className="truncate text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
              {host}
            </p>
            <p className="mt-1 line-clamp-1 text-sm">{r.title}</p>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{r.description}</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">Checks</p>
        <ul className="mt-3 space-y-1.5">
          <Issue ok={r.title.length > 0 && r.title.length <= 60}>
            Title fits Google&apos;s display limit
          </Issue>
          <Issue ok={r.description.length >= 70 && r.description.length <= 160}>
            Description length is in range
          </Issue>
          <Issue ok={/^https?:\/\//.test(r.canonical)}>
            Canonical is an absolute URL — {r.canonical || "not set"}
          </Issue>
          <Issue ok={schemaValid}>Extra schema markup is valid JSON</Issue>
          <Issue ok={!draft.noindex}>
            {draft.noindex ? "Hidden from search engines" : "Visible to search engines"}
          </Issue>
        </ul>
        {(r.usingDefaultTitle || r.usingDefaultDescription) && (
          <p className="mt-3 text-xs text-muted-foreground">
            Blank fields fall back to the page&apos;s built-in copy (shown above).
          </p>
        )}
        <a
          href={r.canonical}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-accent"
        >
          View live page <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}
