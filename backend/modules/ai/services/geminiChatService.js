import { GoogleGenerativeAI } from "@google/generative-ai";

// Lazy initialization to allow environment variables to load
let genAI = null;

const getGenAI = () => {
  if (genAI) return genAI;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Set GEMINI_API_KEY in your environment.');
  }

  genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
};

export const getGeminiChatResponse = async (message) => {
  const ai = getGenAI();
  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = message;
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return text;
};

export default { getGeminiChatResponse };
