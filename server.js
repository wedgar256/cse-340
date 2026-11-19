import express from 'express';
import session from 'express-session';
import { fileURLToPath } from 'url';
import path from 'path';
import 'dotenv/config';
import { testConnection } from './src/models/db.js';
import router from './src/routes.js';
import flashMiddleware from './src/middleware/flash.js';

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
  throw new Error('SESSION_SECRET must be set in the environment.');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

if (NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 30,
    httpOnly: true,
    sameSite: 'lax',
    secure: NODE_ENV === 'production',
  },
}));

app.use(flashMiddleware);

app.use((req, res, next) => {
  if (NODE_ENV === 'development') {
    console.log(`${req.method} ${req.url}`);
  }
  next();
});

app.use((req, res, next) => {
  res.locals.NODE_ENV = NODE_ENV;
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(router);

app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.error('Error occurred:', err.message);
  console.error('Stack trace:', err.stack);

  const status = err.status || 500;
  const template = status === 404 ? '404' : '500';
  const context = {
    title: status === 404 ? 'Page Not Found' : 'Server Error',
    error: err.message,
    stack: err.stack,
  };

  res.status(status).render(`errors/${template}`, context);
});

app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});
