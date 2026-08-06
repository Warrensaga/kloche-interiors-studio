
REVOKE EXECUTE ON FUNCTION public.can_edit(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.claim_first_admin() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.can_edit(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated, service_role;
