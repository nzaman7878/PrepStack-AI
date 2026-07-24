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
    required: true
  },
  track: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track',
    required: true
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

// Ensure one progress record per user per topic
progressSchema.index({ user: 1, topic: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
