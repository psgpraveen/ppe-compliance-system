import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { siteService } from '../services/site.service';
import { SiteFormData } from '../validation';
import { toast } from '@/components/ui/Toast';

export const useSites = (page: number = 1, limit: number = 10, filters?: { site_name?: string; location?: string; status?: string }) => {
  return useQuery({
    queryKey: ['sites', page, limit, filters],
    queryFn: () => siteService.getAll(page, limit, filters),
    placeholderData: keepPreviousData,
  });
};

export const useSiteOptions = () => {
  return useQuery({
    queryKey: ['sites', 'options'],
    queryFn: () => siteService.getOptions(),
  });
};

export const useCreateSite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SiteFormData) => siteService.create(data),
    onSuccess: () => {
      toast.success('Site created successfully');
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    },
    onError: (err: unknown) => {
      const error = err as any;
      toast.error(error.response?.data?.message || 'Failed to create site');
    },
  });
};

export const useUpdateSite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: SiteFormData }) => siteService.update(id, data),
    onSuccess: () => {
      toast.success('Site updated successfully');
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    },
    onError: (err: unknown) => {
      const error = err as any;
      toast.error(error.response?.data?.message || 'Failed to update site');
    },
  });
};

export const useDeleteSite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => siteService.delete(id),
    onSuccess: () => {
      toast.success('Site deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    },
    onError: (err: unknown) => {
      const error = err as any;
      toast.error(error.response?.data?.message || 'Failed to delete site');
    },
  });
};
