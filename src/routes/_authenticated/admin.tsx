import { Link, Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

type AdminLink = {
  to: string;
  label: string;
  search?: Record<string, string>;
  adminOnly?: boolean;
  exact?: boolean;
};

const PAGE_GROUPS: Array<{ heading: string; links: AdminLink[] }> = [
  {
    heading: "Pages",
    links: [
      { to: "/admin/homepage", label: "Home" },
      { to: "/admin", label: "Portfolio", exact: true },
      { to: "/admin/services", label: "Services" },
      { to: "/admin/pages", label: "About", search: { page: "about" } },
      { to: "/admin/pages", label: "Pricing", search: { page: "pricing" } },
      { to: "/admin/pages", label: "Contact", search: { page: "contact" } },
    ],
  },
  {
    heading: "Content",
    links: [
      { to: "/admin/testimonials", label: "Testimonials" },
      { to: "/admin/blog", label: "Journal" },
      { to: "/admin/media", label: "Media" },
      { to: "/admin/navigation", label: "Navigation" },
    ],
  },
  {
    heading: "Studio",
    links: [
      { to: "/admin/inbox", label: "Enquiries", adminOnly: true },
      { to: "/admin/seo", label: "SEO", adminOnly: true },
      { to: "/admin/settings", label: "Settings", adminOnly: true },
      { to: "/admin/team", label: "Team", adminOnly: true },
    ],
  },
];

function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [state, setState] = useState<"checking" | "ok" | "denied">("checking");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!active) return;
      if (!uid) {
        setState("denied");
        return;
      }
      // Primary check: read the caller's own role rows (RLS-scoped to auth.uid()).
      const { data: rows, error } = await supabase.from("user_roles").select("role");
      if (!active) return;
      let roles = (rows ?? []).map((r) => r.role as string);
      if (error || !roles.length) {
        // Fallback for environments where the direct table read is unavailable.
        const [{ data: admin }, { data: editor }] = await Promise.all([
          supabase.rpc("has_role", { _user_id: uid, _role: "admin" }),
          supabase.rpc("has_role", { _user_id: uid, _role: "editor" }),
        ]);
        if (!active) return;
        roles = [...(admin ? ["admin"] : []), ...(editor ? ["editor"] : [])];
      }
      setIsAdmin(roles.includes("admin"));
      setState(roles.includes("admin") || roles.includes("editor") ? "ok" : "denied");
    })();
    return () => {
      active = false;
    };
  }, []);


  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", search: { redirect: undefined }, replace: true });
  }

  const navLink = (l: AdminLink) => (
    <Link
      key={`${l.to}-${l.label}`}
      to={l.to}
      {...(l.search ? { search: l.search } : {})}
      activeOptions={{
        exact: Boolean(l.exact),
        includeSearch: Boolean(l.search),
      }}
      activeProps={{
        className: "bg-accent/12 text-accent",
        "aria-current": "page",
      }}
      className="block whitespace-nowrap rounded-full px-4 py-2 text-[0.72rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      {l.label}
    </Link>
  );

  const groups = PAGE_GROUPS.map((g) => ({
    ...g,
    links: g.links.filter((l) => !l.adminOnly || isAdmin),
  })).filter((g) => g.links.length > 0);

  return (
    <div className="min-h-[100svh] bg-secondary/30">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Logo className="h-8" />
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground hover:text-accent"
            >
              View site
            </Link>
            <Button variant="outline" size="sm" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>
        {/* Mobile / tablet nav */}
        <nav
          aria-label="Dashboard sections"
          className="flex gap-2 overflow-x-auto border-t border-border px-4 py-2 lg:hidden"
        >
          {groups.flatMap((g) => g.links).map(navLink)}
        </nav>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-5 py-8 md:px-8 md:py-12">
        {/* Desktop sidebar */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav
            aria-label="Dashboard sections"
            className="sticky top-28 space-y-6 rounded-3xl border border-border bg-card p-4"
          >
            {groups.map((g) => (
              <div key={g.heading} className="space-y-1">
                <p className="px-4 pb-1 text-[0.6rem] uppercase tracking-[0.22em] text-muted-foreground/70">
                  {g.heading}
                </p>
                {g.links.map(navLink)}
              </div>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          {state === "checking" && (
            <p className="text-sm text-muted-foreground">Checking your access…</p>
          )}
          {state === "denied" && (
            <div className="rounded-3xl border border-border bg-card p-8">
              <h1 className="font-display text-2xl">No studio access</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                This account isn't an administrator yet. Ask the studio owner to grant you access.
              </p>
            </div>
          )}
          {state === "ok" && <Outlet />}
        </main>
      </div>
    </div>
  );
}
