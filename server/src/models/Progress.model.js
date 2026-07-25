const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: false
  },
  track: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track',
    required: false
  },
  roadmap: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roadmap',
    required: false
  },
  // If roadmap is provided but not topic/track, we might just be tracking overall roadmap progress or a specific roadmap string topic
  roadmapTopicSlug: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  completionPercentage: {
    type: Number,
    default: 0
  },
  quizScore: {
    type: Number
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  milestones: [{
    type: { type: String }, // e.g., 'quiz_passed', 'code_challenge_solved'
    achievedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Ensure one progress record per user per topic or roadmap topic
progressSchema.index({ user: 1, topic: 1 }, { unique: true, partialFilterExpression: { topic: { $exists: true } } });
progressSchema.index({ user: 1, roadmap: 1, roadmapTopicSlug: 1 }, { unique: true, partialFilterExpression: { roadmap: { $exists: true }, roadmapTopicSlug: { $exists: true } } });

module.exports = mongoose.model('Progress', progressSchema);
