import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { violationService } from '../services/violation.service';
import { ViolationFilters } from '../types';
import { toast } from '@/components/ui/Toast';

export const useViolations = (page: number = 1, limit: number = 10, filters?: ViolationFilters) => {
  return useQuery({
    queryKey: ['violations', page, limit, filters],
    queryFn: () => violationService.getPaginated(page, limit, filters),
    placeholderData: keepPreviousData,
    refetchInterval: 15000,
  });
};

export const useAcknowledgeViolation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, remarks }: { id: string, remarks?: string }) => violationService.acknowledge(id, remarks),
    onSuccess: () => {
      toast.success('Violation Acknowledged', 'Marked as acknowledged successfully.');
      queryClient.invalidateQueries({ queryKey: ['violations'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['violation-alerts'] });
    },
    onError: (err: unknown) => {
      const error = err as any;
      toast.error('Failed to Acknowledge', error.response?.data?.message || 'Something went wrong.');
    }
  });
};

export const useResolveViolation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, remarks }: { id: string, remarks?: string }) => violationService.resolve(id, remarks),
    onSuccess: () => {
      toast.success('Violation Resolved', 'Marked as resolved successfully.');
      queryClient.invalidateQueries({ queryKey: ['violations'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['violation-alerts'] });
    },
    onError: (err: unknown) => {
      const error = err as any;
      toast.error('Failed to Resolve', error.response?.data?.message || 'Something went wrong.');
    }
  });
};
