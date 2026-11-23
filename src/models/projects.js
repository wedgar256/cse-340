import db from './db.js';

const getAllProjects = async () => {
  const query = `
    SELECT project_id, organization_id, title, description, location, date
    FROM public.service_project
    ORDER BY date;
  `;

  const result = await db.query(query);
  return result.rows;
};

const getProjectDetails = async (projectId) => {
  const query = `
    SELECT
      project.project_id,
      project.organization_id,
      project.title,
      project.description,
      project.location,
      project.date,
      organization.name AS organization_name
    FROM public.service_project AS project
    INNER JOIN public.organization AS organization
      ON organization.organization_id = project.organization_id
    WHERE project.project_id = $1;
  `;

  const result = await db.query(query, [projectId]);
  return result.rows[0] || null;
};

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
    SELECT project_id, organization_id, title, description, location, date
    FROM public.service_project
    WHERE organization_id = $1
    ORDER BY date;
  `;

  const result = await db.query(query, [organizationId]);
  return result.rows;
};

const createProject = async (title, description, location, date, organizationId) => {
  const query = `
    INSERT INTO public.service_project (title, description, location, date, organization_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id;
  `;

  const result = await db.query(query, [title, description, location, date, organizationId]);
  if (result.rows.length === 0) {
    throw new Error('Failed to create project');
  }

  const projectId = result.rows[0].project_id;
  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Created new project with ID:', projectId);
  }

  return projectId;
};

const updateProject = async (projectId, title, description, location, date, organizationId) => {
  const query = `
    UPDATE public.service_project
    SET title = $1,
        description = $2,
        location = $3,
        date = $4,
        organization_id = $5
    WHERE project_id = $6
    RETURNING project_id;
  `;

  const result = await db.query(query, [
    title,
    description,
    location,
    date,
    organizationId,
    projectId,
  ]);
  return result.rows[0] ? result.rows[0].project_id : null;
};

export { getAllProjects, getProjectDetails, getProjectsByOrganizationId, createProject, updateProject };
