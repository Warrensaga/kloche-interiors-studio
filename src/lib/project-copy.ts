import type { Project } from "@/data/site";

/**
 * Search engines treat image-only case studies as thin content. These helpers
 * build unique, factual supporting copy for each project from the details the
 * studio already records in the CMS (location, style, scope, duration, year) —
 * nothing is invented.
 */

const list = (items: string[]) => {
  const clean = items.map((s) => s.trim()).filter(Boolean);
  if (clean.length === 0) return "";
  if (clean.length === 1) return clean[0];
  return `${clean.slice(0, -1).join(", ")} and ${clean[clean.length - 1]}`;
};

const lower = (s: string) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);

/** Longer-form narrative shown under the main project description. */
export function projectNarrative(p: Project): { heading: string; body: string }[] {
  const type = p.projectType?.trim() || "interior project";
  const style = p.style?.trim();
  const sections: { heading: string; body: string }[] = [];

  sections.push({
    heading: "Context",
    body: `${p.name} is a ${lower(type)} completed by Kloche Interiors in ${p.location}${
      p.year ? `, wrapped up in ${p.year}` : ""
    }.${
      style
        ? ` The brief called for a ${lower(style)} direction, so every decision — from the layout of each room to the tone of the finishes — was measured against that language.`
        : " The direction was set with the client at the outset, and every decision was measured against that brief."
    } We began on site, walking the space with the client to understand how each room is actually used, where the daylight falls through the day, and which existing elements were worth keeping. That first read of the space shapes everything that follows.`,
  });

  if (p.scope.length) {
    sections.push({
      heading: "Scope of work",
      body: `Our work here covered ${list(p.scope)}. Each of those lines was drawn, costed and sequenced before anything was ordered or installed, so the client knew what was coming and when.${
        p.duration
          ? ` The programme ran to ${p.duration}, with site visits scheduled around the trades so the sequence never stalled.`
          : ""
      } Our team coordinated the artisans and suppliers directly, which keeps quality consistent and avoids the gaps that appear when design and build are handled by separate hands.`,
    });
  }

  sections.push({
    heading: "Materials and finish",
    body: `Finishes were selected for how they wear in a Kenyan home or workspace, not only for how they photograph. We favour honest materials — timber, stone, textured plaster, considered joinery and layered lighting — sourced through makers we work with regularly in and around Nairobi. Samples were reviewed on site under the room's own light before anything was confirmed, and joinery was built to the dimensions of the actual space rather than to standard sizes.`,
  });

  sections.push({
    heading: "The result",
    body: `The finished ${lower(type)} in ${p.location} reads as one continuous idea rather than a set of separate rooms. If you are planning something similar — a full home, a single room, a commercial fit-out or a renovation — we would be glad to talk it through and share what a project of this scale typically involves.`,
  });

  return sections;
}

/** Descriptive, unique alt text for a gallery photograph. */
export function galleryAlt(p: Project, index: number) {
  const style = p.style?.trim();
  return `${style ? `${style} ` : ""}${lower(p.projectType || "interior")} by Kloche Interiors at ${
    p.name
  }, ${p.location} — view ${index + 1}`;
}
