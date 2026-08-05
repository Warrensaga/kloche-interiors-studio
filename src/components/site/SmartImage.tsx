import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import { SIZES, imageAt, srcSet } from "@/lib/images";
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
};

/**
 * Responsive image with srcset/sizes, explicit aspect ratio and sensible
 * above/below-the-fold loading defaults.
 */
export function SmartImage({
  src,
  baseWidth = 1200,
  widths,
  priority = false,
  ratio,
  sizes = SIZES.full,
  style,
  ...rest
}: Props) {
  return (
    <img
      {...rest}
      src={imageAt(src, baseWidth)}
      srcSet={srcSet(src, widths)}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
      style={ratio ? { aspectRatio: ratio, ...style } : style}
    />
  );
}

export { SIZES };
