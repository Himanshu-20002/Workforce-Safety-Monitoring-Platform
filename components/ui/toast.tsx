'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, duration?: number) => void;
  toasts: ToastItem[];
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'success', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, toasts, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastContainer({ toasts, removeToast }: { toasts: ToastItem[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((item) => (
        <ToastCard key={item.id} item={item} onDismiss={() => removeToast(item.id)} />
      ))}
    </div>
  );
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, item.duration || 4000);

    return () => clearTimeout(timer);
  }, [item.duration, onDismiss]);

  let icon = <Info className="h-5 w-5 text-blue-500" />;
  let borderClass = 'border-l-blue-500';
  let bgClass = 'bg-blue-50/95 dark:bg-blue-950/90';

  if (item.type === 'success') {
    icon = <CheckCircle className="h-5 w-5 text-emerald-500" />;
    borderClass = 'border-l-emerald-500';
    bgClass = 'bg-emerald-50/95 dark:bg-emerald-950/90';
  } else if (item.type === 'error') {
    icon = <AlertCircle className="h-5 w-5 text-rose-500" />;
    borderClass = 'border-l-rose-500';
    bgClass = 'bg-rose-50/95 dark:bg-rose-950/90';
  } else if (item.type === 'warning') {
    icon = <AlertTriangle className="h-5 w-5 text-amber-500" />;
    borderClass = 'border-l-amber-500';
    bgClass = 'bg-amber-50/95 dark:bg-amber-950/90';
  }

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border border-border/80 border-l-4 ${borderClass} ${bgClass} shadow-lg backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in-50`}
    >
      <div className="shrink-0 pt-0.5">{icon}</div>
      <div className="flex-1 text-sm font-semibold text-foreground leading-relaxed pr-2">
        {item.message}
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 p-0.5 rounded-lg text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
