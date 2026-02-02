import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Wind, Star, X, Heart, ScanFace, Footprints, Check, Info } from 'lucide-react';
import { Language } from '../types';
import { getMeditationGuide, getMeditationFeedback } from '../services/geminiService';
import { UI_TEXT, MEDITATION_TYPES } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

interface MeditationHallProps {
  language: Language;
}

const MeditationHall: React.FC<MeditationHallProps> = ({ language }) => {
  const [duration, setDuration] = useState(5); // Minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(MEDITATION_TYPES[0]);
  const [guidance, setGuidance] = useState<string>('');
  const [loadingGuidance, setLoadingGuidance] = useState(false);
  
  // Feedback States
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [userReflection, setUserReflection] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const t = UI_TEXT[language];

  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (interval) clearInterval(interval);
      setShowFeedbackModal(true); // Auto-open feedback on finish
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    if (timeLeft === duration * 60 && !guidance) {
        setLoadingGuidance(true);
        // Pass the English title for the AI to understand the context better
        const text = await getMeditationGuide(selectedMethod.title.en, duration, language);
        setGuidance(text);
        setLoadingGuidance(false);
    }
    setIsActive(true);
  };

  const toggleTimer = () => {
    if (!isActive) {
        handleStart();
    } else {
        setIsActive(false);
    }
  };

  const stopTimer = () => {
      setIsActive(false);
      setShowFeedbackModal(true);
  };

  const submitReflection = async () => {
      if (!userReflection.trim()) return;
      setLoadingFeedback(true);
      const feedback = await getMeditationFeedback(userReflection, language);
      setAiResponse(feedback);
      setLoadingFeedback(false);
  };

  const closeFeedback = () => {
      setShowFeedbackModal(false);
      setUserReflection('');
      setAiResponse('');
      setTimeLeft(duration * 60);
      setGuidance('');
      // Do not reset selectedMethod, user might want to repeat
  };

  // Helper to get icon component
  const getIcon = (iconName: string, size: number = 20) => {
      switch (iconName) {
          case 'Wind': return <Wind size={size} />;
          case 'Heart': return <Heart size={size} />;
          case 'ScanFace': return <ScanFace size={size} />;
          case 'Footprints': return <Footprints size={size} />;
          default: return <Wind size={size} />;
      }
  };

  // Helper to get localized instructions
  const getInstructions = () => {
    return language === 'si' ? selectedMethod.instructions?.si : selectedMethod.instructions?.en;
  };

  const getDescription = () => {
    return language === 'si' ? selectedMethod.fullDescription?.si : selectedMethod.fullDescription?.en;
  };

  return (
    <div className="relative flex flex-col items-center h-full overflow-y-auto p-4 bg-gradient-to-br from-stone-50 to-orange-50 rounded-2xl shadow-inner">
      
      {/* Header & Method Selection (Visible when not active) */}
      <AnimatePresence>
        {!isActive && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-2xl mb-6"
          >
            {/* Title Section */}
            <div className="text-center mb-6">
                <h2 className={`text-3xl font-serif text-stone-800 ${language === 'si' ? 'font-sinhala' : ''}`}>
                    {language === 'si' ? 'භාවනා ශාලාව' : 'Meditation Hall'}
                </h2>
                <p className="text-stone-500 text-sm mt-1">Select your practice for today</p>
            </div>
            
            {/* Method Selection Grid - PRIMARY VISUAL */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {MEDITATION_TYPES.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => {
                          setSelectedMethod(method);
                          setGuidance(''); 
                      }}
                      className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center gap-3 transition-all relative overflow-hidden shadow-sm hover:shadow-md ${
                          selectedMethod.id === method.id 
                          ? 'bg-white border-orange-500 shadow-md ring-2 ring-orange-200 ring-offset-1 transform scale-105' 
                          : 'bg-white border-stone-200 hover:border-orange-300 hover:bg-orange-50'
                      }`}
                    >
                        <div className={`p-2 rounded-full ${selectedMethod.id === method.id ? 'bg-orange-100 text-orange-600' : 'bg-stone-100 text-stone-400'}`}>
                            {getIcon(method.icon, 24)}
                        </div>
                        <span className={`font-bold text-xs ${language === 'si' ? 'font-sinhala' : ''}`}>
                            {language === 'si' ? method.title.si : method.title.en}
                        </span>
                        {selectedMethod.id === method.id && (
                            <div className="absolute top-2 right-2 text-orange-500">
                                <Check size={14} strokeWidth={3} />
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Selected Method Details */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-stone-200 shadow-sm mb-6">
               <div className="flex items-center gap-3 mb-3 border-b border-stone-100 pb-3">
                   <div className="text-orange-500">{getIcon(selectedMethod.icon, 20)}</div>
                   <h3 className={`font-serif font-bold text-lg text-stone-800 ${language === 'si' ? 'font-sinhala' : ''}`}>
                      {language === 'si' ? selectedMethod.title.si : selectedMethod.title.en}
                   </h3>
               </div>
               
               <p className={`text-stone-600 leading-relaxed text-sm mb-5 ${language === 'si' ? 'font-sinhala' : ''}`}>
                  {getDescription()}
               </p>
               
               <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                   <h4 className={`text-xs font-bold text-orange-800 uppercase tracking-wider mb-3 flex items-center gap-1 ${language === 'si' ? 'font-sinhala' : ''}`}>
                      <Info size={14} /> {language === 'si' ? 'උපදෙස් (Instructions)' : 'Instructions'}
                   </h4>
                   <ul className="space-y-2">
                       {getInstructions()?.map((inst, idx) => (
                           <li key={idx} className={`text-sm text-stone-700 flex gap-2 ${language === 'si' ? 'font-sinhala' : ''}`}>
                               <span className="text-orange-400 mt-1">•</span>
                               <span className="flex-1">{inst}</span>
                           </li>
                       ))}
                   </ul>
               </div>
            </div>

            {/* Duration Selector */}
            <div className="bg-white/50 p-4 rounded-2xl flex items-center justify-center gap-2 border border-stone-200">
                 <span className={`text-stone-500 text-sm font-bold uppercase tracking-wider mr-2 ${language === 'si' ? 'font-sinhala' : ''}`}>{t.duration}:</span>
                 {[5, 10, 20, 30].map(m => (
                    <button 
                        key={m}
                        onClick={() => setDuration(m)}
                        className={`w-12 h-10 rounded-lg text-sm font-bold border transition-all ${
                            duration === m 
                            ? 'bg-stone-800 border-stone-800 text-white shadow-lg' 
                            : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-100'
                        }`}
                    >
                        {m}m
                    </button>
                 ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Session View */}
      {isActive && (
         <div className="w-full max-w-md flex flex-col items-center flex-1 justify-center">
            <h2 className={`text-2xl font-serif text-stone-800 mb-6 flex items-center gap-2 ${language === 'si' ? 'font-sinhala' : ''}`}>
                {getIcon(selectedMethod.icon, 24)}
                {language === 'si' ? selectedMethod.title.si : selectedMethod.title.en}
            </h2>

            {/* Timer Circle */}
            <div className="relative w-64 h-64 mb-10 shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-stone-200"
                    />
                    <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 120}
                    strokeDashoffset={2 * Math.PI * 120 * (1 - timeLeft / (duration * 60))}
                    className="text-orange-400 transition-all duration-1000 ease-linear"
                    />
                </svg>
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col">
                    <span className="text-5xl font-mono text-stone-700 font-bold">{formatTime(timeLeft)}</span>
                </div>
            </div>

            {/* Instructions / Guidance Card */}
            <div className="w-full bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-stone-200 shadow-sm mb-8 overflow-y-auto max-h-60">
                 {loadingGuidance ? (
                     <div className="flex justify-center p-4"><span className="text-stone-400 italic animate-pulse">Preparing guidance...</span></div>
                 ) : (
                     <div className="text-center">
                         {guidance && <p className={`text-stone-600 italic font-serif text-lg mb-6 leading-relaxed ${language === 'si' ? 'font-sinhala' : ''}`}>"{guidance}"</p>}
                         
                         {/* Show chant instructions specifically for Metta or if needed */}
                         <div className="space-y-3 mt-4 text-left border-t border-stone-200 pt-4">
                             {getInstructions()?.map((inst, idx) => (
                                 <p key={idx} className={`text-sm text-stone-700 leading-relaxed ${language === 'si' ? 'font-sinhala' : ''}`}>
                                    {inst}
                                 </p>
                             ))}
                         </div>
                     </div>
                 )}
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-6 mb-8">
                <button onClick={toggleTimer} className="w-20 h-20 bg-stone-800 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-stone-700 transition-all hover:scale-105 active:scale-95">
                    <Pause fill="currentColor" size={32} />
                </button>
                <button onClick={stopTimer} className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-red-600 hover:bg-red-200 transition-all">
                    <Square size={20} fill="currentColor" />
                </button>
            </div>
         </div>
      )}

      {/* Start Button (Only when not active) */}
      {!isActive && (
        <button 
            onClick={handleStart}
            className="mt-6 px-16 py-4 bg-orange-600 text-white rounded-full font-bold text-xl shadow-xl hover:bg-orange-700 transition-transform transform hover:scale-105 flex items-center gap-3"
        >
            <Play fill="currentColor" size={24} />
            {t.startSession}
        </button>
      )}

      {/* Feedback Modal */}
      <AnimatePresence>
          {showFeedbackModal && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center p-6 rounded-2xl"
              >
                  <div className="max-w-md w-full text-left">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className={`text-xl font-bold text-stone-800 ${language === 'si' ? 'font-sinhala' : ''}`}>
                              {t.feedbackTitle}
                          </h3>
                          <button onClick={closeFeedback} className="text-stone-400 hover:text-stone-600"><X /></button>
                      </div>
                      
                      {!aiResponse ? (
                          <>
                            <textarea
                                value={userReflection}
                                onChange={(e) => setUserReflection(e.target.value)}
                                placeholder={t.feedbackPlaceholder}
                                className={`w-full p-4 border border-stone-200 rounded-xl mb-4 bg-stone-50 focus:outline-none focus:border-orange-300 h-32 resize-none ${language === 'si' ? 'font-sinhala' : ''}`}
                            />
                            <button 
                                onClick={submitReflection}
                                disabled={loadingFeedback}
                                className="w-full bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 font-medium"
                            >
                                {loadingFeedback ? 'Processing...' : 'Reflect & Complete'}
                            </button>
                            <button onClick={closeFeedback} className="w-full mt-2 text-stone-500 py-2 hover:text-stone-700">Skip Reflection</button>
                          </>
                      ) : (
                          <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 text-center">
                              <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star fill="currentColor" size={24} />
                              </div>
                              <p className={`text-stone-800 font-serif italic mb-6 leading-relaxed ${language === 'si' ? 'font-sinhala' : ''}`}>
                                  "{aiResponse}"
                              </p>
                              <button onClick={closeFeedback} className="w-full bg-stone-800 text-white py-3 rounded-xl hover:bg-stone-900 font-medium">
                                  Close
                              </button>
                          </div>
                      )}
                  </div>
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};

export default MeditationHall;