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

    // Check cache
    if (!forceRegenerate) {
      const cachedContent = await GeneratedContent.findOne({
        topic: topic._id,
        contentType: 'overview',
        difficulty,
      }).sort({ generatedAt: -1 });

      if (cachedContent && cachedContent.cacheStatus !== 'stale') {
        return cachedContent.content;
      }
    }

    // Generate new content
    const trackName = topic.track ? topic.track.name : 'Software Engineering';
    const generationResult = await geminiService.generateTopicContent(topic.name, trackName, difficulty);

    // Save to DB (Cache)
    const newContent = await GeneratedContent.create({
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
      generatedAt: new Date()
    });

    return newContent.content;
  }
}

module.exports = new ContentService();
