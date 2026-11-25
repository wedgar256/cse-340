import db from './db.js';

const getAllCategories = async () => {
  const query = `
    SELECT category_id, name
    FROM public.category
    ORDER BY category_id;
  `;

  const result = await db.query(query);
  return result.rows;
};

const getCategoriesByServiceProjectId = async (projectId) => {
  const query = `
    SELECT category.category_id, category.name
    FROM public.category AS category
    INNER JOIN public.project_category AS project_category
      ON project_category.category_id = category.category_id
    WHERE project_category.project_id = $1
    ORDER BY category.category_id;
  `;

  const result = await db.query(query, [projectId]);
  return result.rows;
};

const getProjectsByCategoryId = async (categoryId) => {
  const query = `
    SELECT project.project_id, project.title, project.description, project.location, project.date
    FROM public.service_project AS project
    INNER JOIN public.project_category AS project_category
      ON project_category.project_id = project.project_id
    WHERE project_category.category_id = $1
    ORDER BY project.date, project.project_id;
  `;

  const result = await db.query(query, [categoryId]);
  return result.rows;
};

const getCategoryById = async (categoryId) => {
  const query = `
    SELECT category_id, name
    FROM public.category
    WHERE category_id = $1;
  `;

  const result = await db.query(query, [categoryId]);
  return result.rows[0] || null;
};

const createCategory = async (name) => {
  const query = `
    INSERT INTO public.category (name)
    VALUES ($1)
    RETURNING category_id;
  `;

  const result = await db.query(query, [name]);
  if (result.rows.length === 0) {
    throw new Error('Failed to create category');
  }

  const categoryId = result.rows[0].category_id;
  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Created new category with ID:', categoryId);
  }

  return categoryId;
};

const updateCategory = async (categoryId, name) => {
  const query = `
    UPDATE public.category
    SET name = $1
    WHERE category_id = $2
    RETURNING category_id;
  `;

  const result = await db.query(query, [name, categoryId]);
  return result.rows[0] ? result.rows[0].category_id : null;
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
  const query = `
    WITH removed AS (
      DELETE FROM public.project_category
      WHERE project_id = $1
    )
    INSERT INTO public.project_category (project_id, category_id)
    SELECT $1, selected.category_id
    FROM unnest($2::integer[]) AS selected(category_id);
  `;

  await db.query(query, [projectId, categoryIds]);
};

export {
  getAllCategories,
  getCategoriesByServiceProjectId,
  getProjectsByCategoryId,
  getCategoryById,
  createCategory,
  updateCategory,
  updateCategoryAssignments,
};
