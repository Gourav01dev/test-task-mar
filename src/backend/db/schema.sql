-- Enable Row Level Security
alter table auth.users enable row level security;

-- Create tables for our finance dashboard

-- Categories Table
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  name text not null,
  type text check (type in ('income', 'expense')) not null,
  color text not null,
  created_at timestamp with time zone default now() not null
);

-- Transactions Table
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  amount decimal(12,2) not null,
  type text check (type in ('income', 'expense')) not null,
  category_id uuid references public.categories(id) not null,
  description text,
  transaction_date date not null,
  created_at timestamp with time zone default now() not null
);

-- Savings Goals Table
create table public.savings_goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  name text not null,
  target_amount decimal(12,2) not null,
  current_amount decimal(12,2) default 0 not null,
  start_date date default current_date not null,
  end_date date not null,
  created_at timestamp with time zone default now() not null
);

-- Row Level Security Policies
-- Only allow users to see their own data

-- RLS for Categories
create policy "Users can view their own categories"
  on categories for select
  using (auth.uid() = user_id);

create policy "Users can insert their own categories"
  on categories for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own categories"
  on categories for update
  using (auth.uid() = user_id);

create policy "Users can delete their own categories"
  on categories for delete
  using (auth.uid() = user_id);

-- RLS for Transactions
create policy "Users can view their own transactions"
  on transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
  on transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own transactions"
  on transactions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own transactions"
  on transactions for delete
  using (auth.uid() = user_id);

-- RLS for Savings Goals
create policy "Users can view their own savings goals"
  on savings_goals for select
  using (auth.uid() = user_id);

create policy "Users can insert their own savings goals"
  on savings_goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own savings goals"
  on savings_goals for update
  using (auth.uid() = user_id);

create policy "Users can delete their own savings goals"
  on savings_goals for delete
  using (auth.uid() = user_id);

-- Create default categories for new users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.categories (user_id, name, type, color)
  values
    (new.id, 'Salary', 'income', '#4CAF50'),
    (new.id, 'Investments', 'income', '#8BC34A'),
    (new.id, 'Other Income', 'income', '#CDDC39'),
    (new.id, 'Housing', 'expense', '#F44336'),
    (new.id, 'Transportation', 'expense', '#FF5722'),
    (new.id, 'Food', 'expense', '#FFC107'),
    (new.id, 'Utilities', 'expense', '#FF9800'),
    (new.id, 'Insurance', 'expense', '#795548'),
    (new.id, 'Healthcare', 'expense', '#E91E63'),
    (new.id, 'Entertainment', 'expense', '#9C27B0'),
    (new.id, 'Shopping', 'expense', '#673AB7'),
    (new.id, 'Personal Care', 'expense', '#3F51B5'),
    (new.id, 'Education', 'expense', '#2196F3'),
    (new.id, 'Savings', 'expense', '#03A9F4'),
    (new.id, 'Debt', 'expense', '#009688'),
    (new.id, 'Miscellaneous', 'expense', '#607D8B');
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();