import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { STUDIO, whatsappLink } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/60">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:px-8 md:py-20">
        <div>
          <p className="font-display text-2xl">
            Kloche
            <span className="ml-1.5 align-middle text-[0.6rem] uppercase tracking-[0.35em] opacity-70">
              Interiors
            </span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            A Nairobi interior design studio making warm, considered homes and workplaces
            across Kenya.
          </p>
          <a
            href={STUDIO.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="mt-6 inline-grid h-11 w-11 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Instagram size={17} />
          </a>
        </div>

        <div>
          <p className="eyebrow">Explore</p>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              { to: "/portfolio", label: "Portfolio" },
              { to: "/services", label: "Services" },
              { to: "/about", label: "About" },
              { to: "/pricing", label: "Pricing" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-muted-foreground transition-colors hover:text-accent"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">Studio</p>
          <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-accent" />
              <span>{STUDIO.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone size={16} className="mt-0.5 shrink-0 text-accent" />
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="hover:text-accent">
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
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
          <p>© {new Date().getFullYear()} Kloche Interiors. All rights reserved.</p>
          <p>Designed & built in Nairobi, Kenya.</p>
        </div>
      </div>
    </footer>
  );
}
