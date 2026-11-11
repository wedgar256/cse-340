DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS organizations;

CREATE TABLE organizations (
  organization_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  logo_url TEXT
);

CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE projects (
  project_id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  CONSTRAINT fk_organization
    FOREIGN KEY (organization_id)
    REFERENCES organizations(organization_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_category
    FOREIGN KEY (category_id)
    REFERENCES categories(category_id)
    ON DELETE RESTRICT
);

INSERT INTO organizations (name, description, logo_url) VALUES
  (
    'Northside Community Pantry',
    'Provides groceries and household essentials to families facing food insecurity.',
    '/images/org1.svg'
  ),
  (
    'Harbor House Outreach',
    'Connects neighbors experiencing homelessness with shelter, meals, and support services.',
    '/images/org2.svg'
  ),
  (
    'Bright Futures Learning Center',
    'Offers tutoring, mentoring, and enrichment programs for local students.',
    '/images/org3.svg'
  ),
  (
    'Greenway Neighborhood Coalition',
    'Brings residents together to care for shared outdoor spaces and strengthen neighborhoods.',
    '/images/org1.svg'
  );

INSERT INTO categories (name) VALUES
  ('Food Security'),
  ('Housing and Homelessness'),
  ('Education and Youth'),
  ('Health and Wellness'),
  ('Environmental Stewardship'),
  ('Community Support');

INSERT INTO projects (organization_id, category_id, name, description) VALUES
  (
    1,
    1,
    'Weekly Grocery Box Delivery',
    'Pack and deliver grocery boxes to older adults and families who cannot reach the pantry.'
  ),
  (
    1,
    6,
    'Community Pantry Volunteer Shifts',
    'Welcome visitors, organize donations, and prepare the pantry for its weekly distribution.'
  ),
  (
    2,
    2,
    'Winter Shelter Meal Service',
    'Prepare and serve warm evening meals for guests staying at the seasonal shelter.'
  ),
  (
    2,
    4,
    'Wellness Check-In Program',
    'Make supportive check-in calls and connect shelter guests with local health resources.'
  ),
  (
    3,
    3,
    'After-School Reading Partners',
    'Read with elementary students and help them build confidence and literacy skills.'
  ),
  (
    3,
    6,
    'Youth Mentoring Circle',
    'Lead weekly activities that help young people develop friendships and practical life skills.'
  ),
  (
    4,
    5,
    'Neighborhood Garden Workdays',
    'Maintain shared garden beds and grow fresh produce for nearby community members.'
  ),
  (
    4,
    6,
    'Park and Trail Clean-Up',
    'Remove litter and care for accessible paths in neighborhood parks.'
  );
