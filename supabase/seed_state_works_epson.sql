-- Seed data for State Works - Epson Campaigns
-- This file contains state work entries for all Epson campaigns organized by state
-- Run this after creating the state_works table and clients table

-- First, ensure Epson India Pvt Ltd exists in clients table
-- If it doesn't exist, insert it (adjust the UUID if needed)
INSERT INTO clients (id, name, logo_url, created_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Epson India Pvt Ltd', '/epson.png', NOW())
ON CONFLICT (id) DO NOTHING;

-- Get the Epson client ID (adjust if you have a different UUID)
-- For this seed, we'll use a placeholder - replace with actual UUID after inserting client
DO $$
DECLARE
  epson_client_id UUID;
BEGIN
  SELECT id INTO epson_client_id FROM clients WHERE name = 'Epson India Pvt Ltd' LIMIT 1;
  
  IF epson_client_id IS NULL THEN
    -- If Epson doesn't exist, create it
    INSERT INTO clients (name, logo_url) VALUES ('Epson India Pvt Ltd', '/epson.png') RETURNING id INTO epson_client_id;
  END IF;

  -- Now insert state works for each state/city combination

  -- UTTAR PRADESH - Agra, Gorakhpur, Lucknow, Prayagraj
  INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
  VALUES 
    (
      'Uttar Pradesh',
      'uttar-pradesh',
      'Epson Business Solutions in Uttar Pradesh',
      'Comprehensive business activation campaigns across Agra, Gorakhpur, Lucknow, and Prayagraj showcasing Epson printing and projection solutions for enterprises.',
      epson_client_id,
      ARRAY[
        'Business product demonstrations in Agra (Sept 2024)',
        'Printer challenge activations in Gorakhpur (Feb 2025)',
        'Enterprise solutions showcase in Lucknow (Sept 2024)',
        'Corporate engagement programs in Prayagraj'
      ],
      ARRAY[
        '/Photos/EPSON FOR BUSINESS/Agra- Sept 2024/Picture1.jpg',
        '/Photos/EPSON FOR BUSINESS/Agra- Sept 2024/Picture2.jpg',
        '/Photos/EPSON FOR BUSINESS/Agra- Sept 2024/Picture3.jpg',
        '/Photos/EPSON FOR BUSINESS/Agra- Sept 2024/Picture4.jpg',
        '/Photos/EPSON FOR BUSINESS/Agra- Sept 2024/Picture5.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Gorakhpur-Feb 2025/Picture1.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Gorakhpur-Feb 2025/Picture2.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Gorakhpur-Feb 2025/Picture3.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Gorakhpur-Feb 2025/Picture4.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Lucknow- Sept 2024/Picture1.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Lucknow- Sept 2024/Picture2.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Lucknow- Sept 2024/Picture3.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Lucknow- Sept 2024/Picture4.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Prayagraj/Picture1.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Prayagraj/Picture2.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Prayagraj/Picture3.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Prayagraj/Picture4.jpg'
      ],
      NOW()
    )
  ON CONFLICT (state, slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    activities = EXCLUDED.activities,
    images = EXCLUDED.images;

  -- BIHAR - Muzaffarpur, Patna, Dhanbad
  INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
  VALUES 
    (
      'Bihar',
      'bihar',
      'Epson Activations in Bihar',
      'On-ground campaigns in Muzaffarpur, Patna, and Dhanbad covering business solutions, printer challenges, and educational initiatives.',
      epson_client_id,
      ARRAY[
        'Business activations in Muzaffarpur (Nov 2024 & 2025)',
        'Printer challenge events in Patna (Feb 2024)',
        'Product demonstrations in Dhanbad (Nov 2024)'
      ],
      ARRAY[
        '/Photos/EPSON FOR BUSINESS/Muzaffarpur- Nov 2024/Picture1.jpg',
        '/Photos/EPSON FOR BUSINESS/Muzaffarpur- Nov 2024/Picture2.jpg',
        '/Photos/EPSON FOR BUSINESS/Muzaffarpur- Nov 2024/Picture3.jpg',
        '/Photos/EPSON FOR BUSINESS/Muzaffarpur/2025/Picture1.jpg',
        '/Photos/EPSON FOR BUSINESS/Muzaffarpur/2025/Picture2.jpg',
        '/Photos/EPSON FOR BUSINESS/Muzaffarpur/2025/Picture3.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Patna-Feb 2024/Picture1.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Patna-Feb 2024/Picture2.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Patna-Feb 2024/Picture3.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Patna-Feb 2024/Picture4.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Dhanbad-Nov 2024/Picture1.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Dhanbad-Nov 2024/Picture2.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Dhanbad-Nov 2024/Picture4.jpg'
      ],
      NOW()
    )
  ON CONFLICT (state, slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    activities = EXCLUDED.activities,
    images = EXCLUDED.images;

  -- WEST BENGAL - Kolkata
  INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
  VALUES 
    (
      'West Bengal',
      'west-bengal',
      'Epson Campaigns in West Bengal',
      'Multi-sector activations in Kolkata covering business solutions, education programs, and healthcare initiatives.',
      epson_client_id,
      ARRAY[
        'Business solutions showcase in Kolkata (May 2024)',
        'Education sector activations in Kolkata (Jan 2024)',
        'Healthcare demonstrations in Kolkata (April 2024)'
      ],
      ARRAY[
        '/Photos/EPSON FOR BUSINESS/Kolkata -May 2024/Picture1.jpg',
        '/Photos/EPSON FOR BUSINESS/Kolkata -May 2024/Picture2.jpg',
        '/Photos/EPSON FOR BUSINESS/Kolkata -May 2024/Picture3.jpg',
        '/Photos/EPSON FOR EDUCATION/Kolkata- Jan 2024/Picture1.jpg',
        '/Photos/EPSON FOR EDUCATION/Kolkata- Jan 2024/Picture2.jpg',
        '/Photos/EPSON FOR EDUCATION/Kolkata- Jan 2024/Picture3.jpg',
        '/Photos/EPSON FOR EDUCATION/Kolkata- Jan 2024/Picture4.jpg',
        '/Photos/EPSON FOR EDUCATION/Kolkata- Jan 2024/Picture5.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Kolkata- April 2024/Picture1.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Kolkata- April 2024/Picture2.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Kolkata- April 2024/Picture3.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Kolkata- April 2024/Picture4.jpg'
      ],
      NOW()
    )
  ON CONFLICT (state, slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    activities = EXCLUDED.activities,
    images = EXCLUDED.images;

  -- MADHYA PRADESH - Bhopal, Indore
  INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
  VALUES 
    (
      'Madhya Pradesh',
      'madhya-pradesh',
      'Epson Activations in Madhya Pradesh',
      'Business and healthcare campaigns in Bhopal and Indore showcasing Epson solutions across different sectors.',
      epson_client_id,
      ARRAY[
        'Business activations in Bhopal (March 2025)',
        'Healthcare demonstrations in Bhopal (Sept 2024)',
        'Education programs in Indore (Feb 2026)'
      ],
      ARRAY[
        '/Photos/EPSON FOR BUSINESS/Bhopal - March 2025/Picture1.jpg',
        '/Photos/EPSON FOR BUSINESS/Bhopal - March 2025/Picture2.jpg',
        '/Photos/EPSON FOR BUSINESS/Bhopal - March 2025/Picture3.jpg',
        '/Photos/EPSON FOR BUSINESS/Bhopal - March 2025/Picture4.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Bhopal- Sept 2024/Picture1.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Bhopal- Sept 2024/Picture2.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Bhopal- Sept 2024/Picture3.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Bhopal- Sept 2024/Picture4.jpg',
        '/Photos/EPSON FOR EDUCATION/Indore- Feb 2026/WhatsApp Image 2026-02-23 at 06.40.11.jpeg',
        '/Photos/EPSON FOR EDUCATION/Indore- Feb 2026/WhatsApp Image 2026-02-23 at 06.41.04.jpeg',
        '/Photos/EPSON FOR EDUCATION/Indore- Feb 2026/WhatsApp Image 2026-02-23 at 06.42.28.jpeg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Bhopal-Dec 2024/Picture1.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Bhopal-Dec 2024/Picture2.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Bhopal-Dec 2024/Picture3.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Bhopal-Dec 2024/Picture4.jpg'
      ],
      NOW()
    )
  ON CONFLICT (state, slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    activities = EXCLUDED.activities,
    images = EXCLUDED.images;

  -- MAHARASHTRA - Nagpur, Pune, Nanded, Solapur, Ahmad Nagar
  INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
  VALUES 
    (
      'Maharashtra',
      'maharashtra',
      'Epson Campaigns Across Maharashtra',
      'Extensive activations across multiple cities in Maharashtra including business solutions, printer challenges, and educational programs.',
      epson_client_id,
      ARRAY[
        'Business activations in Nagpur (April 2024) and Pune (Jan 2025)',
        'Printer challenge events in Nanded (May 2024, Nov 2025), Solapur (April 2024), and Ahmad Nagar (Jan 2025)',
        'Educational initiatives in Vadodara (Sept 2024)'
      ],
      ARRAY[
        '/Photos/EPSON FOR BUSINESS/Nagpur- April 2024/Picture1.jpg',
        '/Photos/EPSON FOR BUSINESS/Nagpur- April 2024/Picture2.jpg',
        '/Photos/EPSON FOR BUSINESS/Nagpur- April 2024/Picture3.jpg',
        '/Photos/EPSON FOR BUSINESS/Nagpur- April 2024/Picture4.jpg',
        '/Photos/EPSON FOR BUSINESS/Pune- Jan 2025/Picture1.jpg',
        '/Photos/EPSON FOR BUSINESS/Pune- Jan 2025/Picture2.jpg',
        '/Photos/EPSON FOR BUSINESS/Pune- Jan 2025/Picture3.jpg',
        '/Photos/EPSON FOR BUSINESS/Pune- Jan 2025/Picture4.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Nanded- May 2024/Picture1.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Nanded- May 2024/Picture2.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Nanded- May 2024/Picture3.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Nanded- May 2024/Picture4.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Nanded- Nov 2025/2025/WhatsApp Image 2025-12-29 at 15.33.24.jpeg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Nanded- Nov 2025/2025/WhatsApp Image 2025-12-29 at 15.32.41.jpeg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Nanded- Nov 2025/2025/WhatsApp Image 2025-12-29 at 15.32.40.jpeg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Nanded- Nov 2025/2025/WhatsApp Image 2025-12-29 at 13.44.jpeg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Solapur- April 2024/Picture1.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Solapur- April 2024/Picture2.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Solapur- April 2024/Picture3.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Ahmad Nagar-(Jan 2025)/Picture1.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Ahmad Nagar-(Jan 2025)/Picture2.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Ahmad Nagar-(Jan 2025)/Picture3.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Ahmad Nagar-(Jan 2025)/Picture4.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Pune - Jan 2026/2025/WhatsApp Image 2026-01-29 at 21.42.35.jpeg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Pune - Jan 2026/2025/WhatsApp Image 2026-01-13 at 21.2.56.jpeg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Pune - Jan 2026/2025/WhatsApp Image 2026-01-0t 10.27.55.jpeg',
        '/Photos/EPSON FOR EDUCATION/Vadodara-Sept 2024/Picture1.jpg',
        '/Photos/EPSON FOR EDUCATION/Vadodara-Sept 2024/Picture2.jpg',
        '/Photos/EPSON FOR EDUCATION/Vadodara-Sept 2024/Picture3.jpg'
      ],
      NOW()
    )
  ON CONFLICT (state, slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    activities = EXCLUDED.activities,
    images = EXCLUDED.images;

  -- DELHI
  INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
  VALUES 
    (
      'Delhi',
      'delhi',
      'Epson Healthcare Solutions in Delhi',
      'Healthcare sector activations in Delhi showcasing Epson medical printing and projection solutions.',
      epson_client_id,
      ARRAY[
        'Healthcare demonstrations in Delhi (July 2024)',
        'Medical equipment showcases',
        'Hospital engagement programs'
      ],
      ARRAY[
        '/Photos/EPSON FOR HEALTHCARE/Delhi- July 2024/Picture1.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Delhi- July 2024/Picture2.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Delhi- July 2024/Picture3.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Delhi- July 2024/Picture4.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Delhi- July 2024/Picture5.jpg'
      ],
      NOW()
    )
  ON CONFLICT (state, slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    activities = EXCLUDED.activities,
    images = EXCLUDED.images;

  -- RAJASTHAN - Jaipur, Jodhpur, Kota
  INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
  VALUES 
    (
      'Rajasthan',
      'rajasthan',
      'Epson Activations in Rajasthan',
      'Healthcare and printer challenge campaigns across Jaipur, Jodhpur, and Kota.',
      epson_client_id,
      ARRAY[
        'Healthcare demonstrations in Jaipur (Jan 2025)',
        'Printer challenge events in Jaipur (Nov 2025), Jodhpur (Feb 2024), and Kota (Feb 2025)'
      ],
      ARRAY[
        '/Photos/EPSON FOR HEALTHCARE/Jaipur- Jan 2025/Picture1.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Jaipur- Jan 2025/Picture2.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Jaipur- Jan 2025/Picture3.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Jaipur- Jan 2025/Picture4.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Jaipur- Jan 2025/Picture5.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Jaipur- Jan 2025/Picture6.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Jaipur- Nov 2025/WhatsApp Image 2025-12-26 at 20.3.jpeg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Jaipur- Nov 2025/WhatsApp Image 2025-12-26 at 20.13.03.jpeg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Jaipur- Nov 2025/WhatsApp Image 2025-12-26 at 20.120.jpeg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Jaipur- Nov 2025/WhatsApp Image 2025-12-26 at 20.12.54.jpeg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Jaipur- Nov 2025/sfa.jpeg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Jodhpur- feb 2024/Picture1.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Jodhpur- feb 2024/Picture2.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Jodhpur- feb 2024/Picture3.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Jodhpur- feb 2024/Picture4.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Kota- Feb 2025/Picture1.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Kota- Feb 2025/Picture2.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Kota- Feb 2025/Picture3.jpg'
      ],
      NOW()
    )
  ON CONFLICT (state, slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    activities = EXCLUDED.activities,
    images = EXCLUDED.images;

  -- JHARKHAND - Ranchi, Jamshedpur
  INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
  VALUES 
    (
      'Jharkhand',
      'jharkhand',
      'Epson Printer Challenge in Jharkhand',
      'Printer challenge activations in Ranchi and Jamshedpur engaging local businesses and consumers.',
      epson_client_id,
      ARRAY[
        'Printer challenge events in Ranchi (Feb 2024)',
        'Product demonstrations in Jamshedpur (Jan 2026)'
      ],
      ARRAY[
        '/Photos/EPSON FOR PRINTER CHALLENGE/Ranchi- Feb 2024/Picture1.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Ranchi- Feb 2024/Picture2.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Ranchi- Feb 2024/Picture3.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Ranchi- Feb 2024/Picture4.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Jamshedpur-Jan 2026/WhatsApp Image 2026-02-08at 20.21.42.jpeg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Jamshedpur-Jan 2026/WhatsApp Image 2026-02-07 at 13.30.53.jpeg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Jamshedpur-Jan 2026/WhatsApp Image 2026-02-07 at 13.24.00.jpeg'
      ],
      NOW()
    )
  ON CONFLICT (state, slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    activities = EXCLUDED.activities,
    images = EXCLUDED.images;

  -- CHHATTISGARH - Raipur
  INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
  VALUES 
    (
      'Chhattisgarh',
      'chhattisgarh',
      'Epson Healthcare in Chhattisgarh',
      'Healthcare sector activations in Raipur showcasing Epson medical solutions.',
      epson_client_id,
      ARRAY[
        'Healthcare demonstrations in Raipur (March 2024)',
        'Medical equipment showcases',
        'Hospital engagement programs'
      ],
      ARRAY[
        '/Photos/EPSON FOR HEALTHCARE/Raipur- March 2024/Picture1.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Raipur- March 2024/Picture2.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Raipur- March 2024/Picture3.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Raipur- March 2024/Picture4.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Raipur- March 2024/Picture5.jpg'
      ],
      NOW()
    )
  ON CONFLICT (state, slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    activities = EXCLUDED.activities,
    images = EXCLUDED.images;

  -- UTTARAKHAND - Dehradun
  INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
  VALUES 
    (
      'Uttarakhand',
      'uttarakhand',
      'Epson Healthcare in Uttarakhand',
      'Healthcare activations in Dehradun showcasing Epson medical printing solutions.',
      epson_client_id,
      ARRAY[
        'Healthcare demonstrations in Dehradun (Aug 2024)',
        'Medical equipment showcases',
        'Hospital engagement programs'
      ],
      ARRAY[
        '/Photos/EPSON FOR HEALTHCARE/Dehradun- Aug 2024/Picture1.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Dehradun- Aug 2024/Picture2.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Dehradun- Aug 2024/Picture3.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Dehradun- Aug 2024/Picture4.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Dehradun- Aug 2024/Picture5.jpg'
      ],
      NOW()
    )
  ON CONFLICT (state, slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    activities = EXCLUDED.activities,
    images = EXCLUDED.images;

  -- HARYANA - Rewari
  INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
  VALUES 
    (
      'Haryana',
      'haryana',
      'Epson Healthcare in Haryana',
      'Healthcare sector activations in Rewari showcasing Epson medical solutions.',
      epson_client_id,
      ARRAY[
        'Healthcare demonstrations in Rewari (May 2024)',
        'Medical equipment showcases',
        'Hospital engagement programs'
      ],
      ARRAY[
        '/Photos/EPSON FOR HEALTHCARE/Rewari- May 2024/Picture1.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Rewari- May 2024/Picture2.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Rewari- May 2024/Picture3.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Rewari- May 2024/Picture4.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Rewari- May 2024/Picture5.jpg'
      ],
      NOW()
    )
  ON CONFLICT (state, slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    activities = EXCLUDED.activities,
    images = EXCLUDED.images;

  -- PUNJAB - Amritsar, Ludhiana
  INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
  VALUES 
    (
      'Punjab',
      'punjab',
      'Epson Education & Printer Challenge in Punjab',
      'Education sector activations in Amritsar and printer challenge events in Ludhiana.',
      epson_client_id,
      ARRAY[
        'Education programs in Amritsar (Dec 2023)',
        'Printer challenge events in Ludhiana'
      ],
      ARRAY[
        '/Photos/EPSON FOR EDUCATION/Amritsar- Dec 2023/Picture1.jpg',
        '/Photos/EPSON FOR EDUCATION/Amritsar- Dec 2023/Picture2.jpg',
        '/Photos/EPSON FOR EDUCATION/Amritsar- Dec 2023/Picture3.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Ludhiana/2026/WhatsApp Image 2026-02-20 at 23.56.27.jpeg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Ludhiana/2026/WhatsApp Image 2026-02-20 at 23.55.47.jpeg'
      ],
      NOW()
    )
  ON CONFLICT (state, slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    activities = EXCLUDED.activities,
    images = EXCLUDED.images;

  -- ASSAM - Guwahati
  INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
  VALUES 
    (
      'Assam',
      'assam',
      'Epson Education in Assam',
      'Education sector activations in Guwahati showcasing Epson solutions for schools and institutions.',
      epson_client_id,
      ARRAY[
        'Education programs in Guwahati (Nov 2024)',
        'School engagement activities',
        'Institutional demonstrations'
      ],
      ARRAY[
        '/Photos/EPSON FOR EDUCATION/Guwahati-Nov 2024/Picture1.jpg',
        '/Photos/EPSON FOR EDUCATION/Guwahati-Nov 2024/Picture2.jpg',
        '/Photos/EPSON FOR EDUCATION/Guwahati-Nov 2024/Picture3.jpg',
        '/Photos/EPSON FOR EDUCATION/Guwahati-Nov 2024/Picture4.jpg'
      ],
      NOW()
    )
  ON CONFLICT (state, slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    activities = EXCLUDED.activities,
    images = EXCLUDED.images;

  -- ODISHA - Cuttack
  INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
  VALUES 
    (
      'Odisha',
      'odisha',
      'Epson Printer Challenge in Odisha',
      'Printer challenge activations in Cuttack engaging local businesses.',
      epson_client_id,
      ARRAY[
        'Printer challenge events in Cuttack (Dec 2025)',
        'Product demonstrations',
        'Business engagement programs'
      ],
      ARRAY[
        '/Photos/EPSON FOR PRINTER CHALLENGE/Cuttack-Dec 2025/jkd.jpeg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Cuttack-Dec 2025/WhatsApp Image 2025-12-23 at 17.40.34.jpeg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Cuttack-Dec 2025/WhatsApp Image 2026-01-06 at 21.09.53.jpeg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Cuttack-Dec 2025/WhatsApp Image 2026-01-07 at 23.10.54.jpeg'
      ],
      NOW()
    )
  ON CONFLICT (state, slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    activities = EXCLUDED.activities,
    images = EXCLUDED.images;

  -- JAMMU & KASHMIR - Srinagar
  INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
  VALUES 
    (
      'Jammu & Kashmir',
      'jammu-and-kashmir',
      'Epson Printer Challenge in Jammu & Kashmir',
      'Printer challenge activations in Srinagar engaging local businesses and consumers.',
      epson_client_id,
      ARRAY[
        'Printer challenge events in Srinagar (July 2024 & July 2025)',
        'Product demonstrations',
        'Business engagement programs'
      ],
      ARRAY[
        '/Photos/EPSON FOR PRINTER CHALLENGE/Srinagar- July 2024/Picture1.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Srinagar- July 2024/Picture2.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Srinagar- July 2024/Picture3.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Srinagar- July 2024/Picture4.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Srinagar- July 2025/2025/WhatsApp Image 2025-12-09 at 18.45.52_8ba6c489.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Srinagar- July 2025/2025/WhatsApp Image 2025-12-09 at 18.45.50_9591ed6e.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Srinagar- July 2025/2025/WhatsApp Image 2025-12-09 at 18.45.46_4e2374e3.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Srinagar- July 2025/2025/WhatsApp Image 2025-12-09 at 18.45.45_ccdb2db3.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Srinagar- July 2025/2025/WhatsApp Image 2025-12-09 at 18.45.38_b4a5472d.jpg'
      ],
      NOW()
    )
  ON CONFLICT (state, slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    activities = EXCLUDED.activities,
    images = EXCLUDED.images;

  -- UTTAR PRADESH - Agra (Printer Challenge)
  INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
  VALUES 
    (
      'Uttar Pradesh',
      'uttar-pradesh-printer-challenge',
      'Epson Printer Challenge in Agra',
      'Printer challenge activations in Agra engaging local businesses.',
      epson_client_id,
      ARRAY[
        'Printer challenge events in Agra (2026)',
        'Product demonstrations',
        'Business engagement programs'
      ],
      ARRAY[
        '/Photos/EPSON FOR PRINTER CHALLENGE/Agra-2026/WhatsApp Image 2026-02-20 at 23.31.36.jpeg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Agra-2026/WhatsApp Image 2026-02-20 at 23.32.06.jpeg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Agra-2026/WhatsApp Image 2026-02-20 at 23.33.12.jpeg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Agra-2026/WhatsApp Image 2026-02-20 at 23.33.31.jpeg'
      ],
      NOW()
    )
  ON CONFLICT DO NOTHING;

END $$;

