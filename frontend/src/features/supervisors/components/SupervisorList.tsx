import React, { useState, useEffect } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { ColumnFilter } from '@/components/ui/ColumnFilter';
import { useSupervisors, useCreateSupervisor, useUpdateSupervisor, useDeleteSupervisor, useSupervisorOptions } from '../hooks/useSupervisors';
import { Supervisor } from '../types';
import { Pencil, Trash2 } from 'lucide-react';
import { SupervisorFormModal } from './SupervisorFormModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { Pagination } from '@/components/ui/Pagination';
import { Tooltip } from '@/components/ui/Tooltip';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { UserCheck, Plus } from 'lucide-react';

export const SupervisorList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const [filters, setFilters] = useState({ name: '', email: '', status: '' });
  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedFilters]);

  const { data: response, isLoading, isError } = useSupervisors(page, limit, debouncedFilters);
  const supervisors = response?.data;
  const meta = response?.meta;
  const { data: supervisorOptionsData } = useSupervisorOptions();
  const createMutation = useCreateSupervisor();
  const updateMutation = useUpdateSupervisor();
  const deleteMutation = useDeleteSupervisor();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | undefined>(undefined);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [supervisorToDelete, setSupervisorToDelete] = useState<Supervisor | null>(null);

  const handleOpenCreate = () => {
    setSelectedSupervisor(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (supervisor: Supervisor) => {
    setSelectedSupervisor(supervisor);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (supervisor: Supervisor) => {
    setSupervisorToDelete(supervisor);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = (data: Record<string, unknown>) => {
    if (selectedSupervisor) {
      updateMutation.mutateAsync({ id: selectedSupervisor.id, data }, {
        onSuccess: () => setIsFormOpen(false)
      });
    } else {
      createMutation.mutateAsync(data, {
        onSuccess: () => setIsFormOpen(false)
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (supervisorToDelete) {
      deleteMutation.mutateAsync(supervisorToDelete.id, {
        onSuccess: () => setIsDeleteOpen(false)
      });
    }
  };



  const getFilterOptions = (options: Record<string, unknown>[], labelKey: string, valueKey: string) => {
    if (!options) return [{ label: 'All', value: '' }];
    const uniqueValues = new Set<string>();
    const mapped = options.reduce((acc, opt) => {
      const val = opt[valueKey];
      if (val && !uniqueValues.has(val)) {
        uniqueValues.add(val);
        acc.push({ label: opt[labelKey], value: val });
      }
      return acc;
    }, [] as { label: string, value: string }[]);
    return [{ label: 'All', value: '' }, ...mapped.sort((a, b) => a.label.localeCompare(b.label))];
  };

  const nameOptions = getFilterOptions(
    (supervisorOptionsData || []).map(s => ({ name: `${s.first_name} ${s.last_name}` })), 
    'name', 
    'name'
  );
  
  const emailOptions = getFilterOptions(supervisorOptionsData || [], 'email', 'email');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6 shrink-0 px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
            <UserCheck size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Supervisors</h2>
            <p className="text-sm text-gray-500">Manage supervisor accounts</p>
          </div>
        </div>
        <div className="flex gap-3">
          {Object.values(filters).some(val => val !== '') && (
            <button
              onClick={() => setFilters({ name: '', email: '', status: '' })}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg transition font-medium text-sm"
            >
              Clear Filters
            </button>
          )}
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold shadow-sm"
          >
            <Plus size={16} /> Add Supervisor
          </button>
        </div>
      </div>

      <div className="bg-white border-y border-gray-200 flex flex-col flex-1 overflow-hidden">
        {isLoading ? (
          <TableSkeleton columns={5} />
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center text-red-500 p-8">Failed to load supervisors.</div>
        ) : (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto scrollbar-thin">
            <table className="w-full text-sm text-left text-gray-500 relative">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th scope="col" className="px-4 py-2 border-b border-gray-100 w-[30%]">
                    <div className="flex items-center">
                      Name
                      <ColumnFilter 
                        value={filters.name} 
                        onChange={(val) => setFilters(prev => ({ ...prev, name: val }))} 
                        type="select"
                        options={nameOptions}
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-2 border-b border-gray-100 w-[35%]">
                    <div className="flex items-center">
                      Email
                      <ColumnFilter 
                        value={filters.email} 
                        onChange={(val) => setFilters(prev => ({ ...prev, email: val }))} 
                        type="select"
                        options={emailOptions}
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-2 border-b border-gray-100 w-[15%]">ID (UUID)</th>
                  <th scope="col" className="px-4 py-2 border-b border-gray-100 w-[10%]">
                    <div className="flex items-center">
                      Status
                      <ColumnFilter 
                        value={filters.status} 
                        onChange={(val) => setFilters(prev => ({ ...prev, status: val }))} 
                        type="select"
                        options={[
                          { label: 'All', value: '' },
                          { label: 'Active', value: 'true' },
                          { label: 'Inactive', value: 'false' },
                        ]}
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-2 text-right border-b border-gray-100 w-[10%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(!supervisors || supervisors.length === 0) ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-500">
                      No supervisors found.
                    </td>
                  </tr>
                ) : (
                  supervisors.map((sup) => (
                    <tr key={sup.id} className="bg-white border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                        {sup.first_name} {sup.last_name}
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {sup.email}
                      </td>
                      <td className="px-4 py-2 text-xs font-mono text-gray-500 cursor-help">
                        <Tooltip content={`UUID: ${sup.id}`} position="top">
                          <span>
                            {`${sup.first_name?.charAt(0).toUpperCase() || ''}${sup.last_name?.charAt(0).toUpperCase() || ''}${new Date(sup.created_at).toISOString().split('T')[0].replace(/-/g, '')}`}
                          </span>
                        </Tooltip>
                      </td>
                      <td className="px-4 py-2">
                        {sup.is_active ? (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-green-200">Active</span>
                        ) : (
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full border border-red-200">Inactive</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-right space-x-2">
                        <Tooltip content="Edit" position="top">
                          <button 
                            onClick={() => handleOpenEdit(sup)}
                            className="p-1.5 font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition"
                          >
                            <Pencil size={16} />
                          </button>
                        </Tooltip>
                        <Tooltip content="Delete" position="top">
                          <button 
                            onClick={() => handleOpenDelete(sup)}
                            className="p-1.5 font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </Tooltip>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {meta && (
            <div className="shrink-0 bg-white">
              <Pagination 
                page={page} 
                totalPages={meta.totalPages} 
                onPageChange={setPage} 
                limit={limit}
                onLimitChange={setLimit}
                totalItems={meta.total}
              />
            </div>
          )}
        </div>
      )}
      </div>

      <SupervisorFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        supervisor={selectedSupervisor}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Supervisor"
        message={`Are you sure you want to delete ${supervisorToDelete?.first_name} ${supervisorToDelete?.last_name}? This will remove their access to the system.`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};
