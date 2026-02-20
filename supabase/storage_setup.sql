-- Create storage buckets
-- Run this in Supabase SQL Editor after creating your project

-- Create events-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('events-images', 'events-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create client-logos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('client-logos', 'client-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Create resumes bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)  -- Private bucket for resumes
ON CONFLICT (id) DO NOTHING;

-- Create news-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('news-images', 'news-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for events-images bucket
CREATE POLICY "Public can view event images" ON storage.objects
  FOR SELECT USING (bucket_id = 'events-images');

CREATE POLICY "Authenticated users can upload event images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'events-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update event images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'events-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete event images" ON storage.objects
  FOR DELETE USING (bucket_id = 'events-images' AND auth.role() = 'authenticated');

-- Storage policies for client-logos bucket
CREATE POLICY "Public can view client logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'client-logos');

CREATE POLICY "Authenticated users can upload client logos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'client-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update client logos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'client-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete client logos" ON storage.objects
  FOR DELETE USING (bucket_id = 'client-logos' AND auth.role() = 'authenticated');

-- Storage policies for resumes bucket (private)
CREATE POLICY "Authenticated users can upload resumes" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Authenticated admins can view resumes" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'resumes' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- Storage policies for news-images bucket
CREATE POLICY "Public can view news images" ON storage.objects
  FOR SELECT USING (bucket_id = 'news-images');

CREATE POLICY "Authenticated users can upload news images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'news-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update news images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'news-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete news images" ON storage.objects
  FOR DELETE USING (bucket_id = 'news-images' AND auth.role() = 'authenticated');

