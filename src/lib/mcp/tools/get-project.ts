import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { PROJECTS } from "@/data/site";

export default defineTool({
  name: "get_portfolio_project",
  title: "Get portfolio project",
  description:
    "Get full details for one Kloche Interiors portfolio project by its id, including description, scope, gallery images and timeline.",
  inputSchema: {
    id: z.string().describe("Project id, e.g. 'karen-villa'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id }) => {
    const project = PROJECTS.find((p) => p.id === id);
    if (!project) {
      return {
        content: [
          {
            type: "text",
            text: `No project with id "${id}". Known ids: ${PROJECTS.map((p) => p.id).join(", ")}`,
          },
        ],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(project, null, 2) }],
      structuredContent: { project },
    };
  },
});
