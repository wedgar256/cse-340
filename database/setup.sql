DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS organizations;
DROP TABLE IF EXISTS categories;

CREATE TABLE organizations (
  organization_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  logo_url TEXT
);

CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE projects (
  project_id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL,
  category_id INTEGER,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  CONSTRAINT fk_organization
    FOREIGN KEY (organization_id)
    REFERENCES organizations(organization_id),
  CONSTRAINT fk_category
    FOREIGN KEY (category_id)
    REFERENCES categories(category_id)
);

INSERT INTO organizations (name, logo_url) VALUES
  ('Tech Innovators', '/images/org1.svg'),
  ('Community Builders', '/images/org2.svg'),
  ('Green Energy Corp', '/images/org3.svg');

INSERT INTO categories (name) VALUES
  ('Software Development'),
  ('Database Administration'),
  ('UI/UX Design'),
  ('System Architecture');

INSERT INTO projects (organization_id, category_id, name, description) VALUES
  (1, 1, 'Project Alpha', 'Inventory Management System'),
  (2, 2, 'Project Beta', 'Dynamic Database Dashboard'),
  (3, 3, 'Project Gamma', 'User Authentication Portal');
