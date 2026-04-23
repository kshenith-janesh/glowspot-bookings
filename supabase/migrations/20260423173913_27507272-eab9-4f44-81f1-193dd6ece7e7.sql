-- Roles enum
create type public.app_role as enum ('admin', 'owner', 'staff');

-- Shops table
create table public.shops (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  contact text,
  owner_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  phone text,
  shop_id uuid references public.shops(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- User roles table (separate to avoid privilege escalation)
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);

-- Security definer role check
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- Auto-create profile + default 'staff' role on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.phone
  );
  insert into public.user_roles (user_id, role) values (new.id, 'staff');
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- updated_at trigger for profiles
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.shops enable row level security;

-- Profiles policies
create policy "Users can view own profile"
on public.profiles for select to authenticated
using (auth.uid() = id);

create policy "Admins can view all profiles"
on public.profiles for select to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Users can update own profile"
on public.profiles for update to authenticated
using (auth.uid() = id);

create policy "Admins can update any profile"
on public.profiles for update to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- user_roles policies
create policy "Users can view own roles"
on public.user_roles for select to authenticated
using (user_id = auth.uid());

create policy "Admins can view all roles"
on public.user_roles for select to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can manage roles"
on public.user_roles for all to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- Shops policies
create policy "Authenticated can view shops"
on public.shops for select to authenticated
using (true);

create policy "Admins can insert shops"
on public.shops for insert to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update shops"
on public.shops for update to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete shops"
on public.shops for delete to authenticated
using (public.has_role(auth.uid(), 'admin'));