const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');

const { NODE_ENV, JWT_SECRET } = process.env;

// ПОЛУЧИТЬ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
const getCurrentUser = (req, res, next) => {
  const myId = req.user._id;
  User.findById(myId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Невалидный id пользователя'));
      } else {
        next(err);
      }
    });
};

// ОБНОВИТЬ ИНФОРМАЦИЮ О ПОЛЬЗОВАТЕЛЕ
const updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.kind === 'ObjectId') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.name === 'MongoError' || err.code === '11000') {
        next(new ConflictError('Можно вносить изменения только со своего email'));
      } else {
        next(err);
      }
    });
};

// СОЗДАТЬ ПОЛЬЗОВАТЕЛЯ
const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  if (password.length === 0) {
    throw new BadRequestError('Введите пароль');
  }

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => {
      res.status(201).send({ user: user.toJSON() });
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError('Пользователь с данным e-mail уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Передан неверный формат данных'));
      } else {
        next(err);
      }
    });
};

// ЛОГИН
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getCurrentUser,
  updateUserInfo,
  createUser,
  login,
};
