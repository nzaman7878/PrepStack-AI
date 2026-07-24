const { Router } = require('express');
const { getBookmarks, toggleBookmark } = require('../controllers/bookmark.controller');
const { verifyJWT } = require('../middlewares/auth.middleware');

const router = Router();

// In a real app we require auth. For now, we will add the middleware but it might need a mock user if testing without login.
// Assuming we login for Phase 3 testing.
router.use(verifyJWT);

router.route('/')
  .get(getBookmarks)
  .post(toggleBookmark);

module.exports = router;
