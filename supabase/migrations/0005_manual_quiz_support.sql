-- Manual (user-authored) quiz support.
--
-- Before applying: confirm the live name of the question_count check
-- constraint (it was created unnamed in 0001_init.sql, so Postgres assigned
-- the default name):
--   select conname, pg_get_constraintdef(oid)
--   from pg_constraint
--   where conrelid = 'public.quizzes'::regclass and contype = 'c';
-- Expected: quizzes_question_count_check. If it differs, adjust the drop
-- below before applying — the `if exists` guard makes this safe to run
-- either way, it just won't replace a constraint under a different name.

alter table public.quizzes
  add column source text not null default 'ai' check (source in ('ai', 'manual'));

alter table public.quizzes drop constraint if exists quizzes_question_count_check;

-- AI-generated quizzes keep their original 10-20 guarantee (also enforced in
-- application code at src/app/api/quiz/generate/route.ts); manually authored
-- quizzes only need at least one question.
alter table public.quizzes add constraint quizzes_question_count_check
  check (
    (source = 'ai' and question_count between 10 and 20)
    or (source = 'manual' and question_count between 1 and 20)
  );
