import session from 'express-session';

const getExpiration = (sessionData) => {
  if (sessionData.cookie?.expires) {
    return new Date(sessionData.cookie.expires);
  }

  const maxAge = sessionData.cookie?.originalMaxAge;
  return new Date(Date.now() + (Number.isFinite(maxAge) && maxAge > 0 ? maxAge : 86400000));
};

class PostgresSessionStore extends session.Store {
  constructor(database) {
    super();
    this.database = database;
  }

  get(sessionId, callback) {
    const query = `
      SELECT session_data
      FROM public.web_sessions
      WHERE session_id = $1 AND expires_at > NOW();
    `;

    this.database.query(query, [sessionId]).then(
      ({ rows }) => callback(null, rows[0]?.session_data || null),
      callback,
    );
  }

  set(sessionId, sessionData, callback) {
    const cleanupQuery = 'DELETE FROM public.web_sessions WHERE expires_at <= NOW();';
    const upsertQuery = `
      INSERT INTO public.web_sessions (session_id, session_data, expires_at)
      VALUES ($1, $2::jsonb, $3)
      ON CONFLICT (session_id) DO UPDATE
      SET session_data = EXCLUDED.session_data,
          expires_at = EXCLUDED.expires_at;
    `;

    this.database.query(cleanupQuery)
      .then(() => this.database.query(upsertQuery, [
        sessionId,
        JSON.stringify(sessionData),
        getExpiration(sessionData),
      ]))
      .then(() => callback(null), callback);
  }

  destroy(sessionId, callback) {
    this.database.query(
      'DELETE FROM public.web_sessions WHERE session_id = $1;',
      [sessionId],
    ).then(() => callback(null), callback);
  }

  touch(sessionId, sessionData, callback) {
    const query = `
      UPDATE public.web_sessions
      SET expires_at = $2
      WHERE session_id = $1;
    `;

    this.database.query(query, [sessionId, getExpiration(sessionData)])
      .then(() => callback(null), callback);
  }
}

export default PostgresSessionStore;
