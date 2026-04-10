import React, { useState, useCallback, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';

let toastCounter = 0;
const toastListeners = [];

export const triggerToast = (message, type = 'success', duration = 4000) => {
  const id = ++toastCounter;
  toastListeners.forEach(listener => listener({ id, message, type, duration }));
  return id;
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleNewToast = (toast) => {
      setToasts(prev => [...prev, toast]);
      if (toast.duration > 0) {
        const timer = setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== toast.id));
        }, toast.duration);
        return () => clearTimeout(timer);
      }
    };

    toastListeners.push(handleNewToast);
    return () => {
      const index = toastListeners.indexOf(handleNewToast);
      if (index > -1) toastListeners.splice(index, 1);
    };
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 pointer-events-none">
      {toasts.map(toast => (
        <Toast 
          key={toast.id} 
          {...toast} 
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

const Toast = ({ id, message, type, onClose }) => {
  const bgColor = {
    success: 'bg-emerald-50 border-emerald-200',
    error: 'bg-rose-50 border-rose-200',
    warning: 'bg-amber-50 border-amber-200',
    info: 'bg-blue-50 border-blue-200',
  }[type] || 'bg-emerald-50 border-emerald-200';

  const textColor = {
    success: 'text-emerald-800',
    error: 'text-rose-800',
    warning: 'text-amber-800',
    info: 'text-blue-800',
  }[type] || 'text-emerald-800';

  const iconColor = {
    success: 'text-emerald-600',
    error: 'text-rose-600',
    warning: 'text-amber-600',
    info: 'text-blue-600',
  }[type] || 'text-emerald-600';

  const Icon = {
    success: FaCheckCircle,
    error: FaTimesCircle,
    warning: FaExclamationCircle,
    info: FaCheckCircle,
  }[type] || FaCheckCircle;

  return (
    <div className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border ${bgColor} shadow-lg animate-in fade-in slide-in-from-right-4`}>
      <Icon className={`flex-shrink-0 ${iconColor}`} size={20} />
      <p className={`text-sm font-medium ${textColor}`}>{message}</p>
      <button
        onClick={onClose}
        className={`flex-shrink-0 ml-2 ${textColor} hover:opacity-70 transition-opacity`}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default ToastContainer;
