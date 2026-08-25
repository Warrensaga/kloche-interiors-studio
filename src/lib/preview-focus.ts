/**
 * Tiny store letting admin editors tell the live preview which page + section
 * (or specific journal post / project) should be focused after an edit.
 */
export type PreviewFocus = { path: string; hash?: string };

let current: PreviewFocus | null = null;
const listeners = new Set<(f: PreviewFocus | null) => void>();

export function setPreviewFocus(focus: PreviewFocus | null) {
  current = focus;
  listeners.forEach((l) => l(current));
}

export function getPreviewFocus() {
  return current;
}

export function subscribePreviewFocus(listener: (f: PreviewFocus | null) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
