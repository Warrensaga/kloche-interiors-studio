CREATE TABLE public.homepage_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL UNIQUE,
  kind text NOT NULL,
  eyebrow text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.homepage_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.homepage_sections TO authenticated;
GRANT ALL ON public.homepage_sections TO service_role;

ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visible homepage sections are viewable by everyone"
  ON public.homepage_sections FOR SELECT
  USING (visible = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert homepage sections"
  ON public.homepage_sections FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update homepage sections"
  ON public.homepage_sections FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete homepage sections"
  ON public.homepage_sections FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_homepage_sections_updated_at
  BEFORE UPDATE ON public.homepage_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.homepage_sections (section_key, kind, eyebrow, title, body, content, sort_order, visible) VALUES
('hero', 'hero', 'Interior Design Studio · Nairobi, Kenya', 'Interiors that feel like home',
 'At Kloche Interiors & Construction, we design and transform spaces that feel as good as they look. From thoughtful interior design and renovations to construction finishes and custom interiors, we bring your vision to life through intentional design, quality craftsmanship and meticulous execution.',
 '{"ctaLabel":"Start Your Transformation","showWhatsapp":true}'::jsonb, 0, true),
('studio', 'richtext', 'The Studio', 'We transform spaces into places you love to live in', '',
 '{"paragraphs":["Kloche Interiors & Construction is an interior design and construction company dedicated to creating thoughtful, functional and beautifully considered spaces.","We work across residential and commercial projects, bringing together interior design, renovation and construction expertise to create spaces that reflect the people who use them.","From the first idea and initial concept to the final finish, we manage the details that turn a space into something truly personal. Our approach combines creativity with practical execution, ensuring that every project is designed with purpose and delivered with care.","Because to us, great interiors aren''t simply about how a space looks. They''re about how it makes you feel and how well it serves the life lived within it."],"linkLabel":"Our story"}'::jsonb, 1, true),
('projects', 'projects', 'Selected Work', 'Featured projects',
 'A few recent spaces, from a Karen family villa to a creative agency in Gigiri.',
 '{"limit":4,"linkLabel":"View full portfolio"}'::jsonb, 2, true),
('services', 'services', 'What We Do', 'Services', '',
 '{"linkLabel":"See all services"}'::jsonb, 3, true),
('pillars', 'pillars', 'Why Kloche?', 'Four pillars we work by', '', '{}'::jsonb, 4, true),
('stats', 'stats', 'By The Numbers', 'A studio built on delivery', '',
 '{"items":[{"value":"60+","label":"Projects delivered"},{"value":"8","label":"Years in practice"},{"value":"40+","label":"Kenyan artisans engaged"},{"value":"Nairobi","label":"& beyond"}]}'::jsonb, 5, true),
('philosophy', 'philosophy', 'Our Philosophy', 'Where Style Meets Lifestyle.',
 'We believe the best spaces are not simply beautiful. They are intentional, functional and personal. At Kloche, we design around the way you live, work and experience your space — bringing together style, comfort and purpose to create interiors that feel uniquely yours.',
 '{}'::jsonb, 6, true),
('testimonials', 'testimonials', 'Kind Words', '', '',
 '{"items":[{"quote":"Kloche understood our home better than we did. Six months on, we still notice small details they got exactly right.","name":"Wanjiru & Kevin M.","detail":"Karen Garden Villa"},{"quote":"They managed contractors, budget and our indecision with complete calm. The reveal genuinely made my mother cry.","name":"Aisha O.","detail":"Westlands Penthouse"},{"quote":"Our office finally feels like the studio we tell clients we are. Staff arrive earlier — that''s the review.","name":"Daniel Kimani","detail":"Founder, Gigiri Studio Offices"}]}'::jsonb, 7, true),
('cta', 'cta', '', 'Ready to transform your space?',
 'Tell us about your home or workplace. We''ll come back within two working days with next steps and a realistic budget range.',
 '{}'::jsonb, 8, true);