import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    className: 'border-found/50 bg-found/10',
    iconClass: 'text-found',
  },
  error: {
    icon: AlertCircle,
    className: 'border-lost/50 bg-lost/10',
    iconClass: 'text-lost',
  },
  info: {
    icon: Info,
    className: 'border-primary/50 bg-primary/10',
    iconClass: 'text-primary',
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-secondary/50 bg-secondary/10',
    iconClass: 'text-secondary',
  },
};

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const config = toastConfig[toast.type];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`
        glass-card border ${config.className}
        flex items-center gap-3 p-4 pr-3 min-w-[300px] max-w-md
        shadow-lg
      `}
    >
      <Icon className={`w-5 h-5 shrink-0 ${config.iconClass}`} />
      <p className="flex-1 text-sm font-medium text-foreground">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 p-1 rounded-lg hover:bg-muted transition-colors"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>
    </motion.div>
  );
}

// Toast store
let toasts: Toast[] = [];
let listeners: Set<() => void> = new Set();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((listener) => listener());
}

export function showToast(message: string, type: ToastType = 'info', duration?: number) {
  const id = Math.random().toString(36).substr(2, 9);
  toasts = [...toasts, { id, message, type, duration }];
  notify();
}

export function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

export function ToastContainer() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const unsubscribe = subscribe(() => forceUpdate({}));
    return () => { unsubscribe(); };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
