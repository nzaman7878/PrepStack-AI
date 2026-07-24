const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function testGeneration() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: "hello",
    });
    console.log(response.text);
  } catch (error) {
    console.error("ERROR:");
    console.error(error.message);
  }
}

testGeneration();
