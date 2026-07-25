const Track = require('../models/Track.model');
const GeneratedContent = require('../models/GeneratedContent.model');
const geminiService = require('../services/gemini.service');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

const getMockInterviewQuestion = asyncHandler(async (req, res) => {
  const { trackSlug } = req.params;
  const { difficulty = 'intermediate' } = req.query;

  const track = await Track.findOne({ slug: trackSlug });
  if (!track) {
    throw new ApiError(404, 'Track not found');
  }

  // Fetch from DB (we can fetch a random one, or just the most recent for MVP)
  const questions = await GeneratedContent.find({
    track: track._id,
    contentType: 'interview',
    difficulty
  });

  if (!questions || questions.length === 0) {
    throw new ApiError(404, 'Mock interview questions not available yet. Please check back later.');
  }

  // Select a random question
  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

  res.status(200).json(new ApiResponse(200, {
    questionData: randomQuestion.content,
    usage: null // no longer generating on the fly
  }, 'Mock interview question retrieved successfully'));
});

const evaluateMockInterviewAnswer = asyncHandler(async (req, res) => {
  const { question, candidateAnswer, idealAnswer, criteria } = req.body;

  if (!question || !candidateAnswer || !idealAnswer || !criteria) {
    throw new ApiError(400, 'Missing required fields for evaluation');
  }

  const evaluationResult = await geminiService.evaluateInterviewAnswer(
    question,
    candidateAnswer,
    idealAnswer,
    criteria
  );

  res.status(200).json(new ApiResponse(200, {
    evaluation: evaluationResult.content,
    usage: evaluationResult.usage
  }, 'Evaluation complete'));
});

module.exports = {
  getMockInterviewQuestion,
  evaluateMockInterviewAnswer
};
