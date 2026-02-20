# Setup Guide for Class 17 Events

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase account (free tier works)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for your project to be fully provisioned
3. Go to Project Settings > API
4. Copy your:
   - Project URL
   - `anon` `public` API key

## Step 3: Configure Environment Variables

1. Create a `.env` file in the root directory:
   ```
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## Step 4: Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL script from `supabase/schema.sql` to create all tables
4. Run the SQL script from `supabase/rls_policies.sql` to set up Row Level Security policies
5. Run the SQL script from `supabase/storage_setup.sql` to create storage buckets and policies
6. (Optional) Run `supabase/seed_clients.sql` to add your featured client names to the `clients` table

## Step 5: Create Admin User

1. Go to Authentication > Users in your Supabase dashboard
2. Click "Add User" or "Invite User"
3. Create a user with email and password

4. **Make the user an admin** - Go to SQL Editor and run one of these:

   **Option A: Update by Email (Easier)**
   ```sql
   UPDATE profiles 
   SET role = 'admin' 
   WHERE id = (
     SELECT id FROM auth.users WHERE email = 'your-email@example.com'
   );
   ```
   Replace `your-email@example.com` with the actual email address.

   **Option B: Update by UUID**
   ```sql
   UPDATE profiles SET role = 'admin' WHERE id = 'user_uuid_here';
   ```
   Replace `user_uuid_here` with the actual UUID from the users table.

   **Option C: Use the helper script**
   Run `supabase/update_admin_by_email.sql` and replace the email address in the script.

## Step 6: Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Step 7: Access Admin Panel

1. Navigate to `http://localhost:5173/admin/login`
2. Login with the admin credentials you created
3. You'll be redirected to the admin dashboard

## Project Structure

```
class-17-events/
├── src/
│   ├── components/          # Reusable components
│   │   ├── AdminLayout.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── PublicLayout.jsx
│   │   └── Sidebar.jsx
│   ├── lib/
│   │   └── supabaseClient.js
│   ├── pages/
│   │   ├── admin/          # Admin dashboard pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── Clients.jsx
│   │   │   ├── Jobs.jsx
│   │   │   ├── Applications.jsx
│   │   │   ├── News.jsx
│   │   │   ├── Messages.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Login.jsx
│   │   └── public/         # Public website pages
│   │       ├── Home.jsx
│   │       ├── About.jsx
│   │       ├── Services.jsx
│   │       ├── Portfolio.jsx
│   │       ├── Clients.jsx
│   │       ├── Careers.jsx
│   │       └── Contact.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── supabase/
│   ├── schema.sql          # Database schema
│   ├── rls_policies.sql    # Security policies
│   └── storage_setup.sql   # Storage buckets setup
└── package.json
```

## Features

### Admin Panel
- ✅ Secure authentication with Supabase Auth
- ✅ Dashboard with real-time statistics
- ✅ Event management (CRUD)
- ✅ Client management (CRUD)
- ✅ Job postings management (CRUD)
- ✅ View job applications
- ✅ News management (CRUD)
- ✅ View contact form messages
- ✅ File uploads for images and resumes

### Public Website
- ✅ Homepage with featured events and news
- ✅ About page
- ✅ Services page
- ✅ Portfolio page (shows all events)
- ✅ Clients showcase
- ✅ Careers page with job listings and application form
- ✅ Contact form

## Troubleshooting

### Authentication Issues
- Make sure your Supabase project is active
- Verify your environment variables are correct
- Check that the user exists in Supabase Auth
- Ensure the user has a profile with the correct role

### Database Issues
- Verify all SQL scripts ran successfully
- Check that RLS policies are enabled
- Ensure you're using the correct table names

### Storage Issues
- Verify storage buckets are created
- Check storage policies are set correctly
- Ensure file uploads are within size limits

### Build Issues
- Run `npm install` again
- Clear node_modules and reinstall
- Check Node.js version compatibility

## Production Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting provider (Vercel, Netlify, etc.)

3. Set environment variables in your hosting platform

4. Ensure your Supabase project is configured for production

## Support

For issues or questions, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

