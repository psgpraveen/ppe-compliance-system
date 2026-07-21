import { api } from '@/services/api';
import { Employee } from '../types';
import { EmployeeFormData } from '../validation';
import { API_ENDPOINTS } from '@/shared/constants/endpoints';

export const employeeService = {
  /**
   * Fetches paginated employees from the server.
   * @returns {Promise<{ data: Employee[], meta: { total: number; page: number; limit: number; totalPages: number; } }>} Paginated response
   */
  async getAll(page: number = 1, limit: number = 10, filters?: { code?: string; name?: string; role?: string; department?: string; status?: string }): Promise<{ data: Employee[], meta: { total: number; page: number; limit: number; totalPages: number; } }> {
    let url = `${API_ENDPOINTS.EMPLOYEES.BASE}?page=${page}&limit=${limit}`;
    if (filters?.code) url += `&code=${encodeURIComponent(filters.code)}`;
    if (filters?.name) url += `&name=${encodeURIComponent(filters.name)}`;
    if (filters?.role) url += `&role=${encodeURIComponent(filters.role)}`;
    if (filters?.department) url += `&department=${encodeURIComponent(filters.department)}`;
    if (filters?.status !== undefined && filters?.status !== '') url += `&status=${encodeURIComponent(filters.status)}`;
    const res = await api.get(url);
    return { data: res.data.data, meta: res.data.meta };
  },

  /**
   * Fetches a single employee by their unique ID.
   * @param {string} id - The UUID of the employee
   * @returns {Promise<Employee>} The employee object
   */
  async getById(id: string): Promise<Employee> {
    const res = await api.get(API_ENDPOINTS.EMPLOYEES.BY_ID(id));
    return res.data.data;
  },

  /**
   * Creates a new employee record.
   * @param {EmployeeFormData} data - The validated form payload
   * @returns {Promise<Employee>} The newly created employee object
   */
  async create(data: EmployeeFormData): Promise<Employee> {
    const payload = { 
      ...data, 
      supervisorId: data.supervisorId || undefined,
      jobProfile: data.jobProfile || undefined,
      mobileNumber: data.mobileNumber || undefined,
      aadharNumber: data.aadharNumber || undefined
    };
    const res = await api.post(API_ENDPOINTS.EMPLOYEES.BASE, payload);
    return res.data.data;
  },

  /**
   * Updates an existing employee record.
   * @param {string} id - The UUID of the employee to update
   * @param {EmployeeFormData} data - The updated payload data
   * @returns {Promise<Employee>} The updated employee object
   */
  async update(id: string, data: EmployeeFormData): Promise<Employee> {
    const payload = { 
      ...data, 
      supervisorId: data.supervisorId || undefined,
      jobProfile: data.jobProfile || undefined,
      mobileNumber: data.mobileNumber || undefined,
      aadharNumber: data.aadharNumber || undefined
    };
    const res = await api.put(API_ENDPOINTS.EMPLOYEES.BY_ID(id), payload);
    return res.data.data;
  },

  /**
   * Permanently deletes an employee record by ID.
   * @param {string} id - The UUID of the employee to delete
   * @returns {Promise<void>}
   */
  async delete(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.EMPLOYEES.BY_ID(id));
  },

  /**
   * Bulk imports multiple employees from an array of JSON objects (parsed from Excel).
   * @param {any[]} employeesData - The parsed excel data
   * @returns {Promise<{ imported: number, failed: number }>}
   */
  async bulkImport(employeesData: Record<string, unknown>[]): Promise<{ imported: number, failed: number }> {
    const res = await api.post(API_ENDPOINTS.EMPLOYEES.BULK_IMPORT, employeesData);
    return res.data.data;
  }
};
