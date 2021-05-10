const router = require('express').Router();

const { getCurrentUser, updateUserInfo } = require('../controllers/users');

const { validateGetCurrentUser, validateUpdateUserInfo } = require('../middlewares/validations');

router.get('/users/me', validateGetCurrentUser, getCurrentUser);
router.patch('/users/me', validateUpdateUserInfo, updateUserInfo);

module.exports = router;
