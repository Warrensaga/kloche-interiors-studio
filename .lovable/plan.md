# Kloche Interiors — Full CMS Upgrade

Goal: the studio manages every part of the site from `/admin` — no code changes ever. The public site keeps its exact current look, responsiveness, SEO and speed; only its content source changes from bundled files to the database.

Because this is large, it ships in five phases. Each phase leaves the site fully working and live.

---

## Phase 1 — Foundation (auth, settings, navigation, footer, media library)

**Auth & accounts**
- Email + password only, public sign-up disabled; new admins are created by invitation from the dashboard.
- Password reset flow with a dedicated reset page.
- Roles: Admin (everything) and Editor (content only, no user or settings management).

**Site settings**
- Business name, email, primary phone, WhatsApp number, address, Google Maps link, opening hours, logo, favicon, social links, footer copy, copyright.
- Business numbers set immediately: primary phone `0717 634003`, WhatsApp `+254 787 068222`, applied everywhere contact info appears.

**Navigation & footer editor**
- Add / rename / remove / reorder menu items, optional dropdown children, and the header button label.
- Footer columns, links and text editable.

**Media library (WordPress-style)**
- Upload, rename, delete, search, preview, folder-style grouping, reuse anywhere via an image picker.
- Uploads auto-converted to optimized WebP/AVIF derivatives with responsive sizes.

## Phase 2 — Page content

- Every page (Home, About, Services, Portfolio, Contact, Pricing) becomes a set of editable sections: eyebrow, heading, body, images, CTA labels, list items.
- Section reordering and show/hide per page (Home already works this way; the pattern extends to the rest).
- Homepage hero supports image or video.

## Phase 3 — Structured content

- **Projects**: full editor with multi-image upload, drag-and-drop ordering, featured image, before/after, categories, location, completion date, optional client, services provided, description, SEO title, meta description, draft/published. (Extends the existing editor.)
- **Services**: title, description, icon, images, display order.
- **Testimonials**: quote, customer name and photo, rating, project name, visibility.

## Phase 4 — Blog & contact inbox

- **Blog**: create/edit/delete, drafts, publish, featured image, categories, tags, author, SEO fields, auto slug. New public routes `/journal` and `/journal/$slug`, listed on the site automatically and added to the sitemap.
- **Contact submissions**: every enquiry stored (name, phone, email, budget, property type, message, date), read/unread state, and CSV export.

## Phase 5 — SEO control & polish

- Per-page meta title, meta description, Open Graph image, canonical URL, and schema markup editable in the dashboard.
- robots.txt editable; sitemap regenerates itself from published pages, projects and posts.
- Final pass: responsive checks on desktop/tablet/mobile, lazy loading, image formats, Core Web Vitals, accessibility contrast.

---

## Technical notes

- Storage: Supabase (Lovable Cloud). New tables: `site_settings`, `nav_items`, `page_sections`, `media_assets`, `services`, `testimonials`, `blog_posts`, `blog_categories`, `contact_submissions`, `seo_meta`, plus `admin_invites`. All with row-level security: public read of published rows, writes restricted to admin/editor roles via the existing `has_role` function.
- Public pages read content through server functions during SSR so SEO and first paint stay as fast as today; each has a bundled fallback so the site never renders empty.
- Admin UI built with shadcn/ui inside the existing `/admin` shell, keeping the studio's typography and palette.
- Uploads go to the private `media` bucket with signed public delivery and generated responsive variants.
