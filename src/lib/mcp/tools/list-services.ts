import { defineTool } from "@lovable.dev/mcp-js";
import { PROCESS, SERVICES } from "@/data/site";

export default defineTool({
  name: "list_services",
  title: "List design services",
  description:
    "List the interior design services Kloche Interiors offers, what each includes, and the studio's project process steps.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const services = SERVICES.map((s) => ({
      id: s.id,
      title: s.title,
      summary: s.short,
      description: s.description,
      includes: s.includes,
    }));
    const payload = { services, process: PROCESS };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
