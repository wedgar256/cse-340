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

export { getAllCategories, getCategoriesByServiceProjectId, updateCategoryAssignments };
