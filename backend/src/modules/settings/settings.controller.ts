import { Request, Response, NextFunction } from 'express';
import { SettingsService } from './settings.service';
import { ApiResponse } from '../../shared/response/ApiResponse';

export class SettingsController {
  private settingsService = new SettingsService();

  getSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.settingsService.getSettingsAsMap();
      return ApiResponse.success(res, 'Settings retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  };

  updateSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.settingsService.updateSettings(req.body);
      return ApiResponse.success(res, 'Settings updated successfully', data);
    } catch (error) {
      next(error);
    }
  };
}
