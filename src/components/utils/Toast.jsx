import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ─── Global event bus ───────────────────────────────────────────────────── */
let _counter = 0;
const _listeners = new Set();

export const triggerToast = (message, type = 'success', duration = 4000) => {
  const id = ++_counter;
  _listeners.forEach(fn => fn({ id, message, type, duration }));
  return id;
};

/* ─── Config per type ────────────────────────────────────────────────────── */
const CONFIG = {
  success: {
    bar: '#10b981',
    bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    border: '#86efac',
    text: '#14532d',
    sub: '#166534',
    label: 'Success',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  error: {
    bar: '#ef4444',
    bg: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
    border: '#fca5a5',
    text: '#450a0a',
    sub: '#7f1d1d',
    label: 'Error',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
  warning: {
    bar: '#f59e0b',
    bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    border: '#fcd34d',
    text: '#451a03',
    sub: '#78350f',
    label: 'Warning',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  info: {
    bar: '#3b82f6',
    bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    border: '#93c5fd',
    text: '#172554',
    sub: '#1e3a8a',
    label: 'Info',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
};

/* ─── Single Toast ───────────────────────────────────────────────────────── */
const Toast = ({ id, message, type = 'success', duration = 4000, onRemove }) => {
  const cfg = CONFIG[type] || CONFIG.success;
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const startRef = useRef(null);
  const rafRef = useRef(null);
  const pausedAtRef = useRef(null);
  const remainingRef = useRef(duration);

  /* Slide in */
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  /* Progress bar tick */
  const startProgress = useCallback(() => {
    startRef.current = performance.now();
    const tick = () => {
      const elapsed = performance.now() - startRef.current;
      const pct = Math.max(0, 100 - (elapsed / remainingRef.current) * 100);
      setProgress(pct);
      if (pct > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        dismiss();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const pauseProgress = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    pausedAtRef.current = performance.now();
    remainingRef.current -= pausedAtRef.current - startRef.current;
  }, []);

  useEffect(() => {
    startProgress();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const dismiss = () => {
    setVisible(false);
    setTimeout(() => onRemove(id), 350);
  };

  return (
    <div
      onMouseEnter={pauseProgress}
      onMouseLeave={startProgress}
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        transform: visible ? 'translateX(0) scale(1)' : 'translateX(110%) scale(0.95)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease',
        willChange: 'transform, opacity',
        boxShadow: '0 10px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
        borderRadius: '14px',
        overflow: 'hidden',
        width: '340px',
        maxWidth: 'calc(100vw - 32px)',
        pointerEvents: 'all',
        position: 'relative',
      }}
    >
      {/* Progress bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '3px',
        width: `${progress}%`,
        background: cfg.bar,
        borderRadius: '14px 0 0 0',
        transition: 'width 0.1s linear',
      }} />

      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        {/* Icon */}
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: cfg.bar + '22',
          border: `1.5px solid ${cfg.bar}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: cfg.bar,
        }}>
          <div style={{ width: '18px', height: '18px' }}>{cfg.icon}</div>
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0, paddingTop: '2px' }}>
          <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: cfg.bar, marginBottom: '2px' }}>
            {cfg.label}
          </p>
          <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 500, color: cfg.text, lineHeight: 1.45, wordBreak: 'break-word' }}>
            {message}
          </p>
        </div>

        {/* Close */}
        <button
          onClick={dismiss}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px',
            color: cfg.sub,
            opacity: 0.5,
            flexShrink: 0,
            lineHeight: 1,
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
          aria-label="Dismiss"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
};

/* ─── Container ──────────────────────────────────────────────────────────── */
const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (toast) => {
      setToasts(prev => {
        const next = [...prev, toast];
        return next.slice(-5); // max 5 visible
      });
    };
    _listeners.add(handler);
    return () => _listeners.delete(handler);
  }, []);

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      alignItems: 'flex-end',
      pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <Toast key={t.id} {...t} onRemove={remove} />
      ))}
    </div>
  );
};

export default ToastContainer;
