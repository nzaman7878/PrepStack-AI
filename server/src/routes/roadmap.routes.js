const express = require('express');
const {
  getAllRoadmaps,
  getRoadmapBySlug,
  updateRoadmapProgress,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap
} = require('../controllers/roadmap.controller');
const { verifyJWT, authorizeRoles, optionalVerifyJWT } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public / User routes (with optional auth to detect admins)
router.route('/').get(optionalVerifyJWT, getAllRoadmaps);
router.route('/:slug').get(optionalVerifyJWT, getRoadmapBySlug);

// User progress route
router.route('/:roadmapId/progress/:topicSlug').post(verifyJWT, updateRoadmapProgress);

// Admin routes
router.use(verifyJWT, authorizeRoles('admin'));
router.route('/').post(createRoadmap);
router.route('/:id').put(updateRoadmap).delete(deleteRoadmap);

module.exports = router;
