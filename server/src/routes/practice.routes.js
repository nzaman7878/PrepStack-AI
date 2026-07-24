const { Router } = require('express');
const { getPracticeQuiz } = require('../controllers/practice.controller');
const { verifyJWT } = require('../middlewares/auth.middleware');

const router = Router();

router.use(verifyJWT);

router.route('/:topicSlug/quiz').get(getPracticeQuiz);

module.exports = router;
