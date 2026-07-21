import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSettings, useUpdateSettings } from '../hooks/useSettings';
import { Settings } from '../types';
import { Clock, Bell, AlertTriangle, Mail } from 'lucide-react';
import { CustomSelect } from '@/components/ui/CustomSelect';

const TIME_OPTIONS = [
  { value: '5', label: '5 Minutes (Testing)' },
  { value: '15', label: '15 Minutes' },
  { value: '30', label: '30 Minutes' },
  { value: '45', label: '45 Minutes' },
  { value: '60', label: '1 Hour' },
  { value: '120', label: '2 Hours' },
  { value: '240', label: '4 Hours' },
];

export const SettingsPage = () => {
  const { data: settings, isLoading } = useSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();

  const { control, handleSubmit, reset } = useForm<Settings>({
    defaultValues: {
      escalation_time_minutes: '30',
      email_notifications: 'true',
      admin_escalation_notification: 'true',
    }
  });

  useEffect(() => {
    if (settings) {
      reset({
        escalation_time_minutes: settings.escalation_time_minutes || '30',
        email_notifications: settings.email_notifications || 'true',
        admin_escalation_notification: settings.admin_escalation_notification || 'true',
      });
    }
  }, [settings, reset]);

  const onSubmit = (data: Settings) => {
    updateSettings(data);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Helper Custom Toggle for string 'true' / 'false'
  const StringToggle = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
    const isChecked = value === 'true';
    return (
      <button
        type="button"
        className={`${
          isChecked ? 'bg-blue-600' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`}
        onClick={() => onChange(isChecked ? 'false' : 'true')}
      >
        <span
          className={`${
            isChecked ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    );
  };

  return (
    <div className="p-6 max-w-full mx-auto w-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Settings</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage global application preferences and automated workflows.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Escalation Policy Card */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden transition-all hover:shadow-md">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Escalation Policy</h3>
              <p className="text-sm text-gray-500">Configure how and when violations are escalated to administrators.</p>
            </div>
          </div>
          <div className="px-6 py-6">
            <div className="max-w-xl">
              <label htmlFor="escalation_time_minutes" className="block text-sm font-medium text-gray-900">
                Supervisor Action Timeout
              </label>
              <p className="mt-1 text-sm text-gray-500 mb-3">
                Select the duration a violation can remain unacknowledged before it is automatically escalated.
              </p>
              <div className="relative rounded-md shadow-sm">
                <Controller
                  name="escalation_time_minutes"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect options={TIME_OPTIONS} value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden transition-all hover:shadow-md">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-500">Manage system-wide notification preferences and alerts.</p>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {/* Admin Escalation Alert */}
            <div className="px-6 py-5 flex items-center justify-between hover:bg-gray-50/30 transition-colors">
              <div className="flex gap-4">
                <div className="mt-1 text-red-500"><AlertTriangle size={20} /></div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900">Admin Escalation Alerts</label>
                  <p className="text-sm text-gray-500 mt-1">Notify administrators immediately when a supervisor fails to take action in time.</p>
                </div>
              </div>
              <Controller
                name="admin_escalation_notification"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <StringToggle value={value} onChange={onChange} />
                )}
              />
            </div>

            {/* Email Notifications */}
            <div className="px-6 py-5 flex items-center justify-between hover:bg-gray-50/30 transition-colors">
              <div className="flex gap-4">
                <div className="mt-1 text-gray-400"><Mail size={20} /></div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900">Email Notifications</label>
                  <p className="text-sm text-gray-500 mt-1">Send daily summaries and alerts to supervisors via email.</p>
                </div>
              </div>
              <Controller
                name="email_notifications"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <StringToggle value={value} onChange={onChange} />
                )}
              />
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="lg:col-span-2 flex items-center justify-end gap-4 pt-4 border-t border-gray-200 mt-4">
          <button
            type="button"
            onClick={() => reset()}
            className="text-sm font-semibold text-gray-900 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isPending ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

      </form>
    </div>
  );
};
