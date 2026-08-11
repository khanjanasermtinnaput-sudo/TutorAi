-- 0002 revoked execute from anon/authenticated directly, but every Postgres
-- role implicitly inherits from PUBLIC, so the grant to PUBLIC (present by
-- default on function creation) still left handle_new_tutorai_user()
-- callable via PostgREST RPC. Revoke from PUBLIC to actually close it off.
revoke execute on function public.handle_new_tutorai_user() from public;
