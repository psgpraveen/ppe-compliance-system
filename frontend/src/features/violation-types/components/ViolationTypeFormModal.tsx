import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { violationTypeSchema, ViolationTypeFormData } from '../validation';
import { ViolationType } from '../types';
import { CustomDropdown } from '@/components/ui/CustomDropdown';

interface ViolationTypeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ViolationTypeFormData) => void;
  violationType?: ViolationType;
  isSubmitting: boolean;
}

export const ViolationTypeFormModal: React.FC<ViolationTypeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  violationType,
  isSubmitting
}) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<ViolationTypeFormData>({
    resolver: zodResolver(violationTypeSchema),
    defaultValues: {
      code: '',
      name: '',
      severity: 'LOW',
      is_active: true
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (violationType) {
        reset({
          code: violationType.code,
          name: violationType.name,
          severity: violationType.severity,
          is_active: violationType.is_active
        });
      } else {
        reset({
          code: '',
          name: '',
          severity: 'LOW',
          is_active: true
        });
      }
    }
  }, [isOpen, violationType, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center rounded-t-xl">
          <h3 className="text-lg font-bold text-gray-900">
            {violationType ? 'Edit Violation Type' : 'Add Violation Type'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
            <input 
              {...register('code')}
              type="text" 
              placeholder="e.g. HELMET_MISSING"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              {...register('name')}
              type="text" 
              placeholder="e.g. Helmet Missing"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <CustomDropdown 
            label="Severity"
            options={[
              { value: 'LOW', label: 'Low' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'HIGH', label: 'High' }
            ]}
            value={watch('severity')}
            {...register('severity')}
            error={errors.severity?.message}
            placeholder="Select severity"
          />

          <div className="flex items-center space-x-2">
            <input 
              {...register('is_active')}
              type="checkbox"
              id="is_active"
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
