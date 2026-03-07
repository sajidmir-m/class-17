-- Additional seed for non-Epson activities (cricket, social, school)
-- Run this AFTER you have already created and seeded state_works.
-- It appends new images and activities for relevant states and removes duplicates.

-- WEST BENGAL – Kolkata: cricket, social, school activities
UPDATE state_works
SET
  images = (
    SELECT ARRAY(
      SELECT DISTINCT x
      FROM unnest(
        COALESCE(images, ARRAY[]::text[])
        ||
        ARRAY[
          '/cricket activities/kolkata/cricket 1.png',
          '/cricket activities/kolkata/cricket 3.png',
          '/Social activity/social activity in kolkata/social activity kol.png',
          '/Social activity/social activity in kolkata/social activity kol 2.png',
          '/school activity/kolkata/school.png'
        ]
      ) AS x
      WHERE x IS NOT NULL AND x <> ''
    )
  ),
  activities = (
    SELECT ARRAY(
      SELECT DISTINCT x
      FROM unnest(
        COALESCE(activities, ARRAY[]::text[])
        ||
        ARRAY[
          'Cricket activity in Kolkata – on-ground engagement and live match screening zones.',
          'Community social activity in Kolkata – crowd interaction, engagement booths, and awareness drives.',
          'School activity in Kolkata – classroom engagement, live demos, and student interaction.'
        ]
      ) AS x
      WHERE x IS NOT NULL AND x <> ''
    )
  )
WHERE state = 'West Bengal';

-- DELHI – social activity
UPDATE state_works
SET
  images = (
    SELECT ARRAY(
      SELECT DISTINCT x
      FROM unnest(
        COALESCE(images, ARRAY[]::text[])
        ||
        ARRAY[
          '/Social activity/social activity in delhi/social activity.png',
          '/Social activity/social activity in delhi/delhi social.png'
        ]
      ) AS x
      WHERE x IS NOT NULL AND x <> ''
    )
  ),
  activities = (
    SELECT ARRAY(
      SELECT DISTINCT x
      FROM unnest(
        COALESCE(activities, ARRAY[]::text[])
        ||
        ARRAY[
          'Social activity in Delhi – high-footfall engagement, crowd interaction, and awareness conversations.'
        ]
      ) AS x
      WHERE x IS NOT NULL AND x <> ''
    )
  )
WHERE state = 'Delhi';

-- ASSAM – Guwahati school activity
UPDATE state_works
SET
  images = (
    SELECT ARRAY(
      SELECT DISTINCT x
      FROM unnest(
        COALESCE(images, ARRAY[]::text[])
        ||
        ARRAY[
          '/school activity/guwati/school.png'
        ]
      ) AS x
      WHERE x IS NOT NULL AND x <> ''
    )
  ),
  activities = (
    SELECT ARRAY(
      SELECT DISTINCT x
      FROM unnest(
        COALESCE(activities, ARRAY[]::text[])
        ||
        ARRAY[
          'School activity in Guwahati – classroom-level engagement, demonstrations, and counselor interactions.'
        ]
      ) AS x
      WHERE x IS NOT NULL AND x <> ''
    )
  )
WHERE state = 'Assam';


