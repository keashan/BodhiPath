
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';
import { UI_TEXT, GOAL_OPTIONS } from '../constants';
import { UserPreferences, Language } from '../types';
import Logo from './Logo';

interface OnboardingProps {
  onComplete: (prefs: UserPreferences) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState<Language>('en');
  const [goals, setGoals] = useState<string[]>([]);
  const [receiveDailyDrops, setReceiveDailyDrops] = useState(true);
  const [isGuided, setIsGuided] = useState(false);

  const t = UI_TEXT[language];
  const goalOpts = GOAL_OPTIONS[language];

  const handleNext = () => setStep(prev => prev + 1);

  const toggleGoal = (goal: string) => {
    setGoals(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const finishOnboarding = () => {
    onComplete({
      hasCompletedOnboarding: true,
      language,
      goals,
      receiveDailyDrops,
      isGuided,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
         <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute top-[-50px] right-[-50px] w-96 h-96 fill-orange-300">
            <path d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.7C91.4,-34.3,98.1,-19.6,95.8,-5.8C93.5,8,82.2,21,71.6,32.1C61,43.2,51.1,52.4,40,60.2C28.9,68,16.6,74.4,2.9,79.4C-10.8,84.4,-25.9,88.1,-39.3,83.3C-52.7,78.5,-64.4,65.2,-73.4,50.7C-82.4,36.2,-88.7,20.5,-88.1,5.2C-87.5,-10.1,-80,-25,-69.8,-37.7C-59.6,-50.4,-46.7,-60.9,-33.4,-68.6C-20.1,-76.3,-6.4,-81.2,5.2,-90.2L16.8,-99.2" transform="translate(100 100)" />
         </svg>
      </div>

      <div className="w-full max-w-md z-10">
        <AnimatePresence mode="wait">
          
          {/* Step 1: Welcome */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-3xl p-8 shadow-xl text-center"
            >
              <div className="mb-6 flex justify-center">
                <Logo className="w-24 h-24 drop-shadow-md" />
              </div>
              <h1 className="text-3xl font-serif text-stone-800 mb-4 font-bold">BodhiPath</h1>
              <p className="text-stone-600 mb-8 leading-relaxed font-serif italic">
                {language === 'si' ? UI_TEXT.si.subtitle : UI_TEXT.en.subtitle}
              </p>
              <button 
                onClick={handleNext}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-full font-medium transition-all shadow-lg shadow-orange-200"
              >
                {language === 'si' ? UI_TEXT.si.startBtn : UI_TEXT.en.startBtn}
              </button>
              <div className="mt-4 flex justify-center space-x-4 text-sm text-stone-400">
                <button onClick={() => setLanguage('en')} className={language === 'en' ? 'text-orange-600 font-bold' : ''}>English</button>
                <span>|</span>
                <button onClick={() => setLanguage('si')} className={language === 'si' ? 'text-orange-600 font-bold' : ''}>සිංහල</button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Language */}
          {step === 2 && (
            <motion.div
               key="step2"
               variants={containerVariants}
               initial="hidden"
               animate="visible"
               exit="exit"
               className="bg-white rounded-3xl p-8 shadow-xl"
            >
               <h2 className={`text-2xl font-serif text-stone-800 mb-6 ${language === 'si' ? 'font-sinhala' : ''}`}>
                 {t.langSelect}
               </h2>
               <div className="space-y-4">
                 <button 
                   onClick={() => { setLanguage('en'); handleNext(); }}
                   className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${language === 'en' ? 'border-orange-500 bg-orange-50' : 'border-stone-200 hover:border-orange-200'}`}
                 >
                   <span className="text-lg">English</span>
                   {language === 'en' && <Check className="text-orange-500" />}
                 </button>
                 <button 
                   onClick={() => { setLanguage('si'); handleNext(); }}
                   className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all font-sinhala ${language === 'si' ? 'border-orange-500 bg-orange-50' : 'border-stone-200 hover:border-orange-200'}`}
                 >
                   <span className="text-lg">සිංහල</span>
                   {language === 'si' && <Check className="text-orange-500" />}
                 </button>
               </div>
            </motion.div>
          )}

          {/* Step 3: Goals */}
          {step === 3 && (
            <motion.div
               key="step3"
               variants={containerVariants}
               initial="hidden"
               animate="visible"
               exit="exit"
               className="bg-white rounded-3xl p-8 shadow-xl"
            >
               <h2 className={`text-2xl font-serif text-stone-800 mb-6 ${language === 'si' ? 'font-sinhala' : ''}`}>
                 {t.goalsTitle}
               </h2>
               <div className="space-y-3 mb-8">
                 {goalOpts.map((goal) => (
                   <button 
                     key={goal}
                     onClick={() => toggleGoal(goal)}
                     className={`w-full text-left p-4 rounded-xl border flex items-center transition-all ${goals.includes(goal) ? 'bg-orange-50 border-orange-500 text-orange-900' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}
                   >
                     <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${goals.includes(goal) ? 'bg-orange-500 border-orange-500' : 'border-stone-300'}`}>
                        {goals.includes(goal) && <Check size={12} className="text-white" />}
                     </div>
                     <span className={language === 'si' ? 'font-sinhala' : ''}>{goal}</span>
                   </button>
                 ))}
               </div>
               <button 
                onClick={handleNext}
                disabled={goals.length === 0}
                className="w-full bg-stone-800 disabled:opacity-50 text-white py-3 rounded-full flex items-center justify-center space-x-2"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </motion.div>
          )}

          {/* Step 4: Personalization */}
          {step === 4 && (
             <motion.div
                key="step4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-3xl p-8 shadow-xl"
             >
                <h2 className={`text-2xl font-serif text-stone-800 mb-6 ${language === 'si' ? 'font-sinhala' : ''}`}>
                  {t.personalizeTitle}
                </h2>
                <div className="space-y-4 mb-8">
                   <button 
                      onClick={() => { setIsGuided(true); handleNext(); }} 
                      className="w-full p-4 bg-orange-100 text-orange-900 rounded-xl font-medium hover:bg-orange-200 transition-colors"
                   >
                     {language === 'si' ? 'ඔව්, මග පෙන්වන්න' : 'Yes, guide me'}
                   </button>
                   <button 
                      onClick={() => { setIsGuided(false); handleNext(); }} 
                      className="w-full p-4 bg-stone-100 text-stone-600 rounded-xl font-medium hover:bg-stone-200 transition-colors"
                   >
                     {language === 'si' ? 'නැහැ, මමම සොයන්නම්' : 'No, I’ll explore freely'}
                   </button>
                </div>
             </motion.div>
          )}

           {/* Step 5: Daily Drops */}
           {step === 5 && (
             <motion.div
                key="step5"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-3xl p-8 shadow-xl"
             >
                <h2 className={`text-2xl font-serif text-stone-800 mb-6 ${language === 'si' ? 'font-sinhala' : ''}`}>
                  {t.dailyDropTitle}
                </h2>
                <div className="flex space-x-4 mb-8">
                   <button onClick={() => { setReceiveDailyDrops(true); handleNext(); }} className="flex-1 p-6 bg-white border-2 border-stone-200 hover:border-orange-400 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all">
                      <span className="text-3xl">🌞</span>
                      <span className="font-bold text-stone-700">{language === 'si' ? 'ඔව්' : 'Yes'}</span>
                   </button>
                   <button onClick={() => { setReceiveDailyDrops(false); handleNext(); }} className="flex-1 p-6 bg-white border-2 border-stone-200 hover:border-stone-400 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all">
                      <span className="text-3xl">🌑</span>
                      <span className="font-bold text-stone-700">{language === 'si' ? 'නැහැ' : 'No'}</span>
                   </button>
                </div>
             </motion.div>
          )}

          {/* Step 6: Final */}
          {step === 6 && (
             <motion.div
                key="step6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-3xl p-8 shadow-xl text-center"
             >
                <div className="mb-6 flex justify-center">
                  <Logo className="w-24 h-24 animate-pulse" />
                </div>
                <h2 className={`text-2xl font-serif text-stone-800 mb-2 font-bold ${language === 'si' ? 'font-sinhala' : ''}`}>
                  {t.finalTitle}
                </h2>
                <p className={`text-stone-600 mb-8 ${language === 'si' ? 'font-sinhala' : ''}`}>
                  {t.finalSubtitle}
                </p>
                <button 
                  onClick={finishOnboarding}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-full font-bold text-lg transition-all shadow-xl shadow-orange-200"
                >
                  {t.enterBtn}
                </button>
             </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
