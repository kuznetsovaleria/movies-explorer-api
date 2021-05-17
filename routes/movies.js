const router = require('express').Router();

const {
  getSavedMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

const {
  validateCreateMovie, validateDeleteMovie,
} = require('../middlewares/validations');

const auth = require('../middlewares/auth');

router.use(auth);

router.get('/movies', getSavedMovies);
router.post('/movies', validateCreateMovie, createMovie);
router.delete('/movies/:movieId', validateDeleteMovie, deleteMovie);

module.exports = router;
