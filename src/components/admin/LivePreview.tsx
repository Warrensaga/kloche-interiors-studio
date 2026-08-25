import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import { Monitor, RefreshCw, Smartphone, X, Eye, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Maps an admin route to the public page it edits. */
function previewPathFor(pathname: string, search: Record<string, unknown>): string {
  const page = typeof search?.page === "string" ? search.page : undefined;
  if (pathname.startsWith("/admin/homepage")) return "/";
  if (pathname.startsWith("/admin/services")) return "/services";
  if (pathname.startsWith("/admin/testimonials")) return "/";
  if (pathname.startsWith("/admin/blog")) return "/journal";
  if (pathname.startsWith("/admin/navigation")) return "/";
  if (pathname.startsWith("/admin/media")) return "/portfolio";
  if (pathname.startsWith("/admin/pages")) return page ? `/${page}` : "/about";
  if (pathname.startsWith("/admin/projects")) return "/portfolio";
  if (pathname === "/admin") return "/portfolio";
  return "/";
}

const STORAGE_KEY = "kloche.livepreview.open";

export function LivePreview() {
  const queryClient = useQueryClient();
  const { pathname, search } = useRouterState({
    select: (s) => ({ pathname: s.location.pathname, search: s.location.search as Record<string, unknown> }),
  });
  const [open, setOpen] = useState(false);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [nonce, setNonce] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setOpen(window.localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  const toggle = (next: boolean) => {
    setOpen(next);
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  };

  const path = previewPathFor(pathname, search);
  const src = useMemo(() => `${path}${path.includes("?") ? "&" : "?"}preview=${nonce}`, [path, nonce]);

  const scheduleRefresh = () => {
    setRefreshing(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setNonce((n) => n + 1), 700);
  };

  // Auto-refresh whenever any admin query cache changes (i.e. after a save).
  useEffect(() => {
    if (!open) return;
    const unsub = queryClient.getQueryCache().subscribe((event) => {
      const key = event.query.queryKey;
      if (Array.isArray(key) && key[0] === "admin" && event.type === "updated") scheduleRefresh();
    });
    return () => {
      unsub();
      if (timer.current) clearTimeout(timer.current);
    };
  }, [open, queryClient]);

  if (!open) {
    return (
      <Button
        onClick={() => toggle(true)}
        size="sm"
        variant="outline"
        className="fixed bottom-5 right-5 z-40 shadow-lg"
      >
        <Eye size={16} /> Live preview
      </Button>
    );
  }

  return (
    <aside
      aria-label="Live preview"
      className="fixed inset-x-0 bottom-0 z-40 flex h-[65svh] flex-col border-t border-border bg-card shadow-2xl lg:inset-y-0 lg:left-auto lg:right-0 lg:h-auto lg:w-[46vw] lg:max-w-[720px] lg:border-l lg:border-t-0"
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2">
        <div className="min-w-0">
          <p className="text-[0.6rem] uppercase tracking-[0.22em] text-muted-foreground">Live preview</p>
          <p className="truncate text-xs text-foreground">{path}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant={device === "desktop" ? "secondary" : "ghost"}
            aria-label="Desktop preview"
            onClick={() => setDevice("desktop")}
          >
            <Monitor size={16} />
          </Button>
          <Button
            size="icon"
            variant={device === "mobile" ? "secondary" : "ghost"}
            aria-label="Mobile preview"
            onClick={() => setDevice("mobile")}
          >
            <Smartphone size={16} />
          </Button>
          <Button size="icon" variant="ghost" aria-label="Refresh preview" onClick={() => setNonce((n) => n + 1)}>
            <RefreshCw size={16} className={refreshing ? "animate-spin" : undefined} />
          </Button>
          <a
            href={path}
            target="_blank"
            rel="noreferrer"
            aria-label="Open page in a new tab"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
          >
            <ExternalLink size={16} />
          </a>
          <Button size="icon" variant="ghost" aria-label="Close live preview" onClick={() => toggle(false)}>
            <X size={16} />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 justify-center overflow-hidden bg-secondary/40 p-3">
        <iframe
          key={src}
          title="Live site preview"
          src={src}
          onLoad={() => setRefreshing(false)}
          className={
            device === "mobile"
              ? "h-full w-[390px] max-w-full rounded-2xl border border-border bg-background shadow-sm"
              : "h-full w-full rounded-2xl border border-border bg-background shadow-sm"
          }
        />
      </div>
    </aside>
  );
}
