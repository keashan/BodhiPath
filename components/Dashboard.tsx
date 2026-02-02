import React, { useEffect, useState } from 'react';
import { MessageCircle, Brain, BookOpen, PenTool, MapPin, Menu, X, Sun, LogOut, GraduationCap, Globe } from 'lucide-react';
import { UserPreferences, AppView, DailyDrop } from '../types';
import { UI_TEXT } from '../constants';
import ChatInterface from './ChatInterface';
import MeditationHall from './MeditationHall';
import DhammaClassroom from './DhammaClassroom';
import KarmaJournal from './KarmaJournal';
import SuttaExplorer from './SuttaExplorer';
import { generateDailyDharma } from '../services/geminiService';
import { auth } from '../services/firebase';
import Logo from './Logo';
import ConfirmModal from './ConfirmModal';

interface DashboardProps {
  preferences: UserPreferences;
  onLogout: () => void;
  onUpdatePreferences: (newPrefs: UserPreferences) => Promise<void>;
}

const Dashboard: React.FC<DashboardProps> = ({ preferences, onLogout, onUpdatePreferences }) => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [dailyDrop, setDailyDrop] = useState<DailyDrop | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const t = UI_TEXT[preferences.language];

  useEffect(() => {
    const fetchDaily = async () => {
        if (preferences.receiveDailyDrops) {
            const drop = await generateDailyDharma(preferences.language);
            setDailyDrop(drop);
        }
    };
    fetchDaily();
  }, [preferences.receiveDailyDrops, preferences.language]);

  const toggleLanguage = async () => {
      const newLang = preferences.language === 'en' ? 'si' : 'en';
      await onUpdatePreferences({
          ...preferences,
          language: newLang
      });
  };

  const NavItem = ({ view, icon: Icon, label }: { view: AppView, icon: any, label: string }) => (
    <button 
      onClick={() => { setCurrentView(view); setSidebarOpen(false); }}
      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
        currentView === view 
        ? 'bg-orange-100 text-orange-900 font-medium' 
        : 'text-stone-600 hover:bg-stone-100'
      }`}
    >
      <Icon size={20} />
      <span className={preferences.language === 'si' ? 'font-sinhala' : ''}>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      <ConfirmModal 
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={onLogout}
        title={preferences.language === 'si' ? 'පිටවීම' : 'Sign Out'}
        message={preferences.language === 'si' ? 'ඔබට මෙම සැසියෙන් ඉවත් වීමට අවශ්‍ය බව විශ්වාසද?' : 'Are you sure you want to sign out? Your journey progress is saved.'}
        confirmText={preferences.language === 'si' ? 'ඔව්, ඉවත් වන්න' : 'Sign Out'}
        cancelText={preferences.language === 'si' ? 'නැහැ' : 'Cancel'}
        isDestructive={true}
      />
      
      {/* Sidebar (Mobile Overlay + Desktop) */}
      <div className={`fixed inset-0 bg-black/20 z-20 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)} />
      
      <aside className={`fixed md:relative z-30 w-64 h-full bg-white border-r border-stone-200 transform transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
           <div className="flex items-center gap-2">
               <Logo className="w-8 h-8" />
               <h1 className="text-xl font-serif font-bold text-stone-800">BodhiPath</h1>
           </div>
           <button onClick={() => setSidebarOpen(false)} className="md:hidden text-stone-500">
               <X size={20} />
           </button>
        </div>

        <nav className="px-4 space-y-1 flex-1 overflow-y-auto">
          <NavItem view={AppView.DASHBOARD} icon={Sun} label={t.home} />
          <NavItem view={AppView.CLASSROOM} icon={GraduationCap} label={t.classroom} />
          <NavItem view={AppView.CHAT} icon={MessageCircle} label={t.chat} />
          <NavItem view={AppView.MEDITATION} icon={Brain} label={t.meditate} />
          <NavItem view={AppView.JOURNAL} icon={PenTool} label={t.journal} />
          <NavItem view={AppView.SUTTA} icon={BookOpen} label={t.suttaExplorer} />
          <NavItem view={AppView.TEMPLE} icon={MapPin} label={t.temple} />
        </nav>

        <div className="p-4 space-y-2 border-t border-stone-100">
             {/* Language Switcher */}
             <button onClick={toggleLanguage} className="w-full flex items-center space-x-3 p-3 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors">
                <Globe size={18} />
                <span className={`text-sm ${preferences.language === 'si' ? 'font-sinhala' : ''}`}>
                    {preferences.language === 'en' ? 'සිංහල' : 'English'}
                </span>
             </button>

             {/* Sign Out Button */}
             <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center space-x-3 p-3 rounded-xl text-stone-400 hover:bg-red-50 hover:text-red-600 transition-colors mt-2"
             >
                <LogOut size={18} />
                <span className={`text-sm ${preferences.language === 'si' ? 'font-sinhala' : ''}`}>
                   {auth.currentUser ? 'Sign Out' : 'Exit Guest'}
                </span>
             </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b border-stone-200 flex items-center px-4 justify-between shrink-0">
            <button onClick={() => setSidebarOpen(true)} className="text-stone-600">
                <Menu />
            </button>
            <span className="font-serif font-bold text-stone-800">BodhiPath</span>
            <div className="w-6" /> {/* Spacer */}
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            
            {/* VIEW: DASHBOARD */}
            {currentView === AppView.DASHBOARD && (
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-r from-orange-100 to-stone-100 p-8 rounded-3xl shadow-sm border border-orange-200">
                        <h2 className="text-3xl font-serif text-orange-900 mb-2">
                             {preferences.language === 'si' ? 'ආයුබෝවන්' : 'Namaste'}, {auth.currentUser ? (preferences.name || 'Practitioner') : 'Guest'}
                        </h2>
                        <p className="text-stone-600 max-w-lg">
                            May you find peace in your practice today. The path is open before you.
                        </p>
                    </div>

                    {/* Daily Dharma Drop */}
                    {dailyDrop && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-10">
                                 <Sun size={64} className="text-orange-400" />
                             </div>
                             <h3 className={`text-sm font-bold text-orange-600 uppercase tracking-wide mb-3 ${preferences.language === 'si' ? 'font-sinhala' : ''}`}>
                                {t.todaysTeaching}
                             </h3>
                             <blockquote className="text-xl font-serif text-stone-800 italic mb-4 leading-relaxed">
                                "{dailyDrop.quote}"
                             </blockquote>
                             <p className="text-sm text-stone-500 font-medium mb-4">— {dailyDrop.source}</p>
                             <div className="bg-stone-50 p-3 rounded-lg text-stone-600 text-sm">
                                💡 <span className="italic">{dailyDrop.reflection}</span>
                             </div>
                        </div>
                    )}

                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <button onClick={() => setCurrentView(AppView.CLASSROOM)} className="p-6 bg-white rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-all text-left group">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <GraduationCap size={24} />
                            </div>
                            <h3 className={`text-lg font-bold text-stone-800 ${preferences.language === 'si' ? 'font-sinhala' : ''}`}>{t.dhammaClassroom}</h3>
                            <p className="text-sm text-stone-500 mt-1">Start your structured lessons.</p>
                        </button>

                        <button onClick={() => setCurrentView(AppView.MEDITATION)} className="p-6 bg-white rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-all text-left group">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Brain size={24} />
                            </div>
                            <h3 className={`text-lg font-bold text-stone-800 ${preferences.language === 'si' ? 'font-sinhala' : ''}`}>{t.meditateNow}</h3>
                            <p className="text-sm text-stone-500 mt-1">Find stillness with a timer.</p>
                        </button>

                         <button onClick={() => setCurrentView(AppView.CHAT)} className="p-6 bg-white rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-all text-left group">
                            <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <MessageCircle size={24} />
                            </div>
                            <h3 className={`text-lg font-bold text-stone-800 ${preferences.language === 'si' ? 'font-sinhala' : ''}`}>{t.askMonk}</h3>
                            <p className="text-sm text-stone-500 mt-1">Chat or debate the Dhamma.</p>
                        </button>
                    </div>
                </div>
            )}

            {/* VIEW: CHAT */}
            {currentView === AppView.CHAT && (
                <div className="h-full max-w-4xl mx-auto">
                    <ChatInterface language={preferences.language} userGoals={preferences.goals} />
                </div>
            )}

            {/* VIEW: MEDITATION */}
            {currentView === AppView.MEDITATION && (
                <div className="h-full max-w-4xl mx-auto">
                    <MeditationHall language={preferences.language} />
                </div>
            )}

            {/* VIEW: JOURNAL */}
            {currentView === AppView.JOURNAL && (
                <div className="h-full max-w-4xl mx-auto">
                    <KarmaJournal language={preferences.language} />
                </div>
            )}

            {/* VIEW: CLASSROOM */}
            {currentView === AppView.CLASSROOM && (
                <DhammaClassroom language={preferences.language} />
            )}

             {/* VIEW: SUTTA */}
             {currentView === AppView.SUTTA && (
                <div className="h-full max-w-4xl mx-auto">
                   <SuttaExplorer language={preferences.language} />
                </div>
            )}

             {/* VIEW: TEMPLE */}
             {currentView === AppView.TEMPLE && (
                <div className="h-full max-w-4xl mx-auto flex flex-col items-center justify-center p-8 text-center">
                    <div className="bg-white p-12 rounded-3xl shadow-sm border border-stone-200">
                        <MapPin size={64} className="mx-auto mb-6 text-orange-500" />
                        <h2 className="text-3xl font-serif text-stone-800 mb-4">Temple Finder</h2>
                        <p className="text-stone-600 mb-8 max-w-md">
                            To find nearby Theravāda centers, please use the <strong>Chat</strong> feature and ask Bhante Bodhi: <br/> 
                            <em>"Where are the nearest temples?"</em>
                        </p>
                        <button onClick={() => setCurrentView(AppView.CHAT)} className="bg-stone-800 text-white px-8 py-3 rounded-full hover:bg-stone-900 transition-colors">
                            Go to Chat
                        </button>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;