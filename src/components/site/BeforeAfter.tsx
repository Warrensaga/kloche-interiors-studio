import { useCallback, useRef, useState } from "react";

export function BeforeAfter({
  before,
  after,
  label = "Drag to compare",
}: {
  before: string;
  after: string;
  label?: string;
}) {
  const [pos, setPos] = useState(52);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, next)));
  }, []);

  return (
    <div
      ref={ref}
      className="relative aspect-4/3 w-full cursor-ew-resize overflow-hidden rounded-3xl shadow-soft select-none md:aspect-16/9"
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        move(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && move(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <img src={after} alt="After renovation" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img
          src={before}
          alt="Before renovation"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ width: ref.current?.offsetWidth ?? "100%", maxWidth: "none" }}
        />
      </div>

      <span className="absolute left-4 top-4 rounded-full bg-charcoal/70 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-cream">
        Before
      </span>
      <span className="absolute right-4 top-4 rounded-full bg-cream/85 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-charcoal">
        After
      </span>

      <div className="absolute inset-y-0 w-px bg-cream" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 left-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-cream text-charcoal shadow-lift">
          <span className="text-xs tracking-widest">◀▶</span>
        </div>
      </div>

      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.65rem] uppercase tracking-[0.2em] text-cream/90">
        {label}
      </p>
    </div>
  );
}
