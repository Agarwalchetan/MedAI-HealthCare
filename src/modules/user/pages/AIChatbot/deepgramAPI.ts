// Backend API service for Deepgram functionality
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface TranscriptionResult {
  success: boolean;
  transcript: string;
  confidence?: number;
}

export interface TTSResult {
  audioUrl: string;
  audio: HTMLAudioElement;
}

class DeepgramAPIService {
  private async makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return response;
  }

  /**
   * Transcribe audio to text using backend API
   */
  async transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.wav');

      const response = await this.makeAuthenticatedRequest('/ai/deepgram/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Transcription failed');
      }

      return {
        success: true,
        transcript: data.data.transcript,
        confidence: data.data.confidence
      };
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }

  /**
   * Convert text to speech using backend API
   */
  async textToSpeech(text: string, model: string = 'aura-asteria-en'): Promise<TTSResult> {
    try {
      const response = await this.makeAuthenticatedRequest('/ai/deepgram/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          model: model
        })
      });

      if (!response.ok) {
        throw new Error(`TTS API request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      return { audioUrl, audio };
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      throw error;
    }
  }

  /**
   * Create audio recorder (client-side functionality)
   */
  async createAudioRecorder(): Promise<MediaRecorder> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      return recorder;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw new Error('Error accessing microphone. Please check permissions.');
    }
  }

  /**
   * Stop media stream (client-side functionality)
   */
  stopMediaStream(stream: MediaStream): void {
    stream.getTracks().forEach(track => track.stop());
  }
}

export const deepgramAPIService = new DeepgramAPIService();

// Export individual functions for easier importing
export const transcribeAudio = (audioBlob: Blob) => deepgramAPIService.transcribeAudio(audioBlob);
export const textToSpeech = (text: string, model?: string) => deepgramAPIService.textToSpeech(text, model);
export const createAudioRecorder = () => deepgramAPIService.createAudioRecorder();
export const stopMediaStream = (stream: MediaStream) => deepgramAPIService.stopMediaStream(stream);

export default deepgramAPIService;
