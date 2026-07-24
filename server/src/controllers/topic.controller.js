const Topic = require('../models/Topic.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const getTopicBySlug = asyncHandler(async (req, res) => {
  const topic = await Topic.findOne({ slug: req.params.slug, isActive: true }).populate('track');
  
  if (!topic) {
    res.status(404);
    throw new Error('Topic not found');
  }

  res.status(200).json(new ApiResponse(200, topic, 'Topic retrieved successfully'));
});

module.exports = {
  getTopicBySlug
};
