
import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, getUserProfile, saveUserProfile } from './services/firebase';
import { Loader2 } from 'lucide-react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import LegalView from './components/LegalView';
import PublicFooter from './components/Footer';
import { UserPreferences, AppPage, Language } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [currentPage, setCurrentPage] = useState<AppPage>('HOME');
  const [language, setLanguage] = useState<Language>('en');

  // Handle Hash Routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/about') setCurrentPage('ABOUT');
      else if (hash === '#/contact') setCurrentPage('CONTACT');
      else if (hash === '#/terms') setCurrentPage('TERMS');
      else if (hash === '#/privacy') setCurrentPage('PRIVACY');
      else if (hash === '#/app') setCurrentPage('APP');
      else setCurrentPage('HOME');
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check on mount
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsGuest(false);
        const profile = await getUserProfile(currentUser.uid);
        if (profile) {
            setPreferences(profile);
            setLanguage(profile.language);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGuestLogin = () => {
      setIsGuest(true);
      try {
        const saved = localStorage.getItem('bodhi_prefs');
        if (saved) {
            const prefs = JSON.parse(saved);
            setPreferences(prefs);
            setLanguage(prefs.language);
        }
      } catch (e) {}
      setLoading(false);
  };

  const handleOnboardingComplete = async (prefs: UserPreferences) => {
    setLanguage(prefs.language);
    await handleUpdatePreferences(prefs);
  };

  const handleUpdatePreferences = async (newPrefs: UserPreferences) => {
      setPreferences(newPrefs);
      if (user && !isGuest) {
          await saveUserProfile(user.uid, newPrefs);
      } else {
          localStorage.setItem('bodhi_prefs', JSON.stringify(newPrefs));
      }
  };

  const handleLogout = async () => {
    if (isGuest) {
        setIsGuest(false);
        setPreferences(null);
    } else {
        await signOut(auth);
        setPreferences(null);
    }
    window.location.hash = '#/';
  };

  if (loading) {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-stone-50 text-orange-600">
            <Loader2 className="animate-spin" size={48} />
        </div>
    );
  }

  // Dashboard has its own complex layout
  if (currentPage === 'APP' && preferences) {
    return (
        <div className="h-screen w-full bg-stone-50 text-stone-800 font-sans">
            <Dashboard 
                preferences={preferences} 
                onLogout={handleLogout} 
                onUpdatePreferences={handleUpdatePreferences} 
            />
        </div>
    );
  }

  // Public/Marketing Wrapper for other pages
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      <main className="flex-1">
        {currentPage === 'HOME' && <LandingPage language={language} />}
        {currentPage === 'ABOUT' && <AboutUs language={language} />}
        {currentPage === 'CONTACT' && <ContactUs language={language} />}
        {currentPage === 'TERMS' && <LegalView type="terms" language={language} onBack={() => window.location.hash = '#/'} />}
        {currentPage === 'PRIVACY' && <LegalView type="privacy" language={language} onBack={() => window.location.hash = '#/'} />}
        {currentPage === 'APP' && !preferences && (
            !user && !isGuest ? <Auth onGuestLogin={handleGuestLogin} /> : <Onboarding onComplete={handleOnboardingComplete} />
        )}
      </main>
      <PublicFooter language={language} setLanguage={setLanguage} />
    </div>
  );
}

export default App;
