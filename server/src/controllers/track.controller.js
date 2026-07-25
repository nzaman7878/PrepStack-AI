const Track = require('../models/Track.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const ApiError = require('../utils/ApiError');

const getAllTracks = asyncHandler(async (req, res) => {
  // We can choose to return all tracks for admin, or just active ones. 
  // If there's an isAdmin query or flag, we could fetch all. 
  // For now, let's allow fetching all tracks without filtering by isActive if admin flag is passed,
  // but to keep it simple and not break existing frontend, we fetch all tracks regardless of isActive for admin routes,
  // Actually, let's keep the existing `getAllTracks` behavior, but add an admin specific route or just query params.
  const filter = req.query.all === 'true' ? {} : { isActive: true };
  const tracks = await Track.find(filter).sort({ order: 1 }).populate('topics');
  res.status(200).json(new ApiResponse(200, tracks, 'Tracks retrieved successfully'));
});

const getTrackBySlug = asyncHandler(async (req, res) => {
  const filter = { slug: req.params.slug };
  if (req.query.all !== 'true') filter.isActive = true;
  
  const track = await Track.findOne(filter).populate({
    path: 'topics',
    match: req.query.all === 'true' ? {} : { isActive: true },
    options: { sort: { order: 1 } }
  });
  
  if (!track) {
    throw new ApiError(404, 'Track not found');
  }

  res.status(200).json(new ApiResponse(200, track, 'Track retrieved successfully'));
});

const createTrack = asyncHandler(async (req, res) => {
  const { name, description, category, icon, color, order, isActive, slug: providedSlug } = req.body;
  const slug = providedSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const existingTrack = await Track.findOne({ slug });
  if (existingTrack) {
    throw new ApiError(409, 'Track with this slug already exists');
  }

  const track = await Track.create({
    slug, name, description, category, icon, color, order, isActive
  });

  res.status(201).json(new ApiResponse(201, track, 'Track created successfully'));
});

const updateTrack = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (updateData.name && !updateData.slug) {
    updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  const track = await Track.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!track) {
    throw new ApiError(404, 'Track not found');
  }

  res.status(200).json(new ApiResponse(200, track, 'Track updated successfully'));
});

const deleteTrack = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const track = await Track.findByIdAndDelete(id);

  if (!track) {
    throw new ApiError(404, 'Track not found');
  }

  res.status(200).json(new ApiResponse(200, null, 'Track deleted successfully'));
});

module.exports = {
  getAllTracks,
  getTrackBySlug,
  createTrack,
  updateTrack,
  deleteTrack
};
