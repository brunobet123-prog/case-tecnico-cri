create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  telefone text not null,
  imovel_interesse text not null,
  origem text not null check (origem in ('site', 'whatsapp', 'indicacao')),
  status text not null check (status in ('novo', 'em_contato', 'qualificado', 'perdido')),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_origem_idx on public.leads (origem);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;

drop policy if exists leads_select_anon on public.leads;
create policy leads_select_anon
  on public.leads
  for select
  to anon
  using (true);
