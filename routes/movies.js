const router = require('express').Router();

const {
  getSavedMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

const {
  validateGetSavedMovies, validateCreateMovie, validateDeleteMovie,
} = require('../middlewares/validations');

router.get('/movies', validateGetSavedMovies, getSavedMovies);
router.post('/movies', validateCreateMovie, createMovie);
router.delete('/movies/:movieId', validateDeleteMovie, deleteMovie);

module.exports = router;
