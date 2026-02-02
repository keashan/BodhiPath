
import React, { useState, useEffect } from 'react';
import { PenTool, Save, Trash2, Calendar } from 'lucide-react';
import { Language, JournalEntry } from '../types';
import { UI_TEXT } from '../constants';
import ConfirmModal from './ConfirmModal';

interface KarmaJournalProps {
  language: Language;
}

const KarmaJournal: React.FC<KarmaJournalProps> = ({ language }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newContent, setNewContent] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const t = UI_TEXT[language];

  // Load from local storage for demo (or Firebase if fully integrated)
  useEffect(() => {
    const saved = localStorage.getItem('bodhi_journal');
    if (saved) {
        setEntries(JSON.parse(saved));
    }
  }, []);

  const saveEntry = () => {
      if (!newContent.trim()) return;
      
      const entry: JournalEntry = {
          id: Date.now().toString(),
          date: new Date().toLocaleDateString(),
          content: newContent,
          tags: []
      };

      const updated = [entry, ...entries];
      setEntries(updated);
      localStorage.setItem('bodhi_journal', JSON.stringify(updated));
      setNewContent('');
  };

  const confirmDelete = () => {
      if (!deleteId) return;
      const updated = entries.filter(e => e.id !== deleteId);
      setEntries(updated);
      localStorage.setItem('bodhi_journal', JSON.stringify(updated));
      setDeleteId(null);
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col md:flex-row gap-6">
       <ConfirmModal 
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={confirmDelete}
          title={language === 'si' ? 'සටහන මකන්නද?' : 'Delete Entry'}
          message={language === 'si' ? 'මෙම සටහන නැවත ලබාගත නොහැක. ඔබට විශ්වාසද?' : 'This action cannot be undone. Are you sure you want to delete this reflection?'}
          confirmText={language === 'si' ? 'මකන්න' : 'Delete'}
          cancelText={language === 'si' ? 'නැහැ' : 'Cancel'}
          isDestructive={true}
       />

       {/* Entry Form */}
       <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-stone-200 h-fit">
           <h2 className={`text-2xl font-serif text-stone-800 mb-4 ${language === 'si' ? 'font-sinhala' : ''}`}>
               {t.newEntry}
           </h2>
           <textarea
             value={newContent}
             onChange={(e) => setNewContent(e.target.value)}
             placeholder={t.entryPlaceholder}
             className={`w-full h-64 p-4 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-orange-300 resize-none mb-4 ${language === 'si' ? 'font-sinhala' : ''}`}
           />
           <button 
             onClick={saveEntry}
             disabled={!newContent.trim()}
             className="w-full bg-stone-800 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-stone-900 transition-colors disabled:opacity-50"
           >
               <Save size={18} />
               <span className={language === 'si' ? 'font-sinhala' : ''}>{t.saveEntry}</span>
           </button>
       </div>

       {/* Past Entries */}
       <div className="flex-1 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
           <h3 className="text-stone-500 font-bold uppercase text-sm tracking-wide">Recent Reflections</h3>
           {entries.length === 0 && (
               <div className="text-center py-10 text-stone-400">
                   <PenTool size={32} className="mx-auto mb-2 opacity-50" />
                   <p>Your journey is unwritten.</p>
               </div>
           )}
           {entries.map((entry) => (
               <div key={entry.id} className="bg-white p-5 rounded-xl shadow-sm border border-stone-100 group">
                   <div className="flex justify-between items-start mb-2">
                       <div className="flex items-center gap-2 text-stone-400 text-sm">
                           <Calendar size={14} />
                           <span>{entry.date}</span>
                       </div>
                       <button onClick={() => setDeleteId(entry.id)} className="text-stone-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Trash2 size={16} />
                       </button>
                   </div>
                   <p className={`text-stone-700 whitespace-pre-wrap leading-relaxed font-serif ${language === 'si' ? 'font-sinhala' : ''}`}>
                       {entry.content}
                   </p>
               </div>
           ))}
       </div>
    </div>
  );
};

export default KarmaJournal;
