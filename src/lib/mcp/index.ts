import { defineMcp } from "@lovable.dev/mcp-js";
import createConsultationRequestTool from "./tools/create-consultation-request";
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
    "Public tools for Kloche Interiors, a premium interior design studio in Nairobi, Kenya. Use `list_portfolio_projects` and `get_portfolio_project` to browse completed work, `list_services` for what the studio offers and how it works, `get_pricing` for package tiers and FAQs, `get_studio_info` for contact details and opening hours, and `create_consultation_request` to turn a client's date/time preference, budget range and project type into a structured enquiry with prefilled WhatsApp and email links.",
  tools: [
    listProjectsTool,
    getProjectTool,
    listServicesTool,
    getPricingTool,
    getStudioInfoTool,
    createConsultationRequestTool,
  ],
});

