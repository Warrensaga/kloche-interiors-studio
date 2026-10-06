import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Clock, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { IMAGES, SERVICES, STUDIO, whatsappLink } from "@/data/site";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/Sections";
import { absoluteUrl, breadcrumbLd, pageSeo } from "@/lib/seo";
import { getSeoMeta } from "@/lib/seo.functions";
import { safeLoad } from "@/lib/supabase-env";
import { SIZES, SmartImage } from "@/components/site/SmartImage";
import { listPublishedPosts, type PostSummary } from "@/lib/blog.functions";
import { listPageCopy, listServices } from "@/lib/content.functions";
import { copyOf, type PageCopy } from "@/lib/content-map";
import type { Service } from "@/data/site";

export const Route = createFileRoute("/contact")({
  loader: async () => {
    const [seo, posts, copy, services] = await Promise.all([
      safeLoad(() => getSeoMeta({ data: "contact" }), null),
      safeLoad(() => listPublishedPosts(), [] as PostSummary[]),
      safeLoad(() => listPageCopy({ data: "contact" }), [] as PageCopy[]),
      safeLoad(() => listServices(), SERVICES),
    ]);
    return { seo, posts, copy, services };
  },
  head: ({ loaderData }) => {
    const seo = pageSeo({
      path: "/contact",
      title: "Contact Kloche Interiors | Westlands, Nairobi",
      description:
        "Book a consultation with Kloche Interiors & Construction on Karuna Rd, Westlands, Nairobi. Call 0717 634003, WhatsApp or email us your project.",
      ogTitle: "Contact Kloche Interiors — Westlands, Nairobi",
      ogDescription:
        "Book a consultation with our interior design and construction studio in Westlands, Nairobi.",
      keywords: [
        "interior design company near me Nairobi",
        "interior designers Westlands",
        "interior design quotation Kenya",
        "general contractor Nairobi",
        "interior design Nairobi",
      ],
      image: IMAGES.studio3,
      override: loaderData?.seo,
    });
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        breadcrumbLd([{ name: "Contact", path: "/contact" }]),
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact Kloche Interiors",
            url: absoluteUrl("/contact"),
            mainEntity: {
              "@type": "HomeAndConstructionBusiness",
              name: "Kloche Interiors & Construction",
              telephone: STUDIO.phoneDisplay,
              email: STUDIO.email,
              address: {
                "@type": "PostalAddress",
                streetAddress: "Karuna Road, Westlands",
                addressLocality: "Nairobi",
                addressRegion: "Nairobi",
                addressCountry: "KE",
              },
              areaServed: [
                "Nairobi, Kenya",
                "Westlands",
                "Karen",
                "Lavington",
                "Kilimani",
                "Gigiri",
              ].map((name) => ({ "@type": "Place", name })),
            },
          }),
        },
        ...seo.scripts,
      ],
    };
  },
  validateSearch: (
    search: Record<string, unknown>,
  ): { budget?: string; service?: string } => {
    const out: { budget?: string; service?: string } = {};
    if (typeof search["budget"] === "string") out.budget = search["budget"];
    if (typeof search["service"] === "string") out.service = search["service"];
    return out;
  },
  component: Contact,
});

const inputClass =
  "mt-2 w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent";

const BUDGET_OPTIONS = [
  "Under KES 300,000",
  "KES 300,000 – 1M",
  "KES 1M – 3M",
  "Above KES 3M",
];

const WEB3FORMS_KEY = "5a2f050e-f666-4f61-a6f7-a05b9d6d929b";

function Contact() {
  const { posts, copy, services } = Route.useLoaderData() as {
    posts: PostSummary[];
    copy: PageCopy[];
    services: Service[];
  };
  const { budget, service } = Route.useSearch();
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [minDate, setMinDate] = useState<string | undefined>(undefined);
  useEffect(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    setMinDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
  }, []);
  const budgetOptions =
    budget && !BUDGET_OPTIONS.includes(budget) ? [budget, ...BUDGET_OPTIONS] : BUDGET_OPTIONS;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    if (get("botcheck")) return;
    const name = get("name");
    const phone = get("phone");
    const email = get("email");
    if (!name || !phone || !email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter your name, phone and a valid email.");
      return;
    }
    const preferredDate = get("preferredDate");
    if (minDate && preferredDate && preferredDate < minDate) {
      toast.error("Please choose a date from today onwards.");
      return;
    }
    setSending(true);
    setStatus("idle");
    // Also store the enquiry for the dashboard inbox.
    void supabase
      .from("contact_submissions")
      .insert({
        name,
        email,
        phone,
        budget: get("budget"),
        property_type: get("projectType"),
        message: get("message"),
      })
      .then(({ error }) => {
        if (error) console.error("Enquiry save failed:", error.message);
      });
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "New Consultation Request: Kloche Interiors",
          from_name: "Kloche Interiors Website",
          replyto: email,
          botcheck: "",
          name,
          phone,
          email,
          project_type: get("projectType"),
          budget_range: get("budget"),
          preferred_date: preferredDate,
          preferred_time: get("preferredTime"),
          message: get("message"),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean };
      if (!res.ok || !data.success) throw new Error("send failed");
      form.reset();
      setStatus("success");
      toast.success("Thank you, we'll get back to you shortly");
    } catch {
      setStatus("error");
      toast.error("We couldn't send your request. Please WhatsApp or call us instead.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Toaster />
      <PageHero
        eyebrow={copyOf(copy, "hero", "eyebrow", "Contact")}
        title={copyOf(copy, "hero", "title", "Let's talk about your space")}
        subtitle={copyOf(
          copy,
          "hero",
          "body",
          "Tell us a little about the project. We reply to every enquiry within two working days.",
        )}
        image={copyOf(copy, "hero", "image_url", IMAGES.studio3)}
      />

      <section className="section-y">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 md:grid-cols-[1.15fr_0.85fr] md:px-8">
          <Reveal>
            <form onSubmit={onSubmit} className="rounded-3xl bg-card p-7 shadow-soft md:p-9">
              <h2 className="eyebrow">Project enquiry</h2>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Name
                  <input required name="name" placeholder="Your full name" className={inputClass} />
                </label>
                <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Phone
                  <input
                    required
                    name="phone"
                    type="tel"
                    placeholder="+254 7.."
                    className={inputClass}
                  />
                </label>
                <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground sm:col-span-2">
                  Email
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="you@email.com"
                    className={inputClass}
                  />
                </label>
                <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Project type
                  <select
                    required
                    name="projectType"
                    defaultValue={service ?? ""}
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select one
                    </option>
                    {service && !services.some((s) => s.title === service) ? (
                      <option value={service}>{service}</option>
                    ) : null}
                    {services.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                    <option value="Commercial fit-out">Commercial fit-out</option>
                    <option value="Not sure yet">Not sure yet</option>
                  </select>
                </label>
                <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Budget range
                  <select
                    required
                    name="budget"
                    defaultValue={budget ?? ""}
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select one
                    </option>
                    {budgetOptions.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>



                </label>
                <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Preferred date
                  <input required name="preferredDate" type="date" min={minDate} className={inputClass} />
                </label>
                <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  Preferred time
                  <select required name="preferredTime" defaultValue="" className={inputClass}>
                    <option value="" disabled>
                      Select one
                    </option>
                    <option>Morning (9:00 – 12:00)</option>
                    <option>Afternoon (12:00 – 15:00)</option>
                    <option>Late afternoon (15:00 – 18:00)</option>
                    <option>Flexible</option>
                  </select>
                </label>
                <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground sm:col-span-2">
                  Message
                  <textarea
                    required
                    name="message"
                    rows={5}
                    placeholder="Tell us about the space, the rooms involved and your ideal timeline."
                    className={`${inputClass} resize-none`}
                  />
                </label>
              </div>
              <input
                type="checkbox"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                style={{ display: "none" }}
                aria-hidden="true"
              />
              <button
                type="submit"
                disabled={sending}
                className="mt-7 w-full rounded-full bg-accent py-4 text-[0.75rem] uppercase tracking-[0.2em] text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send Booking Request"}
              </button>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-border py-4 text-[0.75rem] uppercase tracking-[0.2em] transition-colors hover:border-accent"
              >
                <MessageCircle size={14} /> Send on WhatsApp
              </a>
              {status === "success" && (
                <p role="status" className="mt-5 rounded-2xl border border-border/70 bg-background p-4 text-center text-sm">
                  Thank you, we'll get back to you shortly.
                </p>
              )}
              {status === "error" && (
                <p role="alert" className="mt-5 rounded-2xl border border-destructive/40 bg-background p-4 text-center text-sm text-destructive">
                  Sorry, we couldn't send your request. Please WhatsApp us or call{" "}
                  <a href={`tel:${STUDIO.phoneLink}`} className="underline">{STUDIO.phoneDisplay}</a>.
                </p>
              )}
            </form>
          </Reveal>


          <Reveal delay={0.1} className="space-y-6">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 rounded-3xl bg-forest p-7 text-cream shadow-soft hover-lift"
            >
              <MessageCircle size={26} className="shrink-0" />
              <span>
                <span className="block font-display text-xl">Chat on WhatsApp</span>
                <span className="block text-sm text-cream/75">
                  Fastest reply, Mon–Sat during studio hours
                </span>
              </span>
            </a>

            <div className="rounded-3xl border border-border/70 bg-card p-7 shadow-soft">
              <h2 className="eyebrow">Studio</h2>
              <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-accent" />
                  {STUDIO.address}
                </li>
                <li className="flex gap-3">
                  <Phone size={16} className="mt-0.5 shrink-0 text-accent" />
                  <a href={`tel:${STUDIO.phoneLink}`} className="hover:text-accent">
                    {STUDIO.phoneDisplay}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail size={16} className="mt-0.5 shrink-0 text-accent" />
                  <a href={`mailto:${STUDIO.email}`} className="hover:text-accent">
                    {STUDIO.email}
                  </a>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-border/70 bg-card p-7 shadow-soft">
              <p className="eyebrow flex items-center gap-2">
                <Clock size={13} className="text-accent" /> Business hours
              </p>
              <ul className="mt-5 space-y-3 text-sm">
                {STUDIO.hours.map((h) => (
                  <li key={h.day} className="flex justify-between gap-4">
                    <span className="text-muted-foreground">{h.day}</span>
                    <span>{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-3xl shadow-soft">
              <iframe
                title="Kloche Interiors studio location in Westlands, Nairobi"
                src="https://www.openstreetmap.org/export/embed.html?bbox=36.7910%2C-1.2760%2C36.8210%2C-1.2560&layer=mapnik"
                className="h-64 w-full border-0"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="section-y bg-secondary/50">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="eyebrow">Journal</h2>
                <p className="mt-3 font-display text-3xl md:text-4xl">Notes from the studio</p>
              </div>
              <Link
                to="/journal"
                className="group inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.2em] text-accent"
              >
                Read the journal
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.slice(0, 3).map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.08}>
                  <Link to="/journal/$slug" params={{ slug: p.slug }} className="group block">
                    {p.cover_url && (
                      <div className="overflow-hidden rounded-2xl shadow-soft">
                        <SmartImage
                          src={p.cover_url}
                          alt={p.cover_alt || `${p.title} interior design article`}
                          baseWidth={640}
                          sizes={SIZES.third}
                          ratio="4/3"
                          className="transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <p className="eyebrow mt-5">{p.category || "Journal"}</p>
                    <h3 className="mt-2 font-display text-2xl">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
