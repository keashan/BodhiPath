
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Share2, Quote, History, Calendar, Download, Loader2 } from 'lucide-react';
import { Language, DailyDrop } from '../types';
import { UI_TEXT } from '../constants';
import { toPng } from 'https://esm.sh/html-to-image@1.11.11';

interface DailyDropsViewProps {
  language: Language;
  currentDrop: DailyDrop | null;
  history: DailyDrop[];
  onBack: () => void;
}

const DailyDropsView: React.FC<DailyDropsViewProps> = ({ language, currentDrop, history, onBack }) => {
  const t = UI_TEXT[language];
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleShare = (drop: DailyDrop) => {
    if (!drop) return;
    const text = `"${drop.quote}" — ${drop.source}\n\nReflection: ${drop.reflection}\n\nShared from BodhiPath`;
    if (navigator.share) {
      navigator.share({ title: 'Daily Wisdom', text: text, url: window.location.origin });
    } else {
      navigator.clipboard.writeText(text);
      alert(t.linkCopied);
    }
  };

  const saveAsImage = async () => {
    if (!cardRef.current || isExporting) return;
    
    setIsExporting(true);
    try {
      // Small delay to ensure styles are perfectly ready
      await new Promise(resolve => setTimeout(resolve, 150));
      
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 3, // Very high quality
        // If external stylesheets fail to inline due to strict CORS, 
        // this helps prevent the library from crashing the thread
        skipFonts: false, 
      });
      
      const link = document.createElement('a');
      link.download = `BodhiPath-Wisdom-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
      alert('Failed to save image. This usually happens due to browser security restrictions on external fonts. We are attempting to fix this.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full pb-20">
      {/* Header with Nav and Actions */}
      <div className="sticky top-0 z-20 bg-[#fdfcfb]/80 backdrop-blur-md flex items-center justify-between mb-8 py-4 px-2">
        <button onClick={onBack} className="flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors group">
          <div className="p-2 rounded-full group-hover:bg-stone-100 transition-colors">
            <ChevronLeft size={20} />
          </div>
          <span className={`font-bold hidden sm:inline ${language === 'si' ? 'font-sinhala' : ''}`}>{t.back}</span>
        </button>

        <h2 className={`text-xl md:text-2xl font-serif font-bold text-stone-900 absolute left-1/2 -translate-x-1/2 whitespace-nowrap ${language === 'si' ? 'font-sinhala' : ''}`}>
          {language === 'si' ? 'දෛනික ප්‍රඥාව' : 'Daily Wisdom'}
        </h2>

        <div className="flex items-center gap-2">
           {currentDrop && (
             <>
               <button 
                onClick={saveAsImage}
                disabled={isExporting}
                className="p-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 disabled:opacity-50 active:scale-95"
                title="Save as Image"
              >
                {isExporting ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
              </button>
              <button 
                onClick={() => handleShare(currentDrop)}
                className="p-3 bg-white border border-stone-200 text-stone-600 rounded-xl hover:bg-stone-50 transition-all shadow-sm active:scale-95"
                title="Share Text"
              >
                <Share2 size={20} />
              </button>
             </>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start px-2">
        {/* Today's Feature */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start w-full">
          {currentDrop ? (
            <div className="w-full max-w-[540px]">
              {/* The Exportable Card - Expanded to show all content */}
              <motion.div 
                ref={cardRef}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-stone-200 border border-stone-100 relative flex flex-col justify-between min-h-[540px]"
              >
                {/* Decorative Quote Mark */}
                <div className="absolute top-4 right-4 opacity-[0.05] text-orange-500 pointer-events-none">
                  <Quote size={200} />
                </div>

                <div className="relative z-10 h-full flex flex-col">
                  <span className={`text-[10px] font-black text-orange-600 uppercase tracking-[0.4em] mb-8 block ${language === 'si' ? 'font-sinhala' : ''}`}>
                    {t.todayInspiration}
                  </span>
                  
                  <div className="flex-1 flex flex-col justify-center mb-10">
                    <blockquote className={`text-2xl md:text-3xl font-serif text-stone-800 italic mb-4 leading-relaxed ${language === 'si' ? 'font-sinhala' : ''}`}>
                      "{currentDrop.quote}"
                    </blockquote>
                    <p className="text-stone-400 font-bold text-xs tracking-widest uppercase">— {currentDrop.source}</p>
                  </div>
                  
                  <div className="bg-[#fff9f4] p-6 md:p-8 rounded-2xl border-l-[4px] border-[#fdb884]">
                    <h4 className="text-[10px] font-black text-[#b45309] uppercase tracking-widest mb-3">Bhante's Reflection:</h4>
                    <p className={`text-stone-700 leading-relaxed font-serif text-lg ${language === 'si' ? 'font-sinhala' : ''}`}>
                      {currentDrop.reflection}
                    </p>
                  </div>

                  <div className="mt-12 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-orange-600 opacity-60">
                       <Share2 size={12} />
                       <span className="text-[9px] font-black uppercase tracking-widest">Wisdom Shared</span>
                    </div>
                    <span className="text-[8px] font-bold text-stone-200 uppercase tracking-[0.4em]">BodhiPath</span>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="w-full max-w-[540px] aspect-square bg-stone-100 rounded-[2rem] flex items-center justify-center text-stone-400 italic">
               <Loader2 className="animate-spin mr-2" /> Preparing wisdom...
            </div>
          )}
        </div>

        {/* History Sidebar */}
        <div className="lg:col-span-5 pt-8 lg:pt-0 border-t lg:border-t-0 lg:border-l border-stone-100 lg:pl-12 w-full">
           <div className="flex items-center gap-3 mb-8 text-stone-400">
              <History size={18} />
              <h3 className={`text-xs font-black uppercase tracking-[0.2em] ${language === 'si' ? 'font-sinhala' : ''}`}>
                {language === 'si' ? 'පෙර සිහිකිරීම්' : 'Previous Reflections'}
              </h3>
           </div>

           <div className="space-y-6">
             {history.length > 0 ? (
               history.map((drop, idx) => (
                 <motion.div 
                   key={drop.timestamp}
                   initial={{ opacity: 0, x: 10 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.05 }}
                   className="bg-white p-6 rounded-2xl border border-stone-100 hover:border-orange-200 transition-all group shadow-sm hover:shadow-md cursor-default"
                 >
                    <div className="flex items-center gap-2 text-[9px] text-stone-300 font-bold uppercase tracking-widest mb-3">
                       <Calendar size={10} />
                       <span>{new Date(drop.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-stone-700 line-clamp-3 font-serif italic mb-4 leading-relaxed">"{drop.quote}"</p>
                    <div className="flex justify-between items-center pt-4 border-t border-stone-50">
                       <span className="text-[10px] text-stone-400 font-bold uppercase tracking-tight">{drop.source}</span>
                       <button onClick={() => handleShare(drop)} className="text-stone-300 hover:text-orange-500 transition-colors p-1">
                          <Share2 size={16} />
                       </button>
                    </div>
                 </motion.div>
               ))
             ) : (
               <div className="text-center py-20 bg-stone-50/30 rounded-3xl border border-dashed border-stone-200 text-stone-400 italic">
                 <p className="text-sm opacity-60">Your history of wisdom begins today.</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DailyDropsView;
