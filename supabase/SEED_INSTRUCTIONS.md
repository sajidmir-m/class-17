# Seed Data Instructions for State Works

## Overview
This seed file contains all Epson campaign images organized by state from the `public/Photos/` folder.

## Folder Structure Found:
- **EPSON FOR BUSINESS** - Agra, Bhopal, Kolkata, Muzaffarpur, Nagpur, Pune
- **EPSON FOR EDUCATION** - Amritsar, Guwahati, Indore, Kolkata, Vadodara
- **EPSON FOR HEALTHCARE** - Bhopal, Dehradun, Delhi, Gorakhpur, Jaipur, Kolkata, Raipur, Rewari
- **EPSON FOR PRINTER CHALLENGE** - Multiple cities across India

## How to Use:

### Step 1: Ensure Epson Client Exists
First, make sure "Epson India Pvt Ltd" exists in your `clients` table:

```sql
INSERT INTO clients (name, logo_url, created_at)
VALUES ('Epson India Pvt Ltd', '/epson.png', NOW())
ON CONFLICT DO NOTHING;
```

Or if you already have it, get its UUID:
```sql
SELECT id FROM clients WHERE name = 'Epson India Pvt Ltd';
```

### Step 2: Update the Seed File
Open `seed_state_works_epson.sql` and replace `epson_client_id` variable with the actual UUID from Step 1, OR use the simpler version below.

### Step 3: Run the Seed File
In your Supabase SQL Editor, run the entire `seed_state_works_epson.sql` file.

## Alternative: Simpler Version (Without DO Block)

If your Supabase doesn't support DO blocks, use the simpler version in `seed_state_works_epson_simple.sql` which uses direct INSERT statements.

## If you already ran the seed (Patch)
If you already ran the seed and want to add any missed images later, run:

```sql
-- Supabase SQL editor: run the file
-- supabase/seed_state_works_epson_after_run_patch.sql
```

## States Covered:
- ✅ Uttar Pradesh (Agra, Gorakhpur, Lucknow, Prayagraj)
- ✅ Bihar (Muzaffarpur, Patna, Dhanbad)
- ✅ West Bengal (Kolkata)
- ✅ Madhya Pradesh (Bhopal, Indore)
- ✅ Maharashtra (Nagpur, Pune, Nanded, Solapur, Ahmad Nagar, Vadodara)
- ✅ Delhi
- ✅ Rajasthan (Jaipur, Jodhpur, Kota)
- ✅ Jharkhand (Ranchi, Jamshedpur)
- ✅ Chhattisgarh (Raipur)
- ✅ Uttarakhand (Dehradun)
- ✅ Haryana (Rewari)
- ✅ Punjab (Amritsar, Ludhiana)
- ✅ Assam (Guwahati)
- ✅ Odisha (Cuttack)
- ✅ Jammu & Kashmir (Srinagar)

## Image Paths:
All images are referenced from `/Photos/` folder in your public directory. Make sure your Vite build includes these files in the public folder.

## Notes:
- Images are organized by campaign type (Business, Education, Healthcare, Printer Challenge)
- Each state work entry includes all relevant images from that state
- **Activities are now enhanced with detailed person-to-person engagement descriptions:**
  - Face-to-face consultations
  - One-on-one product demonstrations
  - Individual meetings with decision-makers
  - Hands-on product trials
  - Personalized solutions discussions
  - Direct customer engagement
- Activities emphasize the human connection and personalized approach of each campaign
- If a state has multiple campaign types, they're combined into one entry

## Frontend Enhancements:
The frontend (`StateWork.jsx`) has been enhanced to beautifully display:
- ✅ Person-to-person activities with icons and engaging styling
- ✅ Enhanced photo gallery with hover effects and lightbox
- ✅ Improved card layouts with gradients and shadows
- ✅ Better image handling for public folder paths
- ✅ Responsive design for all screen sizes

