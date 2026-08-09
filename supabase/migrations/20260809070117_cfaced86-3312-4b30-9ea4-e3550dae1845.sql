WITH ins AS (
  INSERT INTO public.projects (slug, name, location, style, project_type, categories, description, scope, duration, year, cover_url, before_url, after_url, sort_order, published)
  VALUES (
    'kileleshwa-residency',
    'Kileleshwa Residency',
    'Kileleshwa, Nairobi',
    'Warm Contemporary',
    'Full Home Transformation',
    ARRAY['Residential','Living Spaces'],
    'A five-bedroom family home reimagined around light, texture and slow living. We opened up the ground floor, layered raw plaster with olive-toned joinery and commissioned local artisans for the woven lighting throughout.',
    ARRAY['Full home interior design','Structural reconfiguration of ground floor','Custom joinery & cabinetry','Furniture sourcing & styling','Art curation with Nairobi makers'],
    '7 months',
    '2024',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1503174971373-b1f69850bded?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
    0,
    true
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id
)
INSERT INTO public.project_images (project_id, url, alt, sort_order)
SELECT ins.id, v.url, v.alt, v.ord FROM ins,
(VALUES
  ('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80','Kileleshwa Residency living room',0),
  ('https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=80','Kileleshwa Residency seating area',1),
  ('https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1400&q=80','Kileleshwa Residency kitchen joinery',2),
  ('https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1400&q=80','Kileleshwa Residency bedroom',3)
) AS v(url, alt, ord);