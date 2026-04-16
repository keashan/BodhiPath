
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, GraduationCap, ArrowRight } from 'lucide-react';
import { UI_TEXT } from '../constants';
import { Language } from '../types';
import Logo from './Logo';

interface LandingPageProps {
  language: Language;
}

const LandingPage: React.FC<LandingPageProps> = ({ language }) => {
  const t = UI_TEXT[language] || UI_TEXT['en'];

  if (!t) return <div className="p-20 text-center">Loading Wisdom...</div>;

  const navigateTo = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = hash;
  };

  return (
    <div className="relative overflow-hidden min-h-[80vh]">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 flex flex-col items-center text-center">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ duration: 2 }}
                className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-100 blur-[100px] rounded-full" 
            />
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 2, delay: 0.5 }}
                className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-stone-200 blur-[120px] rounded-full" 
            />
        </div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <Logo className="w-24 h-24 md:w-32 md:h-32 drop-shadow-sm" />
        </motion.div>

        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-5xl md:text-7xl font-serif font-bold text-stone-900 mb-6 tracking-tight max-w-4xl leading-tight ${language === 'si' ? 'font-sinhala' : ''}`}
        >
            {language === 'si' ? 'බෝධි මාර්ගය: AI සහායෙන් බුදු දහම ඉගෙන ගන්න' : 'Bridge Ancient Wisdom with Modern AI'}
        </motion.h1>

        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-stone-500 text-lg md:text-xl max-w-2xl mb-12 font-serif italic"
        >
            {t.subtitle}
        </motion.p>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col md:flex-row gap-4"
        >
            <a href="#/app" onClick={navigateTo('#/app')} className="px-10 py-5 bg-stone-900 text-white rounded-full font-bold text-lg hover:bg-black transition-all shadow-xl shadow-stone-200 flex items-center gap-2">
                {t.startBtn} <ArrowRight size={20} />
            </a>
            <a href="#/about" onClick={navigateTo('#/about')} className="px-10 py-5 bg-white border border-stone-200 text-stone-700 rounded-full font-bold text-lg hover:bg-stone-50 transition-all">
                {t.navAbout}
            </a>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-24 border-t border-stone-100">
          <div className="text-center mb-16">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-[0.3em] mb-4 block">The Experience</span>
              <h2 className={`text-4xl font-serif font-bold text-stone-800 ${language === 'si' ? 'font-sinhala' : ''}`}>Deep Learning, Gentle Practice</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl transition-all group">
                  <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Sparkles size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-800 mb-4">{t.askMonk}</h3>
                  <p className="text-stone-500 leading-relaxed italic">Engage in dialogue with Bhante Bodhi, our AI guide trained in Theravāda scripture.</p>
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl transition-all group">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Brain size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-800 mb-4">{t.meditateNow}</h3>
                  <p className="text-stone-500 leading-relaxed italic">Guided meditations including Metta, Anapanasati, and Vipassana with AI-generated reflections.</p>
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl transition-all group">
                  <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <GraduationCap size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-800 mb-4">{t.dhammaClassroom}</h3>
                  <p className="text-stone-500 leading-relaxed italic">A structured path through the 10 core foundations of Buddhist wisdom, from Dana to Nibbana.</p>
              </div>
          </div>
      </section>

      {/* Quote Section */}
      <section className="bg-stone-900 py-32 px-6 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none flex items-center justify-center">
              <Logo className="w-[800px] h-[800px]" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
              <blockquote className="text-3xl md:text-5xl font-serif italic mb-8 leading-tight">
                  "Better than a thousand hollow words, is one word that brings peace."
              </blockquote>
              <cite className="text-orange-400 font-bold uppercase tracking-widest">— The Dhammapada</cite>
          </div>
      </section>
    </div>
  );
};

export default LandingPage;
