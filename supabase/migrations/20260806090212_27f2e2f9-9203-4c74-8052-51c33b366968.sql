DROP POLICY IF EXISTS "Published projects are viewable by everyone" ON public.projects;
CREATE POLICY "Published projects are viewable by everyone"
  ON public.projects FOR SELECT TO anon, authenticated
  USING (published = true);
CREATE POLICY "Admins can view all projects"
  ON public.projects FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Images of published projects are viewable by everyone" ON public.project_images;
CREATE POLICY "Images of published projects are viewable by everyone"
  ON public.project_images FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_images.project_id AND p.published = true));
CREATE POLICY "Admins can view all project images"
  ON public.project_images FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));