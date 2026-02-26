import { useEffect } from 'react';
import { Toast as ToastType } from '../../types';
import { cn } from '../../lib/utils';

interface ToastProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration ?? 3000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-bounce-in',
        toast.type === 'success' && 'bg-green-500 text-white',
        toast.type === 'info' && 'bg-blue-500 text-white',
        toast.type === 'warning' && 'bg-amber-500 text-white',
      )}
    >
      {toast.message}
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
