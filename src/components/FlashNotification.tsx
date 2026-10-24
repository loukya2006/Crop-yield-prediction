import React from 'react';
import { useFlash, FlashCategory } from '../context/FlashContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const categoryStyles: Record<FlashCategory, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-900',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
  },
  info: {
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    text: 'text-sky-900',
    icon: <Info className="w-5 h-5 text-sky-600 shrink-0" />
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-900',
    icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
  },
  error: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-900',
    icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
  }
};

export const FlashNotificationBanner: React.FC = () => {
  const { messages, removeFlash } = useFlash();

  if (messages.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {messages.map(item => {
        const style = categoryStyles[item.category] || categoryStyles.info;
        return (
          <div
            key={item.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all animate-in fade-in slide-in-from-top-2 duration-200 ${style.bg} ${style.border}`}
          >
            {style.icon}
            <div className="flex-1 text-sm font-medium leading-relaxed ${style.text}">
              {item.message}
            </div>
            <button
              onClick={() => removeFlash(item.id)}
              className="p-1 text-slate-400 hover:text-slate-700 transition-colors rounded-lg -mr-1 -mt-1"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
