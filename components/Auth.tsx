
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, signInWithGoogle } from '../services/firebase';
import { Loader2, Mail, Lock, LogIn, User, AlertCircle } from 'lucide-react';
import Logo from './Logo';

interface AuthProps {
  onGuestLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onGuestLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      if (err.message.includes('auth/api-key-not-valid')) {
        setError("Firebase not configured. Please add API Key to services/firebase.ts or use Guest Mode.");
      } else {
        setError(err.message.replace('Firebase: ', ''));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/unauthorized-domain') {
        setError(`Domain not authorized: ${window.location.hostname}. Please add this domain to Firebase Console > Auth > Settings, or use Guest Mode.`);
      } else if (err.message && err.message.includes('auth/api-key-not-valid')) {
        setError("Firebase API Key is missing/invalid. Try Guest Mode.");
      } else {
        setError("Failed to sign in. " + (err.message || "Unknown error"));
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
         <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute top-[-50px] right-[-50px] w-96 h-96 fill-orange-300">
            <path d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.7C91.4,-34.3,98.1,-19.6,95.8,-5.8C93.5,8,82.2,21,71.6,32.1C61,43.2,51.1,52.4,40,60.2C28.9,68,16.6,74.4,2.9,79.4C-10.8,84.4,-25.9,88.1,-39.3,83.3C-52.7,78.5,-64.4,65.2,-73.4,50.7C-82.4,36.2,-88.7,20.5,-88.1,5.2C-87.5,-10.1,-80,-25,-69.8,-37.7C-59.6,-50.4,-46.7,-60.9,-33.4,-68.6C-20.1,-76.3,-6.4,-81.2,5.2,-90.2L16.8,-99.2" transform="translate(100 100)" />
         </svg>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 shadow-xl w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
            <div className="mb-4 flex justify-center">
                <Logo className="w-20 h-20 drop-shadow-sm" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-stone-800">BodhiPath</h1>
            <p className="text-stone-500 mt-2 font-serif italic">Begin your journey within.</p>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 flex items-center">
                <Mail className="text-stone-400 mr-3" size={20} />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent w-full outline-none text-stone-800 placeholder-stone-400"
                    required
                />
            </div>
            <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 flex items-center">
                <Lock className="text-stone-400 mr-3" size={20} />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent w-full outline-none text-stone-800 placeholder-stone-400"
                    required
                    minLength={6}
                />
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center flex items-center justify-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-stone-800 hover:bg-stone-900 text-white py-3 rounded-full font-medium transition-all shadow-lg flex justify-center items-center"
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
        </form>

        <div className="my-6 flex items-center justify-between">
            <div className="h-px bg-stone-200 w-full"></div>
            <span className="px-3 text-stone-400 text-sm">or</span>
            <div className="h-px bg-stone-200 w-full"></div>
        </div>

        <button 
            onClick={handleGoogleAuth}
            type="button"
            className="w-full bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 py-3 rounded-full font-medium transition-all flex items-center justify-center space-x-2 mb-3"
        >
             <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            <span>Continue with Google</span>
        </button>

        <button 
            onClick={onGuestLogin}
            type="button"
            className="w-full bg-orange-50 border border-orange-200 hover:bg-orange-100 text-orange-900 py-3 rounded-full font-medium transition-all flex items-center justify-center space-x-2"
        >
             <User className="w-5 h-5" />
            <span>Continue as Guest</span>
        </button>

        <div className="mt-6 text-center">
            <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="text-stone-500 hover:text-stone-700 text-sm font-medium"
            >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
        </div>

        <div className="mt-8 pt-4 border-t border-stone-100 flex justify-center space-x-6 text-xs text-stone-400">
             <a href="#/terms" className="hover:text-orange-600 transition-colors font-medium">Terms of Service</a>
             <a href="#/privacy" className="hover:text-orange-600 transition-colors font-medium">Privacy Policy</a>
        </div>

      </motion.div>
    </div>
  );
};

export default Auth;
