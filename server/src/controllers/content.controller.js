const contentService = require('../services/content.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const getTopicContent = asyncHandler(async (req, res) => {
  const { topicSlug } = req.params;
  const { difficulty = 'intermediate' } = req.query;
  
  // We don't use forceRegenerate anymore from user side, because users are read-only.
  // Admins have a dedicated route to generate content.
  const content = await contentService.getTopicContent(topicSlug, difficulty, false);

  res.status(200).json(new ApiResponse(200, content, 'Topic content retrieved successfully'));
});

module.exports = {
  getTopicContent
};
