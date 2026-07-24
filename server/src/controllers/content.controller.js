const contentService = require('../services/content.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const getTopicContent = asyncHandler(async (req, res) => {
  const { topicSlug } = req.params;
  const { difficulty = 'intermediate', forceRegenerate = 'false' } = req.query;
  
  const isForceRegenerate = forceRegenerate === 'true';

  const content = await contentService.getTopicContent(topicSlug, difficulty, isForceRegenerate);

  res.status(200).json(new ApiResponse(200, content, 'Topic content retrieved successfully'));
});

module.exports = {
  getTopicContent
};
