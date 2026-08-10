-- Tutor AI — initial schema
-- Shares the Supabase project with Co.Ai ("AOf code"); table names below do not
-- collide with Co.Ai's public.users / public.conversations / public.messages / public.usage_limits.

-- ── profiles ──────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  nickname text not null,
  birth_date date not null,
  education_level text not null,
  onboarding_completed boolean not null default false,
  subscription_tier text not null default 'free' check (subscription_tier in ('free','pro','max')),
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text default 'inactive' check (subscription_status in ('active','past_due','canceled','inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── subjects (master data) ───────────────────────────────────────────────
create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text,
  sort_order int not null default 0
);

-- ── chat_sessions ─────────────────────────────────────────────────────────
create table public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject_id uuid references public.subjects(id),
  title text not null default 'แชทใหม่',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── chat_messages ─────────────────────────────────────────────────────────
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  citations jsonb,
  ai_provider text,
  created_at timestamptz not null default now()
);

-- ── quizzes ───────────────────────────────────────────────────────────────
create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  session_id uuid references public.chat_sessions(id),
  subject_id uuid references public.subjects(id),
  topic text not null,
  difficulty text not null check (difficulty in ('easy','medium','hard')),
  question_count int not null check (question_count between 10 and 20),
  status text not null default 'in_progress' check (status in ('in_progress','completed')),
  score int,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- ── quiz_questions ────────────────────────────────────────────────────────
create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  order_index int not null,
  question_text text not null,
  choices jsonb not null,
  correct_choice text not null check (correct_choice in ('A','B','C','D')),
  explanation text not null,
  user_answer text check (user_answer in ('A','B','C','D')),
  is_correct boolean
);

-- ── topic_summaries (cache) ──────────────────────────────────────────────
create table public.topic_summaries (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references public.subjects(id),
  topic text not null,
  education_level text not null,
  summary_content jsonb not null,
  sources jsonb,
  created_at timestamptz not null default now(),
  unique (subject_id, topic, education_level)
);

-- ── usage_logs ────────────────────────────────────────────────────────────
-- TODO: subscription tier limits — pending spec (no quota enforcement yet, log-only)
create table public.usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  action_type text not null check (action_type in ('chat_message','quiz_generated')),
  created_at timestamptz not null default now()
);

-- ── indexes for the FK/lookup paths the app actually queries ──────────────
create index chat_sessions_user_id_idx on public.chat_sessions (user_id);
create index chat_messages_session_id_idx on public.chat_messages (session_id, created_at);
create index quizzes_user_id_idx on public.quizzes (user_id);
create index quiz_questions_quiz_id_idx on public.quiz_questions (quiz_id, order_index);
create index usage_logs_user_id_idx on public.usage_logs (user_id, created_at);

-- ── auto-create profile row on signup ───────────────────────────────────
-- Google OAuth alone doesn't give us nickname/birth_date/education_level, so the
-- row starts incomplete and onboarding_completed=false until /onboarding fills it in.
create or replace function public.handle_new_tutorai_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, nickname, birth_date, education_level)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', 'นักเรียน'), '2000-01-01', 'unknown')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created_tutorai
  after insert on auth.users
  for each row execute function public.handle_new_tutorai_user();

-- ── updated_at maintenance ──────────────────────────────────────────────
-- Named tutorai_* — public.set_updated_at() already exists for Co.Ai's tables
-- in this shared project; do not touch it.
create or replace function public.tutorai_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.tutorai_set_updated_at();

create trigger chat_sessions_set_updated_at
  before update on public.chat_sessions
  for each row execute function public.tutorai_set_updated_at();

-- ── RLS ──────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.topic_summaries enable row level security;
alter table public.usage_logs enable row level security;

create policy "Users manage own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Authenticated users read subjects"
  on public.subjects for select
  to authenticated
  using (true);

create policy "Users manage own chat sessions"
  on public.chat_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own chat messages"
  on public.chat_messages for all
  using (exists (
    select 1 from public.chat_sessions s
    where s.id = chat_messages.session_id and s.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.chat_sessions s
    where s.id = chat_messages.session_id and s.user_id = auth.uid()
  ));

create policy "Users manage own quizzes"
  on public.quizzes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own quiz questions"
  on public.quiz_questions for all
  using (exists (
    select 1 from public.quizzes q
    where q.id = quiz_questions.quiz_id and q.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.quizzes q
    where q.id = quiz_questions.quiz_id and q.user_id = auth.uid()
  ));

create policy "Authenticated users read topic summaries"
  on public.topic_summaries for select
  to authenticated
  using (true);

create policy "Users manage own usage logs"
  on public.usage_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── seed subjects ────────────────────────────────────────────────────────
insert into public.subjects (name, icon, sort_order) values
  ('คณิตศาสตร์', 'calculator', 1),
  ('ฟิสิกส์', 'atom', 2),
  ('เคมี', 'flask-conical', 3),
  ('ชีววิทยา', 'leaf', 4),
  ('ภาษาอังกฤษ', 'languages', 5),
  ('ภาษาไทย', 'book-open', 6),
  ('สังคมศึกษา', 'globe', 7);
