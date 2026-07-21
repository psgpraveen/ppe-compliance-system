import React, { useState } from 'react';
import { useEmployees } from '@/features/employees/hooks/useEmployees';
import { useViolationTypes } from '@/features/violation-types/hooks/useViolationTypes';
import { api } from '@/services/api';
import { toast } from '@/components/ui/Toast';
import { Camera, Send, Activity, Server, AlertCircle } from 'lucide-react';
import { CustomSelect } from '@/components/ui/CustomSelect';

export const IoTSimulatorPage = () => {
  const { data: employeesData } = useEmployees(1, 100);
  const { data: violationTypesData } = useViolationTypes(1, 100);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [formData, setFormData] = useState({
    employeeCode: '',
    violationTypeCode: '',
    iotDeviceId: '',
    imageUrl: 'https://images.unsplash.com/photo-1541888071855-6677464197c3?auto=format&fit=crop&q=80&w=600',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeCode || !formData.violationTypeCode) {
      toast.error('Please select an employee and violation type');
      return;
    }

    setIsSubmitting(true);
    try {
      // Hit the public webhook directly
      const payload = {
        ...formData,
        iotDeviceId: formData.iotDeviceId.trim() || null
      };
      
      const res = await api.post('/violations/iot-report', payload);
      setApiResponse(res.data);
      toast.success('Simulated violation reported successfully!');
      
      // Optionally reset form
      // setFormData({ ...formData, employeeCode: '', violationTypeCode: '' });
    } catch (err: unknown) {
      const error = err as { response?: { data?: any }; message?: string };
      setApiResponse(error.response?.data || { error: error.message });
      toast.error((error.response?.data as any)?.message || 'Failed to send IoT report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          <Activity className="text-blue-600" size={32} />
          IoT Camera Simulator
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Simulate a physical IoT camera detecting a PPE compliance violation and sending it to the backend webhook.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Camera size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Virtual Camera Feed</h3>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Detected Employee</label>
              <CustomSelect
                value={formData.employeeCode}
                onChange={(val) => setFormData({ ...formData, employeeCode: val })}
                placeholder="-- Select Employee --"
                options={
                  employeesData?.data.map((emp) => ({
                    value: emp.employee_code,
                    label: `${emp.first_name} ${emp.last_name} (${emp.employee_code})`
                  })) || []
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Detected Violation</label>
              <CustomSelect
                value={formData.violationTypeCode}
                onChange={(val) => setFormData({ ...formData, violationTypeCode: val })}
                placeholder="-- Select Violation Type --"
                options={
                  violationTypesData?.data.map((vt) => ({
                    value: vt.code,
                    label: `${vt.name} (Severity: ${vt.severity})`
                  })) || []
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IoT Device ID (Simulated)</label>
              <input
                type="text"
                value={formData.iotDeviceId}
                onChange={(e) => setFormData({ ...formData, iotDeviceId: e.target.value })}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Snapshot Image URL</label>
              <input
                type="text"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Transmitting...' : (
                <>
                  <Send size={18} />
                  Trigger Violation Webhook
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Card - sticky on scroll */}
        <div className="sticky top-6 bg-gray-900 rounded-xl shadow-xl overflow-hidden text-gray-300 border border-gray-800 max-h-[calc(100vh-7rem)] flex flex-col">
          <div className="px-6 py-5 border-b border-gray-800 bg-gray-950 flex items-center gap-3">
            <div className="p-2 bg-gray-800 text-green-400 rounded-lg">
              <Server size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Backend Webhook API</h3>
            </div>
          </div>
          
          <div className="p-6 space-y-4 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full">
            <p className="text-sm">
              When you click the trigger button, this interface sends a <code className="text-green-400 bg-gray-800 px-1 py-0.5 rounded">POST</code> request to:
            </p>
            <div className="bg-black p-3 rounded-lg border border-gray-800 overflow-x-auto">
              <code className="text-blue-400 text-sm">/api/v1/violations/iot-report</code>
            </div>
            
            <p className="text-sm mt-4">Payload being sent:</p>
            <div className="bg-black p-4 rounded-lg border border-gray-800 overflow-x-auto">
              <pre className="text-xs text-green-400 font-mono">
{JSON.stringify(
  {
    ...formData,
    iotDeviceId: formData.iotDeviceId.trim() || null
  },
  null,
  2
)}
              </pre>
            </div>

            {apiResponse && (
              <>
                <p className="text-sm mt-4 text-green-400 border-t border-gray-800 pt-4">API Response:</p>
                <div className="bg-black p-4 rounded-lg border border-gray-800 overflow-x-auto">
                  <pre className="text-xs text-blue-300 font-mono">
{JSON.stringify(apiResponse, null, 2)}
                  </pre>
                </div>
              </>
            )}

            <div className="mt-6 flex items-start gap-3 bg-blue-900/20 p-4 rounded-lg border border-blue-900/50">
              <AlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-xs text-blue-200 leading-relaxed">
                Once transmitted, the backend will validate the codes, create a PENDING violation in the database, and it will immediately appear in the Violations Dashboard!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
