const Topic = require('../models/Topic.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const ApiError = require('../utils/ApiError');
const Track = require('../models/Track.model');

const getAllTopics = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isActive: true };
  const topics = await Topic.find(filter).sort({ order: 1 }).populate('track');
  res.status(200).json(new ApiResponse(200, topics, 'Topics retrieved successfully'));
});

const getTopicBySlug = asyncHandler(async (req, res) => {
  const filter = { slug: req.params.slug };
  if (req.query.all !== 'true') filter.isActive = true;

  const topic = await Topic.findOne(filter).populate('track');
  
  if (!topic) {
    throw new ApiError(404, 'Topic not found');
  }

  res.status(200).json(new ApiResponse(200, topic, 'Topic retrieved successfully'));
});

const createTopic = asyncHandler(async (req, res) => {
  const { name, track, difficulty, estimatedTime, order, isActive, tags, slug: providedSlug } = req.body;
  const slug = providedSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const existingTopic = await Topic.findOne({ slug });
  if (existingTopic) {
    throw new ApiError(409, 'Topic with this slug already exists');
  }

  const existingTrack = await Track.findById(track);
  if (!existingTrack) {
    throw new ApiError(404, 'Parent Track not found');
  }

  const topic = await Topic.create({
    slug, name, track, difficulty, estimatedTime, order, isActive, tags
  });

  // Add topic to track
  existingTrack.topics.push(topic._id);
  await existingTrack.save();

  res.status(201).json(new ApiResponse(201, topic, 'Topic created successfully'));
});

const updateTopic = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (updateData.name && !updateData.slug) {
    updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  const existingTopic = await Topic.findById(id);
  if (!existingTopic) {
    throw new ApiError(404, 'Topic not found');
  }

  // Handle track change
  if (updateData.track && updateData.track !== existingTopic.track.toString()) {
    const newTrack = await Track.findById(updateData.track);
    if (!newTrack) {
      throw new ApiError(404, 'New Parent Track not found');
    }
    
    // Remove from old track
    await Track.findByIdAndUpdate(existingTopic.track, {
      $pull: { topics: id }
    });
    
    // Add to new track
    newTrack.topics.push(id);
    await newTrack.save();
  }

  const topic = await Topic.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate('track');

  res.status(200).json(new ApiResponse(200, topic, 'Topic updated successfully'));
});

const deleteTopic = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const topic = await Topic.findByIdAndDelete(id);

  if (!topic) {
    throw new ApiError(404, 'Topic not found');
  }

  // Remove topic from track
  await Track.findByIdAndUpdate(topic.track, {
    $pull: { topics: id }
  });

  res.status(200).json(new ApiResponse(200, null, 'Topic deleted successfully'));
});

module.exports = {
  getAllTopics,
  getTopicBySlug,
  createTopic,
  updateTopic,
  deleteTopic
};
