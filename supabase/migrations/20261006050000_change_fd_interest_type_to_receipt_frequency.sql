do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'fixed_deposits'
      and column_name = 'interest_type'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'fixed_deposits'
      and column_name = 'interest_frequency'
  ) then
    alter table public.fixed_deposits
      rename column interest_type to interest_frequency;
  end if;
end $$;

alter table public.fixed_deposits
  add column if not exists interest_frequency text;

alter table public.fixed_deposits
  alter column interest_frequency set default 'on_maturity',
  alter column interest_frequency set not null;

alter table public.fixed_deposits
  drop constraint if exists fixed_deposits_interest_type_check,
  drop constraint if exists fixed_deposits_interest_frequency_check;

alter table public.fixed_deposits
  add constraint fixed_deposits_interest_frequency_check
  check (interest_frequency in ('monthly', 'quarterly', 'annual', 'on_maturity'));
