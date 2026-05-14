import { useCallback, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { ToastContext } from './toastContext.js';

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3500);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div className="fixed right-4 top-20 z-50 max-w-sm rounded-lg border border-leaf-100 bg-white p-4 shadow-soft">
          <div className="flex items-start gap-3">
            <span className={`mt-1 h-2.5 w-2.5 rounded-full ${toast.type === 'error' ? 'bg-red-500' : 'bg-leaf-600'}`} />
            <p className="text-sm font-semibold text-leaf-900">{toast.message}</p>
            <button className="ml-auto text-stone-500 hover:text-leaf-900" onClick={() => setToast(null)} aria-label="Close alert">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}
