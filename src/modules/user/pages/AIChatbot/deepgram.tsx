export interface TranscriptionResult {
    transcript: string;
}

export interface TTSResult {
    audioUrl: string;
    audio: HTMLAudioElement;
}


export const transcribeAudio = async (audioBlob: Blob): Promise<TranscriptionResult> => {
    try {
        const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY || process.env.REACT_APP_DEEPGRAM_API_KEY;
        if (!apiKey) {
            throw new Error('Deepgram API key not found');
        }
        console.log('API key:', apiKey);

        const response = await fetch('https://api.deepgram.com/v1/listen?model=nova-2&language=en&smart_format=true', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${apiKey}`,
            },
            body: audioBlob
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Deepgram API error:', response.status, errorText);
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        console.log('Deepgram response:', data);

        const transcript = data.results?.channels?.[0]?.alternatives?.[0]?.transcript;

        if (!transcript || !transcript.trim()) {
            throw new Error('No speech detected. Please try again.');
        }

        return { transcript: transcript.trim() };
    } catch (error) {
        console.error('Error transcribing audio:', error);
        throw error;
    }
};


export const textToSpeech = async (text: string): Promise<TTSResult> => {
    try {
        
        const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY || process.env.REACT_APP_DEEPGRAM_API_KEY;
        if (!apiKey) {
            throw new Error('Deepgram API key not found');
        }

        const response = await fetch('https://api.deepgram.com/v1/speak?model=aura-asteria-en', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text
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
};


export const createAudioRecorder = async (): Promise<MediaRecorder> => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        return recorder;
    } catch (error) {
        console.error('Error accessing microphone:', error);
        throw new Error('Error accessing microphone. Please check permissions.');
    }
};


export const stopMediaStream = (stream: MediaStream): void => {
    stream.getTracks().forEach(track => track.stop());
};
