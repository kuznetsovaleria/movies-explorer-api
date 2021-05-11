const router = require('express').Router();

const {
  login, createUser, getCurrentUser, updateUserInfo,
} = require('../controllers/users');

const {
  validateCreateUser, validateLogin, validateUpdateUserInfo,
} = require('../middlewares/validations');

const auth = require('../middlewares/auth');

router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLogin, login);

router.use(auth);

router.get('/users/me', getCurrentUser);
router.patch('/users/me', validateUpdateUserInfo, updateUserInfo);

module.exports = router;
