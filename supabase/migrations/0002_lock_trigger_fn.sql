-- handle_new_tutorai_user is trigger-only; Postgres auto-exposes SECURITY DEFINER
-- functions in public schema as PostgREST RPC endpoints unless execute is revoked.
revoke execute on function public.handle_new_tutorai_user() from anon, authenticated;
