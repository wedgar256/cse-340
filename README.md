# cse-340

CSE 340 service-project directory built with Express, EJS, and PostgreSQL.

## Database setup

Run `database/setup.sql` against your PostgreSQL `cse340` database to create and seed the `organizations`, `projects`, and `categories` tables. This script drops and recreates those tables before inserting its service-project examples.

The application reads `DATABASE_URL` from the process environment when configured. Without it, it connects to the local `cse340` PostgreSQL database. Database query failures are logged and returned as HTTP 500 responses; list pages do not substitute mock records.

## Run

From this directory, install dependencies with `npm install`, then start the application with `npm start`. The organization, project, and category lists link to their detail pages, and project/category details link to related records.