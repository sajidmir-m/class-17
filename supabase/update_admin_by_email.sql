-- Helper script to update a user's role to 'admin' by email
-- Usage: Replace 'Ashiq@class17.com' with the actual email address

-- Method 1: Update using email (recommended)
UPDATE profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'Ashiq@class17.com'
);

-- Method 2: If the profile doesn't exist yet, create it
INSERT INTO profiles (id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'Ashiq@class17.com'
ON CONFLICT (id) 
DO UPDATE SET role = 'admin';

-- Verify the update worked
SELECT 
  p.id,
  p.role,
  u.email,
  u.created_at as user_created_at
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'Ashiq@class17.com';

