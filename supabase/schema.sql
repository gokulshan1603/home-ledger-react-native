create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  uid uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('income', 'expense')),
  amount numeric(12, 2) not null check (amount > 0),
  date timestamptz not null,
  category text not null,
  account text not null check (account in ('bank', 'cash')),
  note text,
  created_at timestamptz not null default timezone('utc', now())
);

create index transactions_uid_date_idx on public.transactions (uid, date desc);

alter table public.transactions enable row level security;

create policy "Users can read their own transactions"
  on public.transactions for select
  using ((select auth.uid()) = uid);

create policy "Users can create their own transactions"
  on public.transactions for insert
  with check ((select auth.uid()) = uid);

create policy "Users can update their own transactions"
  on public.transactions for update
  using ((select auth.uid()) = uid)
  with check ((select auth.uid()) = uid);

create policy "Users can delete their own transactions"
  on public.transactions for delete
  using ((select auth.uid()) = uid);

alter publication supabase_realtime add table public.transactions;
