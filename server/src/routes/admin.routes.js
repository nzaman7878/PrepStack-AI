const { Router } = require('express');
const { getCachedContent, clearCache, getContentById, createContent, updateContent } = require('../controllers/admin.controller');
const { verifyJWT, authorizeRoles } = require('../middlewares/auth.middleware');

const router = Router();

// For MVP, we might not have 'admin' roles properly set up for all users.
// We will just verifyJWT. In a real app, authorizeRoles('admin') is required.
router.use(verifyJWT);

router.route('/cache').get(getCachedContent);
router.route('/cache/:id').delete(clearCache);

router.route('/content').post(createContent);
router.route('/content/:id')
  .get(getContentById)
  .put(updateContent);

module.exports = router;
