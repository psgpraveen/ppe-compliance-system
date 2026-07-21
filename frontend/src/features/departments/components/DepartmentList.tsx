import React, { useState, useEffect } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { ColumnFilter } from '@/components/ui/ColumnFilter';
import { useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment, useDepartmentOptions } from '../hooks/useDepartments';
import { Department } from '../types';
import { DepartmentFormModal } from './DepartmentFormModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { DepartmentFormData } from '../validation';
import { Tooltip } from '@/components/ui/Tooltip';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { Pencil, Trash2, Network, Plus } from 'lucide-react';
import { useSiteOptions } from '@/features/sites/hooks/useSites';
import { useSupervisorOptions } from '@/features/supervisors/hooks/useSupervisors';
import { Pagination } from '@/components/ui/Pagination';

export const DepartmentList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [filters, setFilters] = useState({ name: '', site: '', supervisor: '' });
  const debouncedFilters = useDebounce(filters, 500);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedFilters]);

  const { data: response, isLoading, isError } = useDepartments(page, limit, debouncedFilters);
  const departments = response?.data;
  const meta = response?.meta;
  const { data: sites } = useSiteOptions();
  const { data: departmentOptions } = useDepartmentOptions();
  const { data: supervisorOptions } = useSupervisorOptions();
  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();
  const deleteMutation = useDeleteDepartment();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>(undefined);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);

  const handleOpenCreate = () => {
    setSelectedDepartment(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (dept: Department) => {
    setSelectedDepartment(dept);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (dept: Department) => {
    setDepartmentToDelete(dept);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = (data: DepartmentFormData) => {
    if (selectedDepartment) {
      updateMutation.mutateAsync({ id: selectedDepartment.id, data }, {
        onSuccess: () => setIsFormOpen(false)
      });
    } else {
      createMutation.mutateAsync(data, {
        onSuccess: () => setIsFormOpen(false)
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (departmentToDelete) {
      deleteMutation.mutateAsync(departmentToDelete.id, {
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

  const nameOptions = getFilterOptions(departmentOptions || [], 'name', 'name');
  const siteOptions = getFilterOptions(sites || [], 'site_name', 'site_name');
  const supervisorOptionsMapped = getFilterOptions(
    (supervisorOptions || []).map(s => ({ name: `${s.first_name} ${s.last_name}` })),
    'name',
    'name'
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6 shrink-0 px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
            <Network size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Departments</h2>
            <p className="text-sm text-gray-500">Manage organizational units</p>
          </div>
        </div>
        <div className="flex gap-3">
          {Object.values(filters).some(val => val !== '') && (
            <button
              onClick={() => setFilters({ name: '', site: '', supervisor: '' })}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg transition font-medium text-sm"
            >
              Clear Filters
            </button>
          )}
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold shadow-sm"
          >
            <Plus size={16} /> Add Department
          </button>
        </div>
      </div>

      <div className="bg-white border-y border-gray-200 flex flex-col flex-1 overflow-hidden">
        {isLoading ? (
          <TableSkeleton columns={4} />
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center text-red-500 p-8">Failed to load departments.</div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-auto scrollbar-thin">
              <table className="w-full text-sm text-left text-gray-500 relative">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th scope="col" className="px-4 py-2 border-b border-gray-100 w-[30%]">
                      <div className="flex items-center">
                        Department Name
                        <ColumnFilter
                          value={filters.name}
                          onChange={(val) => setFilters(prev => ({ ...prev, name: val }))}
                          type="select"
                          options={nameOptions}
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-2 border-b border-gray-100 w-[30%]">
                      <div className="flex items-center">
                        Site
                        <ColumnFilter
                          value={filters.site}
                          onChange={(val) => setFilters(prev => ({ ...prev, site: val }))}
                          type="select"
                          options={siteOptions}
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-2 border-b border-gray-100 w-[30%]">
                      <div className="flex items-center">
                        Supervisor Name
                        <ColumnFilter
                          value={filters.supervisor}
                          onChange={(val) => setFilters(prev => ({ ...prev, supervisor: val }))}
                          type="select"
                          options={supervisorOptionsMapped}
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-2 text-right border-b border-gray-100 w-[10%]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(!departments || departments.length === 0) ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-gray-500">
                        No departments found.
                      </td>
                    </tr>
                  ) : (
                    departments.map((dept) => (
                      <tr key={dept.id} className="bg-white border-b border-gray-50 hover:bg-gray-50 transition">
                        <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                          {dept.name}
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {sites?.find(s => s.id === dept.site_id)?.site_name || dept.site_name || <span className="font-mono text-xs text-gray-400">{dept.site_id}</span>}
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {dept.supervisor_first_name ? `${dept.supervisor_first_name} ${dept.supervisor_last_name}` : <span className="text-gray-400 italic">Unassigned</span>}
                        </td>
                        <td className="px-4 py-2 text-right space-x-2">
                          <Tooltip content="Edit" position="top">
                            <button
                              onClick={() => handleOpenEdit(dept)}
                              className="p-1.5 font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition"
                            >
                              <Pencil size={16} />
                            </button>
                          </Tooltip>
                          <Tooltip content="Delete" position="top">
                            <button
                              onClick={() => handleOpenDelete(dept)}
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

      <DepartmentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        department={selectedDepartment}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Department"
        message={`Are you sure you want to delete ${departmentToDelete?.name}? This action cannot be undone.`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};
