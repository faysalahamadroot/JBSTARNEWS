-- Add 'username' and 'is_verified' columns to 'profiles' table

-- 1. Add username column (unique)
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'username') then
    alter table public.profiles add column username text unique;
    create index profiles_username_idx on public.profiles (username);
  end if;
end $$;

-- 2. Add is_verified column
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'is_verified') then
    alter table public.profiles add column is_verified boolean default false;
  end if;
end $$;

-- 3. Update existing profiles (optional: set verified if they have full_name)
update public.profiles
set is_verified = true
where full_name is not null and is_verified is false;
