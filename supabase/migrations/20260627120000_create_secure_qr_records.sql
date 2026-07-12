create extension if not exists pgcrypto;

create table if not exists public.secure_qr_records (
  id uuid primary key default gen_random_uuid(),
  payload text not null,
  iv text not null,
  salt text not null,
  created_at timestamptz not null default now()
);

alter table public.secure_qr_records enable row level security;

create policy "Allow anonymous insert"
  on public.secure_qr_records
  for insert
  to anon
  with check (true);

create policy "Allow anonymous select"
  on public.secure_qr_records
  for select
  to anon
  using (true);
