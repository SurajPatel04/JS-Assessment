import React, { createContext, useState, useCallback, useContext } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, duration = 3000) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="toast-notification fade-in">
          {toast}
        </div>
      )}
    </ToastContext.Provider>
  );
};
