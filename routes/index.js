const router = require('express').Router();

const usersRouter = require('./users');
const moviesRouter = require('./movies');

const NotFoundError = require('../errors/not-found-error');

router.use('/', usersRouter);
router.use('/', moviesRouter);
router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
