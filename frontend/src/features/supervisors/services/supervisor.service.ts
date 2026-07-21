import { api } from '@/services/api';
import { Supervisor } from '../types';
import { CreateSupervisorFormData, UpdateSupervisorFormData } from '../validation';
import { API_ENDPOINTS } from '@/shared/constants/endpoints';

export const supervisorService = {
  /**
   * Fetches paginated supervisors from the server.
   * @returns {Promise<{ data: Supervisor[], meta: { total: number; page: number; limit: number; totalPages: number; } }>} Paginated response
   */
  async getAll(page: number = 1, limit: number = 10, filters?: { name?: string; email?: string; status?: string }): Promise<{ data: Supervisor[], meta: { total: number; page: number; limit: number; totalPages: number; } }> {
    let url = `${API_ENDPOINTS.SUPERVISORS.BASE}?page=${page}&limit=${limit}`;
    if (filters?.name) url += `&name=${encodeURIComponent(filters.name)}`;
    if (filters?.email) url += `&email=${encodeURIComponent(filters.email)}`;
    if (filters?.status !== undefined && filters?.status !== '') url += `&status=${encodeURIComponent(filters.status)}`;
    const res = await api.get(url);
    return { data: res.data.data, meta: res.data.meta };
  },

  /**
   * Fetches supervisor options for dropdowns.
   * @returns {Promise<{ id: string, first_name: string, last_name: string }[]>} Array of options
   */
  async getOptions(): Promise<{ id: string, first_name: string, last_name: string }[]> {
    const res = await api.get(`${API_ENDPOINTS.SUPERVISORS.BASE}/options`);
    return res.data.data;
  },

  /**
   * Fetches a single supervisor by ID.
   * @param {string} id
   * @returns {Promise<Supervisor>}
   */
  async getById(id: string): Promise<Supervisor> {
    const res = await api.get(API_ENDPOINTS.SUPERVISORS.BY_ID(id));
    return res.data.data;
  },

  /**
   * Creates a new supervisor.
   * @param {CreateSupervisorFormData} data
   * @returns {Promise<Supervisor>}
   */
  async create(data: CreateSupervisorFormData): Promise<Supervisor> {
    const payload = { ...data, password: data.password || undefined };
    const res = await api.post(API_ENDPOINTS.SUPERVISORS.BASE, payload);
    return res.data.data;
  },

  /**
   * Updates an existing supervisor.
   * @param {string} id
   * @param {UpdateSupervisorFormData} data
   * @returns {Promise<Supervisor>}
   */
  async update(id: string, data: UpdateSupervisorFormData): Promise<Supervisor> {
    const res = await api.put(API_ENDPOINTS.SUPERVISORS.BY_ID(id), data);
    return res.data.data;
  },

  /**
   * Deletes a supervisor.
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.SUPERVISORS.BY_ID(id));
  }
};
