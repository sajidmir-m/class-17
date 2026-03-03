-- SIMPLER VERSION: Seed data for State Works - Epson Campaigns
-- This version uses subqueries instead of DO blocks for better compatibility
-- Run this after creating the state_works table and clients table

-- Step 1: Ensure Epson India Pvt Ltd exists in clients table
INSERT INTO clients (name, logo_url, created_at)
VALUES ('Epson India Pvt Ltd', '/epson.png', NOW())
ON CONFLICT DO NOTHING;

-- Step 2: Insert state works using subquery to get Epson client ID
-- UTTAR PRADESH
INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
SELECT 
  'Uttar Pradesh',
  'uttar-pradesh',
  'Epson Business Solutions in Uttar Pradesh',
  'Comprehensive business activation campaigns across Agra, Gorakhpur, Lucknow, and Prayagraj showcasing Epson printing and projection solutions for enterprises.',
  (SELECT id FROM clients WHERE name = 'Epson India Pvt Ltd' LIMIT 1),
  ARRAY[
    'Face-to-face product demonstrations with business owners and decision-makers in Agra (Sept 2024)',
    'One-on-one consultations explaining Epson printing solutions tailored to enterprise needs',
    'Interactive printer challenge activations engaging customers personally in Gorakhpur (Feb 2025)',
    'Direct engagement with corporate clients showcasing enterprise solutions in Lucknow (Sept 2024)',
    'Personalized demonstrations for business owners highlighting cost-efficiency and productivity benefits',
    'Hands-on product trials allowing customers to experience Epson technology firsthand',
    'Corporate engagement programs with personalized solutions for each business in Prayagraj',
    'Individual consultations addressing specific printing and projection requirements'
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
ON CONFLICT (state, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  activities = EXCLUDED.activities,
  images = EXCLUDED.images;

-- BIHAR
INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
SELECT 
  'Bihar',
  'bihar',
  'Epson Activations in Bihar',
  'On-ground campaigns in Muzaffarpur, Patna, and Dhanbad covering business solutions, printer challenges, and educational initiatives.',
  (SELECT id FROM clients WHERE name = 'Epson India Pvt Ltd' LIMIT 1),
  ARRAY[
    'Personal interactions with business owners in Muzaffarpur explaining Epson solutions (Nov 2024 & 2025)',
    'Face-to-face consultations understanding each business printing needs and challenges',
    'Direct engagement with customers at printer challenge events in Patna (Feb 2024)',
    'One-on-one product demonstrations allowing hands-on experience with Epson printers',
    'Personalized solutions discussions with business decision-makers',
    'Interactive product trials where customers can test print quality and features',
    'Individual consultations in Dhanbad addressing specific business requirements (Nov 2024)',
    'Direct customer engagement explaining benefits and ROI of Epson solutions'
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
ON CONFLICT (state, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  activities = EXCLUDED.activities,
  images = EXCLUDED.images;

-- WEST BENGAL
INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
SELECT 
  'West Bengal',
  'west-bengal',
  'Epson Campaigns in West Bengal',
  'Multi-sector activations in Kolkata covering business solutions, education programs, and healthcare initiatives.',
  (SELECT id FROM clients WHERE name = 'Epson India Pvt Ltd' LIMIT 1),
  ARRAY[
    'Face-to-face business solutions showcase with personalized consultations in Kolkata (May 2024)',
    'Direct engagement with enterprise clients understanding their specific printing needs',
    'One-on-one demonstrations showcasing how Epson solutions solve business challenges',
    'Personal interactions with educators and school administrators in Kolkata (Jan 2024)',
    'Individual consultations explaining Epson educational technology benefits',
    'Hands-on demonstrations for teachers and students experiencing projection solutions',
    'Direct engagement with healthcare professionals in Kolkata (April 2024)',
    'Personalized consultations with hospital administrators about medical printing solutions',
    'Face-to-face demonstrations showing Epson healthcare technology applications',
    'Individual meetings addressing specific healthcare facility requirements'
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
ON CONFLICT (state, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  activities = EXCLUDED.activities,
  images = EXCLUDED.images;

-- MADHYA PRADESH
INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
SELECT 
  'Madhya Pradesh',
  'madhya-pradesh',
  'Epson Activations in Madhya Pradesh',
  'Business and healthcare campaigns in Bhopal and Indore showcasing Epson solutions across different sectors.',
  (SELECT id FROM clients WHERE name = 'Epson India Pvt Ltd' LIMIT 1),
  ARRAY[
    'Personal interactions with business owners in Bhopal explaining Epson enterprise solutions (March 2025)',
    'One-on-one consultations understanding each business printing workflow and requirements',
    'Face-to-face product demonstrations allowing hands-on experience with Epson technology',
    'Direct engagement with healthcare professionals in Bhopal (Sept 2024)',
    'Individual consultations with hospital administrators about medical printing needs',
    'Personalized demonstrations showing Epson healthcare solutions for different departments',
    'Direct interactions with doctors and medical staff explaining technology benefits',
    'Education programs with personal engagement in Indore (Feb 2026)',
    'Face-to-face meetings with school principals and IT coordinators',
    'Individual consultations with educators about classroom projection solutions',
    'Hands-on demonstrations for teachers experiencing Epson educational technology'
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
ON CONFLICT (state, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  activities = EXCLUDED.activities,
  images = EXCLUDED.images;

-- MAHARASHTRA
INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
SELECT 
  'Maharashtra',
  'maharashtra',
  'Epson Campaigns Across Maharashtra',
  'Extensive activations across multiple cities in Maharashtra including business solutions, printer challenges, and educational programs.',
  (SELECT id FROM clients WHERE name = 'Epson India Pvt Ltd' LIMIT 1),
  ARRAY[
    'Personal interactions with business owners in Nagpur and Pune explaining Epson solutions (April 2024, Jan 2025)',
    'Face-to-face consultations understanding each business specific printing and projection needs',
    'One-on-one product demonstrations allowing customers to experience Epson technology firsthand',
    'Direct engagement at printer challenge events in Nanded, Solapur, and Ahmad Nagar',
    'Individual consultations addressing customer questions and concerns about Epson products',
    'Hands-on product trials where customers can test print quality, speed, and features',
    'Personalized solutions discussions matching Epson products to business requirements',
    'Direct customer engagement explaining cost savings and productivity benefits',
    'Educational initiatives with personal engagement in Vadodara (Sept 2024)',
    'Face-to-face meetings with school administrators and educators',
    'Individual consultations explaining how Epson technology enhances learning experiences',
    'Hands-on demonstrations for teachers experiencing projection and printing solutions'
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
ON CONFLICT (state, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  activities = EXCLUDED.activities,
  images = EXCLUDED.images;

-- DELHI
INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
SELECT 
  'Delhi',
  'delhi',
  'Epson Healthcare Solutions in Delhi',
  'Healthcare sector activations in Delhi showcasing Epson medical printing and projection solutions.',
  (SELECT id FROM clients WHERE name = 'Epson India Pvt Ltd' LIMIT 1),
  ARRAY[
    'Face-to-face healthcare demonstrations with medical professionals in Delhi (July 2024)',
    'Personal interactions with hospital administrators understanding their printing and projection needs',
    'One-on-one consultations with doctors and medical staff explaining Epson healthcare solutions',
    'Individual meetings addressing specific medical department requirements',
    'Direct engagement showcasing medical equipment printing capabilities',
    'Personalized demonstrations showing how Epson solutions improve hospital workflows',
    'Hands-on product trials allowing healthcare professionals to experience technology',
    'Hospital engagement programs with personalized solutions for each facility',
    'Direct consultations explaining cost-efficiency and quality benefits for healthcare'
  ],
  ARRAY[
    '/Photos/EPSON FOR HEALTHCARE/Delhi- July 2024/Picture1.jpg',
    '/Photos/EPSON FOR HEALTHCARE/Delhi- July 2024/Picture2.jpg',
    '/Photos/EPSON FOR HEALTHCARE/Delhi- July 2024/Picture3.jpg',
    '/Photos/EPSON FOR HEALTHCARE/Delhi- July 2024/Picture4.jpg',
    '/Photos/EPSON FOR HEALTHCARE/Delhi- July 2024/Picture5.jpg'
  ],
  NOW()
ON CONFLICT (state, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  activities = EXCLUDED.activities,
  images = EXCLUDED.images;

-- RAJASTHAN
INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
SELECT 
  'Rajasthan',
  'rajasthan',
  'Epson Activations in Rajasthan',
  'Healthcare and printer challenge campaigns across Jaipur, Jodhpur, and Kota.',
  (SELECT id FROM clients WHERE name = 'Epson India Pvt Ltd' LIMIT 1),
  ARRAY[
    'Face-to-face healthcare demonstrations with medical professionals in Jaipur (Jan 2025)',
    'Personal interactions with hospital administrators explaining Epson medical printing solutions',
    'One-on-one consultations with doctors addressing specific healthcare facility needs',
    'Individual meetings showcasing how Epson technology improves medical workflows',
    'Direct engagement at printer challenge events in Jaipur, Jodhpur, and Kota',
    'Personal interactions with customers allowing hands-on experience with Epson printers',
    'Individual consultations addressing customer questions about print quality and features',
    'Face-to-face product demonstrations showing cost savings and productivity benefits',
    'Direct customer engagement explaining Epson solutions tailored to their business needs'
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
ON CONFLICT (state, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  activities = EXCLUDED.activities,
  images = EXCLUDED.images;

-- JHARKHAND
INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
SELECT 
  'Jharkhand',
  'jharkhand',
  'Epson Printer Challenge in Jharkhand',
  'Printer challenge activations in Ranchi and Jamshedpur engaging local businesses and consumers.',
  (SELECT id FROM clients WHERE name = 'Epson India Pvt Ltd' LIMIT 1),
  ARRAY[
    'Face-to-face engagement at printer challenge events in Ranchi (Feb 2024)',
    'Personal interactions with customers allowing hands-on experience with Epson printers',
    'One-on-one consultations addressing customer questions about print quality and features',
    'Direct product demonstrations in Jamshedpur (Jan 2026)',
    'Individual consultations explaining Epson solutions tailored to business needs',
    'Hands-on product trials where customers can test print quality and speed',
    'Personalized solutions discussions matching Epson products to requirements'
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
ON CONFLICT (state, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  activities = EXCLUDED.activities,
  images = EXCLUDED.images;

-- CHHATTISGARH
INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
SELECT 
  'Chhattisgarh',
  'chhattisgarh',
  'Epson Healthcare in Chhattisgarh',
  'Healthcare sector activations in Raipur showcasing Epson medical solutions.',
  (SELECT id FROM clients WHERE name = 'Epson India Pvt Ltd' LIMIT 1),
  ARRAY[
    'Face-to-face healthcare demonstrations with medical professionals in Raipur (March 2024)',
    'Personal interactions with hospital administrators understanding their printing needs',
    'One-on-one consultations with doctors explaining Epson healthcare solutions',
    'Individual meetings addressing specific medical department requirements',
    'Direct engagement showcasing medical equipment printing capabilities',
    'Personalized demonstrations showing how Epson solutions improve hospital workflows',
    'Hands-on product trials allowing healthcare professionals to experience technology',
    'Hospital engagement programs with personalized solutions for each facility'
  ],
  ARRAY[
    '/Photos/EPSON FOR HEALTHCARE/Raipur- March 2024/Picture1.jpg',
    '/Photos/EPSON FOR HEALTHCARE/Raipur- March 2024/Picture2.jpg',
    '/Photos/EPSON FOR HEALTHCARE/Raipur- March 2024/Picture3.jpg',
    '/Photos/EPSON FOR HEALTHCARE/Raipur- March 2024/Picture4.jpg',
    '/Photos/EPSON FOR HEALTHCARE/Raipur- March 2024/Picture5.jpg'
  ],
  NOW()
ON CONFLICT (state, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  activities = EXCLUDED.activities,
  images = EXCLUDED.images;

-- UTTARAKHAND
INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
SELECT 
  'Uttarakhand',
  'uttarakhand',
  'Epson Healthcare in Uttarakhand',
  'Healthcare activations in Dehradun showcasing Epson medical printing solutions.',
  (SELECT id FROM clients WHERE name = 'Epson India Pvt Ltd' LIMIT 1),
  ARRAY[
    'Face-to-face healthcare demonstrations with medical professionals in Dehradun (Aug 2024)',
    'Personal interactions with hospital administrators explaining Epson medical solutions',
    'One-on-one consultations with doctors addressing specific healthcare facility needs',
    'Individual meetings showcasing how Epson technology improves medical workflows',
    'Direct engagement showcasing medical equipment printing capabilities',
    'Personalized demonstrations showing cost-efficiency and quality benefits',
    'Hands-on product trials allowing healthcare professionals to experience technology',
    'Hospital engagement programs with personalized solutions for each facility'
  ],
  ARRAY[
    '/Photos/EPSON FOR HEALTHCARE/Dehradun- Aug 2024/Picture1.jpg',
    '/Photos/EPSON FOR HEALTHCARE/Dehradun- Aug 2024/Picture2.jpg',
    '/Photos/EPSON FOR HEALTHCARE/Dehradun- Aug 2024/Picture3.jpg',
    '/Photos/EPSON FOR HEALTHCARE/Dehradun- Aug 2024/Picture4.jpg',
    '/Photos/EPSON FOR HEALTHCARE/Dehradun- Aug 2024/Picture5.jpg'
  ],
  NOW()
ON CONFLICT (state, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  activities = EXCLUDED.activities,
  images = EXCLUDED.images;

-- HARYANA
INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
SELECT 
  'Haryana',
  'haryana',
  'Epson Healthcare in Haryana',
  'Healthcare sector activations in Rewari showcasing Epson medical solutions.',
  (SELECT id FROM clients WHERE name = 'Epson India Pvt Ltd' LIMIT 1),
  ARRAY[
    'Face-to-face healthcare demonstrations with medical professionals in Rewari (May 2024)',
    'Personal interactions with hospital administrators understanding their printing needs',
    'One-on-one consultations with doctors explaining Epson healthcare solutions',
    'Individual meetings addressing specific medical department requirements',
    'Direct engagement showcasing medical equipment printing capabilities',
    'Personalized demonstrations showing how Epson solutions improve hospital workflows',
    'Hands-on product trials allowing healthcare professionals to experience technology',
    'Hospital engagement programs with personalized solutions for each facility'
  ],
  ARRAY[
    '/Photos/EPSON FOR HEALTHCARE/Rewari- May 2024/Picture1.jpg',
    '/Photos/EPSON FOR HEALTHCARE/Rewari- May 2024/Picture2.jpg',
    '/Photos/EPSON FOR HEALTHCARE/Rewari- May 2024/Picture3.jpg',
    '/Photos/EPSON FOR HEALTHCARE/Rewari- May 2024/Picture4.jpg',
    '/Photos/EPSON FOR HEALTHCARE/Rewari- May 2024/Picture5.jpg'
  ],
  NOW()
ON CONFLICT (state, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  activities = EXCLUDED.activities,
  images = EXCLUDED.images;

-- PUNJAB
INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
SELECT 
  'Punjab',
  'punjab',
  'Epson Education & Printer Challenge in Punjab',
  'Education sector activations in Amritsar and printer challenge events in Ludhiana.',
  (SELECT id FROM clients WHERE name = 'Epson India Pvt Ltd' LIMIT 1),
  ARRAY[
    'Face-to-face education programs with school administrators in Amritsar (Dec 2023)',
    'Personal interactions with teachers and principals explaining Epson educational technology',
    'One-on-one consultations understanding each school specific projection and printing needs',
    'Individual meetings showcasing how Epson solutions enhance classroom learning',
    'Hands-on demonstrations for educators experiencing projection and printing solutions',
    'Direct engagement at printer challenge events in Ludhiana',
    'Personal interactions with customers allowing hands-on experience with Epson printers',
    'Individual consultations addressing questions about print quality and features'
  ],
  ARRAY[
    '/Photos/EPSON FOR EDUCATION/Amritsar- Dec 2023/Picture1.jpg',
    '/Photos/EPSON FOR EDUCATION/Amritsar- Dec 2023/Picture2.jpg',
    '/Photos/EPSON FOR EDUCATION/Amritsar- Dec 2023/Picture3.jpg',
    '/Photos/EPSON FOR PRINTER CHALLENGE/Ludhiana/2026/WhatsApp Image 2026-02-20 at 23.56.27.jpeg',
    '/Photos/EPSON FOR PRINTER CHALLENGE/Ludhiana/2026/WhatsApp Image 2026-02-20 at 23.55.47.jpeg'
  ],
  NOW()
ON CONFLICT (state, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  activities = EXCLUDED.activities,
  images = EXCLUDED.images;

-- ASSAM
INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
SELECT 
  'Assam',
  'assam',
  'Epson Education in Assam',
  'Education sector activations in Guwahati showcasing Epson solutions for schools and institutions.',
  (SELECT id FROM clients WHERE name = 'Epson India Pvt Ltd' LIMIT 1),
  ARRAY[
    'Face-to-face education programs with school administrators in Guwahati (Nov 2024)',
    'Personal interactions with teachers and principals explaining Epson educational technology',
    'One-on-one consultations understanding each school specific projection and printing needs',
    'Individual meetings showcasing how Epson solutions enhance classroom learning',
    'Hands-on demonstrations for educators experiencing projection solutions',
    'Direct engagement with school IT coordinators addressing technical requirements',
    'Personalized solutions discussions matching Epson products to educational needs',
    'Individual consultations explaining cost-efficiency and learning benefits'
  ],
  ARRAY[
    '/Photos/EPSON FOR EDUCATION/Guwahati-Nov 2024/Picture1.jpg',
    '/Photos/EPSON FOR EDUCATION/Guwahati-Nov 2024/Picture2.jpg',
    '/Photos/EPSON FOR EDUCATION/Guwahati-Nov 2024/Picture3.jpg',
    '/Photos/EPSON FOR EDUCATION/Guwahati-Nov 2024/Picture4.jpg'
  ],
  NOW()
ON CONFLICT (state, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  activities = EXCLUDED.activities,
  images = EXCLUDED.images;

-- ODISHA
INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
SELECT 
  'Odisha',
  'odisha',
  'Epson Printer Challenge in Odisha',
  'Printer challenge activations in Cuttack engaging local businesses.',
  (SELECT id FROM clients WHERE name = 'Epson India Pvt Ltd' LIMIT 1),
  ARRAY[
    'Face-to-face engagement at printer challenge events in Cuttack (Dec 2025)',
    'Personal interactions with customers allowing hands-on experience with Epson printers',
    'One-on-one consultations addressing customer questions about print quality and features',
    'Direct product demonstrations showcasing Epson technology benefits',
    'Individual consultations explaining Epson solutions tailored to business needs',
    'Hands-on product trials where customers can test print quality and speed',
    'Personalized solutions discussions matching Epson products to requirements',
    'Direct customer engagement explaining cost savings and productivity benefits'
  ],
  ARRAY[
    '/Photos/EPSON FOR PRINTER CHALLENGE/Cuttack-Dec 2025/jkd.jpeg',
    '/Photos/EPSON FOR PRINTER CHALLENGE/Cuttack-Dec 2025/WhatsApp Image 2025-12-23 at 17.40.34.jpeg',
    '/Photos/EPSON FOR PRINTER CHALLENGE/Cuttack-Dec 2025/WhatsApp Image 2026-01-06 at 21.09.53.jpeg',
    '/Photos/EPSON FOR PRINTER CHALLENGE/Cuttack-Dec 2025/WhatsApp Image 2026-01-07 at 23.10.54.jpeg'
  ],
  NOW()
ON CONFLICT (state, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  activities = EXCLUDED.activities,
  images = EXCLUDED.images;

-- JAMMU & KASHMIR
INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
SELECT 
  'Jammu & Kashmir',
  'jammu-and-kashmir',
  'Epson Printer Challenge in Jammu & Kashmir',
  'Printer challenge activations in Srinagar engaging local businesses and consumers.',
  (SELECT id FROM clients WHERE name = 'Epson India Pvt Ltd' LIMIT 1),
  ARRAY[
    'Face-to-face engagement at printer challenge events in Srinagar (July 2024 & July 2025)',
    'Personal interactions with customers allowing hands-on experience with Epson printers',
    'One-on-one consultations addressing customer questions about print quality and features',
    'Direct product demonstrations showcasing Epson technology benefits',
    'Individual consultations explaining Epson solutions tailored to business needs',
    'Hands-on product trials where customers can test print quality and speed',
    'Personalized solutions discussions matching Epson products to requirements',
    'Direct customer engagement explaining cost savings and productivity benefits',
    'Individual meetings with business owners understanding their specific printing needs'
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
ON CONFLICT (state, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  activities = EXCLUDED.activities,
  images = EXCLUDED.images;

