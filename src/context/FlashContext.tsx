import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type FlashCategory = 'success' | 'info' | 'warning' | 'error';

export interface FlashMessage {
  id: string;
  message: string;
  category: FlashCategory;
  timestamp: Date;
}

interface FlashContextType {
  messages: FlashMessage[];
  flash: (message: string, category?: FlashCategory, durationMs?: number) => void;
  removeFlash: (id: string) => void;
  clearAllFlashes: () => void;
}

const FlashContext = createContext<FlashContextType | undefined>(undefined);

export const FlashProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<FlashMessage[]>([
    {
      id: 'init-1',
      message: 'AgriYield AI system ready. ACO-WOA Hybrid CNN-BiLSTM model loaded (R²=0.9678, RMSE=132.12).',
      category: 'info',
      timestamp: new Date()
    }
  ]);

  const removeFlash = useCallback((id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  }, []);

  const flash = useCallback((message: string, category: FlashCategory = 'info', durationMs: number = 4500) => {
    const id = `flash-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newMsg: FlashMessage = {
      id,
      message,
      category,
      timestamp: new Date()
    };

    setMessages(prev => [newMsg, ...prev.slice(0, 4)]); // Keep maximum 5 active flash notifications

    if (durationMs > 0) {
      setTimeout(() => {
        removeFlash(id);
      }, durationMs);
    }
  }, [removeFlash]);

  const clearAllFlashes = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <FlashContext.Provider value={{ messages, flash, removeFlash, clearAllFlashes }}>
      {children}
    </FlashContext.Provider>
  );
};

export const useFlash = () => {
  const ctx = useContext(FlashContext);
  if (!ctx) {
    throw new Error('useFlash must be used within a FlashProvider');
  }
  return ctx;
};
