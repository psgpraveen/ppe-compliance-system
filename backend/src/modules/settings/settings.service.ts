import { SettingsRepository } from './settings.repository';
import { SettingsUpdateDTO } from './settings.types';

export class SettingsService {
  private settingsRepository = new SettingsRepository();

  /**
   * Fetches all settings and formats them as a simple key-value object.
   */
  async getSettingsAsMap(): Promise<Record<string, string>> {
    const rows = await this.settingsRepository.getAll();
    const settingsMap: Record<string, string> = {};
    rows.forEach(row => {
      settingsMap[row.setting_key] = row.setting_value;
    });
    return settingsMap;
  }

  /**
   * Updates settings and returns the updated key-value map.
   */
  async updateSettings(data: SettingsUpdateDTO): Promise<Record<string, string>> {
    const updatedRows = await this.settingsRepository.updateMany(data);
    const settingsMap: Record<string, string> = {};
    updatedRows.forEach(row => {
      settingsMap[row.setting_key] = row.setting_value;
    });
    return settingsMap;
  }
}
