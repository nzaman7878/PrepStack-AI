const { Router } = require('express');
const { getMockInterviewQuestion, evaluateMockInterviewAnswer } = require('../controllers/interview.controller');
const { verifyJWT } = require('../middlewares/auth.middleware');

const router = Router();

router.use(verifyJWT);

router.route('/:trackSlug/question').get(getMockInterviewQuestion);
router.route('/evaluate').post(evaluateMockInterviewAnswer);

module.exports = router;
