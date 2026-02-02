
import React, { useState, useEffect } from 'react';
import { Book, ChevronRight, CheckCircle, Loader2, MessageCircle, Send, Check } from 'lucide-react';
import { CORE_LESSONS, UI_TEXT } from '../constants';
import { Language, Lesson } from '../types';
import { getLessonContent, askLessonQuestion } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

interface DhammaClassroomProps {
  language: Language;
}

const DhammaClassroom: React.FC<DhammaClassroomProps> = ({ language }) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  
  // Q&A State
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loadingAnswer, setLoadingAnswer] = useState(false);

  const t = UI_TEXT[language];

  useEffect(() => {
    const saved = localStorage.getItem('bodhi_completed_lessons');
    if (saved) {
        try {
            setCompletedIds(JSON.parse(saved));
        } catch (e) {
            console.error("Failed to load completed lessons", e);
        }
    }
  }, []);

  const toggleComplete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let newIds;
    if (completedIds.includes(id)) {
        newIds = completedIds.filter(c => c !== id);
    } else {
        newIds = [...completedIds, id];
    }
    setCompletedIds(newIds);
    localStorage.setItem('bodhi_completed_lessons', JSON.stringify(newIds));
  };

  const handleLessonClick = async (lesson: Lesson) => {
    if (selectedLesson?.id === lesson.id) {
        setSelectedLesson(null);
        setQuestion('');
        setAnswer(null);
        return;
    }
    setSelectedLesson(lesson);
    setQuestion('');
    setAnswer(null);
    setLoading(true);
    const generatedContent = await getLessonContent(lesson.title.en, language);
    setContent(generatedContent);
    setLoading(false);
  };

  const handleAskQuestion = async () => {
      if (!question.trim() || !selectedLesson) return;
      setLoadingAnswer(true);
      const response = await askLessonQuestion(selectedLesson.title.en, question, language);
      setAnswer(response);
      setLoadingAnswer(false);
  };

  const progress = Math.round((completedIds.length / CORE_LESSONS.length) * 100);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-0">
       <div className="mb-6">
           <h2 className={`text-3xl font-serif text-stone-800 mb-2 ${language === 'si' ? 'font-sinhala' : ''}`}>
               {t.dhammaClassroom}
           </h2>
           <p className="text-stone-500 mb-6">Core teachings of the Theravāda Tradition.</p>
           
           {/* Progress Bar */}
           <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
               <div className="flex justify-between items-center mb-2">
                   <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Your Progress</span>
                   <span className="text-sm font-bold text-orange-600">{progress}%</span>
               </div>
               <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
                   <motion.div 
                     className="bg-orange-500 h-full rounded-full"
                     initial={{ width: 0 }}
                     animate={{ width: `${progress}%` }}
                     transition={{ duration: 1, ease: "easeOut" }}
                   />
               </div>
               <div className="mt-2 text-xs text-stone-400 text-center">
                   {completedIds.length} of {CORE_LESSONS.length} lessons completed
               </div>
           </div>
       </div>

       <div className="grid gap-4 pb-20">
           {CORE_LESSONS.map((lesson) => {
               const isCompleted = completedIds.includes(lesson.id);
               return (
                   <motion.div 
                     layout
                     key={lesson.id}
                     className={`rounded-2xl shadow-sm border overflow-hidden transition-all ${
                         isCompleted ? 'bg-orange-50/50 border-orange-100' : 'bg-white border-stone-200'
                     }`}
                   >
                       <button 
                         onClick={() => handleLessonClick(lesson)}
                         className="w-full p-6 flex items-center justify-between hover:bg-stone-50 transition-colors text-left"
                       >
                           <div className="flex items-center gap-4">
                               <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                   isCompleted 
                                   ? 'bg-green-100 text-green-600' 
                                   : (selectedLesson?.id === lesson.id ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600')
                               }`}>
                                   {isCompleted ? <Check size={24} /> : <Book size={20} />}
                               </div>
                               <div>
                                   <h3 className={`font-bold text-lg text-stone-800 ${language === 'si' ? 'font-sinhala' : ''} ${isCompleted ? 'line-through opacity-60 decoration-orange-300' : ''}`}>
                                       {language === 'si' ? lesson.title.si : lesson.title.en}
                                   </h3>
                                   <p className={`text-sm text-stone-500 ${language === 'si' ? 'font-sinhala' : ''}`}>
                                       {language === 'si' ? lesson.description.si : lesson.description.en}
                                   </p>
                               </div>
                           </div>
                           <ChevronRight className={`transform transition-transform text-stone-400 ${selectedLesson?.id === lesson.id ? 'rotate-90' : ''}`} />
                       </button>

                       <AnimatePresence>
                           {selectedLesson?.id === lesson.id && (
                               <motion.div 
                                 initial={{ opacity: 0, height: 0 }}
                                 animate={{ opacity: 1, height: 'auto' }}
                                 exit={{ opacity: 0, height: 0 }}
                                 className="border-t border-stone-100 bg-stone-50"
                               >
                                   <div className="p-6">
                                       {loading ? (
                                           <div className="flex items-center justify-center py-8 text-orange-500 gap-2">
                                               <Loader2 className="animate-spin" />
                                               <span>Inviting wisdom...</span>
                                           </div>
                                       ) : (
                                           <div className="prose prose-stone max-w-none">
                                                <div className={`whitespace-pre-wrap leading-relaxed ${language === 'si' ? 'font-sinhala' : ''}`}>
                                                    {content}
                                                </div>
                                                
                                                <div className="mt-8 pt-8 border-t border-stone-200">
                                                    <h4 className={`text-lg font-bold text-stone-800 mb-4 flex items-center gap-2 ${language === 'si' ? 'font-sinhala' : ''}`}>
                                                        <MessageCircle size={20} className="text-orange-500" />
                                                        {t.lessonQnA}
                                                    </h4>
                                                    
                                                    <div className="flex gap-2 mb-4">
                                                        <input 
                                                            type="text" 
                                                            value={question}
                                                            onChange={(e) => setQuestion(e.target.value)}
                                                            placeholder={t.askLessonQuestion}
                                                            className={`flex-1 p-3 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-400 bg-stone-50 ${language === 'si' ? 'font-sinhala' : ''}`}
                                                        />
                                                        <button 
                                                            onClick={handleAskQuestion}
                                                            disabled={loadingAnswer || !question.trim()}
                                                            className="bg-stone-800 text-white px-4 py-2 rounded-xl hover:bg-stone-900 disabled:opacity-50 transition-colors flex items-center gap-2"
                                                        >
                                                            {loadingAnswer ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                                            <span className="hidden md:inline">{t.askBtn}</span>
                                                        </button>
                                                    </div>

                                                    {answer && (
                                                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-stone-800">
                                                            <p className={`whitespace-pre-wrap leading-relaxed ${language === 'si' ? 'font-sinhala' : ''}`}>
                                                                {answer}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-8 flex justify-end">
                                                    <button 
                                                        onClick={(e) => toggleComplete(lesson.id, e)}
                                                        className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all transform active:scale-95 ${
                                                            isCompleted 
                                                            ? 'bg-stone-200 text-stone-500 hover:bg-stone-300' 
                                                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200'
                                                        }`}
                                                    >
                                                        {isCompleted ? <Check size={18} /> : <CheckCircle size={18} />}
                                                        <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
                                                    </button>
                                                </div>
                                           </div>
                                       )}
                                   </div>
                               </motion.div>
                           )}
                       </AnimatePresence>
                   </motion.div>
               );
           })}
       </div>
    </div>
  );
};

export default DhammaClassroom;
