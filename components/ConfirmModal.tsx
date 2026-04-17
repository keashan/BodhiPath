import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, onClose, onConfirm, title, message, 
  confirmText = "Confirm", cancelText = "Cancel", isDestructive = false 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 overflow-hidden relative border border-stone-100"
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDestructive ? 'bg-red-100 text-red-500' : 'bg-orange-100 text-orange-500'}`}>
                <AlertCircle size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-800 mb-2">{title}</h3>
              <p className="text-stone-600 mb-8 leading-relaxed text-sm">{message}</p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 transition-colors"
                >
                  {cancelText}
                </button>
                <button 
                  onClick={() => { onConfirm(); onClose(); }}
                  className={`flex-1 py-3 rounded-xl text-white font-bold transition-colors shadow-lg ${isDestructive ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : 'bg-stone-800 hover:bg-stone-900 shadow-stone-200'}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;