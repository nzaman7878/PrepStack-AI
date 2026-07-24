const ai = require('../config/gemini.config');
const { buildTopicPrompt } = require('../prompts/topicContent.prompt');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const env = require('../config/env.config');

class GeminiService {
  /**
   * Generates structured learning content for a given topic
   * @param {string} topicName 
   * @param {string} trackName 
   * @param {string} difficulty 
   * @returns {Promise<Object>} The generated JSON content
   */
  async generateTopicContent(topicName, trackName, difficulty) {
    if (!env.geminiApiKey) {
      throw new ApiError(500, 'Gemini API key is not configured');
    }

    try {
      const prompt = buildTopicPrompt(topicName, trackName, difficulty);
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        }
      });

      const jsonText = response.text;
      
      try {
        const parsedData = JSON.parse(jsonText);
        return {
          content: parsedData,
          usage: response.usageMetadata
        };
      } catch (parseError) {
        logger.error(`Failed to parse Gemini response as JSON: ${jsonText}`);
        throw new ApiError(500, 'Failed to parse AI generated content');
      }
    } catch (error) {
      logger.error(`Gemini API Error: ${error.message}`);
      throw new ApiError(500, 'Error generating AI content');
    }
  }
}

module.exports = new GeminiService();
