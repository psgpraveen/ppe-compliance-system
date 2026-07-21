import { api } from '@/services/api';
import { API_ENDPOINTS } from '@/shared/constants/endpoints';
import { ViolationType, PaginatedResponse } from '../types';
import { ViolationTypeFormData } from '../validation';

export const getViolationTypes = async (page = 1, limit = 10, filters?: { name?: string; severity?: string }) => {
  const { data } = await api.get<{ success: boolean; data: ViolationType[]; meta: PaginatedResponse<ViolationType>['meta'] }>(
    API_ENDPOINTS.VIOLATION_TYPES.BASE,
    { params: { page, limit, ...filters } }
  );
  return data;
};

export const getViolationTypeOptions = async () => {
  const { data } = await api.get<{ success: boolean; data: ViolationType[] }>(
    API_ENDPOINTS.VIOLATION_TYPES.OPTIONS
  );
  return data.data;
};

export const createViolationType = async (payload: ViolationTypeFormData) => {
  const { data } = await api.post<{ success: boolean; data: ViolationType }>(
    API_ENDPOINTS.VIOLATION_TYPES.BASE,
    payload
  );
  return data.data;
};

export const updateViolationType = async (id: string, payload: ViolationTypeFormData) => {
  const { data } = await api.put<{ success: boolean; data: ViolationType }>(
    API_ENDPOINTS.VIOLATION_TYPES.BY_ID(id),
    payload
  );
  return data.data;
};

export const deleteViolationType = async (id: string) => {
  const { data } = await api.delete(API_ENDPOINTS.VIOLATION_TYPES.BY_ID(id));
  return data;
};
