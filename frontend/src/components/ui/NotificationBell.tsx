'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, ShieldAlert, Clock, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { format } from 'date-fns';
import Link from 'next/link';

interface ViolationAlert {
  id: string;
  detected_at: string;
  status: 'PENDING' | 'ESCALATED' | 'ACKNOWLEDGED' | 'RESOLVED';
  first_name: string;
  last_name: string;
  employee_code: string;
  violation_type_name: string;
  severity: string;
  department_name: string | null;
}

const statusIcon: Record<string, React.ReactNode> = {
  PENDING:    <Clock     size={13} className="text-yellow-500" />,
  ESCALATED:  <AlertCircle size={13} className="text-red-500" />,
  ACKNOWLEDGED: <CheckCircle size={13} className="text-blue-500" />,
  RESOLVED:   <CheckCircle size={13} className="text-green-500" />,
};

const severityColor: Record<string, string> = {
  LOW:      'bg-gray-100 text-gray-700',
  MEDIUM:   'bg-orange-100 text-orange-700',
  HIGH:     'bg-red-100 text-red-700',
  CRITICAL: 'bg-red-600 text-white',
};

export function NotificationBell({ placement = 'sidebar' }: { placement?: 'sidebar' | 'topbar' }) {
  const [open, setOpen] = useState(false);
  const [prevCount, setPrevCount] = useState(0);
  const [shake, setShake] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats');
      return res.data.data;
    },
    refetchInterval: 15000,
  });

  const { data: alerts } = useQuery({
    queryKey: ['violation-alerts'],
    queryFn: async () => {
      const res = await api.get('/violations?page=1&limit=8');
      return res.data.data as ViolationAlert[];
    },
    refetchInterval: 15000,
  });

  const urgentCount = (stats?.violations?.pending ?? 0) + (stats?.violations?.escalated ?? 0);

  // Shake bell when urgent count increases
  useEffect(() => {
    if (urgentCount > prevCount && prevCount !== 0) {
      setShake(true);
      setTimeout(() => setShake(false), 1100);
    }
    setPrevCount(urgentCount);
  }, [urgentCount]);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={18} className={shake ? 'animate-bell' : ''} />
        {urgentCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold leading-none">
            {urgentCount > 99 ? '99+' : urgentCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className={`absolute z-50 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden
          ${placement === 'topbar' ? 'right-0 top-full mt-2' : 'left-full ml-2 top-0'}`}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <ShieldAlert size={15} className="text-red-500" />
              <span className="text-sm font-semibold text-gray-800">Violations</span>
              {urgentCount > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                  {urgentCount} urgent
                </span>
              )}
            </div>
            <button onClick={() => setOpen(false)} className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors">
              <X size={14} />
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 divide-x divide-gray-100 bg-white border-b border-gray-100">
            {[
              { label: 'Pending',      value: stats?.violations?.pending    ?? 0, color: 'text-yellow-600' },
              { label: 'Escalated',    value: stats?.violations?.escalated  ?? 0, color: 'text-red-600' },
              { label: 'Acknowledged', value: stats?.violations?.acknowledged ?? 0, color: 'text-blue-600' },
              { label: 'Resolved',     value: stats?.violations?.resolved   ?? 0, color: 'text-green-600' },
            ].map(s => (
              <div key={s.label} className="flex flex-col items-center py-2">
                <span className={`text-base font-bold ${s.color}`}>{s.value}</span>
                <span className="text-[10px] text-gray-400 mt-0.5">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Alert List */}
          <div className="max-h-72 overflow-y-auto scrollbar-thin divide-y divide-gray-50">
            {!alerts?.length ? (
              <div className="flex flex-col items-center py-10 text-center">
                <CheckCircle size={28} className="text-green-300 mb-2" />
                <p className="text-sm font-medium text-gray-600">All clear!</p>
                <p className="text-xs text-gray-400">No violations detected.</p>
              </div>
            ) : (
              alerts.map(alert => (
                <div key={alert.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {statusIcon[alert.status]}
                        <span className="text-xs font-semibold text-gray-800 truncate">
                          {alert.first_name} {alert.last_name}
                        </span>
                        <span className="text-[10px] text-gray-400">{alert.employee_code}</span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">{alert.violation_type_name}</p>
                      {alert.department_name && (
                        <p className="text-[10px] text-gray-400">{alert.department_name}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${severityColor[alert.severity] || 'bg-gray-100 text-gray-600'}`}>
                        {alert.severity}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {format(new Date(alert.detected_at), 'h:mm a')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-4 py-2.5">
            <Link
              href="/dashboard/violations"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              View all violations →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
