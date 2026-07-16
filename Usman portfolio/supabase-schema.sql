-- Run this in your Supabase SQL Editor to create the admin tables

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  problem text,
  dataset text,
  tools jsonb DEFAULT '[]'::jsonb,
  solution text,
  insights jsonb DEFAULT '[]'::jsonb,
  results text,
  code text,
  demo text,
  locallink text,
  screenshot text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Skill categories
CREATE TABLE IF NOT EXISTS skill_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  icon text DEFAULT 'Code2',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Skills
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES skill_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  level integer DEFAULT 50,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Certifications
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  org text,
  date text,
  verify_url text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read skill_categories" ON skill_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Allow public read certifications" ON certifications FOR SELECT USING (true);

-- Allow authenticated users full access
CREATE POLICY "Allow authenticated all projects" ON projects FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated all skill_categories" ON skill_categories FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated all skills" ON skills FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated all certifications" ON certifications FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
