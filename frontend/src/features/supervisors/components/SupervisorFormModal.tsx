import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateSupervisorFormData, createSupervisorSchema, UpdateSupervisorFormData, updateSupervisorSchema } from '../validation';
import { Supervisor } from '../types';

interface SupervisorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => void;
  supervisor?: Supervisor;
  isSubmitting: boolean;
}

export const SupervisorFormModal: React.FC<SupervisorFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  supervisor,
  isSubmitting
}) => {
  const schema = supervisor ? updateSupervisorSchema : createSupervisorSchema;
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      isActive: true,
    }
  });

  useEffect(() => {
    if (supervisor && isOpen) {
      reset({
        firstName: supervisor.first_name,
        lastName: supervisor.last_name,
        email: supervisor.email,
        isActive: supervisor.is_active,
      });
    } else if (!isOpen) {
      reset({ firstName: '', lastName: '', email: '', password: '', isActive: true });
    }
  }, [supervisor, isOpen, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            {supervisor ? 'Edit Supervisor' : 'Create Supervisor'}
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
              <label className="block mb-2 text-sm font-medium text-gray-900">First Name</label>
              <input
                type="text"
                {...register('firstName')}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 transition"
                placeholder="e.g. John"
              />
              {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName?.message as string}</p>}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900">Last Name</label>
              <input
                type="text"
                {...register('lastName')}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 transition"
                placeholder="e.g. Doe"
              />
              {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName?.message as string}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-900">Email Address</label>
              <input
                type="email"
                {...register('email')}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 transition"
                placeholder="supervisor@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email?.message as string}</p>}
            </div>

            {!supervisor && (
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-900">Initial Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 pr-10 transition"
                    placeholder="Leave blank for default: ChangeMe123!"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password?.message as string}</p>}
              </div>
            )}
            
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
              {isSubmitting ? 'Saving...' : 'Save Supervisor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
