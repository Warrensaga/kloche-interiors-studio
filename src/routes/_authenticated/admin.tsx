import { Link, Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [state, setState] = useState<"checking" | "ok" | "denied">("checking");

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return;
      const { data } = await supabase.rpc("has_role", { _user_id: uid, _role: "admin" });
      if (active) setState(data ? "ok" : "denied");
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

  return (
    <div className="min-h-[100svh] bg-secondary/30">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div className="flex items-center gap-6">
            <Logo className="h-8" />
            <nav className="hidden gap-5 text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground sm:flex">
              <Link to="/admin" activeOptions={{ exact: true }} activeProps={{ className: "text-accent" }}>
                Projects
              </Link>
              <Link to="/admin/homepage" activeProps={{ className: "text-accent" }}>
                Homepage
              </Link>
              <Link to="/portfolio" className="hover:text-accent">
                View site
              </Link>
            </nav>
          </div>
          <Button variant="outline" size="sm" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
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
  );
}
