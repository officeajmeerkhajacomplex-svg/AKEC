-- SQL Schema for Supabase

-- Profiles Table (Users)
create table profiles (
  id uuid default uuid_generate_v4() primary key,
  name text,
  phone_number text unique,
  role text check (role in ('usthad', 'parent')),
  department text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Students Table
create table students (
  id uuid default uuid_generate_v4() primary key,
  student_name text,
  class_name text,
  department text,
  parent_phone text,
  parent_id uuid references profiles(id)
);

-- Progress Reports Table
create table progress_reports (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references students(id),
  memorization_progress text,
  lesson_progress text,
  exam_score int,
  remarks text,
  attendance_present int default 0,
  attendance_absent int default 0,
  class_performance text,
  hifz_juz_completed int default 0,
  exam_mark numeric default 0,
  exam_total numeric default 100,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Ledger Entries (Existing structure)
create table ledger_entries (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references students(id),
  amount decimal,
  type text check (type in ('given', 'received')),
  note text,
  date date
);

-- Note: Because this app uses the Anon key for simple mobile access without complex auth,
-- ensure Row Level Security is disabled for these tables if you manually created them:
alter table profiles disable row level security;
alter table students disable row level security;
alter table progress_reports disable row level security;
alter table ledger_entries disable row level security;

