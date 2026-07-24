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

module.exports = {
  getCachedContent,
  clearCache
};
