const buildMockInterviewPrompt = (trackName, difficulty) => `
You are a senior technical interviewer conducting a mock interview for a "${trackName}" role.
Difficulty level: ${difficulty}.

Generate 1 challenging interview question that tests conceptual understanding or problem-solving skills.
Return ONLY valid JSON matching this schema exactly:
{
  "question": "string",
  "idealAnswer": "string",
  "evaluationCriteria": ["string", "string", "string"]
}

Rules:
1. No markdown wrappers. Return JSON only.
2. "idealAnswer" should be what a strong candidate would say.
3. "evaluationCriteria" should be 3 key things to look for in the candidate's answer.
`;

const buildInterviewFeedbackPrompt = (question, candidateAnswer, idealAnswer, criteria) => `
You are a senior technical interviewer evaluating a candidate's answer.
Question: "${question}"
Ideal Answer: "${idealAnswer}"
Evaluation Criteria: ${JSON.stringify(criteria)}
Candidate's Answer: "${candidateAnswer}"

Evaluate the candidate's answer and provide feedback.
Return ONLY valid JSON matching this schema exactly:
{
  "score": number, // out of 10
  "feedback": "string",
  "strengths": ["string"],
  "areasForImprovement": ["string"]
}

Rules:
1. No markdown wrappers. Return JSON only.
2. Be objective, constructive, and concise.
`;

module.exports = { buildMockInterviewPrompt, buildInterviewFeedbackPrompt };
