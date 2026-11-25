# W04 Coaching Session: Inserting and Updating Data

## Handling form submissions

The forms submit POST requests to routes in `src/routes.js`. Express parses form fields into `req.body` with `express.urlencoded({ extended: true })` in `server.js`. The route calls an express-validator chain before the matching controller processes the submission.

The project form uses `organizationId`; the project validation chain checks it as a positive integer and converts it with `.toInt()`. The date is checked as a strict ISO date before it is passed to PostgreSQL. Model queries use PostgreSQL parameters such as `$1`, `$2`, and `$3` rather than inserting submitted values into SQL text.

Create and update controllers use these model functions:

| Record | Create | Update |
| --- | --- | --- |
| Service project | `createProject` | `updateProject` |
| Organization | `createOrganization` | `updateOrganization` |
| Category | `createCategory` | `updateCategory` |

Project category assignments use `updateCategoryAssignments` in `src/models/categories.js`.

The form-processing controllers are `processNewProjectForm` and `processEditProjectForm` in `src/controllers/projects.js`, `processNewOrganizationForm` and `processEditOrganizationForm` in `src/controllers/organizations.js`, and `processNewCategoryForm` and `processEditCategoryForm` in `src/controllers/categories.js`. Each controller catches database write errors, saves a flash message, and redirects. Successful writes also save a flash message and redirect, which prevents a browser refresh from repeating the POST.

## Forms for updates and validation

The GET edit controllers load the current record from its model and pass it to the EJS form, so each edit form starts with the saved values. If server-side validation fails, the controller re-renders that form with the submitted `formData` and the validation errors. This preserves the user's entries while showing what needs to be fixed. The form templates escape values when rendering them.

The project validation chain is `projectValidation`; organization forms use `organizationValidation`; category forms use `categoryValidation`. These chains run before the corresponding POST controllers. Invalid submissions do not reach a database write. The forms also use HTML validation attributes such as `required`, `maxlength`, `type="email"`, and `type="date"` for quick browser feedback.

## Sessions and flash messages

`server.js` configures `express-session`, and `src/middleware/flash.js` stores short-lived messages in the session. The shared header calls `flash()` and displays those messages after redirects. Reading the messages removes them from the session so they do not keep appearing on later pages.

## Project file map

- Routes: `src/routes.js`
- Controllers: `src/controllers/projects.js`, `src/controllers/organizations.js`, `src/controllers/categories.js`
- Models and parameterized database queries: `src/models/projects.js`, `src/models/organizations.js`, `src/models/categories.js`
- Forms: `src/views/new-project.ejs`, `src/views/edit-project.ejs`, `src/views/new-organization.ejs`, `src/views/edit-organization.ejs`, `src/views/new-category.ejs`, `src/views/edit-category.ejs`, and `src/views/assign-categories.ejs`
- Session setup and request parsing: `server.js`
- Flash message middleware and shared display: `src/middleware/flash.js` and `src/views/partials/header.ejs`
