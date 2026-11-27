-- Run this against an existing course database to add Week 5 authentication.
-- Safe to run again: existing roles are updated in place.

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

CREATE TABLE IF NOT EXISTS public.web_sessions (
  session_id TEXT PRIMARY KEY,
  session_data JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS web_sessions_expires_at_idx
  ON public.web_sessions(expires_at);
