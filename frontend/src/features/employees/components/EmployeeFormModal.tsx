import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EmployeeFormData, employeeSchema } from '../validation';
import { Employee } from '../types';
import { useDepartmentOptions } from '@/features/departments/hooks/useDepartments';
import { CustomDropdown, DropdownOption } from '@/components/ui/CustomDropdown';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => void;
  employee?: Employee;
  isSubmitting: boolean;
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  employee,
  isSubmitting
}) => {
  const { data: departments, isLoading: isLoadingDepartments } = useDepartmentOptions();

  const departmentOptions: DropdownOption[] = departments ? departments.map(d => ({ value: d.id, label: d.name })) : [];

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      employeeCode: '',
      firstName: '',
      lastName: '',
      departmentId: '',
      supervisorId: '',
      isActive: true,
    }
  });

  const departmentId = watch('departmentId');
  const supervisorId = watch('supervisorId');
  const prevDeptRef = useRef<string>('');

  const selectedDept = departments?.find(d => d.id === departmentId);
  const supervisorName = selectedDept?.supervisor_name || 'No Supervisor Assigned';

  useEffect(() => {
    if (employee && isOpen) {
      prevDeptRef.current = employee.department_id;
      reset({
        employeeCode: employee.employee_code,
        firstName: employee.first_name,
        lastName: employee.last_name,
        departmentId: employee.department_id,
        supervisorId: employee.supervisor_id || '',
        isActive: employee.is_active,
      });
    } else if (!isOpen) {
      prevDeptRef.current = '';
      reset({ employeeCode: '', firstName: '', lastName: '', departmentId: '', supervisorId: '', isActive: true });
    }
  }, [employee, isOpen, reset]);

  // Auto-fill supervisor when department changes manually
  useEffect(() => {
    if (isOpen && departmentId && departmentId !== prevDeptRef.current) {
      prevDeptRef.current = departmentId;
      if (departments) {
        const selectedDept = departments.find(d => d.id === departmentId);
        if (selectedDept) {
          // If the department has a default supervisor, auto-fill it
          setValue('supervisorId', selectedDept.supervisor_id || '', { shouldValidate: true, shouldDirty: true });
        }
      }
    }
  }, [departmentId, departments, isOpen, setValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            {employee ? 'Edit Employee' : 'Create Employee'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition"
          >
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Employee Code</label>
              <input
                type="text"
                {...register('employeeCode')}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 transition"
                placeholder="e.g. EMP-001"
              />
              {errors.employeeCode && <p className="mt-1 text-sm text-red-600">{errors.employeeCode.message}</p>}
            </div>

            <CustomDropdown
              label="Department"
              options={departmentOptions}
              isLoading={isLoadingDepartments}
              placeholder="Select Department"
              error={errors.departmentId?.message}
              value={departmentId}
              {...register('departmentId')}
            />

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">First Name</label>
              <input
                type="text"
                {...register('firstName')}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 transition"
                placeholder="e.g. John"
              />
              {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Last Name</label>
              <input
                type="text"
                {...register('lastName')}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 transition"
                placeholder="e.g. Doe"
              />
              {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
            </div>


            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-900">Assigned Supervisor (Auto-filled from Department)</label>
              <input
                type="text"
                disabled
                value={departmentId ? supervisorName : 'Select a department first'}
                className="bg-gray-100 border border-gray-300 text-gray-500 text-sm rounded-lg block w-full p-2.5 cursor-not-allowed"
              />
            </div>
            
            <div className="md:col-span-2 flex items-center mt-2">
              <input
                type="checkbox"
                {...register('isActive')}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ms-2 text-sm font-medium text-gray-900">Active Status</label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition disabled:opacity-70"
            >
              {isSubmitting ? 'Saving...' : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
