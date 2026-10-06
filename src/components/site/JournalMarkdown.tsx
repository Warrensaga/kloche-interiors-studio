import { Link } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function isInternal(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

export function JournalMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h2>{children}</h2>,
        a: ({ href = "", children }) =>
          isInternal(href) ? (
            <Link to={href}>{children}</Link>
          ) : (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}