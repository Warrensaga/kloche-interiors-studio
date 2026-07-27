import { defineTool } from "@lovable.dev/mcp-js";
import { COMPARISON, FAQS, TIERS } from "@/data/site";

export default defineTool({
  name: "get_pricing",
  title: "Get pricing packages",
  description:
    "Get Kloche Interiors pricing tiers, the feature comparison table across tiers, and pricing-related FAQs.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const payload = { tiers: TIERS, comparison: COMPARISON, faqs: FAQS };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
