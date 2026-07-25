const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  topics: [{
    name: { type: String, required: true },
    slug: { type: String, required: true }, // The AI can generate this slug, mapping to actual Topic if possible
    description: String,
    estimatedTime: String,
    prerequisites: [String],
    resources: [{
      title: String,
      type: { type: String, enum: ['video', 'article', 'course', 'documentation'] },
      url: String
    }],
    topicRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic'
    }
  }]
});

const phaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  milestones: [milestoneSchema]
});

const roadmapSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  phases: [phaseSchema],
  isPublished: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Roadmap', roadmapSchema);
