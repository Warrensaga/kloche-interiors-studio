ALTER TABLE public.blog_posts
ADD COLUMN cover_alt TEXT NOT NULL DEFAULT '';

COMMENT ON COLUMN public.blog_posts.cover_alt IS 'Descriptive alternative text for the journal cover image.';