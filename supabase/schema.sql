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

create table public.gold_holdings (
  id uuid primary key default gen_random_uuid(),
  uid uuid not null references auth.users(id) on delete cascade,
  name text not null,
  weight numeric(12, 4),
  purchased_at timestamptz not null,
  sold_at timestamptz,
  status text not null default 'active' check (status in ('active', 'sold')),
  note text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.gold_movements (
  id uuid primary key default gen_random_uuid(),
  uid uuid not null references auth.users(id) on delete cascade,
  gold_holding_id uuid not null references public.gold_holdings(id) on delete cascade,
  kind text not null check (kind in ('purchase', 'valuation', 'sale')),
  amount numeric(12, 2) not null check (amount > 0),
  weight numeric(12, 4),
  date timestamptz not null,
  note text,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.fixed_deposits (
  id uuid primary key default gen_random_uuid(),
  uid uuid not null references auth.users(id) on delete cascade,
  name text not null,
  principal numeric(12, 2) not null check (principal > 0),
  interest_rate numeric(7, 3),
  started_at timestamptz not null,
  maturity_at timestamptz not null,
  maturity_amount numeric(12, 2),
  status text not null default 'active' check (status in ('active', 'matured', 'closed', 'renewed')),
  note text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.fixed_deposit_movements (
  id uuid primary key default gen_random_uuid(),
  uid uuid not null references auth.users(id) on delete cascade,
  fixed_deposit_id uuid not null references public.fixed_deposits(id) on delete cascade,
  kind text not null check (kind in ('opened', 'interest', 'maturity', 'closed', 'renewed')),
  amount numeric(12, 2) not null check (amount > 0),
  date timestamptz not null,
  note text,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.loans (
  id uuid primary key default gen_random_uuid(),
  uid uuid not null references auth.users(id) on delete cascade,
  direction text not null check (direction in ('given', 'taken')),
  party_name text not null,
  principal numeric(12, 2) not null check (principal > 0),
  interest_rate numeric(7, 3),
  started_at timestamptz not null,
  due_at timestamptz,
  status text not null default 'active' check (status in ('active', 'settled', 'cancelled')),
  note text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.loan_movements (
  id uuid primary key default gen_random_uuid(),
  uid uuid not null references auth.users(id) on delete cascade,
  loan_id uuid not null references public.loans(id) on delete cascade,
  kind text not null check (kind in ('disbursement', 'repayment', 'interest')),
  amount numeric(12, 2) not null check (amount > 0),
  date timestamptz not null,
  note text,
  created_at timestamptz not null default timezone('utc', now())
);

create index gold_holdings_uid_date_idx on public.gold_holdings (uid, purchased_at desc);
create index fixed_deposits_uid_maturity_idx on public.fixed_deposits (uid, maturity_at asc);
create index loans_uid_started_idx on public.loans (uid, started_at desc);
create index gold_movements_parent_date_idx on public.gold_movements (gold_holding_id, date desc);
create index fixed_deposit_movements_parent_date_idx on public.fixed_deposit_movements (fixed_deposit_id, date desc);
create index loan_movements_parent_date_idx on public.loan_movements (loan_id, date desc);

alter table public.gold_holdings enable row level security;
alter table public.gold_movements enable row level security;
alter table public.fixed_deposits enable row level security;
alter table public.fixed_deposit_movements enable row level security;
alter table public.loans enable row level security;
alter table public.loan_movements enable row level security;

create policy "Users can manage their own gold holdings" on public.gold_holdings for all using ((select auth.uid()) = uid) with check ((select auth.uid()) = uid);
create policy "Users can manage their own gold movements" on public.gold_movements for all using ((select auth.uid()) = uid) with check ((select auth.uid()) = uid);
create policy "Users can manage their own fixed deposits" on public.fixed_deposits for all using ((select auth.uid()) = uid) with check ((select auth.uid()) = uid);
create policy "Users can manage their own fixed deposit movements" on public.fixed_deposit_movements for all using ((select auth.uid()) = uid) with check ((select auth.uid()) = uid);
create policy "Users can manage their own loans" on public.loans for all using ((select auth.uid()) = uid) with check ((select auth.uid()) = uid);
create policy "Users can manage their own loan movements" on public.loan_movements for all using ((select auth.uid()) = uid) with check ((select auth.uid()) = uid);

alter publication supabase_realtime add table public.gold_holdings;
alter publication supabase_realtime add table public.fixed_deposits;
alter publication supabase_realtime add table public.loans;
