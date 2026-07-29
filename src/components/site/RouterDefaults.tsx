import { useRouter } from "@tanstack/react-router";
import { ErrorState } from "./ErrorState";

export function DefaultNotFound() {
  return (
    <ErrorState
      code="404"
      eyebrow="Page not found"
      title="This room doesn't exist"
      body="The page you were looking for may have moved or never existed. Let's get you back to something beautiful."
    />
  );
}

export function DefaultCatchBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();
  console.error(error);
  return (
    <ErrorState
      eyebrow="Something went wrong"
      title="This page didn't load"
      body="An unexpected error interrupted things on our end. Try again, or head back home while we sort it out."
      onRetry={() => {
        router.invalidate();
        reset();
      }}
    />
  );
}
