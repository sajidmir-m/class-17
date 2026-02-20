-- Seed: Featured clients for Class 17 Events
-- Safe to run multiple times (won't duplicate by name).

INSERT INTO public.clients (name)
SELECT v.name
FROM (
  VALUES
    ('Epson India Pvt Ltd'),
    ('HP'),
    ('Doms'),
    ('Kellox'),
    ('Bhartiya Exla Life Insurance'),
    ('DNA'),
    ('Star Sports Pro Kabaddi Junior'),
    ('Z Network')
) AS v(name)
WHERE NOT EXISTS (
  SELECT 1 FROM public.clients c WHERE c.name = v.name
);


