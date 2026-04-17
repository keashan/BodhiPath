import React, { useEffect, useState, useRef } from 'react';
import { MessageCircle, Brain, BookOpen, PenTool, MapPin, Menu, X, Sun, LogOut, GraduationCap, Compass, Loader2, Share2, Sparkles, ChevronRight, Shield } from 'lucide-react';
import { UserPreferences, AppView, DailyDrop } from '../types';
import { UI_TEXT } from '../constants';
import ChatInterface from './ChatInterface';
import MeditationHall from './MeditationHall';
import DhammaClassroom from './DhammaClassroom';
import KarmaJournal from './KarmaJournal';
import SuttaExplorer from './SuttaExplorer';
import DailyDropsView from './DailyDropsView';
import AdminPanel from './AdminPanel';
import { generateDailyDharma, getPersonalizedGuidance } from '../services/geminiService';
import { auth, getDailyWisdom, saveDailyWisdom } from '../services/firebase';
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
  const [dropHistory, setDropHistory] = useState<DailyDrop[]>([]);
  const [personalizedGuidance, setPersonalizedGuidance] = useState<string>('');
  const [loadingGuidance, setLoadingGuidance] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const t = UI_TEXT[preferences.language];

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Inject Ad Script
  useEffect(() => {
    const scriptSrc = "https://anniversaryvacuumambassador.com/d8c772d201c9897096542407c0adf8a0/invoke.js";
    if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
        const script = document.createElement('script');
        script.async = true;
        script.dataset.cfasync = "false";
        script.src = scriptSrc;
        document.body.appendChild(script);
    }
  }, []);

  // Reset scroll on view change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [currentView]);

  useEffect(() => {
    const handleDailyWisdom = async () => {
        if (!preferences.receiveDailyDrops) return;

        const date = new Date();
        const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        const lang = preferences.language;

        const savedHistory = localStorage.getItem('bodhi_drop_history');
        const history: DailyDrop[] = savedHistory ? JSON.parse(savedHistory) : [];
        setDropHistory(history);

        let today: DailyDrop | null = null;

        // Try global Firebase first (works for both guests and logged-in users)
        try {
            const date = new Date();
            const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            const lang = preferences.language;

            today = await getDailyWisdom(dateKey, lang);

            if (!today) {
                // If not in Firebase, check local cache first to avoid unnecessary generation/writes
                const savedToday = localStorage.getItem('bodhi_drop_today');
                const localToday: DailyDrop | null = savedToday ? JSON.parse(savedToday) : null;
                const isStillValid = localToday && (Date.now() - localToday.timestamp < 12 * 60 * 60 * 1000);

                if (isStillValid) {
                   today = localToday;
                } else {
                   const newDropData = await generateDailyDharma(lang);
                   today = { ...newDropData, timestamp: Date.now() };
                }
                
                // Try to save to Firebase, but catch permission errors silently 
                // as they usually mean another user (or tab) just saved it.
                try {
                  await saveDailyWisdom(dateKey, lang, today);
                } catch (saveError: any) {
                  // Silent catch for race conditions
                  console.log("Note: Concurrent wisdom save suppressed.");
                }
            }
            
            // Sync to local today for faster subsequent loads
            localStorage.setItem('bodhi_drop_today', JSON.stringify(today));

        } catch (error) {
            console.log("Firebase daily wisdom fetch failed, falling back to local storage", error);
            // Fallback to LocalStorage (e.g. if config is missing or network is down)
            const savedToday = localStorage.getItem('bodhi_drop_today');
            const localToday: DailyDrop | null = savedToday ? JSON.parse(savedToday) : null;
            const now = Date.now();
            const oneDay = 24 * 60 * 60 * 1000;

            if (!localToday || (now - localToday.timestamp > oneDay)) {
                if (localToday && !history.find(d => d.timestamp === localToday?.timestamp)) {
                    const updatedHistory = [localToday, ...history].slice(0, 10);
                    setDropHistory(updatedHistory);
                    localStorage.setItem('bodhi_drop_history', JSON.stringify(updatedHistory));
                }
                const newDropData = await generateDailyDharma(lang);
                today = { ...newDropData, timestamp: now };
                localStorage.setItem('bodhi_drop_today', JSON.stringify(today));
            } else {
                today = localToday;
            }
        }

        if (today) {
            setDailyDrop(today);
        }
    };
    handleDailyWisdom();
  }, [preferences.receiveDailyDrops, preferences.language]);

  useEffect(() => {
    const fetchGuidance = async () => {
        if (preferences.isGuided && !personalizedGuidance) {
            setLoadingGuidance(true);
            const guidance = await getPersonalizedGuidance(preferences.language, preferences.goals);
            setPersonalizedGuidance(guidance);
            setLoadingGuidance(false);
        }
    };
    fetchGuidance();
  }, [preferences.isGuided, preferences.goals, preferences.language]);

  const handleShare = async () => {
    const shareData = {
      title: 'BodhiPath',
      text: t.shareMessage,
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert(t.linkCopied);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
    }
  };

  const navigateTo = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = hash;
  };

  const isAdmin = auth.currentUser?.email === 'keashanjayaweera@gmail.com';

  const NavItem = ({ view, icon: Icon, label, hasUpdate }: { view: AppView, icon: any, label: string, hasUpdate?: boolean }) => (
    <button 
      onClick={() => { setCurrentView(view); setSidebarOpen(false); }}
      className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 ${
        currentView === view 
        ? 'bg-orange-50 text-orange-900 font-bold shadow-sm ring-1 ring-orange-100' 
        : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon size={20} strokeWidth={currentView === view ? 2.5 : 2} />
        <span className={`${preferences.language === 'si' ? 'font-sinhala' : 'font-medium'} text-sm`}>{label}</span>
      </div>
      {hasUpdate && <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />}
    </button>
  );

  const AppFooter = () => (
    <footer className="mt-auto pt-12 pb-6 text-center border-t border-stone-100 w-full px-4">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-4">
            <a 
                href="#/terms"
                onClick={navigateTo('#/terms')}
                className={`text-xs text-stone-400 hover:text-orange-600 transition-colors uppercase tracking-widest font-bold underline-offset-4 hover:underline ${preferences.language === 'si' ? 'font-sinhala' : ''}`}
            >
                {t.terms}
            </a>
            <a 
                href="#/privacy"
                onClick={navigateTo('#/privacy')}
                className={`text-xs text-stone-400 hover:text-orange-600 transition-colors uppercase tracking-widest font-bold underline-offset-4 hover:underline ${preferences.language === 'si' ? 'font-sinhala' : ''}`}
            >
                {t.privacy}
            </a>
        </div>
        <p className="text-[10px] text-stone-300 font-serif tracking-wider uppercase">© 2025 BodhiPath • Path to Liberation</p>
    </footer>
  );

  return (
    <div className="flex h-screen bg-[#fdfcfb] overflow-hidden">
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
      
      {/* Navigation Sidebar */}
      <div className={`fixed inset-0 bg-stone-900/10 backdrop-blur-sm z-20 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)} />
      
      <aside className={`fixed md:relative z-30 w-72 h-full bg-white/80 backdrop-blur-md border-r border-stone-100 transform transition-transform duration-500 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col shadow-2xl md:shadow-none`}>
        <div className="p-8 flex items-center justify-between">
           <div className="flex items-center gap-3">
               <Logo className="w-10 h-10 drop-shadow-sm" />
               <h1 className="text-2xl font-serif font-bold text-stone-800 tracking-tight">BodhiPath</h1>
           </div>
           <button onClick={() => setSidebarOpen(false)} className="md:hidden text-stone-400 p-1 hover:bg-stone-50 rounded-lg">
               <X size={20} />
           </button>
        </div>

        <nav className="px-5 space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
          <NavItem view={AppView.DASHBOARD} icon={Sun} label={t.home} />
          <NavItem view={AppView.DAILY_DROPS} icon={Sparkles} label={t.dailyDrops} />
          <div className="h-px bg-stone-50 mx-4 my-2" />
          <NavItem view={AppView.CLASSROOM} icon={GraduationCap} label={t.classroom} />
          <NavItem view={AppView.CHAT} icon={MessageCircle} label={t.chat} />
          <NavItem view={AppView.MEDITATION} icon={Brain} label={t.meditate} />
          <NavItem view={AppView.JOURNAL} icon={PenTool} label={t.journal} />
          <NavItem view={AppView.SUTTA} icon={BookOpen} label={t.suttaExplorer} />
          <NavItem view={AppView.TEMPLE} icon={MapPin} label={t.temple} />
          {isAdmin && (
            <>
              <div className="h-px bg-stone-50 mx-4 my-2" />
              <NavItem view={AppView.ADMIN} icon={Shield} label="Admin Console" />
            </>
          )}
        </nav>

        <div className="p-6 space-y-3 border-t border-stone-50">
             <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center space-x-3 p-3.5 rounded-2xl text-stone-400 hover:bg-red-50 hover:text-red-600 transition-all"
             >
                <LogOut size={18} />
                <span className={`text-sm font-medium ${preferences.language === 'si' ? 'font-sinhala' : ''}`}>
                   {auth.currentUser ? 'Sign Out' : 'Exit Guest'}
                </span>
             </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="md:hidden h-20 bg-white/80 backdrop-blur-md border-b border-stone-100 flex items-center px-6 justify-between shrink-0 z-10">
            <button onClick={() => setSidebarOpen(true)} className="text-stone-800 p-2 bg-stone-50 rounded-xl">
                <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
                <Logo className="w-8 h-8" />
                <span className="font-serif font-bold text-xl text-stone-800">BodhiPath</span>
            </div>
            <div className="w-10" />
        </header>

        <div className="flex-1 flex overflow-hidden">
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 md:p-12 custom-scrollbar">
                {currentView === AppView.DASHBOARD && (
                    <div className="max-w-4xl mx-auto space-y-12 min-h-full flex flex-col">
                        <div className="flex-1 space-y-10">
                            {/* Welcome Banner */}
                            <div className="bg-gradient-to-br from-orange-50 to-stone-50 p-10 rounded-[2.5rem] shadow-sm border border-orange-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                                <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white opacity-40 blur-3xl rounded-full" />
                                <Logo className="w-24 h-24 md:w-32 md:h-32 drop-shadow-xl z-10" />
                                <div className="text-center md:text-left z-10">
                                    <h2 className="text-4xl font-serif text-stone-900 mb-3 font-bold">
                                        {preferences.language === 'si' ? 'ආයුබෝවන්' : 'Namaste'}, {auth.currentUser ? (preferences.name || 'Practitioner') : 'Guest'}
                                    </h2>
                                    <p className="text-stone-500 max-w-lg italic font-serif text-lg">
                                        {preferences.language === 'si' 
                                            ? 'ඔබේ අද දින පුහුණුව සාර්ථක වේවා! මඟ පෙන්වීම ඉදිරියෙන්ම ඇත.' 
                                            : 'May you find peace in your practice today. Your path is open before you.'}
                                    </p>
                                </div>
                            </div>

                            {/* Path Guidance */}
                            {preferences.isGuided && (
                                <div className="bg-stone-900 text-stone-50 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group border border-stone-800 ring-4 ring-orange-500/5">
                                    <div className="absolute top-[-40px] right-[-40px] opacity-10 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">
                                        <Compass size={200} />
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className={`text-xs font-bold text-orange-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 ${preferences.language === 'si' ? 'font-sinhala' : ''}`}>
                                            <Sparkles size={16} className="animate-pulse" />
                                            {preferences.language === 'si' ? 'භන්තේගේ මග පෙන්වීම' : "Bhante's Path Guidance"}
                                        </h3>
                                        {loadingGuidance ? (
                                            <div className="flex items-center gap-3 text-stone-400 italic py-2">
                                                <Loader2 size={18} className="animate-spin" />
                                                <span className="text-sm">Consulting with Bhante Bodhi...</span>
                                            </div>
                                        ) : (
                                            <p className={`text-xl font-serif leading-relaxed italic text-stone-100 ${preferences.language === 'si' ? 'font-sinhala' : ''}`}>
                                                {personalizedGuidance || "Continue with your structured lessons in the Classroom to build a solid foundation."}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Daily Dharma Drop Card */}
                            {dailyDrop && (
                                <button 
                                    onClick={() => setCurrentView(AppView.DAILY_DROPS)}
                                    className="w-full text-left bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 relative overflow-hidden group hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-500"
                                >
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-110 transition-all duration-700">
                                        <Logo className="w-64 h-64" />
                                    </div>
                                    <h3 className={`text-xs font-bold text-orange-600 uppercase tracking-[0.2em] mb-5 flex items-center gap-2 ${preferences.language === 'si' ? 'font-sinhala' : ''}`}>
                                        <Sun size={14} />
                                        {t.todaysTeaching}
                                    </h3>
                                    <blockquote className="text-2xl font-serif text-stone-800 italic mb-6 leading-snug line-clamp-3">
                                        "{dailyDrop.quote}"
                                    </blockquote>
                                    <div className="flex items-center justify-between border-t border-stone-50 pt-6">
                                        <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">— {dailyDrop.source}</p>
                                        <span className="text-xs text-orange-600 font-black flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                                            VIEW FULL WISDOM <ChevronRight size={16} />
                                        </span>
                                    </div>
                                </button>
                            )}

                            {/* Quick Actions Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <button onClick={() => setCurrentView(AppView.CLASSROOM)} className="p-8 bg-white rounded-3xl shadow-sm border border-stone-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left group">
                                    <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-100 transition-all">
                                        <GraduationCap size={28} />
                                    </div>
                                    <h3 className={`text-xl font-bold text-stone-800 mb-2 ${preferences.language === 'si' ? 'font-sinhala' : ''}`}>{t.dhammaClassroom}</h3>
                                    <p className="text-sm text-stone-400 leading-relaxed">Structured lessons on the path to liberation.</p>
                                </button>

                                <button onClick={() => setCurrentView(AppView.MEDITATION)} className="p-8 bg-white rounded-3xl shadow-sm border border-stone-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left group">
                                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-100 transition-all">
                                        <Brain size={28} />
                                    </div>
                                    <h3 className={`text-xl font-bold text-stone-800 mb-2 ${preferences.language === 'si' ? 'font-sinhala' : ''}`}>{t.meditateNow}</h3>
                                    <p className="text-sm text-stone-400 leading-relaxed">Find stillness and clarity with our guided timer.</p>
                                </button>

                                <button onClick={() => setCurrentView(AppView.CHAT)} className="p-8 bg-white rounded-3xl shadow-sm border border-stone-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left group">
                                    <div className="w-14 h-14 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-sky-100 transition-all">
                                        <MessageCircle size={28} />
                                    </div>
                                    <h3 className={`text-xl font-bold text-stone-800 mb-2 ${preferences.language === 'si' ? 'font-sinhala' : ''}`}>{t.askMonk}</h3>
                                    <p className="text-sm text-stone-400 leading-relaxed">Direct spiritual dialogue with Bhante Bodhi.</p>
                                </button>
                            </div>

                            {/* Spread the Dhamma Section */}
                            <div className="bg-orange-100/30 border border-orange-100 rounded-[2.5rem] p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className={`text-2xl font-bold text-orange-900 mb-2 ${preferences.language === 'si' ? 'font-sinhala' : ''}`}>
                                        {t.spreadDhamma}
                                    </h3>
                                    <p className={`text-orange-800/60 text-lg ${preferences.language === 'si' ? 'font-sinhala' : ''}`}>
                                        {preferences.language === 'si' 
                                            ? 'බුදුන් වහන්සේගේ ඉගැන්වීම් ලොව පුරා පතුරුවන්න සහය වන්න.' 
                                            : 'Invite others to embark on their own spiritual journey.'}
                                    </p>
                                </div>
                                <button 
                                    onClick={handleShare}
                                    className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-orange-700 hover:shadow-2xl hover:shadow-orange-200 transition-all shrink-0 text-lg"
                                >
                                    <Share2 size={22} />
                                    <span className={preferences.language === 'si' ? 'font-sinhala' : ''}>{t.inviteFriends}</span>
                                </button>
                            </div>
                        </div>
                        <AppFooter />
                    </div>
                )}

                {currentView === AppView.ADMIN && isAdmin && (
                    <AdminPanel language={preferences.language} />
                )}
                
                {/* Other views */}
                {currentView === AppView.DAILY_DROPS && (
                    <DailyDropsView language={preferences.language} currentDrop={dailyDrop} history={dropHistory} onBack={() => setCurrentView(AppView.DASHBOARD)} />
                )}
                {currentView === AppView.CHAT && (
                    <div className="h-full max-w-4xl mx-auto flex flex-col"><ChatInterface language={preferences.language} userGoals={preferences.goals} /></div>
                )}
                {currentView === AppView.MEDITATION && (
                    <div className="h-full max-w-4xl mx-auto"><MeditationHall language={preferences.language} /></div>
                )}
                {currentView === AppView.JOURNAL && (
                    <div className="h-full max-w-4xl mx-auto"><KarmaJournal language={preferences.language} /></div>
                )}
                {currentView === AppView.CLASSROOM && <DhammaClassroom language={preferences.language} />}
                {currentView === AppView.SUTTA && (
                    <div className="h-full max-w-4xl mx-auto"><SuttaExplorer language={preferences.language} /></div>
                )}
                {currentView === AppView.TEMPLE && (
                    <div className="h-full max-w-4xl mx-auto flex flex-col items-center justify-center p-8 text-center">
                        <div className="bg-white p-16 rounded-[3rem] shadow-sm border border-stone-100 max-w-lg">
                            <MapPin size={80} className="mx-auto mb-8 text-orange-500 opacity-20" />
                            <h2 className="text-3xl font-serif text-stone-800 mb-6 font-bold">Temple Finder</h2>
                            <p className="text-stone-500 mb-10 text-lg leading-relaxed">
                                To find nearby Theravāda centers, please use the <strong>Chat</strong> feature and ask Bhante Bodhi: <br/> 
                                <em className="text-orange-600 mt-4 block">"Where are the nearest temples?"</em>
                            </p>
                            <button onClick={() => setCurrentView(AppView.CHAT)} className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-stone-200">
                                Open Chat
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Sidebar */}
            <aside className="hidden xl:flex w-80 bg-[#faf9f8] border-l border-stone-100 flex-col p-8 shrink-0">
                <div className="w-full h-full rounded-[2.5rem] bg-white border border-stone-100 shadow-sm flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200 opacity-20" />
                    <p className="text-[10px] text-stone-300 font-bold uppercase tracking-[0.3em] mb-4">Awaiting Reflection</p>
                    <div id="container-d8c772d201c9897096542407c0adf8a0" className="w-full flex items-center justify-center"></div>
                </div>
            </aside>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;