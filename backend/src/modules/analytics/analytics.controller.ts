import { Request, Response, NextFunction } from 'express';
import { AnalyticsRepository } from './analytics.repository';
import { ApiResponse } from '../../shared/response/ApiResponse';

const repo = new AnalyticsRepository();

export class AnalyticsController {
  getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, role } = req.user!;
      const data = await repo.getAnalytics(role, userId);
      return ApiResponse.success(res, 'Analytics fetched successfully', data);
    } catch (error) {
      next(error);
    }
  };
}
