const { Router } = require('express');
const { getTopicContent } = require('../controllers/content.controller');
const { verifyJWT } = require('../middlewares/auth.middleware');

const router = Router();

// In MVP, we might allow non-authenticated users to view basic content, 
// but let's require auth for AI generation to protect API costs.
router.use(verifyJWT);

router.route('/:topicSlug/overview').get(getTopicContent);

module.exports = router;
