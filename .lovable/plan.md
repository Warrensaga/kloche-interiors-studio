# Journal Markdown Standard

## Scope
- Convert journal body rendering to Markdown with Tailwind Typography styling while keeping the existing journal page design.
- Extend the editor so every post can provide accessible cover-image text and receive clear Markdown authoring guidance and validation.
- Enforce a single page H1, safe heading hierarchy, styled emphasis, lists, and correct internal/external link behavior.
- Add related posts plus contact and WhatsApp consultation actions at the end of each article.
- Preserve and complete each article's SEO metadata, Open Graph image, Article structured data, and sitemap inclusion.

## Implementation
- Add `react-markdown`, `remark-gfm`, and `@tailwindcss/typography`.
- Add a `cover_alt` field to journal records through a database migration, keeping public read and admin write protections unchanged.
- Update public journal queries and types to load cover alt text and related published posts.
- Add a focused Markdown renderer that maps internal links to TanStack Router links and secures external links.
- Update the admin journal form with cover-alt input, Markdown examples, required-field checks, heading checks, and link-count guidance.
- Add article typography styles through semantic design tokens only.

## Verification
- Confirm an article renders headings, emphasis, lists, internal links, external links, related posts, and both consultation actions.
- Confirm the post title remains the only H1 and image alt text is present.
- Confirm metadata, Article JSON-LD, sitemap output, admin editing, phone layout, and build health.