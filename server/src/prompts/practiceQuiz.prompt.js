const buildPracticeQuizPrompt = (topicName, trackName, difficulty) => `
You are a technical interviewer testing a candidate on "${topicName}" for a "${trackName}" role.
Difficulty level: ${difficulty}.

Generate exactly 5 multiple choice questions to test their understanding.
Return ONLY valid JSON matching this schema exactly:
{
  "title": "string",
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctOptionIndex": number,
      "explanation": "string"
    }
  ]
}

Rules:
1. "options" array must have exactly 4 strings.
2. "correctOptionIndex" must be an integer between 0 and 3.
3. "explanation" should explain why the correct option is right and the others are wrong.
4. No markdown wrappers. Return JSON only.
`;

module.exports = { buildPracticeQuizPrompt };
