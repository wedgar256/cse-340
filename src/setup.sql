CREATE TABLE IF NOT EXISTS public.organization (
  organization_id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO public.organization (name, description, contact_email, logo_filename)
SELECT seed.name, seed.description, seed.contact_email, seed.logo_filename
FROM (VALUES
  (
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
  ),
  (
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
  ),
  (
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
  )
) AS seed(name, description, contact_email, logo_filename)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.organization AS existing
  WHERE existing.name = seed.name
);

CREATE TABLE IF NOT EXISTS public.service_project (
  project_id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES public.organization(organization_id),
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(150) NOT NULL,
  date DATE NOT NULL
);

ALTER TABLE public.service_project
  ADD COLUMN IF NOT EXISTS location VARCHAR(150);
ALTER TABLE public.service_project
  ADD COLUMN IF NOT EXISTS date DATE;

UPDATE public.service_project
SET location = 'Community location'
WHERE location IS NULL;
UPDATE public.service_project
SET date = CURRENT_DATE
WHERE date IS NULL;

ALTER TABLE public.service_project
  ALTER COLUMN location SET NOT NULL;
ALTER TABLE public.service_project
  ALTER COLUMN date SET NOT NULL;

CREATE TABLE IF NOT EXISTS public.category (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

INSERT INTO public.category (name)
SELECT seed.name
FROM (VALUES
  ('Education'),
  ('Food Security'),
  ('Community Development'),
  ('Environment'),
  ('Health and Wellbeing'),
  ('Volunteer Support')
) AS seed(name)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.category AS existing
  WHERE existing.name = seed.name
);

CREATE TABLE IF NOT EXISTS public.project_category (
  project_id INTEGER NOT NULL REFERENCES public.service_project(project_id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES public.category(category_id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, category_id)
);

WITH project_seed(organization_name, title, description, location, date, category_name) AS (
  VALUES
    ('BrightFuture Builders', 'Community Garden Renewal', 'Prepare growing beds and improve shared garden spaces for neighborhood families.', 'Kampala', DATE '2026-12-05', 'Environment'),
    ('BrightFuture Builders', 'Neighborhood Playground Repair', 'Repair shared play equipment and refresh a safe outdoor gathering space for families.', 'Kampala', DATE '2026-12-12', 'Community Development'),
    ('BrightFuture Builders', 'Accessible Walking Path', 'Improve a neighborhood walking route so residents of all abilities can use it safely.', 'Entebbe', DATE '2026-12-19', 'Health and Wellbeing'),
    ('BrightFuture Builders', 'Community Classroom Refresh', 'Prepare a local learning space with volunteer painting, cleaning, and classroom improvements.', 'Jinja', DATE '2027-01-09', 'Education'),
    ('BrightFuture Builders', 'Community Water Point Improvement', 'Help maintain a shared water point and improve the surrounding public space.', 'Mbale', DATE '2027-01-16', 'Community Development'),
    ('GreenHarvest Growers', 'Harvest and Food Drive', 'Harvest seasonal produce and organize donations for local community kitchens.', 'Entebbe', DATE '2026-12-12', 'Food Security'),
    ('GreenHarvest Growers', 'Neighborhood Seedling Giveaway', 'Share vegetable seedlings and practical growing advice with neighborhood households.', 'Kampala', DATE '2026-12-19', 'Food Security'),
    ('GreenHarvest Growers', 'Community Compost Workshop', 'Teach residents how to turn household and garden waste into useful compost.', 'Jinja', DATE '2027-01-09', 'Environment'),
    ('GreenHarvest Growers', 'School Garden Workday', 'Help students prepare garden beds and learn about growing fresh food together.', 'Mukono', DATE '2027-01-16', 'Education'),
    ('GreenHarvest Growers', 'Fresh Produce Pantry Delivery', 'Pack and deliver fresh produce to local families through a community food pantry.', 'Wakiso', DATE '2027-01-23', 'Food Security'),
    ('UnityServe Volunteers', 'Community Learning Day', 'Help coordinate a day of learning activities and practical support for local families.', 'Jinja', DATE '2026-12-19', 'Education'),
    ('UnityServe Volunteers', 'Neighborhood Clean-Up', 'Bring residents together to clean shared paths and public gathering areas.', 'Mbale', DATE '2026-12-26', 'Environment'),
    ('UnityServe Volunteers', 'Senior Neighbor Support Visits', 'Coordinate friendly visits and practical errands for older residents who need support.', 'Kampala', DATE '2027-01-09', 'Health and Wellbeing'),
    ('UnityServe Volunteers', 'Family Resource Fair', 'Connect local families with community services, learning activities, and volunteer support.', 'Entebbe', DATE '2027-01-16', 'Community Development'),
    ('UnityServe Volunteers', 'Warm Welcome Supply Kits', 'Assemble and distribute essential seasonal supplies through local community partners.', 'Jinja', DATE '2027-01-23', 'Volunteer Support')
)
INSERT INTO public.service_project (organization_id, title, description, location, date)
SELECT organization.organization_id, project_seed.title, project_seed.description,
       project_seed.location, project_seed.date
FROM project_seed
INNER JOIN public.organization AS organization
  ON organization.name = project_seed.organization_name
WHERE NOT EXISTS (
  SELECT 1
  FROM public.service_project AS existing
  WHERE existing.organization_id = organization.organization_id
    AND existing.title = project_seed.title
);

WITH project_categories(organization_name, project_title, category_name) AS (
  VALUES
    ('BrightFuture Builders', 'Community Garden Renewal', 'Environment'),
    ('BrightFuture Builders', 'Neighborhood Playground Repair', 'Community Development'),
    ('BrightFuture Builders', 'Accessible Walking Path', 'Health and Wellbeing'),
    ('BrightFuture Builders', 'Community Classroom Refresh', 'Education'),
    ('BrightFuture Builders', 'Community Water Point Improvement', 'Community Development'),
    ('GreenHarvest Growers', 'Harvest and Food Drive', 'Food Security'),
    ('GreenHarvest Growers', 'Neighborhood Seedling Giveaway', 'Food Security'),
    ('GreenHarvest Growers', 'Community Compost Workshop', 'Environment'),
    ('GreenHarvest Growers', 'School Garden Workday', 'Education'),
    ('GreenHarvest Growers', 'Fresh Produce Pantry Delivery', 'Food Security'),
    ('UnityServe Volunteers', 'Community Learning Day', 'Education'),
    ('UnityServe Volunteers', 'Neighborhood Clean-Up', 'Environment'),
    ('UnityServe Volunteers', 'Senior Neighbor Support Visits', 'Health and Wellbeing'),
    ('UnityServe Volunteers', 'Family Resource Fair', 'Community Development'),
    ('UnityServe Volunteers', 'Warm Welcome Supply Kits', 'Volunteer Support')
)
INSERT INTO public.project_category (project_id, category_id)
SELECT project.project_id, category.category_id
FROM project_categories AS assignment
INNER JOIN public.organization AS organization
  ON organization.name = assignment.organization_name
INNER JOIN public.service_project AS project
  ON project.organization_id = organization.organization_id
  AND project.title = assignment.project_title
INNER JOIN public.category AS category
  ON category.name = assignment.category_name
WHERE NOT EXISTS (
  SELECT 1
  FROM public.project_category AS existing
  WHERE existing.project_id = project.project_id
    AND existing.category_id = category.category_id
);

INSERT INTO public.project_category (project_id, category_id)
SELECT project.project_id, category.category_id
FROM public.service_project AS project
CROSS JOIN LATERAL (
  SELECT category_id
  FROM public.category
  WHERE name = 'Community Development'
  LIMIT 1
) AS category
WHERE NOT EXISTS (
  SELECT 1
  FROM public.project_category AS existing
  WHERE existing.project_id = project.project_id
);

CREATE TABLE IF NOT EXISTS public.roles (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) UNIQUE NOT NULL,
  role_description TEXT
);

INSERT INTO public.roles (role_name, role_description) VALUES
  ('user', 'Standard user with basic access'),
  ('admin', 'Administrator with full system access')
ON CONFLICT (role_name) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id INTEGER NOT NULL REFERENCES public.roles(role_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.web_sessions (
  session_id TEXT PRIMARY KEY,
  session_data JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS web_sessions_expires_at_idx
  ON public.web_sessions(expires_at);
