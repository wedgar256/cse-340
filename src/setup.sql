CREATE TABLE organization (
  organization_id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
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
  );

CREATE TABLE service_project (
  project_id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organization(organization_id),
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(150) NOT NULL,
  date DATE NOT NULL
);

INSERT INTO service_project (organization_id, title, description, location, date)
VALUES
  (1, 'Community Garden Renewal', 'Prepare growing beds and improve shared garden spaces for neighborhood families.', 'Kampala', '2026-12-05'),
  (2, 'Harvest and Food Drive', 'Harvest seasonal produce and organize donations for local community kitchens.', 'Entebbe', '2026-12-12'),
  (3, 'Community Learning Day', 'Help coordinate a day of learning activities and practical support for local families.', 'Jinja', '2026-12-19');

CREATE TABLE category (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

INSERT INTO category (name) VALUES
  ('Education'),
  ('Food Security'),
  ('Community Development');

CREATE TABLE project_category (
  project_id INTEGER NOT NULL REFERENCES service_project(project_id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES category(category_id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, category_id)
);

INSERT INTO project_category (project_id, category_id) VALUES
  (1, 3),
  (2, 2),
  (3, 1);

CREATE TABLE roles (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) UNIQUE NOT NULL,
  role_description TEXT
);

INSERT INTO roles (role_name, role_description) VALUES
  ('user', 'Standard user with basic access'),
  ('admin', 'Administrator with full system access');

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id INTEGER NOT NULL REFERENCES roles(role_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dedicated grading account: admin@example.com / cse340!
INSERT INTO users (name, email, password_hash, role_id)
SELECT 'Administrator', 'admin@example.com',
       '$2b$10$IkNZdO4mN/X/JpdRLZkV0O6.Cw1zFvCCkmsa019Q3RkA.zAWoS4pO',
       role_id
FROM roles
WHERE role_name = 'admin';
