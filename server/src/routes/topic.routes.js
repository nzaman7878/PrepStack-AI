const { Router } = require('express');
const { getTopicBySlug } = require('../controllers/topic.controller');

const router = Router();

router.route('/:slug').get(getTopicBySlug);

module.exports = router;
