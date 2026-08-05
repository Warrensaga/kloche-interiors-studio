import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";

import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

/** Fingerprinted build output + binary media that never changes in place. */
const IMMUTABLE = /(^\/(_build|assets|_server)\/)|(\.[0-9a-f]{8,}\.[a-z0-9]+$)/i;
/** Stable static files that can change on redeploy (icons, manifest, robots). */
const STATIC_ASSET = /\.(avif|webp|png|jpe?g|gif|svg|ico|woff2?|ttf|otf|mp4|webm)$/i;

const cacheHeaderMiddleware = createMiddleware().server(async ({ next, request }) => {
  const { pathname } = new URL(request.url);

  if (IMMUTABLE.test(pathname)) {
    setResponseHeader("cache-control", "public, max-age=31536000, immutable");
  } else if (STATIC_ASSET.test(pathname)) {
    setResponseHeader(
      "cache-control",
      "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800",
    );
  }

  return next();
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware, cacheHeaderMiddleware, csrfMiddleware],
}));
