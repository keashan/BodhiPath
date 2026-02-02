
import React from 'react';
import { Globe, Heart } from 'lucide-react';
import Logo from './Logo';
import { UI_TEXT } from '../constants';
import { Language } from '../types';

interface FooterProps {
  language: Language;
  setLanguage: (l: Language) => void;
}

const Footer: React.FC<FooterProps> = ({ language, setLanguage }) => {
  const t = UI_TEXT[language];

  const navigateTo = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = hash;
  };

  return (
    <footer className="bg-stone-50 border-t border-stone-200 pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2 space-y-6">
           <div className="flex items-center gap-3">
              <Logo className="w-10 h-10" />
              <span className="font-serif font-bold text-2xl text-stone-800 tracking-tight">BodhiPath</span>
           </div>
           <p className="text-stone-500 max-w-sm leading-relaxed font-serif italic">
              "Through Dhamma, we find the path to true liberation." BodhiPath is an AI-enhanced spiritual companion built to preserve and propagate Theravāda Buddhist wisdom.
           </p>
           <button 
              onClick={() => setLanguage(language === 'en' ? 'si' : 'en')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-full text-xs font-bold text-stone-600 hover:border-orange-300 transition-all"
           >
              <Globe size={14} /> {language === 'en' ? 'සිංහල' : 'English'}
           </button>
        </div>

        <div className="space-y-4">
           <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Discover</h4>
           <nav className="flex flex-col space-y-3 text-sm">
              <a href="#/" onClick={navigateTo('#/')} className="text-stone-600 hover:text-orange-600 transition-colors">{t.navHome}</a>
              <a href="#/about" onClick={navigateTo('#/about')} className="text-stone-600 hover:text-orange-600 transition-colors">{t.navAbout}</a>
              <a href="#/contact" onClick={navigateTo('#/contact')} className="text-stone-600 hover:text-orange-600 transition-colors">{t.navContact}</a>
              <a href="#/app" onClick={navigateTo('#/app')} className="text-orange-600 font-bold hover:underline transition-all">Launch App</a>
           </nav>
        </div>

        <div className="space-y-4">
           <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Legal</h4>
           <nav className="flex flex-col space-y-3 text-sm">
              <a href="#/terms" onClick={navigateTo('#/terms')} className="text-stone-600 hover:text-orange-600 transition-colors">{t.terms}</a>
              <a href="#/privacy" onClick={navigateTo('#/privacy')} className="text-stone-600 hover:text-orange-600 transition-colors">{t.privacy}</a>
           </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-10 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-xs text-stone-300 uppercase tracking-widest font-bold">© 2025 BodhiPath • Dedicated to the Triple Gem</p>
          <div className="flex items-center gap-2 text-stone-300 text-xs font-bold italic">
              Made with <Heart size={12} className="text-orange-200 fill-current" /> in Mindfulness
          </div>
      </div>
    </footer>
  );
};

export default Footer;
