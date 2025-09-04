import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader, Heart, Mic, MicOff, Play, Pause } from 'lucide-react';
import UserNavbar from '../components/UserNavbar';
import UserSidebar from '../components/UserSidebar';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIChatbot: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI health assistant. I can help you with preliminary health assessments, symptom analysis, and general health information. How can I assist you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response (In production, this would call your AI service)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(textToSend),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('fever') || input.includes('temperature')) {
      return 'A fever is typically a sign that your body is fighting an infection. For temperatures above 100.4°F (38°C), consider rest, hydration, and over-the-counter fever reducers. If fever persists for more than 3 days or is accompanied by severe symptoms, please consult a healthcare provider immediately.';
    } else if (input.includes('headache')) {
      return 'Headaches can have various causes including stress, dehydration, eye strain, or underlying conditions. Try staying hydrated, getting adequate rest, and applying a cold or warm compress. If headaches are severe, frequent, or accompanied by other symptoms like vision changes, please seek medical attention.';
    } else if (input.includes('cough')) {
      return 'Coughs can be dry or productive and may indicate respiratory irritation or infection. Stay hydrated, use honey for throat soothing, and consider humidifying your environment. If the cough persists for more than 2 weeks or is accompanied by blood, fever, or difficulty breathing, consult a doctor.';
    } else if (input.includes('chest pain')) {
      return '⚠️ Chest pain can be serious. If you\'re experiencing severe chest pain, shortness of breath, or pain radiating to your arm, jaw, or back, seek immediate emergency medical attention by calling 911. For mild chest discomfort, monitor symptoms closely and consult a healthcare provider.';
    } else if (input.includes('diabetes') || input.includes('blood sugar')) {
      return 'Diabetes management involves monitoring blood glucose levels, maintaining a healthy diet, regular exercise, and medication compliance. Keep track of your blood sugar readings, follow your prescribed meal plan, and take medications as directed. Regular check-ups with your healthcare provider are essential.';
    } else if (input.includes('blood pressure') || input.includes('hypertension')) {
      return 'High blood pressure management includes reducing sodium intake, maintaining a healthy weight, regular exercise, limiting alcohol, and taking prescribed medications. Monitor your blood pressure regularly and keep a log. Lifestyle changes can significantly impact blood pressure control.';
    } else {
      return 'Thank you for your question. Based on the symptoms or concerns you\'ve described, I recommend maintaining a healthy lifestyle with proper nutrition, regular exercise, and adequate sleep. However, for accurate diagnosis and treatment, please consult with a qualified healthcare provider who can perform a proper examination and review your medical history.';
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      setIsLoading(true);

      // Check if API key is available
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

      if (transcript && transcript.trim()) {
        setInputMessage(transcript);
        // Automatically send the transcribed message
        setTimeout(() => {
          handleSendMessage(transcript);
        }, 100);
      } else {
        alert('No speech detected. Please try again.');
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      alert(`Error transcribing audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const textToSpeech = async (text: string, messageId: string) => {
    try {
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentAudio(null);
        setPlayingMessageId(null);
      }

      // If clicking the same message that was playing, just stop
      if (playingMessageId === messageId) {
        return;
      }

      setPlayingMessageId(messageId);

      // Get API key
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

      audio.onended = () => {
        setPlayingMessageId(null);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setPlayingMessageId(null);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };

      setCurrentAudio(audio);
      await audio.play();
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      setPlayingMessageId(null);
      setCurrentAudio(null);
      alert(`Error playing audio: ${error.message}`);
    }
  };

  const quickQuestions = [
    'I have a persistent headache',
    'What should I do for a fever?',
    'I\'m experiencing chest discomfort',
    'How to manage diabetes?',
    'Blood pressure concerns'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <UserSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <UserNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-6 h-full flex flex-col">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">AI Health Assistant</h1>
                <p className="text-gray-600 mt-1">Get preliminary health insights and guidance</p>
              </div>

              {/* Chat Container */}
              <div className="flex-1 bg-white rounded-xl shadow-sm flex flex-col">
                {/* Chat Messages */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`flex items-start space-x-3 max-w-xs md:max-w-md lg:max-w-lg ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                            }`}
                        >
                          {/* Avatar */}
                          <div
                            className={`p-2 rounded-full ${message.sender === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                              }`}
                          >
                            {message.sender === 'user' ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Bot className="h-4 w-4" />
                            )}
                          </div>

                          {/* Message Bubble */}
                          <div
                            className={`px-4 py-3 rounded-2xl ${message.sender === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                              }`}
                          >
                            <p className="text-sm leading-relaxed">{message.text}</p>
                            <div className="flex items-center justify-between mt-2">
                              <p
                                className={`text-xs ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                                  }`}
                              >
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              {message.sender === 'ai' && (
                                <button
                                  onClick={() => textToSpeech(message.text, message.id)}
                                  className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                                  title="Play audio"
                                >
                                  {playingMessageId === message.id ? (
                                    <Pause className="h-3 w-3 text-gray-600" />
                                  ) : (
                                    <Play className="h-3 w-3 text-gray-600" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Loading indicator */}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex items-start space-x-3">
                          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-2 rounded-full">
                            <Bot className="h-4 w-4" />
                          </div>
                          <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                            <div className="flex items-center space-x-2">
                              <Loader className="h-4 w-4 animate-spin text-gray-500" />
                              <span className="text-sm text-gray-500">AI is thinking...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Quick Questions */}
                {messages.length === 1 && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-3">Quick questions to get started:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => setInputMessage(question)}
                          className="text-sm bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="p-6 border-t border-gray-200">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Describe your symptoms or health concerns..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleVoiceToggle}
                      disabled={isLoading}
                      className={`p-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isRecording
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                    >
                      {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center space-x-2 text-xs text-gray-500">
                    <Heart className="h-3 w-3" />
                    <span>This AI assistant provides general health information and is not a substitute for professional medical advice.</span>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;