import { Request, Response, NextFunction } from 'express';
import { EmployeeService } from './employee.service';
import { ApiResponse } from '../../shared/response/ApiResponse';

export class EmployeeController {
  private employeeService = new EmployeeService();

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const filters = {
        code: req.query.code as string | undefined,
        name: req.query.name as string | undefined,
        role: req.query.role as string | undefined,
        department: req.query.department as string | undefined,
        status: req.query.status as string | undefined,
      };

      const { role, userId } = req.user || {};
      const { data, meta } = await this.employeeService.getPaginated(page, limit, filters, role, userId);
      return ApiResponse.paginated(res, 'Employees retrieved successfully', data, meta);
    } catch (error) {
      next(error);
    }
  };

  getRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roles = await this.employeeService.getRoles();
      return ApiResponse.success(res, 'Roles retrieved successfully', roles);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.employeeService.getEmployeeById(req.params.id);
      return ApiResponse.success(res, 'Employee retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role, userId } = req.user || {};
      const data = await this.employeeService.createEmployee(req.body, role, userId);
      return ApiResponse.success(res, 'Employee created successfully', data, 201);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role, userId } = req.user || {};
      const data = await this.employeeService.updateEmployee(req.params.id, req.body, role, userId);
      return ApiResponse.success(res, 'Employee updated successfully', data);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role, userId } = req.user || {};
      await this.employeeService.deleteEmployee(req.params.id, role, userId);
      return ApiResponse.success(res, 'Employee deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  bulkImport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.employeeService.processBulkImport(req.body);
      return ApiResponse.success(res, 'Bulk import completed', data, 201);
    } catch (error) {
      next(error);
    }
  };
}
