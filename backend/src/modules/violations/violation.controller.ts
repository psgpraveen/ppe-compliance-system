import { Request, Response, NextFunction } from 'express';
import { ViolationService } from './violation.service';
import { ApiResponse } from '../../shared/response/ApiResponse';

export class ViolationController {
  private violationService = new ViolationService();

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const filters = {
        status: req.query.status as string,
        employee_code: req.query.employee_code as string,
        violation_type_code: req.query.violation_type_code as string,
        date_from: req.query.date_from as string,
        date_to: req.query.date_to as string,
      };

      const { role, userId } = req.user!;
      const result = await this.violationService.getPaginated(page, limit, filters, role, userId);
      
      return res.status(200).json({
        success: true,
        message: 'Violations retrieved successfully',
        data: result.data,
        total: result.total,
        meta: {
          total: result.total,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  };

  createFromIoT = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { employeeCode, violationTypeCode, iotDeviceId, imageUrl } = req.body;
      const data = await this.violationService.createFromIoT(employeeCode, violationTypeCode, iotDeviceId, imageUrl);
      return ApiResponse.success(res, 'Violation recorded successfully', data, 201);
    } catch (error) {
      next(error);
    }
  };

  acknowledge = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { remarks } = req.body;
      const { userId, role } = req.user!;

      const data = await this.violationService.acknowledgeViolation(id, userId, role, remarks);
      return ApiResponse.success(res, 'Violation acknowledged successfully', data);
    } catch (error) {
      next(error);
    }
  };

  resolve = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { remarks } = req.body;
      const { userId, role } = req.user!;

      const data = await this.violationService.resolveViolation(id, userId, role, remarks);
      return ApiResponse.success(res, 'Violation resolved successfully', data);
    } catch (error) {
      next(error);
    }
  };
}
