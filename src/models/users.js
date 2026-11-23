import bcrypt from 'bcryptjs';
import db from './db.js';

const findUserByEmail = async (email) => {
  const query = `
    SELECT users.user_id, users.name, users.email, users.password_hash, roles.role_name
    FROM public.users AS users
    INNER JOIN public.roles AS roles ON roles.role_id = users.role_id
    WHERE users.email = $1;
  `;
  const result = await db.query(query, [email]);
  return result.rows[0] || null;
};

const createUser = async (name, email, passwordHash) => {
  const query = `
    INSERT INTO public.users (name, email, password_hash, role_id)
    SELECT $1, $2, $3, role_id
    FROM public.roles
    WHERE role_name = 'user'
    RETURNING user_id;
  `;
  const result = await db.query(query, [name, email, passwordHash]);
  if (!result.rows[0]) throw new Error('The standard user role is missing.');
  return result.rows[0].user_id;
};

const authenticateUser = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) return null;
  const { password_hash, ...safeUser } = user;
  return safeUser;
};

const getAllUsers = async () => {
  const query = `
    SELECT users.user_id, users.name, users.email, roles.role_name
    FROM public.users AS users
    INNER JOIN public.roles AS roles ON roles.role_id = users.role_id
    ORDER BY users.name, users.email;
  `;
  const result = await db.query(query);
  return result.rows;
};

export { createUser, authenticateUser, getAllUsers };
