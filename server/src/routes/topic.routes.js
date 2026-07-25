const { Router } = require('express');
const { getTopicBySlug, getAllTopics, createTopic, updateTopic, deleteTopic } = require('../controllers/topic.controller');
const { verifyJWT } = require('../middlewares/auth.middleware');

const router = Router();

router.route('/').get(getAllTopics);
router.route('/:slug').get(getTopicBySlug);

// Admin routes
router.route('/').post(verifyJWT, createTopic);
router.route('/:id').put(verifyJWT, updateTopic).delete(verifyJWT, deleteTopic);

module.exports = router;
