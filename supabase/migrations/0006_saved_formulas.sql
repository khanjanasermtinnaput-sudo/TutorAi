-- Personal formula library ("สูตรของฉัน") — a user's bookmarked LaTeX
-- formulas, saved from chat, from a quiz, or typed directly. Rows are
-- immutable once created (no edit flow), so no updated_at/trigger needed.

create table public.saved_formulas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  latex text not null,
  label text,
  source text not null default 'manual' check (source in ('manual', 'chat', 'quiz')),
  created_at timestamptz not null default now(),
  unique (user_id, latex)
);

create index saved_formulas_user_id_idx on public.saved_formulas (user_id, created_at desc);

alter table public.saved_formulas enable row level security;

create policy "Users manage own saved formulas"
  on public.saved_formulas for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
