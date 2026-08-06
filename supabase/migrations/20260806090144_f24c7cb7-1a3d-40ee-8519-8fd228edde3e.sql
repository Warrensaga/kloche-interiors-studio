DROP POLICY IF EXISTS "Visible homepage sections are viewable by everyone" ON public.homepage_sections;
CREATE POLICY "Visible homepage sections are viewable by everyone"
  ON public.homepage_sections FOR SELECT TO anon, authenticated
  USING (visible = true);
CREATE POLICY "Admins can view all homepage sections"
  ON public.homepage_sections FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));