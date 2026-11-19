const flashMiddleware = (req, res, next) => {
  req.flash = (...args) => {
    const storedMessages = req.session.flash || {};

    if (args.length === 0) {
      delete req.session.flash;
      return storedMessages;
    }

    const [type, message] = args;
    if (typeof type !== 'string' || type.length === 0) {
      throw new TypeError('A flash message type is required.');
    }

    if (args.length === 1) {
      const messages = storedMessages[type] || [];
      if (req.session.flash) {
        delete req.session.flash[type];
      }
      return messages;
    }

    if (typeof message !== 'string') {
      throw new TypeError('A flash message must be a string.');
    }

    if (!req.session.flash) {
      req.session.flash = {};
    }
    if (!req.session.flash[type]) {
      req.session.flash[type] = [];
    }
    req.session.flash[type].push(message);
    return req.session.flash[type].length;
  };

  res.locals.flash = req.flash;
  next();
};

export default flashMiddleware;
