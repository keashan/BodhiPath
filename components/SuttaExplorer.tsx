
import React, { useState, useRef, useEffect } from 'react';
import { Search, BookOpen, Send, Loader2, Sparkles, Scroll } from 'lucide-react';
import { ChatMessage, Language } from '../types';
import { createSuttaChatSession } from '../services/geminiService';
import { UI_TEXT } from '../constants';
import { Chat } from '@google/genai';

interface SuttaExplorerProps {
  language: Language;
}

const SuttaExplorer: React.FC<SuttaExplorerProps> = ({ language }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = UI_TEXT[language];

  useEffect(() => {
    // Initialize specific Sutta chat session
    const session = createSuttaChatSession(language);
    setChatSession(session);
    
    setMessages([{
        id: 'init',
        role: 'model',
        text: language === 'si' 
            ? "ඔබට සොයා ගැනීමට අවශ්‍ය සූත්‍රය හෝ ධර්ම කරුණ කුමක්ද? (උදා: 'මංගල සූත්‍රය', 'කර්මය ගැන')" 
            : "Which Sutta or Dhamma topic do you wish to explore today? (e.g., 'Metta Sutta', 'Mindfulness')",
        timestamp: Date.now()
    }]);
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || !chatSession) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessage({ message: textToSend });
      const text = result.text;

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: text || (language === 'si' ? "ක්ෂමා කරන්න, මට එය සොයාගත නොහැකි විය." : "I apologize, I could not retrieve that information."),
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Sutta Chat error:", error);
      const errorMsg: ChatMessage = {
         id: (Date.now() + 1).toString(),
         role: 'model',
         text: language === 'si' ? "සමාවන්න, තාක්ෂණික දෝෂයක්." : "Connection error. Please try again.",
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

  const suggestions = language === 'si' 
    ? ['මංගල සූත්‍රය', 'කරණීය මෙත්ත සූත්‍රය', 'ධම්මචක්ක සූත්‍රය', 'කෝපය පාලනය']
    : ['Mangala Sutta', 'Metta Sutta', 'Dhammacakkappavattana Sutta', 'Handling Anger'];

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-stone-50 border-b border-stone-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center">
                <BookOpen size={24} />
            </div>
            <div>
                <h2 className={`text-2xl font-serif font-bold text-stone-800 ${language === 'si' ? 'font-sinhala' : ''}`}>
                    {t.suttaExplorerTitle}
                </h2>
                <p className={`text-sm text-stone-500 ${language === 'si' ? 'font-sinhala' : ''}`}>
                    {t.suttaExplorerSubtitle}
                </p>
            </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-5 shadow-sm ${
                        msg.role === 'user' 
                        ? 'bg-amber-600 text-white rounded-tr-none' 
                        : 'bg-stone-50 text-stone-800 border border-stone-100 rounded-tl-none font-serif leading-relaxed'
                    }`}>
                        {msg.role === 'model' && (
                            <div className="mb-2 flex items-center gap-2 text-amber-600 opacity-80 text-xs uppercase tracking-widest font-bold">
                                <Scroll size={12} />
                                <span>Tipitaka AI</span>
                            </div>
                        )}
                        <div className={`whitespace-pre-wrap ${language === 'si' ? 'font-sinhala' : ''}`}>
                            {msg.text}
                        </div>
                    </div>
                </div>
            ))}
            
            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-stone-50 rounded-2xl rounded-tl-none p-4 shadow-sm border border-stone-100 flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin text-amber-500" />
                        <span className="text-sm text-stone-400 italic">Searching texts...</span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-stone-50 border-t border-stone-200">
            {messages.length < 3 && (
                <div className="mb-4 flex flex-wrap gap-2">
                    <span className="text-xs text-stone-400 w-full mb-1 uppercase font-bold tracking-wider">{t.suggestedSuttas}</span>
                    {suggestions.map((sug) => (
                        <button 
                            key={sug}
                            onClick={() => handleSend(sug)}
                            className={`px-3 py-1 bg-white border border-stone-200 rounded-full text-sm text-stone-600 hover:border-amber-400 hover:text-amber-700 transition-colors ${language === 'si' ? 'font-sinhala' : ''}`}
                        >
                            {sug}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 border border-stone-200 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 transition-all shadow-sm">
                <Search className="text-stone-400" size={20} />
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t.suttaSearchPlaceholder}
                    className={`flex-1 bg-transparent border-none focus:outline-none text-stone-800 placeholder-stone-400 ${language === 'si' ? 'font-sinhala' : ''}`}
                    disabled={isLoading}
                />
                <button 
                    onClick={() => handleSend()}
                    disabled={isLoading || !input.trim()}
                    className="p-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    </div>
  );
};

export default SuttaExplorer;
