const mongoose = require('mongoose');

const generatedContentSchema = new mongoose.Schema({
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true,
    index: true
  },
  contentType: {
    type: String,
    enum: ['overview', 'interview', 'practice', 'cheatsheet'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  language: {
    type: String,
    default: 'en'
  },
  content: {
    type: mongoose.Schema.Types.Mixed, // Stores the structured JSON from Gemini
    required: true
  },
  promptVersion: {
    type: String,
    required: true
  },
  generationModel: {
    type: String,
    default: 'gemini-3.6-flash'
  },
  tokenUsage: {
    input: Number,
    output: Number
  },
  cacheStatus: {
    type: String,
    enum: ['fresh', 'cached', 'stale'],
    default: 'fresh'
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date // Optional for implementing stale cache regeneration
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Compound index for fast lookup
generatedContentSchema.index({ topic: 1, contentType: 1, difficulty: 1 }, { unique: true });

module.exports = mongoose.model('GeneratedContent', generatedContentSchema);
