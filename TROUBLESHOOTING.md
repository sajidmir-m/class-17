# Troubleshooting Guide

## Blank Screen Issue

If you're seeing a blank screen, follow these steps:

### 1. Check Browser Console
- Open Developer Tools (F12)
- Check the Console tab for errors
- Check the Network tab for failed requests

### 2. Verify Environment Variables
Create a `.env` file in the root directory with:
```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important:** Restart the dev server after creating/updating `.env` file!

### 3. Check if Dev Server is Running
The dev server should show output like:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 4. Common Issues

#### Issue: "Missing Supabase environment variables"
**Solution:** Create `.env` file with your Supabase credentials

#### Issue: "Cannot read properties of undefined"
**Solution:** Make sure Supabase tables are created (run schema.sql)

#### Issue: White/blank screen
**Solution:** 
- Check browser console for errors
- Verify all dependencies are installed: `npm install`
- Clear browser cache and reload
- Check if the dev server is actually running

#### Issue: "Failed to fetch" errors
**Solution:** 
- Verify Supabase URL and key are correct
- Check if Supabase project is active
- Verify RLS policies are set up correctly

### 5. Quick Fixes

1. **Restart Dev Server:**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

2. **Clear Cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear browser cache

3. **Reinstall Dependencies:**
   ```bash
   rm -rf node_modules
   npm install
   ```

4. **Check File Structure:**
   Make sure all files are in the correct locations:
   - `src/App.jsx` exists
   - `src/main.jsx` exists
   - `index.html` exists in root

### 6. Verify Setup

Run these checks:
- ✅ `npm install` completed successfully
- ✅ `.env` file exists with correct values
- ✅ Dev server is running (`npm run dev`)
- ✅ No errors in browser console
- ✅ Supabase project is active
- ✅ Database tables are created

### 7. Still Not Working?

Check the browser console and share:
- Any error messages
- Network tab errors
- Console warnings

The app should work even without Supabase credentials (it will show warnings but won't crash).

