
import React from 'react';
import { ChevronLeft, Shield, FileText } from 'lucide-react';
import { Language } from '../types';
import { LEGAL_CONTENT, UI_TEXT } from '../constants';

interface LegalViewProps {
  type: 'terms' | 'privacy';
  language: Language;
  onBack: () => void;
}

const LegalView: React.FC<LegalViewProps> = ({ type, language, onBack }) => {
  const content = LEGAL_CONTENT[language][type];
  const t = UI_TEXT[language];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-colors mb-8"
      >
        <ChevronLeft size={20} />
        <span className={language === 'si' ? 'font-sinhala' : ''}>{t.back}</span>
      </button>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-stone-200 relative overflow-hidden">
        {/* Subtle background icon */}
        <div className="absolute top-[-20px] right-[-20px] opacity-5 text-stone-900">
          {type === 'terms' ? <FileText size={200} /> : <Shield size={200} />}
        </div>

        <div className="relative z-10">
          <h1 className={`text-3xl font-serif font-bold text-stone-800 mb-2 ${language === 'si' ? 'font-sinhala' : ''}`}>
            {content.title}
          </h1>
          <p className="text-sm text-stone-400 mb-8 italic">
            {language === 'si' ? 'අවසන් වරට යාවත්කාලීන කළේ' : 'Last Updated'}: {content.lastUpdated}
          </p>

          <div className="space-y-8">
            {content.sections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className={`text-lg font-bold text-stone-700 ${language === 'si' ? 'font-sinhala' : ''}`}>
                  {section.heading}
                </h3>
                <p className={`text-stone-600 leading-relaxed ${language === 'si' ? 'font-sinhala' : ''}`}>
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-stone-100 text-center">
            <p className="text-stone-400 text-sm font-serif italic">
              {language === 'si' 
                ? 'ප්‍රඥාවෙන් සහ කරුණාවෙන් මඟ පෙන්වනු ලැබේ.' 
                : 'Guided by wisdom and compassion.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalView;
