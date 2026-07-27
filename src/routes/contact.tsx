import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Clock, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { IMAGES, PROJECTS, SERVICES, STUDIO, whatsappLink } from "@/data/site";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/Sections";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Kloche Interiors, Nairobi" },
      {
        name: "description",
        content:
          "Book a consultation with Kloche Interiors in Westlands, Nairobi. Call, WhatsApp, email or send us your project details.",
      },
      { property: "og:title", content: "Contact — Kloche Interiors" },
      {
        property: "og:description",
        content: "Book a consultation with our Nairobi interior design studio.",
      },
      { property: "og:image", content: IMAGES.studio3 },
      { name: "twitter:image", content: IMAGES.studio3 },
    ],
  }),
  component: Contact,
});

const inputClass =
  "mt-2 w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-accent";

function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    toast.success("Thank you — we'll be in touch within two working days.");
    e.currentTarget.reset();
  };

  return (
    <>
      <Toaster />
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your space"
        subtitle="Tell us a little about the project. We reply to every enquiry within two working days."
        image={IMAGES.studio3}
      />

      <section className="section-y">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 md:grid-cols-[1.15fr_0.85fr] md:px-8">
          <Reveal>
            <form onSubmit={onSubmit} className="rounded-3xl bg-card p-7 shadow-soft md:p-9">
              <p className="eyebrow">Project enquiry</p>
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
                  <select required name="projectType" defaultValue="" className={inputClass}>
                    <option value="" disabled>
                      Select one
                    </option>
                    {SERVICES.map((s) => (
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
                  <select required name="budget" defaultValue="" className={inputClass}>
                    <option value="" disabled>
                      Select one
                    </option>
                    <option>Under KES 500,000</option>
                    <option>KES 500,000 – 1.5M</option>
                    <option>KES 1.5M – 3M</option>
                    <option>KES 3M – 6M</option>
                    <option>Above KES 6M</option>
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
              <button
                type="submit"
                className="mt-7 w-full rounded-full bg-accent py-4 text-[0.75rem] uppercase tracking-[0.2em] text-accent-foreground transition-opacity hover:opacity-90"
              >
                {sent ? "Enquiry sent" : "Send enquiry"}
              </button>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Prefer voice notes? WhatsApp is usually fastest.
              </p>
            </form>
          </Reveal>

          <Reveal delay={0.1} className="space-y-6">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 rounded-3xl bg-forest p-7 text-cream shadow-soft transition-transform hover:-translate-y-0.5"
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
              <p className="eyebrow">Studio</p>
              <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-accent" />
                  {STUDIO.address}
                </li>
                <li className="flex gap-3">
                  <Phone size={16} className="mt-0.5 shrink-0 text-accent" />
                  {STUDIO.phoneDisplay}
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

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="eyebrow">Latest on Instagram</p>
            <a
              href={STUDIO.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.2em] text-accent"
            >
              <Instagram size={14} /> @klocheinteriors
            </a>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {PROJECTS.slice(0, 4).map((p) => (
              <img
                key={p.id}
                src={p.cover}
                alt={`Instagram post featuring ${p.name}`}
                loading="lazy"
                className="aspect-square w-full rounded-2xl object-cover shadow-soft"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
