const { Router } = require('express');
const { register, login, logout, refresh, getMe, updateProfile, getStats } = require('../controllers/auth.controller');
const { verifyJWT } = require('../middlewares/auth.middleware');

const router = Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(verifyJWT, logout);
router.route('/refresh').post(refresh);
router.route('/me').get(verifyJWT, getMe);
router.route('/me').put(verifyJWT, updateProfile);
router.route('/stats').get(verifyJWT, getStats);

module.exports = router;
