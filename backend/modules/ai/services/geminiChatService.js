import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ;

if (!GEMINI_API_KEY) {
  throw new Error('Gemini API key is not configured. Set GEMINI_API_KEY in your environment.');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const getGeminiChatResponse = async (message) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = message;
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return text;
};

export default { getGeminiChatResponse };
