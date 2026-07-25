const buildRoadmapPrompt = (role, difficulty) => `
You are an expert curriculum designer and senior software engineer. Create a comprehensive, industry-relevant learning roadmap for a "${role}" role at a ${difficulty} level.

The roadmap should be broken down into "phases", and each phase into "milestones". Each milestone contains specific "topics" to learn.
This roadmap should be extremely high-quality and reflect the current job market.

Return the response STRICTLY as a JSON object with the following structure:
{
  "title": "String - e.g. Full Stack Developer Roadmap",
  "description": "String - High level description of the roadmap",
  "role": "${role}",
  "phases": [
    {
      "name": "String - e.g. Frontend Basics",
      "description": "String",
      "milestones": [
        {
          "title": "String - e.g. Internet & HTML",
          "description": "String",
          "topics": [
            {
              "name": "String - e.g. Semantic HTML",
              "slug": "String - a url friendly slug e.g. semantic-html",
              "description": "String - Brief explanation of what it is",
              "estimatedTime": "String - e.g. '2 weeks' or '4 hours'",
              "prerequisites": ["Array of string slugs"],
              "resources": [
                {
                  "title": "String",
                  "type": "String - one of 'video', 'article', 'course', 'documentation'",
                  "url": "String - valid URL to the resource"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

Ensure the JSON is valid and does not contain markdown formatting block around it, just the JSON string. Ensure the roadmap is very detailed and structured logically.
`;

module.exports = {
  buildRoadmapPrompt
};
