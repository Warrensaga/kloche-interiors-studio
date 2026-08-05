import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import { SIZES, imageAt, isOptimizable, srcSet } from "@/lib/images";
import { cn } from "@/lib/utils";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {
  src: string;
  /** Rendered width hint used for the fallback `src`. */
  baseWidth?: number;
  widths?: number[];
  /** Above-the-fold images render eagerly with high fetch priority. */
  priority?: boolean;
  /** Intrinsic aspect ratio, e.g. "4 / 3" — prevents layout shift. */
  ratio?: string;
  /** Wrapper <picture> class — rarely needed. */
  pictureClassName?: string;
};

/**
 * Responsive image with AVIF/WebP negotiation, srcset/sizes, explicit aspect
 * ratio and sensible above/below-the-fold loading defaults.
 */
export function SmartImage({
  src,
  baseWidth = 1200,
  widths,
  priority = false,
  ratio,
  sizes = SIZES.full,
  style,
  className,
  pictureClassName,
  ...rest
}: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [hydrated, setHydrated] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setHydrated(true);
    if (ref.current?.complete) setLoaded(true);
  }, []);

  const pending = hydrated && !loaded;
  const optimizable = isOptimizable(src);

  const img = (
    <img
      {...rest}
      ref={ref}
      src={imageAt(src, baseWidth)}
      srcSet={srcSet(src, widths)}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(true)}
      className={cn(
        "transition-opacity duration-700 ease-out",
        pending ? "opacity-0 bg-muted" : "opacity-100",
        className,
      )}
      style={ratio ? { aspectRatio: ratio, ...style } : style}
    />
  );

  if (!optimizable) return img;

  return (
    <picture className={cn("contents", pictureClassName)}>
      <source type="image/avif" srcSet={srcSet(src, widths, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(src, widths, "webp")} sizes={sizes} />
      {img}
    </picture>
  );
}

export { SIZES };
