
import React from 'react';
import { Heart, Compass, History } from 'lucide-react';
import { Language } from '../types';

interface AboutUsProps {
  language: Language;
}

const AboutUs: React.FC<AboutUsProps> = ({ language }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <header className="text-center mb-20">
          <h1 className={`text-5xl font-serif font-bold text-stone-900 mb-6 ${language === 'si' ? 'font-sinhala' : ''}`}>
              {language === 'si' ? 'අප ගැන' : 'Our Mission'}
          </h1>
          <p className="text-xl text-stone-500 italic font-serif">Preserving the timeless Dhamma through the lens of modern innovation.</p>
      </header>

      <div className="space-y-24">
          <section className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1">
                  <h2 className="text-3xl font-bold text-stone-800 mb-6">Lineage & Intent</h2>
                  <p className="text-stone-600 leading-relaxed text-lg mb-4">
                      BodhiPath was born from a desire to make the profound teachings of Theravāda Buddhism accessible to a digital generation. We believe that technology, when guided by Right Intention, can be a powerful tool for spiritual growth.
                  </p>
                  <p className="text-stone-600 leading-relaxed text-lg">
                      Our AI Monk, Bhante Bodhi, is carefully structured to reference the Pali Canon (Tipitaka), providing a companion that encourages reflection rather than just giving rote answers.
                  </p>
              </div>
              <div className="w-64 h-64 bg-orange-50 rounded-[3rem] flex items-center justify-center text-orange-500">
                  <Compass size={120} />
              </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-sm">
                  <div className="text-stone-800 mb-6 font-bold flex items-center gap-3">
                      <Heart className="text-red-400" /> Compassion First
                  </div>
                  <p className="text-stone-600 italic">Every line of code and every interaction is designed to foster loving-kindness and mental clarity.</p>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-sm">
                  <div className="text-stone-800 mb-6 font-bold flex items-center gap-3">
                      <History className="text-blue-400" /> Preserving Tradition
                  </div>
                  <p className="text-stone-600 italic">We strictly adhere to the Theravāda interpretation of the Buddha's teachings as found in the ancient texts.</p>
              </div>
          </section>
      </div>
    </div>
  );
};

export default AboutUs;
