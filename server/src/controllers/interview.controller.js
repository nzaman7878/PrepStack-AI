const Track = require('../models/Track.model');
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

  // Generate question on the fly (no need to cache, it should be varied)
  const generationResult = await geminiService.generateMockInterviewQuestion(track.name, difficulty);

  // Return generated content along with usage
  res.status(200).json(new ApiResponse(200, {
    questionData: generationResult.content,
    usage: generationResult.usage
  }, 'Mock interview question generated successfully'));
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
