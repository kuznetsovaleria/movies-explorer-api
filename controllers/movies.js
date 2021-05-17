const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');

// ПОЛУЧИТЬ ВСЕ СОХРАНЁННЫЕ ФИЛЬМЫ
const getSavedMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => {
      if (!movies) {
        throw new NotFoundError('Фильм не найден');
      }
      res.status(200).send(movies);
    })
    .catch(next);
};

// СОЗДАТЬ ФИЛЬМ
const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// УДАЛИТЬ ФИЛЬМ ИЗ СОХРАНЁННЫХ
const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }
      if (movie.owner.equals(req.user._id)) {
        movie.remove()
          .then(() => {
            res.status(200).send({ message: 'Фильм удалён из сохранённых' });
          })
          .catch(next);
      } else {
        next(new ForbiddenError('Можно удалять только свои сохранённые фильмы'));
      }
    })
    // .then((movie) => {
    //   if (!movie) {
    //     throw new NotFoundError('Фильм не найден');
    //   }
    //   if (movie.owner.equals(req.user._id)) {
    //     Movie.findByIdAndRemove(movieId)
    //       .then(() => {
    //         res.status(200).send({ message: 'Фильм удалён из сохранённых' });
    //       })
    //       .catch(next);
    //   } else {
    //     next(new ForbiddenError('Можно удалять только свои сохранённые фильмы'));
    //   }
    // })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Невалидный id фильма'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getSavedMovies,
  createMovie,
  deleteMovie,
};
