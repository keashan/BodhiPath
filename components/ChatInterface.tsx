
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, Scale } from 'lucide-react';
import { ChatMessage, Language } from '../types';
import { createChatSession } from '../services/geminiService';
import { UI_TEXT } from '../constants';
import { Chat } from '@google/genai';

interface ChatInterfaceProps {
  language: Language;
  userGoals: string[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ language, userGoals }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [isDebateMode, setIsDebateMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = UI_TEXT[language];

  // Initialize or Reset Session when Mode/Language changes
  useEffect(() => {
    const session = createChatSession(language, userGoals, isDebateMode);
    setChatSession(session);
    
    // Initial greeting
    const greetingText = isDebateMode 
      ? (language === 'si' ? "අපි ධර්ම සාකච්ඡාවක් කරමු. ඔබේ තර්කය ඉදිරිපත් කරන්න." : "Let us debate the Dhamma. Present your view.")
      : (language === 'si' ? "තෙරුවන් සරණයි! මම භන්තේ බෝධි. ඔබට ධර්මය සම්බන්ධව ඇති ගැටලු මොනවාද?" : "Namo Buddhaya! I am Bhante Bodhi. How may I guide you on the Dhamma path today?");

    setMessages([{
        id: 'init',
        role: 'model',
        text: greetingText,
        timestamp: Date.now()
    }]);
  }, [language, userGoals, isDebateMode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessage({ message: userMsg.text });
      const text = result.text; 

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: text || (language === 'si' ? "මට එය තේරුම් ගැනීමට අපහසුයි. කරුණාකර නැවත අසන්න." : "I apologize, I could not understand clearly. Please ask again."),
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: ChatMessage = {
         id: (Date.now() + 1).toString(),
         role: 'model',
         text: language === 'si' ? "සමාවන්න, තාක්ෂණික දෝෂයක් සිදු විය." : "Apologies, I encountered a disturbance. Please try again.",
         timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-stone-50 rounded-2xl overflow-hidden shadow-inner border border-stone-200">
      {/* Header */}
      <div className={`p-4 flex items-center justify-between border-b border-orange-200 ${isDebateMode ? 'bg-stone-800 text-white' : 'bg-orange-100 text-stone-800'}`}>
        <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 border-2 border-white ${isDebateMode ? 'bg-stone-700' : 'bg-orange-200'}`}>
                <span className="text-xl">{isDebateMode ? '⚖️' : '🧘‍♂️'}</span>
            </div>
            <div>
            <h3 className={`font-serif font-bold ${language === 'si' ? 'font-sinhala' : ''}`}>
                {isDebateMode ? (language === 'si' ? 'ධර්ම විවාදය' : 'Dhamma Debate') : t.monkPersona}
            </h3>
            <p className="text-xs opacity-70 flex items-center">
                <Sparkles size={10} className="mr-1" /> 
                AI Guide (Gemini)
            </p>
            </div>
        </div>
        
        <button 
            onClick={() => setIsDebateMode(!isDebateMode)}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all ${isDebateMode ? 'bg-stone-600 hover:bg-stone-500' : 'bg-white hover:bg-orange-50 shadow-sm'}`}
        >
            <Scale size={14} />
            <span>{t.debateMode}</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-orange-600 text-white rounded-tr-none' 
                : 'bg-white text-stone-800 border border-stone-100 rounded-tl-none font-serif'
            }`}>
                <p className={`whitespace-pre-wrap leading-relaxed ${language === 'si' ? 'font-sinhala' : ''}`}>{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm border border-stone-100 flex items-center space-x-2">
                <Loader2 size={16} className="animate-spin text-orange-500" />
                <span className="text-sm text-stone-400 italic">Thinking...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-stone-200">
        <div className="flex items-center space-x-2 bg-stone-100 rounded-full px-4 py-2 border border-transparent focus-within:border-orange-300 focus-within:bg-white transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.chatPlaceholder}
            className={`flex-1 bg-transparent border-none focus:outline-none text-stone-800 placeholder-stone-400 ${language === 'si' ? 'font-sinhala' : ''}`}
            disabled={isLoading}
          />
          <button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()}
            className="p-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
