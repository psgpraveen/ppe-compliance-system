import React, { useState } from 'react';
import { useViolations, useAcknowledgeViolation, useResolveViolation } from '../hooks/useViolations';
import { Pagination } from '@/components/ui/Pagination';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { Search, AlertCircle, CheckCircle, Clock, Check, Eye, ShieldAlert, X } from 'lucide-react';
import { format } from 'date-fns';
import { Violation } from '../types';

const SnapshotModal = ({ violation, onClose }: { violation: Violation; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <div>
            <h3 className="text-base font-semibold text-white">Violation Snapshot</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {violation.first_name} {violation.last_name} · {format(new Date(violation.detected_at), 'MMM d, yyyy h:mm a')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Image */}
        <div className="relative bg-black">
          {violation.image_url ? (
            <img
              src={violation.image_url}
              alt="Violation snapshot"
              className="w-full max-h-80 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`${violation.image_url ? 'hidden' : ''} flex flex-col items-center justify-center py-14 text-gray-500`}>
            <Eye size={36} className="mb-2 opacity-40" />
            <p className="text-sm">No snapshot available</p>
          </div>
        </div>

        {/* Details */}
        <div className="px-5 py-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Violation</p>
            <p className="text-white font-medium">{violation.violation_type_name}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Department</p>
            <p className="text-white font-medium">{violation.department_name || '—'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Status</p>
            <p className="text-white font-medium">{violation.status}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Severity</p>
            <p className="text-white font-medium">{violation.severity}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ViolationList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [selectedSnapshot, setSelectedSnapshot] = useState<Violation | null>(null);

  const { data, isLoading } = useViolations(page, limit, {
    status: statusFilter,
    employee_code: search
  });

  const { mutate: acknowledge, isPending: isAckPending } = useAcknowledgeViolation();
  const { mutate: resolve, isPending: isResPending } = useResolveViolation();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock size={11} /> Pending</span>;
      case 'ESCALATED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertCircle size={11} /> Escalated</span>;
      case 'ACKNOWLEDGED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Check size={11} /> Acknowledged</span>;
      case 'RESOLVED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle size={11} /> Resolved</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'LOW': return <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">Low</span>;
      case 'MEDIUM': return <span className="text-orange-600 bg-orange-100 px-2 py-0.5 rounded text-xs font-medium">Medium</span>;
      case 'HIGH': return <span className="text-red-600 bg-red-100 px-2 py-0.5 rounded text-xs font-medium">High</span>;
      case 'CRITICAL': return <span className="text-white bg-red-600 px-2 py-0.5 rounded text-xs font-bold animate-pulse">Critical</span>;
      default: return null;
    }
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'ESCALATED', label: 'Escalated' },
    { value: 'ACKNOWLEDGED', label: 'Acknowledged' },
    { value: 'RESOLVED', label: 'Resolved' },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl ring-4 ring-red-50/50">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">Active Violations</h1>
                  <p className="text-xs sm:text-sm text-gray-500">Monitor, acknowledge, and resolve safety incidents in real-time.</p>
                </div>
              </div>

              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search employee code..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm bg-gray-50/50 focus:bg-white transition"
                  />
                </div>
                <div className="w-full sm:w-44">
                  <CustomSelect
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={statusOptions}
                    placeholder="All Statuses"
                  />
                </div>
              </div>
            </div>

            {/* Quick Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setStatusFilter('')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  statusFilter === '' 
                    ? 'bg-gray-900 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Statuses
              </button>
              <button
                onClick={() => setStatusFilter('PENDING')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  statusFilter === 'PENDING' 
                    ? 'bg-amber-600 text-white shadow-sm' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200/60 hover:bg-amber-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Pending
              </button>
              <button
                onClick={() => setStatusFilter('ESCALATED')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  statusFilter === 'ESCALATED' 
                    ? 'bg-red-600 text-white shadow-sm' 
                    : 'bg-red-50 text-red-700 border border-red-200/60 hover:bg-red-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Escalated
              </button>
              <button
                onClick={() => setStatusFilter('ACKNOWLEDGED')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  statusFilter === 'ACKNOWLEDGED' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-blue-50 text-blue-700 border border-blue-200/60 hover:bg-blue-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Acknowledged
              </button>
              <button
                onClick={() => setStatusFilter('RESOLVED')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  statusFilter === 'RESOLVED' 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Resolved
              </button>
            </div>
          </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col top-0">
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-235px)] scrollbar-thin">
            <table className="min-w-full divide-y divide-gray-100 relative border-collapse">
              <thead className="bg-gray-50/90 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100">
                <tr>
                  <th className="hidden sm:table-cell px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="hidden md:table-cell px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Violation</th>
                  <th className="hidden sm:table-cell px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {isLoading ? (
                  <tr><td colSpan={6} className="px-6 py-4"><TableSkeleton columns={6} /></td></tr>
                ) : data?.data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <CheckCircle className="mx-auto h-12 w-12 text-emerald-400 mb-2" />
                      <h3 className="text-base font-bold text-gray-900">No violations found</h3>
                      <p className="mt-1 text-sm text-gray-500">No active incidents match your selected filters.</p>
                    </td>
                  </tr>
                ) : (
                  data?.data.map((violation) => (
                    <tr key={violation.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{format(new Date(violation.detected_at), 'MMM d, yyyy')}</div>
                        <div className="text-xs text-gray-400 font-medium">{format(new Date(violation.detected_at), 'h:mm a')}</div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{violation.first_name} {violation.last_name}</div>
                        <div className="text-xs font-mono text-gray-400">{violation.employee_code}</div>
                      </td>
                      <td className="hidden md:table-cell px-5 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-700">{violation.department_name || <span className="text-gray-400 italic">—</span>}</div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{violation.violation_type_name}</span>
                          {getSeverityBadge(violation.severity)}
                        </div>
                        <div className="sm:hidden mt-1">{getStatusBadge(violation.status)}</div>
                        <button
                          onClick={() => setSelectedSnapshot(violation)}
                          className="mt-1 text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye size={12} /> View Snapshot
                        </button>
                      </td>
                      <td className="hidden sm:table-cell px-5 py-4 whitespace-nowrap">
                        {getStatusBadge(violation.status)}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        {(violation.status === 'PENDING' || violation.status === 'ESCALATED') && (
                          <button
                            onClick={() => acknowledge({ id: violation.id })}
                            disabled={isAckPending}
                            className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 px-3.5 py-1.5 rounded-xl transition-all shadow-2xs hover:shadow text-xs font-bold disabled:opacity-50"
                          >
                            Acknowledge
                          </button>
                        )}
                        {violation.status === 'ACKNOWLEDGED' && (
                          <button
                            onClick={() => resolve({ id: violation.id })}
                            disabled={isResPending}
                            className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-3.5 py-1.5 rounded-xl transition-all shadow-2xs hover:shadow text-xs font-bold disabled:opacity-50"
                          >
                            Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {data && data.total > 0 && (
            <div className="border-t border-gray-100 bg-gray-50/50">
              <Pagination
                page={page}
                totalPages={Math.ceil(data.total / limit)}
                onPageChange={setPage}
                limit={limit}
                onLimitChange={setLimit}
                totalItems={data.total}
              />
            </div>
          )}
        </div>
      </div>

      {/* Snapshot Modal */}
      {selectedSnapshot && (
        <SnapshotModal
          violation={selectedSnapshot}
          onClose={() => setSelectedSnapshot(null)}
        />
      )}
    </>
  );
};
