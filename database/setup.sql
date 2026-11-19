DROP TABLE IF EXISTS project_categories;
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
  name VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(150) NOT NULL DEFAULT '',
  date DATE,
  CONSTRAINT fk_organization
    FOREIGN KEY (organization_id)
    REFERENCES organizations(organization_id)
    ON DELETE CASCADE
);

CREATE TABLE project_categories (
  project_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  PRIMARY KEY (project_id, category_id),
  CONSTRAINT fk_pc_project
    FOREIGN KEY (project_id)
    REFERENCES projects(project_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_pc_category
    FOREIGN KEY (category_id)
    REFERENCES categories(category_id)
    ON DELETE CASCADE
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

INSERT INTO projects (organization_id, name, description, location, date) VALUES
  (
    1,
    'Weekly Grocery Box Delivery',
    'Pack and deliver grocery boxes to older adults and families who cannot reach the pantry.',
    'Northside Community Center',
    '2026-01-10'
  ),
  (
    1,
    'Community Pantry Volunteer Shifts',
    'Welcome visitors, organize donations, and prepare the pantry for its weekly distribution.',
    'Northside Community Pantry',
    '2026-01-17'
  ),
  (
    1,
    'Weekend Produce Market',
    'Set up and run the weekend produce market so fresh food stays affordable for every household.',
    'Northside Market Hall',
    '2026-02-07'
  ),
  (
    1,
    'Senior Meal Box Packing',
    'Assemble meal boxes for homebound seniors and coordinate same-day delivery routes.',
    'Northside Community Center',
    '2026-02-14'
  ),
  (
    1,
    'Spring Food Drive Sorting Day',
    'Sort, inventory, and shelve donations collected during the spring neighborhood food drive.',
    'Northside Warehouse',
    '2026-03-03'
  ),
  (
    2,
    'Winter Shelter Meal Service',
    'Prepare and serve warm evening meals for guests staying at the seasonal shelter.',
    'Harbor House Shelter',
    '2026-01-12'
  ),
  (
    2,
    'Wellness Check-In Program',
    'Make supportive check-in calls and connect shelter guests with local health resources.',
    'Harbor House Outreach Office',
    '2026-01-26'
  ),
  (
    2,
    'Move-In Kit Assembly',
    'Build starter kits of bedding, hygiene items, and kitchen supplies for newly housed neighbors.',
    'Harbor House Warehouse',
    '2026-02-09'
  ),
  (
    2,
    'Housing Resource Fair',
    'Host landlords, caseworkers, and legal aid volunteers for a one-day housing resource fair.',
    'Harbor House Shelter',
    '2026-02-23'
  ),
  (
    2,
    'Overnight Volunteer Training',
    'Train new overnight volunteers on intake procedures, boundaries, and emergency response.',
    'Harbor House Shelter',
    '2026-03-10'
  ),
  (
    3,
    'After-School Reading Partners',
    'Read with elementary students and help them build confidence and literacy skills.',
    'Bright Futures Learning Center',
    '2026-01-13'
  ),
  (
    3,
    'Youth Mentoring Circle',
    'Lead weekly activities that help young people develop friendships and practical life skills.',
    'Bright Futures Learning Center',
    '2026-01-27'
  ),
  (
    3,
    'Homework Help Lab',
    'Staff an after-school lab where students get one-on-one help with homework and study skills.',
    'Bright Futures Learning Center',
    '2026-02-10'
  ),
  (
    3,
    'Summer Reading Kickoff',
    'Launch the summer reading program with sign-ups, book giveaways, and reading challenges.',
    'Bright Futures Library Room',
    '2026-02-24'
  ),
  (
    3,
    'STEM Discovery Saturday',
    'Run hands-on science and engineering activities for students and their families.',
    'Bright Futures Learning Center',
    '2026-03-07'
  ),
  (
    4,
    'Neighborhood Garden Workdays',
    'Maintain shared garden beds and grow fresh produce for nearby community members.',
    'Greenway Community Garden',
    '2026-01-17'
  ),
  (
    4,
    'Park and Trail Clean-Up',
    'Remove litter and care for accessible paths in neighborhood parks.',
    'Greenway Riverside Park',
    '2026-02-01'
  ),
  (
    4,
    'Tree Planting Weekend',
    'Plant native trees along the hillside trail and mulch seedlings planted last season.',
    'Greenway Hillside Trail',
    '2026-02-21'
  ),
  (
    4,
    'Compost Workshop',
    'Teach residents how to start and maintain a backyard compost bin.',
    'Greenway Community Garden',
    '2026-03-07'
  ),
  (
    4,
    'Creek Restoration Day',
    'Remove invasive plants and restore native habitat along the creek path.',
    'Greenway Creek Path',
    '2026-03-21'
  );

INSERT INTO project_categories (project_id, category_id) VALUES
  (1, 1),
  (1, 6),
  (2, 6),
  (2, 1),
  (3, 1),
  (4, 1),
  (4, 4),
  (5, 6),
  (5, 1),
  (6, 2),
  (6, 4),
  (7, 4),
  (7, 6),
  (8, 2),
  (8, 6),
  (9, 2),
  (9, 6),
  (10, 2),
  (11, 3),
  (12, 3),
  (12, 6),
  (13, 3),
  (14, 3),
  (14, 1),
  (15, 3),
  (15, 5),
  (16, 5),
  (16, 6),
  (17, 5),
  (17, 6),
  (18, 5),
  (19, 5),
  (19, 3),
  (20, 5),
  (20, 4);
