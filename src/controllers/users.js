import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { authenticateUser, createUser, getAllUsers } from '../models/users.js';

const registrationValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.')
    .bail().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),
  body('email').trim().isEmail().withMessage('Enter a valid email address.')
    .bail().isLength({ max: 100 }).withMessage('Email must be 100 characters or fewer.')
    .normalizeEmail(),
  body('password').isLength({ min: 8, max: 72 })
    .withMessage('Password must be between 8 and 72 characters.'),
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
];

const showUserRegistrationForm = (req, res) => {
  res.render('register', {
    title: 'Create an Account',
    formData: {},
    errors: [],
  });
};

const processUserRegistrationForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('register', {
      title: 'Create an Account',
      formData: { name: req.body.name || '', email: req.body.email || '' },
      errors: errors.array(),
    });
  }

  try {
    const { name, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    await createUser(name, email, passwordHash);
    req.flash('success', 'Registration successful. You can now log in.');
    return res.redirect('/login');
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).render('register', {
        title: 'Create an Account',
        formData: { name: req.body.name || '', email: req.body.email || '' },
        errors: [{ msg: 'An account with that email already exists.' }],
      });
    }
    throw error;
  }
};

const showLoginForm = (req, res) => {
  if (req.query.loggedOut === '1') req.flash('success', 'You have been logged out.');
  res.render('login', { title: 'Log In', formData: {}, errors: [] });
};

const processLoginForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('login', {
      title: 'Log In',
      formData: { email: req.body.email || '' },
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;
  const user = await authenticateUser(email, password);
  if (!user) {
    return res.status(401).render('login', {
      title: 'Log In',
      formData: { email },
      errors: [{ msg: 'Invalid email or password.' }],
    });
  }

  req.session.user = user;
  req.flash('success', 'Login successful.');
  return res.redirect('/dashboard');
};

const processLogout = (req, res, next) => {
  if (!req.session) return res.redirect('/login?loggedOut=1');
  req.session.destroy((error) => {
    if (error) return next(error);
    res.clearCookie('connect.sid');
    return res.redirect('/login?loggedOut=1');
  });
};

const requireLogin = (req, res, next) => {
  if (!req.session?.user) {
    req.flash('error', 'Please log in to view that page.');
    return res.redirect('/login');
  }
  next();
};

const requireRole = (role) => (req, res, next) => {
  if (!req.session?.user) {
    req.flash('error', 'Please log in to view that page.');
    return res.redirect('/login');
  }
  if (req.session.user.role_name !== role) {
    req.flash('error', 'You do not have permission to view that page.');
    return res.redirect('/dashboard');
  }
  next();
};

const showDashboard = (req, res) => {
  const { name, email } = req.session.user;
  res.render('dashboard', { title: 'Dashboard', name, email });
};

const showUsersPage = async (req, res) => {
  const users = await getAllUsers();
  res.render('users', { title: 'Registered Users', users });
};

export {
  registrationValidation,
  loginValidation,
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  requireRole,
  showDashboard,
  showUsersPage,
};
