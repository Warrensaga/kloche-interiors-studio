-- Close the one-time admin bootstrap function to app users.
-- An admin already exists, so this function is permanently a no-op for the app,
-- but an open privilege-granting SECURITY DEFINER function is an escalation
-- surface if the admin row is ever removed. Backend/service access is retained
-- so a future bootstrap can still be performed deliberately via a migration.
REVOKE EXECUTE ON FUNCTION public.claim_first_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.claim_first_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.claim_first_admin() FROM authenticated;

-- Defense in depth on the read-only role-check helpers.
-- EXECUTE for `authenticated` MUST be retained: these functions are referenced
-- inside the RLS policies on projects, project_images, homepage_sections,
-- services, site_settings, nav_items, page_sections, media_assets,
-- testimonials, blog_posts, contact_submissions, seo_meta, admin_invites and
-- user_roles. RLS policy expressions are evaluated with the privileges of the
-- querying role, so revoking EXECUTE from `authenticated` would make every
-- admin/editor policy error out and break the entire CMS.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;

REVOKE EXECUTE ON FUNCTION public.can_edit(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.can_edit(uuid) FROM anon;