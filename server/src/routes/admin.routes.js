const { Router } = require('express');
const { getCachedContent, clearCache, getContentById, createContent, updateContent } = require('../controllers/admin.controller');
const { verifyJWT, authorizeRoles } = require('../middlewares/auth.middleware');

const router = Router();

// Require auth and admin role for all admin routes
router.use(verifyJWT);
router.use(authorizeRoles('admin'));

router.route('/cache').get(getCachedContent);
router.route('/cache/:id').delete(clearCache);

router.route('/content').post(createContent);
router.route('/content/:id')
  .get(getContentById)
  .put(updateContent);

const { generateTopicContent, generateTopicPractice, generateMockInterviewQuestion } = require('../controllers/admin.controller');

// AI Generation Routes
router.route('/generate/topic/:topicSlug/overview').post(generateTopicContent);
router.route('/generate/topic/:topicSlug/practice').post(generateTopicPractice);
router.route('/generate/track/:trackSlug/interview').post(generateMockInterviewQuestion);

module.exports = router;
