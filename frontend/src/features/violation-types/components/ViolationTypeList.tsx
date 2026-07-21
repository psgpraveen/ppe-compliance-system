import React, { useState, useEffect } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { ColumnFilter } from '@/components/ui/ColumnFilter';
import { useViolationTypes, useCreateViolationType, useUpdateViolationType, useDeleteViolationType } from '../hooks/useViolationTypes';
import { ViolationType } from '../types';
import { ViolationTypeFormModal } from './ViolationTypeFormModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { ViolationTypeFormData } from '../validation';
import { Pagination } from '@/components/ui/Pagination';
import { Tooltip } from '@/components/ui/Tooltip';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { Pencil, Trash2, AlertTriangle, Plus } from 'lucide-react';

export const ViolationTypeList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [filters, setFilters] = useState({ name: '', severity: '' });
  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedFilters]);
  
  const { data: response, isLoading, isError } = useViolationTypes(page, limit, debouncedFilters);
  const violationTypes = response?.data;
  const meta = response?.meta;

  const createMutation = useCreateViolationType();
  const updateMutation = useUpdateViolationType();
  const deleteMutation = useDeleteViolationType();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ViolationType | undefined>(undefined);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ViolationType | null>(null);

  const handleOpenCreate = () => {
    setSelectedItem(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: ViolationType) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (item: ViolationType) => {
    setItemToDelete(item);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = (data: ViolationTypeFormData) => {
    if (selectedItem) {
      updateMutation.mutateAsync({ id: selectedItem.id, data }, {
        onSuccess: () => setIsFormOpen(false)
      });
    } else {
      createMutation.mutateAsync(data, {
        onSuccess: () => setIsFormOpen(false)
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      deleteMutation.mutateAsync(itemToDelete.id, {
        onSuccess: () => setIsDeleteOpen(false)
      });
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'HIGH': return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">High</span>;
      case 'MEDIUM': return <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">Medium</span>;
      case 'LOW': return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">Low</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">{severity}</span>;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6 shrink-0 px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Violation Types</h2>
            <p className="text-sm text-gray-500">Define detectable PPE violations</p>
          </div>
        </div>
        <div className="flex gap-3">
          {Object.values(filters).some(val => val !== '') && (
            <button
              onClick={() => setFilters({ name: '', severity: '' })}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg transition font-medium text-sm"
            >
              Clear Filters
            </button>
          )}
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold shadow-sm"
          >
            <Plus size={16} /> Add Violation Type
          </button>
        </div>
      </div>

      <div className="bg-white border-y border-gray-200 flex flex-col flex-1 overflow-hidden">
        {isLoading ? (
          <TableSkeleton columns={5} />
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center text-red-500 p-8">Failed to load violation types.</div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-auto scrollbar-thin">
              <table className="w-full text-sm text-left text-gray-500 relative">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th scope="col" className="px-4 py-2 border-b border-gray-100 w-[20%]">Code</th>
                    <th scope="col" className="px-4 py-2 border-b border-gray-100 w-[35%]">
                      <div className="flex items-center">
                        Name
                        <ColumnFilter 
                          value={filters.name} 
                          onChange={(val) => setFilters(prev => ({ ...prev, name: val }))} 
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-2 border-b border-gray-100 w-[15%]">
                      <div className="flex items-center">
                        Severity
                        <ColumnFilter 
                          value={filters.severity} 
                          onChange={(val) => setFilters(prev => ({ ...prev, severity: val }))} 
                          type="select"
                          options={[
                            { label: 'All', value: '' },
                            { label: 'Low', value: 'LOW' },
                            { label: 'Medium', value: 'MEDIUM' },
                            { label: 'High', value: 'HIGH' },
                          ]}
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-2 border-b border-gray-100 w-[15%]">Status</th>
                    <th scope="col" className="px-4 py-2 text-right border-b border-gray-100 w-[15%]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(!violationTypes || violationTypes.length === 0) ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-500">
                        No violation types found.
                      </td>
                    </tr>
                  ) : (
                    violationTypes.map((item) => (
                      <tr key={item.id} className="bg-white border-b border-gray-50 hover:bg-gray-50 transition">
                        <td className="px-4 py-2 font-mono text-xs text-gray-900 whitespace-nowrap">
                          {item.code}
                        </td>
                        <td className="px-4 py-2 font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-4 py-2">
                          {getSeverityBadge(item.severity)}
                        </td>
                        <td className="px-4 py-2">
                          {item.is_active ? (
                            <span className="text-green-600 flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>Active</span>
                          ) : (
                            <span className="text-gray-500 flex items-center"><span className="w-2 h-2 rounded-full bg-gray-400 mr-2"></span>Inactive</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-right space-x-2">
                          <Tooltip content="Edit" position="top">
                            <button 
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition"
                            >
                              <Pencil size={16} />
                            </button>
                          </Tooltip>
                          <Tooltip content="Delete" position="top">
                            <button 
                              onClick={() => handleOpenDelete(item)}
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

      <ViolationTypeFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        violationType={selectedItem}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Violation Type"
        message={`Are you sure you want to delete ${itemToDelete?.name}? This action cannot be undone.`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};
