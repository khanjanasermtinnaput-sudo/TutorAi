-- Cache auth.uid() per statement instead of re-evaluating per row (Supabase perf lint 0003)
drop policy "Users manage own profile" on public.profiles;
create policy "Users manage own profile"
  on public.profiles for all
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy "Users manage own chat sessions" on public.chat_sessions;
create policy "Users manage own chat sessions"
  on public.chat_sessions for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy "Users manage own chat messages" on public.chat_messages;
create policy "Users manage own chat messages"
  on public.chat_messages for all
  using (exists (
    select 1 from public.chat_sessions s
    where s.id = chat_messages.session_id and s.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.chat_sessions s
    where s.id = chat_messages.session_id and s.user_id = (select auth.uid())
  ));

drop policy "Users manage own quizzes" on public.quizzes;
create policy "Users manage own quizzes"
  on public.quizzes for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy "Users manage own quiz questions" on public.quiz_questions;
create policy "Users manage own quiz questions"
  on public.quiz_questions for all
  using (exists (
    select 1 from public.quizzes q
    where q.id = quiz_questions.quiz_id and q.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.quizzes q
    where q.id = quiz_questions.quiz_id and q.user_id = (select auth.uid())
  ));

drop policy "Users manage own usage logs" on public.usage_logs;
create policy "Users manage own usage logs"
  on public.usage_logs for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Covering indexes for FKs the linter flagged
create index chat_sessions_subject_id_idx on public.chat_sessions (subject_id);
create index quizzes_session_id_idx on public.quizzes (session_id);
create index quizzes_subject_id_idx on public.quizzes (subject_id);
