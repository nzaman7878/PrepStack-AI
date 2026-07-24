const { Router } = require('express');
const { getAllTracks, getTrackBySlug } = require('../controllers/track.controller');

const router = Router();

router.route('/').get(getAllTracks);
router.route('/:slug').get(getTrackBySlug);

module.exports = router;
