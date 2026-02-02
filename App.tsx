
import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, getUserProfile, saveUserProfile } from './services/firebase';
import { Loader2 } from 'lucide-react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import LegalView from './components/LegalView';
import { UserPreferences, AppPage } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [currentPage, setCurrentPage] = useState<AppPage>('APP');

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        setIsGuest(false);
        // Fetch user data from Firestore
        const profile = await getUserProfile(currentUser.uid);
        if (profile) {
            setPreferences(profile);
        } else {
            // User exists in Auth but no profile yet (new user)
            setPreferences(null);
        }
      } else if (!isGuest) {
        // Only clear preferences if not switching to guest mode manually
        setPreferences(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isGuest]);

  const handleGuestLogin = () => {
      setIsGuest(true);
      // Try to load local preferences if they exist
      try {
        const saved = localStorage.getItem('bodhi_prefs');
        if (saved) {
            setPreferences(JSON.parse(saved));
        } else {
            setPreferences(null);
        }
      } catch (e) {
          setPreferences(null);
      }
      setLoading(false);
  };

  const handleOnboardingComplete = async (prefs: UserPreferences) => {
    await handleUpdatePreferences(prefs);
  };

  const handleUpdatePreferences = async (newPrefs: UserPreferences) => {
      setPreferences(newPrefs);
      if (user && !isGuest) {
          // Save to Firestore
          await saveUserProfile(user.uid, newPrefs);
      } else {
          // Save to LocalStorage for guest
          localStorage.setItem('bodhi_prefs', JSON.stringify(newPrefs));
      }
  };

  const handleLogout = async () => {
    if (isGuest) {
        setIsGuest(false);
        setPreferences(null);
    } else {
        try {
            await signOut(auth);
            // We rely on onAuthStateChanged to clear preferences and user state
            // This prevents the "Onboarding" screen from flashing before the Auth screen appears
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }
  };

  const handleNavigate = (page: AppPage) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-stone-50 text-orange-600">
            <Loader2 className="animate-spin" size={48} />
        </div>
    );
  }

  // Legal Pages (accessible regardless of auth state)
  if (currentPage === 'TERMS') {
    return <div className="min-h-screen bg-stone-50"><LegalView type="terms" language={preferences?.language || 'en'} onBack={() => handleNavigate('APP')} /></div>;
  }
  if (currentPage === 'PRIVACY') {
    return <div className="min-h-screen bg-stone-50"><LegalView type="privacy" language={preferences?.language || 'en'} onBack={() => handleNavigate('APP')} /></div>;
  }

  // App Pages
  if (!user && !isGuest) {
    return <Auth onGuestLogin={handleGuestLogin} onNavigate={handleNavigate} />;
  }

  return (
    <div className="h-screen w-full bg-stone-50 text-stone-800 font-sans">
      {!preferences ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <Dashboard 
          preferences={preferences} 
          onLogout={handleLogout} 
          onUpdatePreferences={handleUpdatePreferences} 
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}

export default App;
