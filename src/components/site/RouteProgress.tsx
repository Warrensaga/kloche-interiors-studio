import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

/** Thin top bar that appears while a route's data is loading, for smooth nav feedback. */
export function RouteProgress() {
  const isLoading = useRouterState({ select: (s) => s.status === "pending" });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const t = setTimeout(() => setVisible(true), 120);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisible(false), 220);
    return () => clearTimeout(t);
  }, [isLoading]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 200ms ease" }}
    >
      <div
        className="h-full bg-accent"
        style={{
          width: visible ? "90%" : "100%",
          transition: visible ? "width 1.4s cubic-bezier(.22,1,.36,1)" : "width 220ms ease",
        }}
      />
    </div>
  );
}
