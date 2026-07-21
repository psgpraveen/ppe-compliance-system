'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { ViolationStats } from '../types';

interface ViolationsChartProps {
  stats: ViolationStats;
}

export const ViolationsChart = ({ stats }: ViolationsChartProps) => {
  const data = [
    { name: 'Pending', value: stats.pending, color: '#F59E0B' }, // amber-500
    { name: 'Escalated', value: stats.escalated, color: '#EF4444' }, // red-500
    { name: 'Acknowledged', value: stats.acknowledged, color: '#3B82F6' }, // blue-500
    { name: 'Resolved', value: stats.resolved, color: '#10B981' }, // emerald-500
  ].filter(item => item.value > 0); // Only show segments that have data

  if (stats.total === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full min-h-[400px]">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Violations by Status</h3>
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <p>No violations recorded yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full min-h-[400px]">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Violations by Status</h3>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ fontWeight: 500 }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              formatter={(value, entry, index) => <span className="text-sm font-medium text-gray-700 ml-1">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
          <span className="text-3xl font-bold text-gray-900">{stats.total}</span>
          <span className="text-sm text-gray-500">Total</span>
        </div>
      </div>
    </div>
  );
};
