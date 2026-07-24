const Track = require('../models/Track.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const getAllTracks = asyncHandler(async (req, res) => {
  const tracks = await Track.find({ isActive: true }).sort({ order: 1 }).populate('topics');
  res.status(200).json(new ApiResponse(200, tracks, 'Tracks retrieved successfully'));
});

const getTrackBySlug = asyncHandler(async (req, res) => {
  const track = await Track.findOne({ slug: req.params.slug, isActive: true }).populate({
    path: 'topics',
    match: { isActive: true },
    options: { sort: { order: 1 } }
  });
  
  if (!track) {
    res.status(404);
    throw new Error('Track not found');
  }

  res.status(200).json(new ApiResponse(200, track, 'Track retrieved successfully'));
});

module.exports = {
  getAllTracks,
  getTrackBySlug
};
