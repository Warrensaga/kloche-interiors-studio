
-- helper: admin or editor
CREATE OR REPLACE FUNCTION public.can_edit(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','editor'))
$$;

-- SITE SETTINGS -------------------------------------------------------------
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  business_name text NOT NULL DEFAULT 'Kloche Interiors',
  tagline text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone_display text NOT NULL DEFAULT '',
  phone_link text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  maps_url text NOT NULL DEFAULT '',
  hours jsonb NOT NULL DEFAULT '[]'::jsonb,
  logo_url text NOT NULL DEFAULT '',
  favicon_url text NOT NULL DEFAULT '',
  socials jsonb NOT NULL DEFAULT '{}'::jsonb,
  footer_blurb text NOT NULL DEFAULT '',
  copyright text NOT NULL DEFAULT '',
  header_cta_label text NOT NULL DEFAULT 'Start Your Transformation',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings are viewable by everyone" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- NAV -----------------------------------------------------------------------
CREATE TABLE public.nav_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES public.nav_items(id) ON DELETE CASCADE,
  label text NOT NULL,
  href text NOT NULL DEFAULT '/',
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  location text NOT NULL DEFAULT 'header',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.nav_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nav_items TO authenticated;
GRANT ALL ON public.nav_items TO service_role;
ALTER TABLE public.nav_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Nav is viewable by everyone" ON public.nav_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Editors manage nav" ON public.nav_items FOR ALL TO authenticated USING (can_edit(auth.uid())) WITH CHECK (can_edit(auth.uid()));
CREATE TRIGGER update_nav_items_updated_at BEFORE UPDATE ON public.nav_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- PAGE SECTIONS -------------------------------------------------------------
CREATE TABLE public.page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL,
  section_key text NOT NULL,
  kind text NOT NULL DEFAULT 'richtext',
  eyebrow text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (page_key, section_key)
);
GRANT SELECT ON public.page_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_sections TO authenticated;
GRANT ALL ON public.page_sections TO service_role;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visible sections viewable by everyone" ON public.page_sections FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Editors manage page sections" ON public.page_sections FOR ALL TO authenticated USING (can_edit(auth.uid())) WITH CHECK (can_edit(auth.uid()));
CREATE TRIGGER update_page_sections_updated_at BEFORE UPDATE ON public.page_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- MEDIA ---------------------------------------------------------------------
CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  path text NOT NULL,
  url text NOT NULL,
  folder text NOT NULL DEFAULT 'uploads',
  mime_type text NOT NULL DEFAULT '',
  size_bytes integer NOT NULL DEFAULT 0,
  alt text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media_assets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Media viewable by everyone" ON public.media_assets FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Editors manage media" ON public.media_assets FOR ALL TO authenticated USING (can_edit(auth.uid())) WITH CHECK (can_edit(auth.uid()));
CREATE TRIGGER update_media_assets_updated_at BEFORE UPDATE ON public.media_assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- SERVICES ------------------------------------------------------------------
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  number_label text NOT NULL DEFAULT '',
  title text NOT NULL,
  summary text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'Sparkles',
  image_url text NOT NULL DEFAULT '',
  bullets text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visible services viewable by everyone" ON public.services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Editors manage services" ON public.services FOR ALL TO authenticated USING (can_edit(auth.uid())) WITH CHECK (can_edit(auth.uid()));
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- TESTIMONIALS --------------------------------------------------------------
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  name text NOT NULL,
  detail text NOT NULL DEFAULT '',
  project_name text NOT NULL DEFAULT '',
  photo_url text NOT NULL DEFAULT '',
  rating integer NOT NULL DEFAULT 5,
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visible testimonials viewable by everyone" ON public.testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Editors manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (can_edit(auth.uid())) WITH CHECK (can_edit(auth.uid()));
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- BLOG ----------------------------------------------------------------------
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  cover_url text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  author text NOT NULL DEFAULT 'Kloche Interiors',
  seo_title text NOT NULL DEFAULT '',
  seo_description text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts viewable by everyone" ON public.blog_posts FOR SELECT TO anon USING (published = true);
CREATE POLICY "Editors view all posts" ON public.blog_posts FOR SELECT TO authenticated USING (published = true OR can_edit(auth.uid()));
CREATE POLICY "Editors manage posts" ON public.blog_posts FOR ALL TO authenticated USING (can_edit(auth.uid())) WITH CHECK (can_edit(auth.uid()));
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CONTACT SUBMISSIONS -------------------------------------------------------
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  budget text NOT NULL DEFAULT '',
  property_type text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_submissions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_submissions TO authenticated;
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an enquiry" ON public.contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read enquiries" ON public.contact_submissions FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update enquiries" ON public.contact_submissions FOR UPDATE TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete enquiries" ON public.contact_submissions FOR DELETE TO authenticated USING (has_role(auth.uid(),'admin'));
CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON public.contact_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- SEO -----------------------------------------------------------------------
CREATE TABLE public.seo_meta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL UNIQUE,
  path text NOT NULL DEFAULT '/',
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  og_image text NOT NULL DEFAULT '',
  canonical text NOT NULL DEFAULT '',
  schema_json text NOT NULL DEFAULT '',
  noindex boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.seo_meta TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_meta TO authenticated;
GRANT ALL ON public.seo_meta TO service_role;
ALTER TABLE public.seo_meta ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SEO viewable by everyone" ON public.seo_meta FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage SEO" ON public.seo_meta FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER update_seo_meta_updated_at BEFORE UPDATE ON public.seo_meta FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ADMIN INVITES -------------------------------------------------------------
CREATE TABLE public.admin_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  role app_role NOT NULL DEFAULT 'editor',
  accepted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_invites TO authenticated;
GRANT ALL ON public.admin_invites TO service_role;
ALTER TABLE public.admin_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage invites" ON public.admin_invites FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER update_admin_invites_updated_at BEFORE UPDATE ON public.admin_invites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- admins can manage roles
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- SEED ----------------------------------------------------------------------
INSERT INTO public.site_settings (singleton, business_name, tagline, email, phone_display, phone_link, whatsapp, address, maps_url, hours, socials, footer_blurb, copyright)
VALUES (true, 'Kloche Interiors', 'Interiors that feel like home', 'klocheinteriors@gmail.com', '0717 634003', '+254717634003', '254787068222', 'Karuna Road, Nairobi, Kenya', 'https://maps.google.com/?q=Karuna+Road+Nairobi',
 '[{"day":"Monday – Friday","time":"9:00 – 18:00"},{"day":"Saturday","time":"10:00 – 15:00"},{"day":"Sunday & Public Holidays","time":"By appointment"}]'::jsonb,
 '{"instagram":"https://www.instagram.com/klocheinteriors_construction?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==","tiktok":"https://www.tiktok.com/@klocheinteriors?lang=en","facebook":"https://www.facebook.com/Klocheinteriors","linkedin":"https://www.linkedin.com/company/Kloche-interiors"}'::jsonb,
 'A Nairobi interior design studio making warm, considered homes and workplaces across Kenya.',
 'Kloche Interiors. All rights reserved.');

INSERT INTO public.nav_items (label, href, sort_order, location) VALUES
 ('Home','/',0,'header'),
 ('Portfolio','/portfolio',1,'header'),
 ('Services','/services',2,'header'),
 ('About','/about',3,'header'),
 ('Pricing','/pricing',4,'header'),
 ('Contact','/contact',5,'header'),
 ('Portfolio','/portfolio',0,'footer'),
 ('Services','/services',1,'footer'),
 ('About','/about',2,'footer'),
 ('Pricing','/pricing',3,'footer'),
 ('Contact','/contact',4,'footer');
