import { api } from '@/services/api';
import { Department } from '../types';
import { DepartmentFormData } from '../validation';
import { API_ENDPOINTS } from '@/shared/constants/endpoints';

export const departmentService = {
  /**
   * Fetches paginated departments from the server.
   * @returns {Promise<{ data: Department[], meta: { total: number; page: number; limit: number; totalPages: number; } }>} Paginated response
   */
  async getAll(page: number = 1, limit: number = 10, filters?: { name?: string; site?: string; supervisor?: string }): Promise<{ data: Department[], meta: { total: number; page: number; limit: number; totalPages: number; } }> {
    let url = `${API_ENDPOINTS.DEPARTMENTS.BASE}?page=${page}&limit=${limit}`;
    if (filters?.name) url += `&name=${encodeURIComponent(filters.name)}`;
    if (filters?.site) url += `&site=${encodeURIComponent(filters.site)}`;
    if (filters?.supervisor) url += `&supervisor=${encodeURIComponent(filters.supervisor)}`;
    const res = await api.get(url);
    return { data: res.data.data, meta: res.data.meta };
  },

  /**
   * Fetches department options for dropdowns.
   * @returns {Promise<{ id: string, name: string, supervisor_id: string | null, supervisor_name: string | null }[]>} Array of options
   */
  async getOptions(): Promise<{ id: string, name: string, supervisor_id: string | null, supervisor_name: string | null }[]> {
    const res = await api.get(`${API_ENDPOINTS.DEPARTMENTS.BASE}/options`);
    return res.data.data;
  },

  /**
   * Fetches a single department by its unique ID.
   * @param {string} id - The UUID of the department
   * @returns {Promise<Department>} The department object
   */
  async getById(id: string): Promise<Department> {
    const res = await api.get(API_ENDPOINTS.DEPARTMENTS.BY_ID(id));
    return res.data.data;
  },

  /**
   * Creates a new department record.
   * @param {DepartmentFormData} data - The validated form payload
   * @returns {Promise<Department>} The newly created department object
   */
  async create(data: DepartmentFormData): Promise<Department> {
    // Convert empty string supervisorId to undefined to pass validation properly
    const payload = { ...data, supervisorId: data.supervisorId || undefined };
    const res = await api.post(API_ENDPOINTS.DEPARTMENTS.BASE, payload);
    return res.data.data;
  },

  /**
   * Updates an existing department record.
   * @param {string} id - The UUID of the department to update
   * @param {DepartmentFormData} data - The updated payload data
   * @returns {Promise<Department>} The updated department object
   */
  async update(id: string, data: DepartmentFormData): Promise<Department> {
    const payload = { ...data, supervisorId: data.supervisorId || undefined };
    const res = await api.put(API_ENDPOINTS.DEPARTMENTS.BY_ID(id), payload);
    return res.data.data;
  },

  /**
   * Permanently deletes a department record by ID.
   * @param {string} id - The UUID of the department to delete
   * @returns {Promise<void>}
   */
  async delete(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.DEPARTMENTS.BY_ID(id));
  }
};
