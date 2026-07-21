import { api } from '@/services/api';
import { Site } from '../types';
import { SiteFormData } from '../validation';
import { API_ENDPOINTS } from '@/shared/constants/endpoints';

export const siteService = {
  /**
   * Fetches paginated construction sites from the server.
   * @returns {Promise<{ data: Site[], meta: { total: number; page: number; limit: number; totalPages: number; } }>} Paginated response
   */
  async getAll(page: number = 1, limit: number = 10, filters?: { site_name?: string; location?: string; status?: string }): Promise<{ data: Site[], meta: { total: number; page: number; limit: number; totalPages: number; } }> {
    let url = `${API_ENDPOINTS.SITES.BASE}?page=${page}&limit=${limit}`;
    if (filters?.site_name) url += `&site_name=${encodeURIComponent(filters.site_name)}`;
    if (filters?.location) url += `&location=${encodeURIComponent(filters.location)}`;
    if (filters?.status !== undefined && filters?.status !== '') url += `&status=${encodeURIComponent(filters.status)}`;
    const res = await api.get(url);
    return { data: res.data.data, meta: res.data.meta };
  },

  /**
   * Fetches site options for dropdowns.
   * @returns {Promise<{ id: string, site_name: string }[]>} Array of options
   */
  async getOptions(): Promise<{ id: string, site_name: string }[]> {
    const res = await api.get(`${API_ENDPOINTS.SITES.BASE}/options`);
    return res.data.data;
  },

  /**
   * Fetches a single site by its unique ID.
   * @param {string} id - The UUID of the site
   * @returns {Promise<Site>} The site object
   */
  async getById(id: string): Promise<Site> {
    const res = await api.get(API_ENDPOINTS.SITES.BY_ID(id));
    return res.data.data;
  },

  /**
   * Creates a new construction site record.
   * @param {SiteFormData} data - The validated form payload
   * @returns {Promise<Site>} The newly created site object
   */
  async create(data: SiteFormData): Promise<Site> {
    const res = await api.post(API_ENDPOINTS.SITES.BASE, data);
    return res.data.data;
  },

  /**
   * Updates an existing construction site record.
   * @param {string} id - The UUID of the site to update
   * @param {SiteFormData} data - The updated payload data
   * @returns {Promise<Site>} The updated site object
   */
  async update(id: string, data: SiteFormData): Promise<Site> {
    const res = await api.put(API_ENDPOINTS.SITES.BY_ID(id), data);
    return res.data.data;
  },

  /**
   * Permanently deletes a construction site record by ID.
   * @param {string} id - The UUID of the site to delete
   * @returns {Promise<void>}
   */
  async delete(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.SITES.BY_ID(id));
  }
};
