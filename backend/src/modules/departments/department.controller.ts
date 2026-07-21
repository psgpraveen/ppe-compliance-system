import { Request, Response, NextFunction } from 'express';
import { DepartmentService } from './department.service';
import { ApiResponse } from '../../shared/response/ApiResponse';

export class DepartmentController {
  private departmentService = new DepartmentService();

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const filters = {
        name: req.query.name as string | undefined,
        site: req.query.site as string | undefined,
        supervisor: req.query.supervisor as string | undefined,
      };

      const { data, meta } = await this.departmentService.getPaginated(page, limit, filters);
      return ApiResponse.paginated(res, 'Departments retrieved successfully', data, meta);
    } catch (error) {
      next(error);
    }
  };

  getOptions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const options = await this.departmentService.getOptions();
      return ApiResponse.success(res, 'Department options retrieved successfully', options);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.departmentService.getDepartmentById(req.params.id);
      return ApiResponse.success(res, 'Department retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.departmentService.createDepartment(req.body);
      return ApiResponse.success(res, 'Department created successfully', data, 201);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.departmentService.updateDepartment(req.params.id, req.body);
      return ApiResponse.success(res, 'Department updated successfully', data);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.departmentService.deleteDepartment(req.params.id);
      return ApiResponse.success(res, 'Department deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
