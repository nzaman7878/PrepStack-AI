const express = require('express');
const {
  getAllRoadmaps,
  getRoadmapBySlug,
  updateRoadmapProgress,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap
} = require('../controllers/roadmap.controller');
const { verifyJWT, authorizeRoles } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public / User routes
router.route('/').get(getAllRoadmaps);
router.route('/:slug').get(getRoadmapBySlug);

// User progress route
router.route('/:roadmapId/progress/:topicSlug').post(verifyJWT, updateRoadmapProgress);

// Admin routes
router.use(verifyJWT, authorizeRoles('admin'));
router.route('/').post(createRoadmap);
router.route('/:id').put(updateRoadmap).delete(deleteRoadmap);

module.exports = router;
