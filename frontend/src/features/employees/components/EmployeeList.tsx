import React, { useState, useEffect } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { ColumnFilter } from '@/components/ui/ColumnFilter';
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee, useRoleOptions } from '../hooks/useEmployees';
import { useDepartmentOptions } from '@/features/departments/hooks/useDepartments';
import { Employee } from '../types';
import { EmployeeFormModal } from './EmployeeFormModal';
import { ImportEmployeesModal } from './ImportEmployeesModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { EmployeeFormData } from '../validation';
import { Pagination } from '@/components/ui/Pagination';
import { Tooltip } from '@/components/ui/Tooltip';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { Pencil, Trash2, Users, Plus, Upload } from 'lucide-react';

export const EmployeeList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [filters, setFilters] = useState({ code: '', name: '', role: '', department: '', status: '' });
  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedFilters]);

  const { data: response, isLoading, isError } = useEmployees(page, limit, debouncedFilters);
  const employees = response?.data;
  const meta = response?.meta;
  const { data: deptOptionsResponse } = useDepartmentOptions();

  const departmentOptions = [
    { label: 'All', value: '' },
    ...(Array.isArray(deptOptionsResponse) ? deptOptionsResponse.map((d: { name: string }) => ({ label: d.name, value: d.name })) : [])
  ];

  const { data: roleOptionsResponse } = useRoleOptions();
  const roleOptions = [
    { label: 'All', value: '' },
    ...(Array.isArray(roleOptionsResponse) ? roleOptionsResponse.map((r: string) => ({ label: r, value: r })) : [])
  ];

  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const deleteMutation = useDeleteEmployee();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>(undefined);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const handleOpenCreate = () => {
    setSelectedEmployee(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = (data: EmployeeFormData) => {
    if (selectedEmployee) {
      updateMutation.mutateAsync({ id: selectedEmployee.id, data }, {
        onSuccess: () => setIsFormOpen(false)
      });
    } else {
      createMutation.mutateAsync(data, {
        onSuccess: () => setIsFormOpen(false)
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (employeeToDelete) {
      deleteMutation.mutateAsync(employeeToDelete.id, {
        onSuccess: () => setIsDeleteOpen(false)
      });
    }
  };



  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6 shrink-0 px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 text-green-600 rounded-xl">
            <Users size={20} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Employees</h2>
            <p className="text-sm text-gray-500">Manage workforce records</p>
          </div>
        </div>
        <div className="flex gap-2 self-end sm:self-auto">
          {Object.values(filters).some(val => val !== '') && (
            <button
              onClick={() => setFilters({ code: '', name: '', department: '', role: '', status: '' })}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg transition font-medium text-sm"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsImportOpen(true)}
            className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-50 transition text-sm font-semibold"
          >
            <Upload size={15} /> <span className="hidden sm:inline">Bulk </span>Import
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold shadow-sm"
          >
            <Plus size={16} /> Add Employee
          </button>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton columns={8} />
      ) : isError ? (
        <div className="flex-1 flex items-center justify-center bg-white border-y border-gray-200 text-red-500 p-8">Failed to load employees.</div>
      ) : (
        <div className="bg-white border-y border-gray-200 flex flex-col flex-1 overflow-hidden">
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-auto scrollbar-thin">
              <table className="w-full text-sm text-left text-gray-500 relative">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th scope="col" className="px-4 py-2 border-b border-gray-100 w-[10%]">
                      <div className="flex items-center">
                        Code
                        <ColumnFilter
                          value={filters.code}
                          onChange={(val) => setFilters(prev => ({ ...prev, code: val }))}
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-2 border-b border-gray-100 w-[15%]">
                      <div className="flex items-center">
                        Name
                        <ColumnFilter
                          value={filters.name}
                          onChange={(val) => setFilters(prev => ({ ...prev, name: val }))}
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-2 border-b border-gray-100 w-[12%]">Mobile No.</th>
                    <th scope="col" className="px-4 py-2 border-b border-gray-100 w-[12%]">Aadhar No.</th>
                    <th scope="col" className="px-4 py-2 border-b border-gray-100 w-[18%]">
                      <div className="flex items-center">
                        Role
                        <ColumnFilter
                          value={filters.role}
                          onChange={(val) => setFilters(prev => ({ ...prev, role: val }))}
                          type="select"
                          options={roleOptions}
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-2 border-b border-gray-100 w-[17%]">
                      <div className="flex items-center">
                        Department
                        <ColumnFilter
                          value={filters.department}
                          onChange={(val) => setFilters(prev => ({ ...prev, department: val }))}
                          type="select"
                          options={departmentOptions}
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-2 border-b border-gray-100 w-[8%]">
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
                    <th scope="col" className="px-4 py-2 text-right border-b border-gray-100 w-[8%]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(!employees || employees.length === 0) ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-gray-500">
                        No employees found.
                      </td>
                    </tr>
                  ) : (
                    employees.map((emp) => (
                      <tr key={emp.id} className="bg-white border-b border-gray-50 hover:bg-gray-50 transition">
                        <td className="px-4 py-2 font-mono font-medium text-gray-900 whitespace-nowrap">
                          {emp.employee_code}
                        </td>
                        <td className="px-4 py-2 font-medium text-gray-900">
                          {emp.first_name} {emp.last_name}
                        </td>
                        <td className="px-4 py-2 text-gray-600 text-sm">
                          {emp.mobile_number || '-'}
                        </td>
                        <td className="px-4 py-2 text-gray-600 text-sm">
                          {emp.aadhar_number || '-'}
                        </td>
                        <td className="px-4 py-2 text-gray-600 text-sm">
                          {emp.job_profile || '-'}
                        </td>
                        <td className="px-4 py-2 text-gray-600 text-sm">
                          {emp.department_name}
                        </td>
                        <td className="px-4 py-2">
                          {emp.is_active ? (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full border border-green-200">Active</span>
                          ) : (
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full border border-red-200">Inactive</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-right space-x-2">
                          <Tooltip content="Edit" position="top">
                            <button
                              onClick={() => handleOpenEdit(emp)}
                              className="p-1.5 font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition"
                            >
                              <Pencil size={16} />
                            </button>
                          </Tooltip>
                          <Tooltip content="Delete" position="top">
                            <button
                              onClick={() => handleOpenDelete(emp)}
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
        </div>
      )}

      <EmployeeFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        employee={selectedEmployee}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ImportEmployeesModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Employee"
        message={`Are you sure you want to delete ${employeeToDelete?.first_name} ${employeeToDelete?.last_name}? This action cannot be undone.`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};
