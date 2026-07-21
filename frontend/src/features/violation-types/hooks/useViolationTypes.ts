import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { 
  getViolationTypes, 
  getViolationTypeOptions, 
  createViolationType, 
  updateViolationType, 
  deleteViolationType 
} from '../services/violationType.service';

export const useViolationTypes = (page: number, limit: number, filters?: { name?: string; severity?: string }) => {
  return useQuery({
    queryKey: ['violation-types', page, limit, filters],
    queryFn: () => getViolationTypes(page, limit, filters),
    placeholderData: keepPreviousData,
  });
};

export const useViolationTypeOptions = () => {
  return useQuery({
    queryKey: ['violation-type-options'],
    queryFn: getViolationTypeOptions,
  });
};

export const useCreateViolationType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createViolationType,
    onSuccess: () => {
      toast.success('Violation type created successfully');
      queryClient.invalidateQueries({ queryKey: ['violation-types'] });
      queryClient.invalidateQueries({ queryKey: ['violation-type-options'] });
    },
    onError: (err: unknown) => {
      const error = err as any;
      toast.error(error?.response?.data?.message || 'Failed to create violation type');
    }
  });
};

export const useUpdateViolationType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => updateViolationType(id, data),
    onSuccess: () => {
      toast.success('Violation type updated successfully');
      queryClient.invalidateQueries({ queryKey: ['violation-types'] });
      queryClient.invalidateQueries({ queryKey: ['violation-type-options'] });
    },
    onError: (err: unknown) => {
      const error = err as any;
      toast.error(error?.response?.data?.message || 'Failed to update violation type');
    }
  });
};

export const useDeleteViolationType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteViolationType,
    onSuccess: () => {
      toast.success('Violation type deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['violation-types'] });
      queryClient.invalidateQueries({ queryKey: ['violation-type-options'] });
    },
    onError: (err: unknown) => {
      const error = err as any;
      toast.error(error?.response?.data?.message || 'Failed to delete violation type. It might be in use.');
    }
  });
};
