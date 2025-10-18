import { API_BASE_URL } from '../translationAPI';

export async function geminiChatAPI(message: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  if (!response.ok) {
    throw new Error('Failed to get AI response');
  }
  const data = await response.json();
  return data.response;
}
