import { defineMcp } from "@lovable.dev/mcp-js";
import getPricingTool from "./tools/get-pricing";
import getProjectTool from "./tools/get-project";
import getStudioInfoTool from "./tools/get-studio-info";
import listProjectsTool from "./tools/list-projects";
import listServicesTool from "./tools/list-services";

export default defineMcp({
  name: "kloche-interiors-mcp",
  title: "Kloche Interiors",
  version: "0.1.0",
  instructions:
    "Public tools for Kloche Interiors, a premium interior design studio in Nairobi, Kenya. Use `list_portfolio_projects` and `get_portfolio_project` to browse completed work, `list_services` for what the studio offers and how it works, `get_pricing` for package tiers and FAQs, and `get_studio_info` for contact details and opening hours.",
  tools: [
    listProjectsTool,
    getProjectTool,
    listServicesTool,
    getPricingTool,
    getStudioInfoTool,
  ],
});
