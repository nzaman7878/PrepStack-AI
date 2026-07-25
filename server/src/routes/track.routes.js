const { Router } = require('express');
const { getAllTracks, getTrackBySlug, createTrack, updateTrack, deleteTrack } = require('../controllers/track.controller');
const { verifyJWT } = require('../middlewares/auth.middleware');

const router = Router();

router.route('/').get(getAllTracks);
router.route('/:slug').get(getTrackBySlug);

// Admin routes
router.route('/').post(verifyJWT, createTrack);
router.route('/:id').put(verifyJWT, updateTrack).delete(verifyJWT, deleteTrack);

module.exports = router;
