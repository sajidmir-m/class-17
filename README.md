# Class 17 Events

**Tagline:** Ideas That Speak Louder Than Words

A full-stack event management and marketing website built with React, Vite, Tailwind CSS, and Supabase.

## Features

- 🔐 Secure admin authentication with role-based access
- 📊 Admin dashboard with real-time statistics
- 🎉 Event management (CRUD operations)
- 🏢 Client management
- 💼 Job postings and applications
- 📰 News management
- ✉️ Contact form message handling
- 📱 Fully responsive design

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a new Supabase project at https://supabase.com
   - Copy your project URL and anon key
   - Create a `.env` file in the root directory:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. **Set up database:**
   - Run the SQL scripts in `supabase/schema.sql` in your Supabase SQL editor
   - Run the SQL scripts in `supabase/rls_policies.sql` to set up security policies
   - Create storage buckets: `events-images`, `client-logos`, `resumes`, `news-images`

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/       # Reusable components
├── pages/           # Page components
│   ├── admin/      # Admin dashboard pages
│   └── public/     # Public website pages
├── lib/            # Utilities and configurations
└── App.jsx         # Main app component
```

## Admin Access

Default admin credentials should be set up in Supabase Auth. Create an admin user through Supabase dashboard and assign the `admin` role.

