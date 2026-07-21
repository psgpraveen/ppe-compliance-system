import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { departmentService } from '../services/department.service';
import { DepartmentFormData } from '../validation';
import { toast } from '@/components/ui/Toast';

export const useDepartments = (page: number = 1, limit: number = 10, filters?: { name?: string; site?: string; supervisor?: string }) => {
  return useQuery({
    queryKey: ['departments', page, limit, filters],
    queryFn: () => departmentService.getAll(page, limit, filters),
    placeholderData: keepPreviousData,
  });
};

export const useDepartmentOptions = () => {
  return useQuery({
    queryKey: ['departments', 'options'],
    queryFn: () => departmentService.getOptions(),
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DepartmentFormData) => departmentService.create(data),
    onSuccess: () => {
      toast.success('Department created successfully');
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
    onError: (err: unknown) => {
      const error = err as any;
      toast.error(error.response?.data?.message || 'Failed to create department');
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: DepartmentFormData }) => departmentService.update(id, data),
    onSuccess: () => {
      toast.success('Department updated successfully');
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
    onError: (err: unknown) => {
      const error = err as any;
      toast.error(error.response?.data?.message || 'Failed to update department');
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => departmentService.delete(id),
    onSuccess: () => {
      toast.success('Department deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
    onError: (err: unknown) => {
      const error = err as any;
      toast.error(error.response?.data?.message || 'Failed to delete department');
    },
  });
};
