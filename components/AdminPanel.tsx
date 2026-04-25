import React, { useState, useEffect } from 'react';
import { Shield, Activity, Send, CheckCircle, XCircle, Info, Loader2, RefreshCw, ExternalLink } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase.js';

interface AdminPanelProps {
  language: 'en' | 'si';
}

const AdminPanel: React.FC<AdminPanelProps> = ({ language }) => {
  const [healthData, setHealthData] = useState<any>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [manualResult, setManualResult] = useState<any>(null);
  const [loadingManual, setLoadingManual] = useState(false);
  const [todayStatus, setTodayStatus] = useState<{ posted: boolean; at?: number; id?: string } | null>(null);
  
  const date = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Colombo',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const parts = formatter.formatToParts(date);
  const y = parts.find(p => p.type === 'year')?.value;
  const m = parts.find(p => p.type === 'month')?.value;
  const d = parts.find(p => p.type === 'day')?.value;
  const dateKey = `${y}-${m}-${d}`;

  useEffect(() => {
    // Listen to today's wisdom doc for real-time status
    const wisdomRef = doc(db, "daily_wisdom", `${dateKey}_en`);
    const unsubscribe = onSnapshot(wisdomRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setTodayStatus({
          posted: !!data.fb_posted,
          at: data.fb_posted_at,
          id: data.fb_post_id
        });
      } else {
        setTodayStatus({ posted: false });
      }
    });

    return () => unsubscribe();
  }, [dateKey]);

  const handleHealthCheck = async () => {
    setLoadingHealth(true);
    setHealthData(null);
    console.log("Triggering Health Check through Server Proxy...");
    try {
      const resp = await fetch(`/api/admin/wisdom-proxy?check=1`);
      if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(`HTTP ${resp.status}: ${errorText || 'Unknown Error'}`);
      }
      const data = await resp.json();
      console.log("Health Check Success:", data);
      setHealthData(data);
    } catch (err: any) {
      console.error("Health Check Failed:", err);
      setHealthData({ error: err.message });
    } finally {
      setLoadingHealth(false);
    }
  };

  const handleManualCall = async () => {
    console.log("Manual Post Button Clicked - Requesting Server Proxy...");
    setLoadingManual(true);
    setManualResult(null);
    try {
      const resp = await fetch(`/api/admin/wisdom-proxy?manual=1&force=1`);
      if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(`HTTP ${resp.status}: ${errorText || 'Unknown Error'}`);
      }
      const text = await resp.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        // If not JSON, it's the plain text message the user requested
        data = { message: text, status: 'text_response' };
      }
      console.log("Manual Post Success:", data);
      setManualResult(data);
    } catch (err: any) {
      console.error("Manual Post Failed:", err);
      setManualResult({ error: err.message });
    } finally {
      setLoadingManual(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
          <Shield size={120} />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-stone-800 mb-2 flex items-center gap-3">
              <Shield className="text-orange-600" size={32} />
              Admin Console
            </h2>
            <p className="text-stone-500 italic">Management tools using protected server-side secrets.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Status Section */}
          <div className="space-y-6">
            <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
              <h3 className="text-sm font-bold text-stone-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity size={16} />
                Today's Posting Status
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-stone-50">
                  <span className="text-sm text-stone-500">FB Post Released:</span>
                  {todayStatus?.posted ? (
                    <span className="flex items-center gap-2 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1 rounded-full">
                      <CheckCircle size={14} /> SENT
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-stone-400 font-bold text-xs bg-stone-100 px-3 py-1 rounded-full">
                      <XCircle size={14} /> PENDING
                    </span>
                  )}
                </div>

                {todayStatus?.posted && (
                  <div className="p-4 bg-orange-50/30 rounded-2xl border border-orange-100 space-y-2">
                    <p className="text-[10px] text-orange-800/60 font-bold uppercase tracking-widest">Post Metadata</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[10px] text-stone-400">Date Segment</p>
                        <p className="text-xs font-mono font-bold text-stone-700">{dateKey}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-stone-400">Sent At</p>
                        <p className="text-xs font-mono font-bold text-stone-700">
                          {todayStatus.at ? new Date(todayStatus.at).toLocaleTimeString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    {todayStatus.id && (
                      <div className="pt-2 border-t border-orange-100">
                        <p className="text-[10px] text-stone-400">FB Thread ID</p>
                        <p className="text-xs font-mono font-bold text-orange-900 break-all mb-2">{todayStatus.id}</p>
                        <a 
                          href={`https://facebook.com/${todayStatus.id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] text-orange-600 font-bold hover:underline flex items-center gap-1"
                        >
                          <ExternalLink size={10} /> View existing post
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleHealthCheck}
                disabled={loadingHealth}
                className="w-full flex items-center justify-center gap-3 bg-stone-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-stone-200 disabled:opacity-50"
              >
                {loadingHealth ? <Loader2 className="animate-spin" size={20} /> : <Activity size={20} />}
                Run Health Check API
              </button>

              <button 
                onClick={handleManualCall}
                disabled={loadingManual}
                className="w-full flex items-center justify-center gap-3 border-2 border-orange-600 text-orange-600 py-4 rounded-2xl font-bold hover:bg-orange-50 transition-all disabled:opacity-50"
              >
                {loadingManual ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                Manual Force Post to Facebook
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6 flex flex-col">
            <div className="flex-1 bg-stone-50 p-6 rounded-3xl border border-stone-100 overflow-auto max-h-[400px]">
              <h3 className="text-sm font-bold text-stone-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Info size={16} />
                API Response Output
              </h3>

              {!healthData && !manualResult && (
                <div className="h-full flex flex-col items-center justify-center py-12 text-stone-300">
                  <RefreshCw size={40} className="mb-4 opacity-20" />
                  <p className="text-xs italic">Awaiting API trigger...</p>
                </div>
              )}

              {healthData && (
                <div className="space-y-4">
                  <div className="bg-white p-3 rounded-lg border border-stone-100">
                    <p className="text-[10px] text-stone-400 font-bold uppercase mb-2">Health Check Results</p>
                    <pre className="text-[10px] font-mono p-2 bg-stone-100 rounded leading-relaxed overflow-x-auto">
                      {JSON.stringify(healthData, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {manualResult && (
                <div className="space-y-4">
                  <div className="bg-white p-3 rounded-lg border border-stone-100">
                    <p className="text-[10px] text-stone-400 font-bold uppercase mb-2">Manual Trigger Results</p>
                    
                    {manualResult.message && (
                      <div className={`mb-3 p-3 rounded-xl border ${manualResult.status === 'text_response' ? 'bg-blue-50 border-blue-100 text-blue-800' : 'bg-emerald-50 border-emerald-100 text-emerald-800'}`}>
                        <p className="text-xs font-bold mb-1">Response Message:</p>
                        <p className="text-sm font-medium">{manualResult.message}</p>
                      </div>
                    )}

                    {manualResult.postedToPage && (
                      <div className="mb-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
                        <p className="text-xs text-stone-500 mb-1">Posted to Page:</p>
                        <p className="text-sm font-serif font-bold text-stone-800">{manualResult.postedToPage}</p>
                        <p className="text-[10px] text-stone-400 font-mono">ID: {manualResult.pageId || 'N/A'}</p>
                      </div>
                    )}
                    
                    {manualResult.postUrl && (
                      <a 
                        href={manualResult.postUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-orange-600 text-white text-xs py-2 rounded-lg font-bold mb-3 hover:bg-orange-700 transition-all shadow-sm"
                      >
                        <Send size={14} /> View Live Post on Facebook
                      </a>
                    )}

                    <pre className="text-[10px] font-mono p-2 bg-stone-100 rounded leading-relaxed overflow-x-auto text-stone-600">
                      {JSON.stringify(manualResult, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
            
            <p className="text-[10px] text-stone-400 italic text-center">
              Note: Manual calls override randomization and existing checks but still update Firestore records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
