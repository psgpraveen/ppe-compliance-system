import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DepartmentFormData, departmentSchema } from '../validation';
import { Department } from '../types';
import { useSiteOptions } from '@/features/sites/hooks/useSites';
import { useSupervisorOptions } from '@/features/supervisors/hooks/useSupervisors';
import { CustomDropdown, DropdownOption } from '@/components/ui/CustomDropdown';

interface DepartmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DepartmentFormData) => void;
  department?: Department;
  isSubmitting: boolean;
}

export const DepartmentFormModal: React.FC<DepartmentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  department,
  isSubmitting
}) => {
  const { data: sites, isLoading: isLoadingSites } = useSiteOptions();
  const { data: supervisors, isLoading: isLoadingSupervisors } = useSupervisorOptions();

  const siteOptions: DropdownOption[] = sites ? sites.map(s => ({ value: s.id, label: s.site_name })) : [];
  const supervisorOptions: DropdownOption[] = supervisors ? supervisors.map(s => ({ value: s.id, label: `${s.first_name} ${s.last_name}` })) : [];

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      siteId: '',
      name: '',
      supervisorId: '',
    }
  });

  const siteId = watch('siteId');
  const supervisorId = watch('supervisorId');

  useEffect(() => {
    if (department && isOpen) {
      reset({
        siteId: department.site_id,
        name: department.name,
        supervisorId: department.supervisor_id || '',
      });
    } else if (!isOpen) {
      reset({ siteId: '', name: '', supervisorId: '' });
    }
  }, [department, isOpen, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            {department ? 'Edit Department' : 'Create Department'}
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
          <CustomDropdown
            label="Select Site"
            options={siteOptions}
            isLoading={isLoadingSites}
            placeholder="Choose a site"
            error={errors.siteId?.message}
            value={siteId}
            {...register('siteId')}
          />

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Department Name</label>
            <input
              type="text"
              {...register('name')}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 transition"
              placeholder="e.g. Concrete Division"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <CustomDropdown
            label="Supervisor (Optional)"
            options={supervisorOptions}
            isLoading={isLoadingSupervisors}
            placeholder="Select Supervisor (None)"
            error={errors.supervisorId?.message as string}
            value={supervisorId}
            {...register('supervisorId')}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
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
              {isSubmitting ? 'Saving...' : 'Save Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
