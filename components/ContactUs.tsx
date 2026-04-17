
import React, { useState } from 'react';
import { Mail, MessageSquare, Send, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface ContactUsProps {
  language: Language;
}

const ContactUs: React.FC<ContactUsProps> = ({ language }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Resolve environment variable for Web3Forms
  const env = (import.meta as any).env || {};
  const proc = (typeof process !== 'undefined' ? process.env : {}) as any;
  const WEB3FORMS_ACCESS_KEY = env.VITE_WEB3FORMS_KEY || proc.VITE_WEB3FORMS_KEY;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // If key isn't set, show a helpful developer message
    if (!WEB3FORMS_ACCESS_KEY) {
        setError("Configuration Missing: Please set the VITE_WEB3FORMS_KEY environment variable.");
        setLoading(false);
        return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `BodhiPath Inquiry from ${formData.name}`,
          from_name: "BodhiPath Support",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        const submittedEmail = formData.email;
        setFormData({ name: '', email: submittedEmail, message: '' });
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (err: any) {
      console.error("Email delivery error:", err);
      setError(language === 'si' ? 'පණිවිඩය යැවීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.' : 'Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
          <h1 className={`text-5xl font-serif font-bold text-stone-900 mb-6 ${language === 'si' ? 'font-sinhala' : ''}`}>
              {language === 'si' ? 'සම්බන්ධ වන්න' : 'Contact Us'}
          </h1>
          <p className="text-xl text-stone-500 italic font-serif">We are here to support your path.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
                  <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-3">
                      <Mail className="text-orange-500" /> Email Support
                  </h3>
                  <p className="text-stone-600 mb-2">For technical support or Dhamma inquiries:</p>
                  <a href="mailto:bodhipath@ktktools.net" className="text-orange-600 font-bold hover:underline">bodhipath@ktktools.net</a>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
                  <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-3">
                      <MessageSquare className="text-emerald-500" /> Feedback
                  </h3>
                  <p className="text-stone-600 italic">"May all beings be happy." We welcome your suggestions to improve this Dhamma tool.</p>
              </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-xl relative overflow-hidden">
              {submitted ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                          <CheckCircle2 size={32} />
                      </div>
                      <h3 className="text-2xl font-bold text-stone-800 mb-2">Message Sent</h3>
                      <p className="text-stone-500 italic">May you find peace. We will get back to you shortly at {formData.email}.</p>
                      <button 
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({ name: '', email: '', message: '' });
                        }}
                        className="mt-8 bg-stone-100 text-stone-600 px-6 py-2 rounded-full text-sm font-bold hover:bg-stone-200 transition-all"
                      >
                        Send another message
                      </button>
                  </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 ml-1">Name</label>
                        <input 
                            required 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            type="text" 
                            autoComplete="name"
                            className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl focus:outline-none focus:border-orange-300 transition-all" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 ml-1">Email</label>
                        <input 
                            required 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email" 
                            autoComplete="email"
                            className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl focus:outline-none focus:border-orange-300 transition-all" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 ml-1">Message</label>
                        <textarea 
                            required 
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl focus:outline-none focus:border-orange-300 transition-all h-32 resize-none" 
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 text-sm border border-red-100">
                            <AlertCircle size={18} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Sending...</span>
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                <span>Send Message</span>
                            </>
                        )}
                    </button>
                    
                    <p className="text-[10px] text-stone-300 text-center uppercase tracking-widest mt-4 italic">
                        Secured delivery via encrypted transmission
                    </p>
                </form>
              )}
          </div>
      </div>
    </div>
  );
};

export default ContactUs;
