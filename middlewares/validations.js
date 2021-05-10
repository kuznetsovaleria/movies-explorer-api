const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;
const validator = require('validator');

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required()
      .messages({
        'any.required': 'Поле email должно быть заполнено',
      }),
    password: Joi.string().required().min(8)
      .messages({
        'string.min': 'Минимальная длина пароля - 8 символов',
        'any.required': 'Пароль обязателен',
      }),
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля name - 2',
        'string.max': 'Максимальная длина поля name - 30',
        'any.required': 'Поле name должно быть заполнено',
      }),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required()
      .messages({
        'any.required': 'Поле email должно быть заполнено',
      }),
    password: Joi.string().required().min(8)
      .messages({
        'string.min': 'Минимальная длина пароля - 8 символов',
        'any.required': 'Пароль обязателен',
      }),
  }),
});

const validateGetCurrentUser = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200),
  }).unknown(true),
});

const validateUpdateUserInfo = celebrate({
  body: Joi.object().keys({
    email: Joi.string(),
    name: Joi.string(),
  }),
  headers: Joi.object().keys({
    'content-type': Joi.string().valid('application/json').required(),
    authorization: Joi.string().required().min(2).max(200),
  }).unknown(true),
});

const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле image должно быть валидным url-адресом');
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле trailer должно быть валидным url-адресом');
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Поле thumbnail должно быть валидным url-адресом');
    }),
    movieId: Joi.string().required(),
    nameRu: Joi.string().required().pattern(/^[а-яА-ЯЁё0-9\s]+$/),
    nameEn: Joi.string().required().pattern(/^[a-zA-Z0-9\s]+$/),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required().min(2).max(200),
  }).unknown(true),
});

const validateGetSavedMovies = celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().min(2).max(200),
  }).unknown(true),
});

const validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id фильма');
    }),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required().min(2).max(200),
  }).unknown(true),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateGetCurrentUser,
  validateUpdateUserInfo,
  validateCreateMovie,
  validateGetSavedMovies,
  validateDeleteMovie,
};
