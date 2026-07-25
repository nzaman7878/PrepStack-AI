const GeneratedContent = require('../models/GeneratedContent.model');
const Topic = require('../models/Topic.model');
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

module.exports = {
  getCachedContent,
  clearCache,
  getContentById,
  createContent,
  updateContent
};
