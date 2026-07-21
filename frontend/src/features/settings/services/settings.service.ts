import { api } from '@/services/api';
import { Settings } from '../types';
import { API_ENDPOINTS } from '@/shared/constants/endpoints';

export const settingsService = {
  async getSettings(): Promise<Settings> {
    const res = await api.get(API_ENDPOINTS.SETTINGS.BASE);
    return res.data.data;
  },

  async updateSettings(data: Partial<Settings>): Promise<Settings> {
    const res = await api.put(API_ENDPOINTS.SETTINGS.BASE, data);
    return res.data.data;
  }
};
