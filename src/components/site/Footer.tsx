import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { useNav, useSiteConfig } from "@/hooks/useCms";
import { waLink } from "@/lib/cms";

function TikTokIcon({ size = 17, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.62 2.66-4.8 2.05-1.61 4.92-1.79 7.26-.74.02.02.04.04.06.05v4.14c-.57-.23-1.18-.35-1.81-.35-1.42 0-2.74.82-3.36 2.12-.27.57-.37 1.22-.28 1.85.13.96.79 1.81 1.67 2.19.89.38 1.93.32 2.77-.16.86-.48 1.44-1.39 1.5-2.38.02-.34.02-.68.02-1.02V.02h3.32z" />
    </svg>
  );
}

export function Footer() {
  const config = useSiteConfig();
  const nav = useNav("footer");
  return (
    <footer className="border-t border-border bg-secondary/60">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:px-8 md:py-20">
        <div>
          <Logo className="text-2xl" markClassName="h-9 w-9" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
{config.footerBlurb}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {[
              { href: config.socials.instagram, label: "Instagram", icon: Instagram },
              { href: config.socials.tiktok, label: "TikTok", icon: TikTokIcon },
              { href: config.socials.facebook, label: "Facebook", icon: Facebook },
              { href: config.socials.linkedin, label: "LinkedIn", icon: Linkedin },
            ].map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-grid h-11 w-11 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow">Explore</p>
          <ul className="mt-5 space-y-3 text-sm">
            {nav.map((n) => ({ to: n.href as "/", label: n.label })).map((l) => (
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
              <span>{config.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone size={16} className="mt-0.5 shrink-0 text-accent" />
              <a href={waLink(config.whatsapp, "Hello Kloche Interiors, I would like to book a consultation.")} target="_blank" rel="noreferrer" className="hover:text-accent">
                {config.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail size={16} className="mt-0.5 shrink-0 text-accent" />
              <a href={`mailto:${config.email}`} className="hover:text-accent">
                {config.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
          <p>© {new Date().getFullYear()} {config.copyright}</p>
          <p>Designed & built in Nairobi, Kenya.</p>
        </div>
      </div>
    </footer>
  );
}
