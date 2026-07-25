const Topic = require('../models/Topic.model');
const GeneratedContent = require('../models/GeneratedContent.model');
const geminiService = require('./gemini.service');
const ApiError = require('../utils/ApiError');

class ContentService {
  /**
   * Retrieves or generates topic content
   * @param {string} topicSlug 
   * @param {string} difficulty 
   * @param {boolean} forceRegenerate 
   */
  async getTopicContent(topicSlug, difficulty = 'intermediate', forceRegenerate = false) {
    const topic = await Topic.findOne({ slug: topicSlug }).populate('track');
    
    if (!topic) {
      throw new ApiError(404, 'Topic not found');
    }

    const cachedContent = await GeneratedContent.findOne({
      topic: topic._id,
      contentType: 'overview',
      difficulty,
    }).sort({ generatedAt: -1 });

    if (cachedContent && cachedContent.cacheStatus !== 'stale') {
      return cachedContent.content;
    }

    throw new ApiError(404, 'Content not available yet. Please check back later.');
  }
}

module.exports = new ContentService();
