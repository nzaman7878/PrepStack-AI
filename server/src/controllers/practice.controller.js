const Topic = require('../models/Topic.model');
const GeneratedContent = require('../models/GeneratedContent.model');
const geminiService = require('../services/gemini.service');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const getPracticeQuiz = asyncHandler(async (req, res) => {
  const { topicSlug } = req.params;
  const { difficulty = 'intermediate' } = req.query;

  const topic = await Topic.findOne({ slug: topicSlug }).populate('track');
  if (!topic) {
    throw new ApiError(404, 'Topic not found');
  }

  // Check DB
  const cachedContent = await GeneratedContent.findOne({
    topic: topic._id,
    contentType: 'practice',
    difficulty,
  }).sort({ generatedAt: -1 });

  if (cachedContent && cachedContent.cacheStatus !== 'stale') {
    return res.status(200).json(new ApiResponse(200, cachedContent.content, 'Practice quiz retrieved successfully'));
  }

  throw new ApiError(404, 'Practice quiz not available yet. Please check back later.');
});

module.exports = { getPracticeQuiz };
