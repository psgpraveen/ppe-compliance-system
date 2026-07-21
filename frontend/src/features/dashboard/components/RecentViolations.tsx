import React from 'react';
import { format } from 'date-fns';
import { RecentViolation } from '../types';

interface RecentViolationsProps {
  violations: RecentViolation[];
}

const statusColors = {
  PENDING: 'bg-amber-100 text-amber-800',
  ESCALATED: 'bg-red-100 text-red-800',
  ACKNOWLEDGED: 'bg-blue-100 text-blue-800',
  RESOLVED: 'bg-emerald-100 text-emerald-800',
};

const severityColors = {
  LOW: 'bg-gray-100 text-gray-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  CRITICAL: 'bg-red-100 text-red-800',
};

export const RecentViolations = ({ violations }: RecentViolationsProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="text-lg font-bold text-gray-900">Recent Violations</h3>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-500">View all</button>
      </div>
      
      {violations.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No recent violations.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">Employee</th>
                <th className="px-6 py-3 font-medium">Violation</th>
                <th className="px-6 py-3 font-medium">Time</th>
                <th className="px-6 py-3 font-medium">Severity</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {violations.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{v.first_name} {v.last_name}</div>
                    <div className="text-xs text-gray-500">{v.employee_code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-900">{v.violation_type_name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {format(new Date(v.detected_at), 'MMM d, h:mm a')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${severityColors[v.severity]}`}>
                      {v.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[v.status]}`}>
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
