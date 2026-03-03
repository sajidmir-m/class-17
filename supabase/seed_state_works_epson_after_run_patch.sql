-- PATCH SEED (run AFTER you've already run seed_state_works_epson_simple.sql)
-- Adds the few missing image paths found in public/Photos that were not included in the original seed.
-- Safe to re-run: it appends missing images and removes duplicates.

-- Ensure Epson exists
INSERT INTO clients (name, logo_url, created_at)
VALUES ('Epson India Pvt Ltd', '/epson.png', NOW())
ON CONFLICT DO NOTHING;

-- Add missing images to Uttar Pradesh entry (Agra/Gorakhpur extra folders)
UPDATE state_works
SET images = (
  SELECT ARRAY(
    SELECT DISTINCT x
    FROM unnest(
      COALESCE(state_works.images, ARRAY[]::text[])
      ||
      ARRAY[
        '/Photos/EPSON FOR HEALTHCARE/Gorakhpur- Feb 2024/Picture1.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Gorakhpur- Feb 2024/Picture2.jpg',
        '/Photos/EPSON FOR HEALTHCARE/Gorakhpur- Feb 2024/Picture3.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Agra-2026/WhatsApp Image 2026-02-20 at 23.31.36.jpeg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Agra-2026/WhatsApp Image 2026-02-20 at 23.32.06.jpeg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Agra-2026/WhatsApp Image 2026-02-20 at 23.33.12.jpeg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Agra-2026/WhatsApp Image 2026-02-20 at 23.33.31.jpeg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Gorakhpur-2025/WhatsApp Image 2025-12-09 at 21.17.08_b50d41d3.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Gorakhpur-2025/WhatsApp Image 2025-12-09 at 21.17.39_e5857f12.jpg',
        '/Photos/EPSON FOR PRINTER CHALLENGE/Gorakhpur-2025/WhatsApp Image 2025-12-11 at 18.50.17_4d86db8d.jpg'
      ]
    ) AS x
    WHERE x IS NOT NULL AND x <> ''
  )
)
WHERE slug = 'uttar-pradesh';

-- If the Uttar Pradesh row doesn't exist for some reason, create it with these images
INSERT INTO state_works (state, slug, title, description, brand_client_id, activities, images, created_at)
SELECT
  'Uttar Pradesh',
  'uttar-pradesh',
  'Epson Activations in Uttar Pradesh (Patch)',
  'Additional Epson activation photos (Agra/Gorakhpur) added after the initial seed run.',
  (SELECT id FROM clients WHERE name = 'Epson India Pvt Ltd' LIMIT 1),
  ARRAY[
    'Additional campaign photos added after initial seed run (Agra 2026, Gorakhpur 2025, Gorakhpur Healthcare 2024)'
  ],
  ARRAY[
    '/Photos/EPSON FOR HEALTHCARE/Gorakhpur- Feb 2024/Picture1.jpg',
    '/Photos/EPSON FOR HEALTHCARE/Gorakhpur- Feb 2024/Picture2.jpg',
    '/Photos/EPSON FOR HEALTHCARE/Gorakhpur- Feb 2024/Picture3.jpg',
    '/Photos/EPSON FOR PRINTER CHALLENGE/Agra-2026/WhatsApp Image 2026-02-20 at 23.31.36.jpeg',
    '/Photos/EPSON FOR PRINTER CHALLENGE/Agra-2026/WhatsApp Image 2026-02-20 at 23.32.06.jpeg',
    '/Photos/EPSON FOR PRINTER CHALLENGE/Agra-2026/WhatsApp Image 2026-02-20 at 23.33.12.jpeg',
    '/Photos/EPSON FOR PRINTER CHALLENGE/Agra-2026/WhatsApp Image 2026-02-20 at 23.33.31.jpeg',
    '/Photos/EPSON FOR PRINTER CHALLENGE/Gorakhpur-2025/WhatsApp Image 2025-12-09 at 21.17.08_b50d41d3.jpg',
    '/Photos/EPSON FOR PRINTER CHALLENGE/Gorakhpur-2025/WhatsApp Image 2025-12-09 at 21.17.39_e5857f12.jpg',
    '/Photos/EPSON FOR PRINTER CHALLENGE/Gorakhpur-2025/WhatsApp Image 2025-12-11 at 18.50.17_4d86db8d.jpg'
  ],
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM state_works WHERE slug = 'uttar-pradesh');


