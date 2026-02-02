
import React from 'react';
import { Moon } from 'lucide-react';
import { Language } from '../types';
import { POYA_DAYS_2025, UI_TEXT } from '../constants';

interface BuddhistCalendarProps {
  language: Language;
}

const BuddhistCalendar: React.FC<BuddhistCalendarProps> = ({ language }) => {
  const today = new Date();
  
  // Find next poya
  const nextPoya = POYA_DAYS_2025.find(p => new Date(p.date) >= today);

  return (
    <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
            <h2 className={`text-3xl font-serif text-stone-800 mb-2 ${language === 'si' ? 'font-sinhala' : ''}`}>
                {UI_TEXT[language].buddhistCalendar}
            </h2>
            <p className="text-stone-500">2025 Poya Days & Observances</p>
        </div>

        {/* Highlight Next Poya */}
        {nextPoya && (
            <div className="bg-stone-800 text-orange-50 rounded-3xl p-8 mb-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl">
                 <div className="absolute top-[-50%] left-[-20%] w-full h-full bg-orange-500 opacity-10 blur-3xl rounded-full pointer-events-none"></div>
                 <Moon size={48} className="mb-4 text-orange-200" />
                 <span className="uppercase tracking-widest text-xs font-bold text-orange-300 mb-2">Next Observance</span>
                 <h3 className={`text-4xl font-serif font-bold mb-2 ${language === 'si' ? 'font-sinhala' : ''}`}>
                     {language === 'si' ? nextPoya.si : nextPoya.name}
                 </h3>
                 <p className="text-xl opacity-90">{new Date(nextPoya.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
        )}

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {POYA_DAYS_2025.map((day) => {
                const isPast = new Date(day.date) < today;
                return (
                    <div key={day.date} className={`bg-white p-6 rounded-2xl border ${isPast ? 'border-stone-100 opacity-60' : 'border-stone-200 shadow-sm'} flex flex-col items-center text-center`}>
                        <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-stone-400">
                            <Moon size={20} />
                        </div>
                        <h4 className={`font-bold text-lg text-stone-800 mb-1 ${language === 'si' ? 'font-sinhala' : ''}`}>
                            {language === 'si' ? day.si : day.name}
                        </h4>
                        <p className="text-stone-500 text-sm">{day.date}</p>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default BuddhistCalendar;
