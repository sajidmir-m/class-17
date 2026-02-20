-- Migration: Add state_works table
-- Run this in your Supabase SQL Editor if the table doesn't exist

-- Create state_works table
CREATE TABLE IF NOT EXISTS state_works (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  state TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT,
  description TEXT,
  brand_client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  activities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(state, slug)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_state_works_slug ON state_works(slug);
CREATE INDEX IF NOT EXISTS idx_state_works_state ON state_works(state);

-- Enable Row Level Security
ALTER TABLE state_works ENABLE ROW LEVEL SECURITY;

-- RLS Policies for state_works table
-- Public can view state works
CREATE POLICY "Public can view state_works" ON state_works
  FOR SELECT USING (true);

-- Admins can manage state works
CREATE POLICY "Admins can manage state_works" ON state_works
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

