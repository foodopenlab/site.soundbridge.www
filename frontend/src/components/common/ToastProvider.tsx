'use client';

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toast } from './Toast';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  action?: ToastAction;
}

export interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info', action?: ToastAction) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);

export interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [activeToast, setActiveToast] = useState<ToastItem | null>(null);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'success', action?: ToastAction) => {
      const id = Math.random().toString(36).substring(2, 9);
      setActiveToast({ id, message, type, action });
    },
    []
  );

  const handleClose = useCallback((id: string) => {
    setActiveToast((prev) => (prev?.id === id ? null : prev));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <AnimatePresence>
        {activeToast && (
          <Toast
            key={activeToast.id}
            id={activeToast.id}
            message={activeToast.message}
            type={activeToast.type}
            action={activeToast.action}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};
