import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { supervisorService } from '../services/supervisor.service';
import { CreateSupervisorFormData, UpdateSupervisorFormData } from '../validation';
import { toast } from '@/components/ui/Toast';

export const useSupervisors = (page: number = 1, limit: number = 10, filters?: { name?: string; email?: string; status?: string }) => {
  return useQuery({
    queryKey: ['supervisors', page, limit, filters],
    queryFn: () => supervisorService.getAll(page, limit, filters),
    placeholderData: keepPreviousData,
  });
};

export const useSupervisorOptions = () => {
  return useQuery({
    queryKey: ['supervisors', 'options'],
    queryFn: () => supervisorService.getOptions(),
  });
};

export const useCreateSupervisor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => supervisorService.create(data),
    onSuccess: () => {
      toast.success('Supervisor created successfully');
      queryClient.invalidateQueries({ queryKey: ['supervisors'] });
    },
    onError: (err: unknown) => {
      const error = err as any;
      toast.error(error.response?.data?.message || 'Failed to create supervisor');
    },
  });
};

export const useUpdateSupervisor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => supervisorService.update(id, data),
    onSuccess: () => {
      toast.success('Supervisor updated successfully');
      queryClient.invalidateQueries({ queryKey: ['supervisors'] });
    },
    onError: (err: unknown) => {
      const error = err as any;
      toast.error(error.response?.data?.message || 'Failed to update supervisor');
    },
  });
};

export const useDeleteSupervisor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => supervisorService.delete(id),
    onSuccess: () => {
      toast.success('Supervisor deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['supervisors'] });
    },
    onError: (err: unknown) => {
      const error = err as any;
      toast.error(error.response?.data?.message || 'Failed to delete supervisor');
    },
  });
};
