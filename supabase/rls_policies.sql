-- RLS Policies for events table
-- Public read access
CREATE POLICY "Public can view events" ON events
  FOR SELECT USING (true);

-- Admin/Editor full access
CREATE POLICY "Admins can manage events" ON events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- RLS Policies for clients table
CREATE POLICY "Public can view clients" ON clients
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage clients" ON clients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- RLS Policies for jobs table
CREATE POLICY "Public can view jobs" ON jobs
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage jobs" ON jobs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- RLS Policies for applications table
-- Only authenticated admins can view applications
CREATE POLICY "Admins can view applications" ON applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- Public can insert applications (for job applications)
CREATE POLICY "Public can create applications" ON applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage applications" ON applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- RLS Policies for news table
CREATE POLICY "Public can view news" ON news
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage news" ON news
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- RLS Policies for messages table
-- Only admins can view messages
CREATE POLICY "Admins can view messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- Public can insert messages (contact form)
CREATE POLICY "Public can create messages" ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage messages" ON messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'editor')
    )
  );

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'editor');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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

