const Topic = require('../models/Topic.model');
const GeneratedContent = require('../models/GeneratedContent.model');
const geminiService = require('../services/gemini.service');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const getPracticeQuiz = asyncHandler(async (req, res) => {
  const { topicSlug } = req.params;
  const { difficulty = 'intermediate', forceRegenerate = 'false' } = req.query;
  const isForceRegenerate = forceRegenerate === 'true';

  const topic = await Topic.findOne({ slug: topicSlug }).populate('track');
  if (!topic) {
    throw new ApiError(404, 'Topic not found');
  }

  // Check cache
  if (!isForceRegenerate) {
    const cachedContent = await GeneratedContent.findOne({
      topic: topic._id,
      contentType: 'practice_quiz',
      difficulty,
    }).sort({ generatedAt: -1 });

    if (cachedContent && cachedContent.cacheStatus !== 'stale') {
      return res.status(200).json(new ApiResponse(200, cachedContent.content, 'Practice quiz retrieved successfully'));
    }
  }

  // Generate new content
  const trackName = topic.track ? topic.track.name : 'Software Engineering';
  const generationResult = await geminiService.generatePracticeQuiz(topic.name, trackName, difficulty);

  // Cache it
  const newContent = await GeneratedContent.create({
    topic: topic._id,
    contentType: 'practice_quiz',
    difficulty,
    content: generationResult.content,
    generationModel: 'gemini-2.5-flash',
    tokenUsage: {
      input: generationResult.usage?.promptTokenCount || 0,
      output: generationResult.usage?.candidatesTokenCount || 0,
    },
    cacheStatus: 'fresh',
    generatedAt: new Date()
  });

  res.status(200).json(new ApiResponse(200, newContent.content, 'Practice quiz generated successfully'));
});

module.exports = { getPracticeQuiz };
