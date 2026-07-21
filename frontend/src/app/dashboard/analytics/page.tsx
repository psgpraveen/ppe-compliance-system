'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import {
  TrendingUp, ShieldAlert, CheckCircle, Clock, Users,
  BarChart3, AlertTriangle, ArrowUpRight
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface AnalyticsData {
  violationsOverTime: { date: string; total: string; resolved: string }[];
  byDepartment:  { department: string; total: string; resolved: string; open: string }[];
  bySeverity:    { severity: string; total: string }[];
  byStatus:      { status: string; total: string }[];
  byViolationType: { violation_type: string; total: string }[];
  topViolators:  { first_name: string; last_name: string; employee_code: string; department: string; total: string; open_count: string }[];
  resolutionStats: { avg_resolution_hours: string | null; resolved_count: string; total_count: string };
}

// ─── Colours ──────────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  PENDING:     '#F59E0B',
  ESCALATED:   '#EF4444',
  ACKNOWLEDGED:'#3B82F6',
  RESOLVED:    '#10B981',
  DETECTED:    '#8B5CF6',
  CLOSED:      '#6B7280',
};
const SEVERITY_COLORS: Record<string, string> = {
  HIGH:   '#EF4444',
  MEDIUM: '#F97316',
  LOW:    '#22C55E',
};
const CHART_PALETTE = ['#3B82F6','#8B5CF6','#EC4899','#14B8A6','#F97316','#EAB308','#06B6D4','#84CC16'];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function num(v: string | null | undefined) { return parseInt(v ?? '0', 10) || 0; }
function pct(part: number, total: number) { return total ? Math.round((part / total) * 100) : 0; }

// ─── MiniStatCard ─────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}><Icon size={22} /></div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── SVG Line Chart ──────────────────────────────────────────────────────────
function LineChart({ data }: { data: { date: string; total: number; resolved: number }[] }) {
  if (!data.length) return <EmptyChart />;
  const W = 600; const H = 180; const PAD = { top: 16, right: 12, bottom: 28, left: 32 };
  const iW = W - PAD.left - PAD.right;
  const iH = H - PAD.top - PAD.bottom;
  const maxVal = Math.max(...data.map(d => d.total), 1);
  const xStep = iW / Math.max(data.length - 1, 1);

  const points = (key: 'total' | 'resolved') =>
    data.map((d, i) => `${PAD.left + i * xStep},${PAD.top + iH - (d[key] / maxVal) * iH}`).join(' ');

  const area = (key: 'total' | 'resolved') => {
    const pts = data.map((d, i) => `${PAD.left + i * xStep},${PAD.top + iH - (d[key] / maxVal) * iH}`);
    return `M${pts[0]} L${pts.join(' L')} L${PAD.left + (data.length - 1) * xStep},${PAD.top + iH} L${PAD.left},${PAD.top + iH} Z`;
  };

  const labelStep = Math.ceil(data.length / 7);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <g key={t}>
          <line x1={PAD.left} y1={PAD.top + iH * (1 - t)} x2={PAD.left + iW} y2={PAD.top + iH * (1 - t)} stroke="#F3F4F6" strokeWidth={1} />
          <text x={PAD.left - 4} y={PAD.top + iH * (1 - t) + 4} textAnchor="end" fontSize={9} fill="#9CA3AF">{Math.round(maxVal * t)}</text>
        </g>
      ))}
      {/* Area fills */}
      <path d={area('total')} fill="#3B82F620" />
      <path d={area('resolved')} fill="#10B98120" />
      {/* Lines */}
      <polyline points={points('total')} fill="none" stroke="#3B82F6" strokeWidth={2} strokeLinejoin="round" />
      <polyline points={points('resolved')} fill="none" stroke="#10B981" strokeWidth={2} strokeLinejoin="round" strokeDasharray="4 2" />
      {/* X labels */}
      {data.map((d, i) => i % labelStep === 0 && (
        <text key={i} x={PAD.left + i * xStep} y={H - 6} textAnchor="middle" fontSize={9} fill="#9CA3AF">{d.date}</text>
      ))}
      {/* Dots */}
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={PAD.left + i * xStep} cy={PAD.top + iH - (d.total / maxVal) * iH} r={3} fill="#3B82F6" />
          <circle cx={PAD.left + i * xStep} cy={PAD.top + iH - (d.resolved / maxVal) * iH} r={2.5} fill="#10B981" />
        </g>
      ))}
    </svg>
  );
}

// ─── SVG Bar Chart ───────────────────────────────────────────────────────────
function BarChart({ data, color = '#3B82F6' }: {
  data: { label: string; value: number }[];
  color?: string;
}) {
  if (!data.length) return <EmptyChart />;
  const W = 500; const H = 180; const PAD = { top: 10, right: 12, bottom: 40, left: 40 };
  const iW = W - PAD.left - PAD.right;
  const iH = H - PAD.top - PAD.bottom;
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const barW = (iW / data.length) * 0.6;
  const gap   = iW / data.length;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      {[0, 0.5, 1].map(t => (
        <g key={t}>
          <line x1={PAD.left} y1={PAD.top + iH * (1 - t)} x2={PAD.left + iW} y2={PAD.top + iH * (1 - t)} stroke="#F3F4F6" strokeWidth={1} />
          <text x={PAD.left - 4} y={PAD.top + iH * (1 - t) + 4} textAnchor="end" fontSize={9} fill="#9CA3AF">{Math.round(maxVal * t)}</text>
        </g>
      ))}
      {data.map((d, i) => {
        const barH = (d.value / maxVal) * iH;
        const x = PAD.left + gap * i + (gap - barW) / 2;
        const y = PAD.top + iH - barH;
        const maxLabelLen = 10;
        const label = d.label.length > maxLabelLen ? d.label.slice(0, maxLabelLen) + '…' : d.label;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx={3} fill={color} fillOpacity={0.85} />
            <text x={x + barW / 2} y={PAD.top + iH + 12} textAnchor="middle" fontSize={8} fill="#6B7280"
              transform={`rotate(-35 ${x + barW / 2} ${PAD.top + iH + 12})`}>{label}</text>
            <text x={x + barW / 2} y={y - 3} textAnchor="middle" fontSize={9} fill="#374151" fontWeight="600">{d.value}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── SVG Donut Chart ─────────────────────────────────────────────────────────
function DonutChart({ data, colorMap }: {
  data: { label: string; value: number; color?: string }[];
  colorMap?: Record<string, string>;
}) {
  if (!data.length || data.every(d => d.value === 0)) return <EmptyChart />;
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = 90; const cy = 90; const R = 70; const r = 44;
  let angle = -Math.PI / 2;

  const slices = data.map((d, i) => {
    const sweep = (d.value / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(angle);
    const y1 = cy + R * Math.sin(angle);
    angle += sweep;
    const x2 = cx + R * Math.cos(angle);
    const y2 = cy + R * Math.sin(angle);
    const x3 = cx + r * Math.cos(angle);
    const y3 = cy + r * Math.sin(angle);
    const x4 = cx + r * Math.cos(angle - sweep);
    const y4 = cy + r * Math.sin(angle - sweep);
    const large = sweep > Math.PI ? 1 : 0;
    const path = `M${x1},${y1} A${R},${R},0,${large},1,${x2},${y2} L${x3},${y3} A${r},${r},0,${large},0,${x4},${y4} Z`;
    const fill = colorMap?.[d.label] ?? d.color ?? CHART_PALETTE[i % CHART_PALETTE.length];
    return { ...d, path, fill, pct: pct(d.value, total) };
  });

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 180 180" className="w-36 h-36 shrink-0">
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.fill} stroke="white" strokeWidth={2} />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize={20} fontWeight="bold" fill="#111827">{total}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize={9} fill="#6B7280">total</text>
      </svg>
      <div className="flex flex-col gap-1.5 min-w-0">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: s.fill }} />
            <span className="text-gray-600 truncate">{s.label}</span>
            <span className="ml-auto font-semibold text-gray-800">{s.value}</span>
            <span className="text-gray-400 w-8 text-right">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Empty Chart Placeholder ──────────────────────────────────────────────────
function EmptyChart() {
  return (
    <div className="flex flex-col items-center justify-center h-32 text-gray-300">
      <BarChart3 size={32} className="mb-1" />
      <p className="text-xs">No data yet</p>
    </div>
  );
}

// ─── Card Wrapper ─────────────────────────────────────────────────────────────
function Card({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-4 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      {children}
    </div>
  );
}

// ─── Main Analytics Page ─────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const { data: raw, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await api.get('/analytics');
      return res.data.data;
    },
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!raw) return null;

  // Compute summary numbers
  const totalViolations = num(raw.resolutionStats?.total_count);
  const resolvedCount   = num(raw.resolutionStats?.resolved_count);
  const avgHours = parseFloat(raw.resolutionStats?.avg_resolution_hours ?? '0') || 0;
  const complianceRate = pct(resolvedCount, totalViolations);

  const statusTotal = raw.byStatus.reduce((s, d) => s + num(d.total), 0);
  const openCount   = raw.byStatus.filter(d => ['PENDING','ESCALATED'].includes(d.status)).reduce((s, d) => s + num(d.total), 0);

  // Normalise chart data
  const timelineData = raw.violationsOverTime.map(d => ({
    date: d.date,
    total: num(d.total),
    resolved: num(d.resolved),
  }));

  const deptData = raw.byDepartment.slice(0, 7).map(d => ({
    label: d.department,
    value: num(d.total),
  }));

  const typeData = raw.byViolationType.map(d => ({
    label: d.violation_type,
    value: num(d.total),
  }));

  const statusDonut = raw.byStatus.map(d => ({
    label: d.status.charAt(0) + d.status.slice(1).toLowerCase(),
    value: num(d.total),
    color: STATUS_COLORS[d.status],
  }));

  const severityDonut = raw.bySeverity.map(d => ({
    label: d.severity,
    value: num(d.total),
    color: SEVERITY_COLORS[d.severity] ?? '#6B7280',
  }));

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-4 sm:space-y-5">

      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-violet-100 text-violet-700 rounded-xl">
          <BarChart3 size={22} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-sm text-gray-500">30-day PPE compliance insights</p>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={ShieldAlert}  label="Total Violations (30d)" value={totalViolations} color="bg-red-50 text-red-600" />
        <StatCard icon={CheckCircle}  label="Resolved"    value={resolvedCount} sub={`${complianceRate}% of total`} color="bg-green-50 text-green-600" />
        <StatCard icon={AlertTriangle} label="Open"       value={openCount}     sub="Pending + Escalated" color="bg-amber-50 text-amber-600" />
        <StatCard icon={Clock}        label="Avg Resolution" value={avgHours > 0 ? `${avgHours}h` : '—'} sub="Last 30 days" color="bg-blue-50 text-blue-600" />
      </div>

      {/* Violations over time */}
      <Card title="📈 Violations Over Time (Last 30 Days)" className="col-span-full">
        <div className="flex gap-4 mb-2">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <span className="inline-block w-4 h-0.5 bg-blue-500" />Total
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <span className="inline-block w-4 h-0.5 bg-emerald-500 border-dashed" style={{ borderTop: '2px dashed #10B981', background: 'transparent' }} />Resolved
          </span>
        </div>
        <LineChart data={timelineData} />
      </Card>

      {/* Dept + Type bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="🏢 Violations by Department">
          <BarChart data={deptData} color="#8B5CF6" />
        </Card>
        <Card title="⚠️ Violations by Type">
          <BarChart data={typeData} color="#F97316" />
        </Card>
      </div>

      {/* Donut charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="📊 Status Breakdown">
          <DonutChart data={statusDonut} />
        </Card>
        <Card title="🔴 Severity Breakdown">
          <DonutChart data={severityDonut} />
        </Card>
      </div>

      {/* Top violators */}
      <Card title="👤 Top 5 Employees by Violations">
        {raw.topViolators.length === 0 ? (
          <EmptyChart />
        ) : (
          <div className="space-y-2">
            {raw.topViolators.map((v, i) => {
              const total = num(v.total);
              const maxTotal = num(raw.topViolators[0]?.total);
              const barPct = pct(total, maxTotal);
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400 w-4 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-medium text-gray-800 truncate">
                        {v.first_name} {v.last_name}
                        <span className="text-gray-400 text-xs ml-1">({v.employee_code})</span>
                      </span>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {num(v.open_count) > 0 && (
                          <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-medium">
                            {v.open_count} open
                          </span>
                        )}
                        <span className="text-sm font-bold text-gray-900">{total}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all"
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{v.department}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

    </div>
  );
}
