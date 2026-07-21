import { Response } from 'express';

export class ApiResponse {
  static success<T>(res: Response, message: string, data?: T, statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data: data || {},
    });
  }

  static paginated<T>(res: Response, message: string, data: T[], meta: { total: number, page: number, limit: number, totalPages: number }, statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta,
    });
  }

  static error(res: Response, message: string, errors?: unknown[], statusCode: number = 400) {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(errors && { errors })
    });
  }
}
