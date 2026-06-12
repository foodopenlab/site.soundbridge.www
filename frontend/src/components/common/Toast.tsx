'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose: (id: string) => void;
}

export const Toast = ({
  id,
  message,
  type,
  action,
  onClose,
}: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <motion.div
      initial={{ y: 20, x: '-50%', opacity: 0 }}
      animate={{ y: 0, x: '-50%', opacity: 1 }}
      exit={{ y: 20, x: '-50%', opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={twMerge(
        clsx(
          'fixed bottom-[72px] left-1/2 z-150',
          'bg-sb-primary text-sb-bg font-sans',
          'px-4 py-3 rounded-[10px] text-[13px] shadow-lg flex items-center justify-between gap-4',
          'max-w-[320px] min-w-[220px]',
          type === 'success' && 'border-l-2 border-sb-green',
          type === 'error' && 'border-l-2 border-sb-error',
          type === 'info' && 'border-l-2 border-sb-accent'
        )
      )}
    >
      <span className="flex-1 text-left">{message}</span>
      {action && (
        <button
          onClick={() => {
            action.onClick();
            onClose(id);
          }}
          className="text-sb-accent hover:underline font-medium text-[12px] shrink-0"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
};
