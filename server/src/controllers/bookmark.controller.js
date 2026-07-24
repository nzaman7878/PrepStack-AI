const Bookmark = require('../models/Bookmark.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const getBookmarks = asyncHandler(async (req, res) => {
  // Assuming req.user is populated by auth middleware
  const userId = req.user?._id; 
  
  if (!userId) {
    // For MVP testing, if auth is bypassed, return empty or mock
    return res.status(200).json(new ApiResponse(200, [], 'Bookmarks retrieved'));
  }

  const bookmarks = await Bookmark.find({ user: userId }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, bookmarks, 'Bookmarks retrieved'));
});

const toggleBookmark = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new Error('Not authenticated');

  const { itemType, itemId, slug, title, link } = req.body;
  
  let targetId = itemId;

  if (!targetId && slug && itemType === 'topic') {
    const Topic = require('../models/Topic.model');
    const topic = await Topic.findOne({ slug });
    if (!topic) throw new Error('Topic not found');
    targetId = topic._id;
  }

  if (!targetId) throw new Error('itemId or slug is required');

  const existing = await Bookmark.findOne({ user: userId, itemId: targetId });
  if (existing) {
    await Bookmark.deleteOne({ _id: existing._id });
    return res.status(200).json(new ApiResponse(200, { isBookmarked: false }, 'Bookmark removed'));
  }

  const newBookmark = await Bookmark.create({
    user: userId,
    itemType,
    itemId: targetId,
    notes: JSON.stringify({ title, link }) // Storing metadata in notes for simple UI access
  });

  res.status(201).json(new ApiResponse(201, { isBookmarked: true, bookmark: newBookmark }, 'Bookmark added'));
});

module.exports = {
  getBookmarks,
  toggleBookmark
};
