import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { CATEGORIES, STUDIO, whatsappLink } from "@/data/site";

const BUDGET_RANGES = [
  "Under KES 200,000",
  "KES 200,000 – 1M",
  "KES 1M – 3M",
  "Over KES 3M",
  "Not sure yet",
] as const;

export default defineTool({
  name: "create_consultation_request",
  title: "Create consultation booking request",
  description:
    "Build a structured Kloche Interiors consultation booking request from a preferred date/time, budget range and project type. Returns a formatted enquiry summary plus a prefilled WhatsApp link and mailto link the client can use to send it — it does not book anything by itself.",
  inputSchema: {
    name: z.string().trim().min(1).max(100).describe("Client's full name."),
    contact: z
      .string()
      .trim()
      .min(1)
      .max(120)
      .describe("Client's phone number or email address for the reply."),
    projectType: z
      .string()
      .trim()
      .min(1)
      .max(60)
      .describe(
        `Project type, ideally one of: ${CATEGORIES.join(", ")} (other descriptions are accepted).`,
      ),
    budgetRange: z
      .string()
      .trim()
      .min(1)
      .max(60)
      .describe(`Budget range, ideally one of: ${BUDGET_RANGES.join(" | ")}.`),
    preferredDate: z
      .string()
      .trim()
      .min(1)
      .max(40)
      .describe("Preferred consultation date, e.g. '2026-08-14' or 'week of 10 August'."),
    preferredTime: z
      .string()
      .trim()
      .min(1)
      .max(40)
      .describe("Preferred time of day, e.g. '10:00' or 'weekday mornings'."),
    location: z
      .string()
      .trim()
      .max(120)
      .optional()
      .describe("Optional site location, e.g. 'Kilimani, Nairobi'."),
    notes: z
      .string()
      .trim()
      .max(1000)
      .optional()
      .describe("Optional extra context about the space or brief."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: (input) => {
    const request = {
      name: input.name,
      contact: input.contact,
      projectType: input.projectType,
      budgetRange: input.budgetRange,
      preferredDate: input.preferredDate,
      preferredTime: input.preferredTime,
      location: input.location ?? null,
      notes: input.notes ?? null,
    };

    const lines = [
      `Consultation request — ${STUDIO.name}`,
      `Name: ${request.name}`,
      `Contact: ${request.contact}`,
      `Project type: ${request.projectType}`,
      `Budget range: ${request.budgetRange}`,
      `Preferred date: ${request.preferredDate}`,
      `Preferred time: ${request.preferredTime}`,
      ...(request.location ? [`Location: ${request.location}`] : []),
      ...(request.notes ? [`Notes: ${request.notes}`] : []),
    ];
    const summary = lines.join("\n");

    const payload = {
      request,
      summary,
      budgetOptions: BUDGET_RANGES,
      projectTypeOptions: CATEGORIES,
      whatsappUrl: whatsappLink(summary),
      mailtoUrl: `mailto:${STUDIO.email}?subject=${encodeURIComponent(
        `Consultation request — ${request.name}`,
      )}&body=${encodeURIComponent(summary)}`,
      studioHours: STUDIO.hours,
      nextStep:
        "Send the summary via the WhatsApp or mailto link, or through the contact form at /contact. The studio confirms the slot by reply.",
    };

    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
