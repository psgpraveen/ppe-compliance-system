'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration: number;
  exiting?: boolean;
}

// ─── Module-level store (no context needed) ───────────────────────────────────
type Listener = (toasts: ToastItem[]) => void;
let _toasts: ToastItem[] = [];
const _listeners = new Set<Listener>();

function notify() {
  _listeners.forEach(l => l([..._toasts]));
}

function addToast(type: ToastType, title: string, message?: string, duration = 4000) {
  const id = `t-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  _toasts = [{ id, type, title, message, duration }, ..._toasts].slice(0, 5);
  notify();
  return id;
}

function exitToast(id: string) {
  _toasts = _toasts.map(t => t.id === id ? { ...t, exiting: true } : t);
  notify();
  setTimeout(() => {
    _toasts = _toasts.filter(t => t.id !== id);
    notify();
  }, 320);
}

// ─── Public API (call from anywhere — no hook/context needed) ─────────────────
export const toast = {
  success: (title: string, message?: string) => addToast('success', title, message),
  error:   (title: string, message?: string) => addToast('error',   title, message),
  warning: (title: string, message?: string) => addToast('warning', title, message),
  info:    (title: string, message?: string) => addToast('info',    title, message),
};

// ─── Visual config ────────────────────────────────────────────────────────────
const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle  size={18} className="text-emerald-400 shrink-0" />,
  error:   <XCircle      size={18} className="text-red-400   shrink-0" />,
  warning: <AlertTriangle size={18} className="text-amber-400 shrink-0" />,
  info:    <Info         size={18} className="text-blue-400  shrink-0" />,
};

const bars: Record<ToastType, string> = {
  success: 'bg-emerald-500',
  error:   'bg-red-500',
  warning: 'bg-amber-500',
  info:    'bg-blue-500',
};

// ─── Single Toast Item ────────────────────────────────────────────────────────
function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timer.current = setTimeout(() => onDismiss(item.id), item.duration);
    return () => clearTimeout(timer.current);
  }, [item.id, item.duration, onDismiss]);

  return (
    <div
      className={`relative flex items-start gap-3 w-80 bg-gray-900 border border-gray-700/60 text-white rounded-xl shadow-2xl px-4 py-3 overflow-hidden ${item.exiting ? 'toast-out' : 'toast-in'}`}
    >
      <span className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${bars[item.type]}`} />
      <div className="mt-0.5 ml-1">{icons[item.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight">{item.title}</p>
        {item.message && (
          <p className="text-xs text-gray-400 mt-0.5 leading-snug">{item.message}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(item.id)}
        className="p-0.5 text-gray-500 hover:text-gray-300 transition-colors shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ─── Toast Container — place once at app root ────────────────────────────────
export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener: Listener = (t) => setToasts(t);
    _listeners.add(listener);
    return () => { _listeners.delete(listener); };
  }, []);

  const dismiss = useCallback((id: string) => exitToast(id), []);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <ToastCard item={t} onDismiss={dismiss} />
        </div>
      ))}
    </div>
  );
}

// ─── Keep ToastProvider for backwards compat (just renders container) ─────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}
