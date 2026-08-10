import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s['redirect'] === "string" ? (s['redirect'] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Studio Sign In — Kloche Interiors" },
      { name: "description", content: "Private sign in for the Kloche Interiors studio team." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Studio Sign In — Kloche Interiors" },
      { property: "og:description", content: "Private studio access." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const target = search.redirect?.startsWith("/") ? search.redirect : "/admin";

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: target, replace: true });
    });
  }, [navigate, target]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const fn =
        mode === "signin"
          ? supabase.auth.signInWithPassword({ email, password })
          : supabase.auth.signUp({
              email,
              password,
              options: { emailRedirectTo: window.location.origin + "/admin" },
            });
      const { data, error: err } = await fn;
      if (err) throw err;
      if (!data.session) {
        setError("Check your email to confirm your account, then sign in.");
        return;
      }
      navigate({ to: target, replace: true });

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="flex min-h-[100svh] items-center justify-center px-5 py-24">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-soft md:p-10">
        <Logo className="h-10" />
        <h1 className="mt-8 font-display text-3xl">Studio access</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to manage projects, imagery and site content.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 text-xs uppercase tracking-[0.16em] text-muted-foreground underline-offset-4 hover:text-accent hover:underline"
        >
          {mode === "signin" ? "Create the studio account" : "I already have an account"}
        </button>
      </div>
    </section>
  );
}
