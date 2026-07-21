import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { employeeService } from '../services/employee.service';
import { EmployeeFormData } from '../validation';
import toast from 'react-hot-toast';
import { api } from '@/services/api';
import { API_ENDPOINTS } from '@/shared/constants/endpoints';

export const useRoleOptions = () => {
  return useQuery({
    queryKey: ['employees', 'roles'],
    queryFn: async () => {
      const res = await api.get(`${API_ENDPOINTS.EMPLOYEES.BASE}/roles`);
      return res.data.data as string[];
    }
  });
};

export const useEmployees = (page: number = 1, limit: number = 10, filters?: { code?: string; name?: string; role?: string; department?: string; status?: string }) => {
  return useQuery({
    queryKey: ['employees', page, limit, filters],
    queryFn: () => employeeService.getAll(page, limit, filters),
    placeholderData: keepPreviousData,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EmployeeFormData) => employeeService.create(data),
    onSuccess: () => {
      toast.success('Employee created successfully');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: (err: unknown) => {
      const error = err as any;
      toast.error(error.response?.data?.message || 'Failed to create employee');
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: EmployeeFormData }) => employeeService.update(id, data),
    onSuccess: () => {
      toast.success('Employee updated successfully');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: (err: unknown) => {
      const error = err as any;
      toast.error(error.response?.data?.message || 'Failed to update employee');
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => employeeService.delete(id),
    onSuccess: () => {
      toast.success('Employee deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: (err: unknown) => {
      const error = err as any;
      toast.error(error.response?.data?.message || 'Failed to delete employee');
    },
  });
};

export const useBulkImportEmployees = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>[]) => employeeService.bulkImport(data),
    onSuccess: (res) => {
      toast.success(`Import successful: ${res.imported} imported, ${res.failed} failed/skipped.`);
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: (err: unknown) => {
      const error = err as any;
      toast.error(error.response?.data?.message || 'Failed to bulk import employees');
    },
  });
};
