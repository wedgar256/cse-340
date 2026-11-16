# cse-340

CSE 340 service-project directory built with Express, EJS, and PostgreSQL.

## Database setup

Run `database/setup.sql` against your PostgreSQL `cse340` database to create and seed the `organizations`, `projects`, and `categories` tables. This script drops and recreates those tables before inserting its service-project examples.

The application reads `DATABASE_URL` from the process environment when configured. Without it, it connects to the local `cse340` PostgreSQL database. Database query failures are logged and returned as HTTP 500 responses; list pages do not substitute mock records.

## Features

- **Create**: GET/POST routes for organizations, projects, and categories with parameterized inserts, flash messages, and redirect-on-success.
- **Edit**: GET routes load a record by ID into a pre-populated form; POST routes validate, update, flash, and redirect.
- **Assign categories**: the project detail page links to a checkbox view that pre-checks current assignments and rewrites the `project_categories` junction table in a transaction.
- **Validation**: express-validator rules run server-side on every create/update POST; forms also use HTML5 `required`, `maxlength`, and `pattern` attributes. Failed validation re-renders the form (HTTP 422) with error messages and the user's input preserved.

## Run

From this directory, install dependencies with `npm install`, then start the application with `npm start`. The organization, project, and category lists link to their detail pages, and project/category details link to related records.

## Deploy on Render

1. Push this repository to GitHub.
2. Create a **Web Service** on Render and point it at the repository (this directory is the repository root).
3. Render detects Node automatically: build command `npm install`, start command `npm start` (from `package.json`).
4. Set environment variables:
   - `DATABASE_URL` — your PostgreSQL connection string (Render PostgreSQL or an external provider).
   - `SESSION_SECRET` — any long random string.
   - `NODE_ENV` = `production` (Render sets this by default; it enables SSL for the database connection).
5. Run `database/setup.sql` against that database once to create and seed the tables.
