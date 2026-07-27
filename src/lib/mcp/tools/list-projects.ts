import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { CATEGORIES, PROJECTS } from "@/data/site";

export default defineTool({
  name: "list_portfolio_projects",
  title: "List portfolio projects",
  description:
    "List Kloche Interiors portfolio projects, optionally filtered by category (Residential, Commercial, Kitchens, Living Spaces).",
  inputSchema: {
    category: z
      .string()
      .optional()
      .describe(`Optional category filter. One of: ${CATEGORIES.join(", ")}`),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category }) => {
    const items = PROJECTS.filter(
      (p) =>
        !category ||
        p.categories.some((c) => c.toLowerCase() === category.toLowerCase()),
    ).map((p) => ({
      id: p.id,
      name: p.name,
      location: p.location,
      style: p.style,
      categories: p.categories,
      year: p.year,
      duration: p.duration,
    }));

    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { projects: items },
    };
  },
});
