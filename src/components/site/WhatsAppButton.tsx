import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/data/site";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Kloche Interiors on WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-forest px-4 py-4 text-cream shadow-lift transition-transform duration-300 hover:scale-105 md:bottom-8 md:right-8"
    >
      <MessageCircle size={22} className="shrink-0" />
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm transition-all duration-300 group-hover:max-w-40 md:inline">
        Chat with us
      </span>
    </a>
  );
}
