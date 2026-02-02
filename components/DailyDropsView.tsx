
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Share2, Quote, History, Calendar } from 'lucide-react';
import { Language, DailyDrop } from '../types';
import { UI_TEXT } from '../constants';

interface DailyDropsViewProps {
  language: Language;
  currentDrop: DailyDrop | null;
  history: DailyDrop[];
  onBack: () => void;
}

const DailyDropsView: React.FC<DailyDropsViewProps> = ({ language, currentDrop, history, onBack }) => {
  const t = UI_TEXT[language];

  const handleShare = (drop: DailyDrop) => {
    const text = `"${drop.quote}" — ${drop.source}\n\nReflection: ${drop.reflection}\n\nShared from BodhiPath`;
    if (navigator.share) {
      navigator.share({ title: 'Daily Wisdom', text: text, url: window.location.origin });
    } else {
      navigator.clipboard.writeText(text);
      alert(t.linkCopied);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors">
          <ChevronLeft size={20} />
          <span className={language === 'si' ? 'font-sinhala' : ''}>{t.back}</span>
        </button>
        <h2 className={`text-2xl font-serif font-bold text-stone-800 ${language === 'si' ? 'font-sinhala' : ''}`}>
          {t.dailyDrops}
        </h2>
        <div className="w-8" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-y-auto">
        {/* Today's Feature */}
        <div className="lg:col-span-7">
          {currentDrop ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-orange-200 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 text-orange-500">
                <Quote size={120} />
              </div>

              <div className="relative z-10">
                <span className={`text-xs font-bold text-orange-600 uppercase tracking-widest mb-6 block ${language === 'si' ? 'font-sinhala' : ''}`}>
                  {t.todayInspiration}
                </span>
                <blockquote className="text-3xl font-serif text-stone-800 italic mb-6 leading-tight">
                  "{currentDrop.quote}"
                </blockquote>
                <p className="text-lg text-stone-500 font-medium mb-8">— {currentDrop.source}</p>
                
                <div className="bg-orange-50 p-6 rounded-2xl border-l-4 border-orange-300 mb-8">
                  <h4 className="text-sm font-bold text-orange-800 mb-2">Bhante's Reflection:</h4>
                  <p className={`text-stone-700 leading-relaxed font-serif ${language === 'si' ? 'font-sinhala' : ''}`}>
                    {currentDrop.reflection}
                  </p>
                </div>

                <button 
                  onClick={() => handleShare(currentDrop)}
                  className="flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-colors"
                >
                  <Share2 size={20} />
                  <span>Share Wisdom</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="h-64 bg-stone-100 rounded-3xl flex items-center justify-center text-stone-400 italic">
               Preparing today's wisdom...
            </div>
          )}
        </div>

        {/* History Gallery */}
        <div className="lg:col-span-5">
           <div className="flex items-center gap-2 mb-4 text-stone-400">
              <History size={18} />
              <h3 className={`text-sm font-bold uppercase tracking-widest ${language === 'si' ? 'font-sinhala' : ''}`}>
                {t.previousDrops}
              </h3>
           </div>

           <div className="space-y-4">
             {history.length > 0 ? (
               history.map((drop, idx) => (
                 <motion.div 
                   key={drop.timestamp}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.1 }}
                   className="bg-stone-50 p-4 rounded-xl border border-stone-200 hover:border-orange-200 transition-colors group"
                 >
                    <div className="flex items-center gap-2 text-[10px] text-stone-400 mb-2">
                       <Calendar size={10} />
                       <span>{new Date(drop.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-stone-700 line-clamp-2 font-serif italic mb-2">"{drop.quote}"</p>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] text-stone-400 font-medium">{drop.source}</span>
                       <button onClick={() => handleShare(drop)} className="text-stone-300 hover:text-orange-500 opacity-0 group-hover:opacity-100 transition-all">
                          <Share2 size={14} />
                       </button>
                    </div>
                 </motion.div>
               ))
             ) : (
               <div className="text-center py-12 text-stone-400 italic">
                 {t.noHistory}
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DailyDropsView;
