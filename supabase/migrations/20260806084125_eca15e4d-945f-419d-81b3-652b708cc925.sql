-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Shared updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Projects
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  location text NOT NULL DEFAULT '',
  style text NOT NULL DEFAULT '',
  project_type text NOT NULL DEFAULT '',
  categories text[] NOT NULL DEFAULT '{}',
  client_name text,
  description text NOT NULL DEFAULT '',
  scope text[] NOT NULL DEFAULT '{}',
  duration text NOT NULL DEFAULT '',
  year text NOT NULL DEFAULT '',
  completion_date date,
  cover_url text NOT NULL DEFAULT '',
  before_url text,
  after_url text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published projects are viewable by everyone"
ON public.projects FOR SELECT
USING (published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert projects"
ON public.projects FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update projects"
ON public.projects FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete projects"
ON public.projects FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Project images
CREATE TABLE public.project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX project_images_project_id_idx ON public.project_images (project_id, sort_order);

GRANT SELECT ON public.project_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_images TO authenticated;
GRANT ALL ON public.project_images TO service_role;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Images of published projects are viewable by everyone"
ON public.project_images FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_id AND (p.published = true OR public.has_role(auth.uid(), 'admin'))
  )
);

CREATE POLICY "Admins can insert project images"
ON public.project_images FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update project images"
ON public.project_images FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete project images"
ON public.project_images FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_project_images_updated_at
BEFORE UPDATE ON public.project_images
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();