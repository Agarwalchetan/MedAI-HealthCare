import geminiChatService from '../services/geminiChatService.js';

export const chatWithGemini = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }
    const aiResponse = await geminiChatService.getGeminiChatResponse(message);
    res.json({ response: aiResponse });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Gemini chat error' });
  }
};
