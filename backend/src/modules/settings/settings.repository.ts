import { query } from '../../shared/database/db';
import { SettingRow } from './settings.types';

export class SettingsRepository {
  async getAll(): Promise<SettingRow[]> {
    const res = await query('SELECT * FROM settings ORDER BY setting_key ASC');
    return res.rows;
  }

  async updateMany(settings: Record<string, string>): Promise<SettingRow[]> {
    const keys = Object.keys(settings);
    if (keys.length === 0) return this.getAll();

    // Use a transaction since we are updating multiple rows
    await query('BEGIN');
    try {
      for (const key of keys) {
        await query(
          `INSERT INTO settings (setting_key, setting_value) 
           VALUES ($2, $1) 
           ON CONFLICT (setting_key) 
           DO UPDATE SET setting_value = $1, updated_at = CURRENT_TIMESTAMP`,
          [settings[key], key]
        );
      }
      await query('COMMIT');
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

    return this.getAll();
  }
}
