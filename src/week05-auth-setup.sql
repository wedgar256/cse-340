-- Run this against an existing course database to add Week 5 authentication.
-- Safe to run again: existing roles and the admin account are updated in place.

CREATE TABLE IF NOT EXISTS public.roles (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) UNIQUE NOT NULL,
  role_description TEXT
);

INSERT INTO public.roles (role_name, role_description) VALUES
  ('user', 'Standard user with basic access'),
  ('admin', 'Administrator with full system access')
ON CONFLICT (role_name) DO UPDATE
SET role_description = EXCLUDED.role_description;

CREATE TABLE IF NOT EXISTS public.users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id INTEGER NOT NULL REFERENCES public.roles(role_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grading account: admin@example.com / cse340!
INSERT INTO public.users (name, email, password_hash, role_id)
SELECT
  'Administrator',
  'admin@example.com',
  '$2b$10$IkNZdO4mN/X/JpdRLZkV0O6.Cw1zFvCCkmsa019Q3RkA.zAWoS4pO',
  role_id
FROM public.roles
WHERE role_name = 'admin'
ON CONFLICT (email) DO UPDATE
SET name = EXCLUDED.name,
    password_hash = EXCLUDED.password_hash,
    role_id = EXCLUDED.role_id;
