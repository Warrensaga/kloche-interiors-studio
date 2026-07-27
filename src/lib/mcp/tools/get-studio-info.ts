import { defineTool } from "@lovable.dev/mcp-js";
import { STUDIO, whatsappLink } from "@/data/site";

export default defineTool({
  name: "get_studio_info",
  title: "Get studio contact info",
  description:
    "Get Kloche Interiors studio details: name, tagline, Nairobi address, phone, email, opening hours and WhatsApp booking link.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const payload = {
      name: STUDIO.name,
      tagline: STUDIO.tagline,
      address: STUDIO.address,
      phone: STUDIO.phoneDisplay,
      email: STUDIO.email,
      hours: STUDIO.hours,
      instagram: STUDIO.instagram,
      whatsapp: whatsappLink(),
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
