const { GoogleGenAI } = require('@google/genai');
const env = require('./env.config');
const logger = require('../utils/logger');

if (!env.geminiApiKey) {
  logger.warn('GEMINI_API_KEY is not defined in environment variables. AI features will not work.');
}

const ai = new GoogleGenAI({ apiKey: env.geminiApiKey });

module.exports = ai;
