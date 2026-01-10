import FormData from 'form-data';
import fetch from 'node-fetch';
import dotenv from "dotenv";
dotenv.config();

export class DeepgramService {
  constructor() {
    this.apiKey = process.env.DEEPGRAM_API_KEY;
    this.baseUrl = 'https://api.deepgram.com/v1';
    
    if (!this.apiKey && process.env.NODE_ENV === 'production') {
      throw new Error('Deepgram API key is not configured');
    }
  }


  async transcribeAudio(audioBuffer, contentType = 'audio/wav') {
    try {
      if (!this.apiKey) {
        throw new Error('Deepgram API key is not configured. Please set DEEPGRAM_API_KEY in your environment variables.');
      }
  
      const response = await fetch(`${this.baseUrl}/listen?model=nova-2&language=en&smart_format=true`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.apiKey}`,
          'Content-Type': contentType,  // e.g., audio/wav or audio/mp3
        },
        body: audioBuffer,  // send raw binary data
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Deepgram API error:', response.status, errorText);
        throw new Error(`Deepgram API request failed: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Deepgram response:', data);
  
      const transcript = data.results?.channels?.[0]?.alternatives?.[0]?.transcript;
  
      if (!transcript || !transcript.trim()) {
        throw new Error('No speech detected. Please try again.');
      }
  
      return {
        success: true,
        transcript: transcript.trim(),
        confidence: data.results?.channels?.[0]?.alternatives?.[0]?.confidence || 0
      };
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }
  


  async textToSpeech(text, model = 'aura-asteria-en') {
    try {
      if (!this.apiKey) {
        throw new Error('Deepgram API key is not configured. Please set DEEPGRAM_API_KEY in your environment variables.');
      }

      const response = await fetch(`${this.baseUrl}/speak?model=${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Deepgram TTS API error:', response.status, errorText);
        throw new Error(`TTS API request failed: ${response.status}`);
      }

      const audioBuffer = await response.buffer();
      return audioBuffer;
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      throw error;
    }
  }
}

export default DeepgramService;
