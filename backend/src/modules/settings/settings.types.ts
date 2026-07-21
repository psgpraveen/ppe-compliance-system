export interface SettingRow {
  id: string;
  setting_key: string;
  setting_value: string;
  description: string | null;
  updated_at: Date;
}

export interface SettingsUpdateDTO {
  [key: string]: string;
}
