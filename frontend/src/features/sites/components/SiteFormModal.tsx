import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SiteFormData, siteSchema } from '../validation';
import { Site } from '../types';

interface SiteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SiteFormData) => void;
  site?: Site;
  isSubmitting: boolean;
}

export const SiteFormModal: React.FC<SiteFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  site,
  isSubmitting
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SiteFormData>({
    resolver: zodResolver(siteSchema),
    defaultValues: {
      siteName: '',
      location: '',
      isActive: true,
    }
  });

  useEffect(() => {
    if (site && isOpen) {
      reset({
        siteName: site.site_name,
        location: site.location || '',
        isActive: site.is_active,
      });
    } else if (!isOpen) {
      reset({ siteName: '', location: '', isActive: true });
    }
  }, [site, isOpen, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            {site ? 'Edit Site' : 'Create Site'}
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
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Site Name</label>
            <input
              type="text"
              {...register('siteName')}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 transition"
              placeholder="e.g. Downtown Construction"
            />
            {errors.siteName && <p className="mt-1 text-sm text-red-600">{errors.siteName.message}</p>}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Location (Optional)</label>
            <input
              type="text"
              {...register('location')}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 transition"
              placeholder="e.g. 123 Main St"
            />
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('isActive')}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ms-2 text-sm font-medium text-gray-900">Active Status</label>
          </div>

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
              {isSubmitting ? 'Saving...' : 'Save Site'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
