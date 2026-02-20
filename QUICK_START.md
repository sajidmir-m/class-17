# Quick Start - Fix Blank Screen

## Step 1: Check if Dev Server is Running

Open terminal in the project folder and run:
```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

## Step 2: Open the URL

Click on or copy the URL shown (usually `http://localhost:5173/`)

## Step 3: If Still Blank Screen

### Option A: Create .env file (Recommended)

1. Create a file named `.env` in the root folder (same level as `package.json`)
2. Add these lines (replace with your actual Supabase values):
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. **IMPORTANT:** Stop the dev server (Ctrl+C) and restart it:
   ```bash
   npm run dev
   ```

### Option B: Run Without Supabase (For Testing)

The app should now work even without Supabase credentials. You'll see warnings in the console but the page should load.

## Step 4: Check Browser Console

1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. Look for any red error messages
4. Share those errors if the page still doesn't load

## Common Issues:

### ❌ "Cannot GET /"
- Dev server is not running
- Solution: Run `npm run dev`

### ❌ White/Blank Screen
- Check browser console (F12)
- Verify dev server is running
- Try hard refresh: Ctrl+Shift+R

### ❌ "Failed to fetch"
- Supabase not configured
- Solution: Create `.env` file (see Step 3)

### ✅ Page Loads but Shows Errors
- This is normal if Supabase isn't set up yet
- The page structure should still be visible

## Test if App is Working:

Even without Supabase, you should see:
- Navigation bar at the top
- "Class 17 Events" heading
- Footer at the bottom

If you see these, the app is working! You just need to configure Supabase for full functionality.

