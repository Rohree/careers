/*
  # Create jobs and applications tables

  1. New Tables
    - `jobs`
      - `id` (uuid, primary key)  
      - `title` (text, required)
      - `description` (text, required)
      - `location` (text, required)
      - `created_at` (timestamp)
    - `applications`
      - `id` (uuid, primary key)
      - `job_id` (uuid, foreign key to jobs)
      - `full_name` (text, required)
      - `email` (text, required)
      - `phone` (text, required)
      - `cover_letter` (text, required)
      - `cv_url` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access to jobs
    - Add policies for authenticated admin access to applications
*/

CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  cover_letter text NOT NULL,
  cv_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Jobs policies (public read access)
CREATE POLICY "Jobs are publicly readable"
  ON jobs
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage jobs"
  ON jobs
  FOR ALL
  TO authenticated
  USING (true);

-- Applications policies (restricted access)
CREATE POLICY "Authenticated users can read applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create applications"
  ON applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage applications"
  ON applications
  FOR ALL
  TO authenticated
  USING (true);