import { api } from '@/services/api';
import { Violation, ViolationFilters } from '../types';

export const violationService = {
  async getPaginated(page: number, limit: number, filters?: ViolationFilters): Promise<{ data: Violation[]; total: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.employee_code && { employee_code: filters.employee_code }),
      ...(filters?.violation_type_code && { violation_type_code: filters.violation_type_code }),
      ...(filters?.date_from && { date_from: filters.date_from }),
      ...(filters?.date_to && { date_to: filters.date_to }),
    });

    const res = await api.get(`/violations?${params}`);
    return {
      data: res.data.data,
      total: res.data.meta.total,
    };
  },

  async acknowledge(id: string, remarks?: string): Promise<Violation> {
    const res = await api.put(`/violations/${id}/acknowledge`, { remarks });
    return res.data.data;
  },

  async resolve(id: string, remarks?: string): Promise<Violation> {
    const res = await api.put(`/violations/${id}/resolve`, { remarks });
    return res.data.data;
  }
};
