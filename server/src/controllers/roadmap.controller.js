const Roadmap = require('../models/Roadmap.model');
const Topic = require('../models/Topic.model');
const Progress = require('../models/Progress.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

const getAllRoadmaps = asyncHandler(async (req, res) => {
  // Users only see published roadmaps, admin sees all
  const filter = req.user?.role === 'admin' && req.query.all === 'true' ? {} : { isPublished: true };
  const roadmaps = await Roadmap.find(filter).select('-phases.milestones').sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, roadmaps, 'Roadmaps retrieved successfully'));
});

const getRoadmapBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const filter = { slug };
  if (req.user?.role !== 'admin') {
    filter.isPublished = true;
  }

  const roadmap = await Roadmap.findOne(filter).populate({
    path: 'phases.milestones.topics.topicRef',
    select: 'slug name difficulty estimatedTime tags track',
    populate: { path: 'track', select: 'slug' }
  });
  if (!roadmap) {
    throw new ApiError(404, 'Roadmap not found');
  }

  // Get user progress if logged in
  let progressMap = {};
  if (req.user) {
    const progressRecords = await Progress.find({ user: req.user._id, roadmap: roadmap._id });
    progressRecords.forEach(p => {
      progressMap[p.roadmapTopicSlug] = p.status;
    });
  }

  res.status(200).json(new ApiResponse(200, { roadmap, progressMap }, 'Roadmap retrieved successfully'));
});

const createRoadmap = asyncHandler(async (req, res) => {
  const roadmapData = req.body;
  if (!roadmapData.slug) {
    roadmapData.slug = roadmapData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  // Find matching topics by slug and add topicRefs
  if (roadmapData.phases) {
    for (const phase of roadmapData.phases) {
      if (phase.milestones) {
        for (const milestone of phase.milestones) {
          if (milestone.topics) {
            for (const topic of milestone.topics) {
              const existingTopic = await Topic.findOne({ slug: topic.slug });
              if (existingTopic) {
                topic.topicRef = existingTopic._id;
              }
            }
          }
        }
      }
    }
  }

  const roadmap = await Roadmap.create(roadmapData);
  res.status(201).json(new ApiResponse(201, roadmap, 'Roadmap created successfully'));
});

const updateRoadmap = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  if (updateData.title && !updateData.slug) {
    updateData.slug = updateData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  if (updateData.phases) {
    for (const phase of updateData.phases) {
      if (phase.milestones) {
        for (const milestone of phase.milestones) {
          if (milestone.topics) {
            for (const topic of milestone.topics) {
              if (topic.slug && !topic.topicRef) {
                const existingTopic = await Topic.findOne({ slug: topic.slug });
                if (existingTopic) {
                  topic.topicRef = existingTopic._id;
                }
              }
            }
          }
        }
      }
    }
  }

  const roadmap = await Roadmap.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
  if (!roadmap) {
    throw new ApiError(404, 'Roadmap not found');
  }

  res.status(200).json(new ApiResponse(200, roadmap, 'Roadmap updated successfully'));
});

const deleteRoadmap = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const roadmap = await Roadmap.findByIdAndDelete(id);
  if (!roadmap) {
    throw new ApiError(404, 'Roadmap not found');
  }
  res.status(200).json(new ApiResponse(200, null, 'Roadmap deleted successfully'));
});

const updateRoadmapProgress = asyncHandler(async (req, res) => {
  const { roadmapId, topicSlug } = req.params;
  const { status } = req.body; // 'completed', 'in_progress', 'not_started'
  
  const roadmap = await Roadmap.findById(roadmapId);
  if (!roadmap) throw new ApiError(404, 'Roadmap not found');
  
  // Find topic in roadmap to get its ref if it has one
  let topicRef = null;
  for (const phase of roadmap.phases) {
    for (const milestone of phase.milestones) {
      const foundTopic = milestone.topics.find(t => t.slug === topicSlug);
      if (foundTopic && foundTopic.topicRef) {
        topicRef = foundTopic.topicRef;
        break;
      }
    }
    if (topicRef) break;
  }

  let progress = await Progress.findOne({ user: req.user._id, roadmap: roadmapId, roadmapTopicSlug: topicSlug });
  
  if (progress) {
    progress.status = status;
    if (topicRef) progress.topic = topicRef;
    await progress.save();
  } else {
    progress = await Progress.create({
      user: req.user._id,
      roadmap: roadmapId,
      roadmapTopicSlug: topicSlug,
      topic: topicRef,
      status
    });
  }
  
  res.status(200).json(new ApiResponse(200, progress, 'Progress updated'));
});

module.exports = {
  getAllRoadmaps,
  getRoadmapBySlug,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
  updateRoadmapProgress
};
