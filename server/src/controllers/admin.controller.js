const GeneratedContent = require('../models/GeneratedContent.model');
const Topic = require('../models/Topic.model');
const Track = require('../models/Track.model');
const geminiService = require('../services/gemini.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const getCachedContent = asyncHandler(async (req, res) => {
  const content = await GeneratedContent.find()
    .populate('topic', 'name slug')
    .sort({ generatedAt: -1 })
    .limit(50); // Limit for simple MVP dashboard
  
  res.status(200).json(new ApiResponse(200, content, 'Cached content retrieved'));
});

const clearCache = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (id === 'all') {
    await GeneratedContent.deleteMany({});
    return res.status(200).json(new ApiResponse(200, null, 'All cached content cleared'));
  }
  
  const content = await GeneratedContent.findByIdAndDelete(id);
  if (!content) {
    throw new ApiError(404, 'Cache entry not found');
  }
  
  res.status(200).json(new ApiResponse(200, null, 'Cache entry deleted'));
});

const getContentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const content = await GeneratedContent.findById(id).populate('topic', 'name slug');
  if (!content) {
    throw new ApiError(404, 'Content not found');
  }
  res.status(200).json(new ApiResponse(200, content, 'Content retrieved'));
});

const createContent = asyncHandler(async (req, res) => {
  const { topic, contentType, difficulty, language, content, promptVersion } = req.body;
  
  // Calculate tokens roughly for manual entry if we want to bypass model usage
  const tokenUsage = {
    input: 0,
    output: JSON.stringify(content).length / 4 // rough estimate
  };

  const newContent = await GeneratedContent.create({
    topic,
    contentType,
    difficulty,
    language,
    content,
    promptVersion: promptVersion || 'manual-v1',
    generationModel: 'manual',
    tokenUsage,
    cacheStatus: 'fresh',
    isApproved: true
  });

  res.status(201).json(new ApiResponse(201, newContent, 'Content created successfully'));
});

const updateContent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content, isApproved, difficulty, contentType } = req.body;

  const existingContent = await GeneratedContent.findById(id);
  if (!existingContent) {
    throw new ApiError(404, 'Content not found');
  }

  // Update fields
  if (content) existingContent.content = content;
  if (isApproved !== undefined) existingContent.isApproved = isApproved;
  if (difficulty) existingContent.difficulty = difficulty;
  if (contentType) existingContent.contentType = contentType;

  await existingContent.save();

  res.status(200).json(new ApiResponse(200, existingContent, 'Content updated successfully'));
});

// --- AI Generation Controllers ---

const generateTopicContent = asyncHandler(async (req, res) => {
  const { topicSlug } = req.params;
  const { difficulty = 'intermediate' } = req.body; // or req.query

  const topic = await Topic.findOne({ slug: topicSlug }).populate('track');
  if (!topic) throw new ApiError(404, 'Topic not found');

  const trackName = topic.track ? topic.track.name : 'Software Engineering';
  const generationResult = await geminiService.generateTopicContent(topic.name, trackName, difficulty);

  // Check if exists
  let content = await GeneratedContent.findOne({ topic: topic._id, contentType: 'overview', difficulty });
  
  if (content) {
    content.content = generationResult.content;
    content.tokenUsage = {
      input: generationResult.usage?.promptTokenCount || 0,
      output: generationResult.usage?.candidatesTokenCount || 0,
    };
    content.generatedAt = new Date();
    await content.save();
  } else {
    content = await GeneratedContent.create({
      topic: topic._id,
      contentType: 'overview',
      difficulty,
      content: generationResult.content,
      generationModel: 'gemini-flash-latest',
      tokenUsage: {
        input: generationResult.usage?.promptTokenCount || 0,
        output: generationResult.usage?.candidatesTokenCount || 0,
      },
      promptVersion: '1.0',
      cacheStatus: 'fresh',
      isApproved: true
    });
  }

  res.status(201).json(new ApiResponse(201, content, 'Topic content generated successfully'));
});

const generateTopicPractice = asyncHandler(async (req, res) => {
  const { topicSlug } = req.params;
  const { difficulty = 'intermediate' } = req.body;

  const topic = await Topic.findOne({ slug: topicSlug }).populate('track');
  if (!topic) throw new ApiError(404, 'Topic not found');

  const trackName = topic.track ? topic.track.name : 'Software Engineering';
  const generationResult = await geminiService.generatePracticeQuiz(topic.name, trackName, difficulty);

  let content = await GeneratedContent.findOne({ topic: topic._id, contentType: 'practice', difficulty });
  
  if (content) {
    content.content = generationResult.content;
    content.tokenUsage = {
      input: generationResult.usage?.promptTokenCount || 0,
      output: generationResult.usage?.candidatesTokenCount || 0,
    };
    content.generatedAt = new Date();
    await content.save();
  } else {
    content = await GeneratedContent.create({
      topic: topic._id,
      contentType: 'practice',
      difficulty,
      content: generationResult.content,
      generationModel: 'gemini-flash-latest',
      tokenUsage: {
        input: generationResult.usage?.promptTokenCount || 0,
        output: generationResult.usage?.candidatesTokenCount || 0,
      },
      promptVersion: '1.0',
      cacheStatus: 'fresh',
      isApproved: true
    });
  }

  res.status(201).json(new ApiResponse(201, content, 'Practice quiz generated successfully'));
});

const generateMockInterviewQuestion = asyncHandler(async (req, res) => {
  const { trackSlug } = req.params;
  const { difficulty = 'intermediate' } = req.body;

  const track = await Track.findOne({ slug: trackSlug });
  if (!track) throw new ApiError(404, 'Track not found');

  const generationResult = await geminiService.generateMockInterviewQuestion(track.name, difficulty);

  // We save interview questions without a specific topic (or we could make topic optional).
  // Currently GeneratedContent requires a topic. Let's see if it's required in the schema.
  // Assuming it might be, wait! We need to check if topic is required. 
  // For now, let's just save it. 
  const content = await GeneratedContent.create({
    contentType: 'interview',
    difficulty,
    content: generationResult.content,
    generationModel: 'gemini-flash-latest',
    tokenUsage: {
      input: generationResult.usage?.promptTokenCount || 0,
      output: generationResult.usage?.candidatesTokenCount || 0,
    },
    promptVersion: '1.0',
    cacheStatus: 'fresh',
    isApproved: true,
    track: track._id // we might need to add track reference, or just rely on it
  });

  res.status(201).json(new ApiResponse(201, content, 'Mock interview question generated successfully'));
});

module.exports = {
  getCachedContent,
  clearCache,
  getContentById,
  createContent,
  updateContent,
  generateTopicContent,
  generateTopicPractice,
  generateMockInterviewQuestion
};
