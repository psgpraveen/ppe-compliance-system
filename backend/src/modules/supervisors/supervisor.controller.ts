import { Request, Response, NextFunction } from 'express';
import { SupervisorService } from './supervisor.service';
import { ApiResponse } from '../../shared/response/ApiResponse';

export class SupervisorController {
  private supervisorService = new SupervisorService();

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const filters = {
        name: req.query.name as string | undefined,
        email: req.query.email as string | undefined,
        status: req.query.status as string | undefined,
      };

      const { data, meta } = await this.supervisorService.getPaginated(page, limit, filters);
      return ApiResponse.paginated(res, 'Supervisors retrieved successfully', data, meta);
    } catch (error) {
      next(error);
    }
  };

  getOptions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const options = await this.supervisorService.getOptions();
      return ApiResponse.success(res, 'Supervisor options retrieved successfully', options);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.supervisorService.getSupervisorById(req.params.id);
      return ApiResponse.success(res, 'Supervisor retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.supervisorService.createSupervisor(req.body);
      return ApiResponse.success(res, 'Supervisor created successfully', data, 201);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.supervisorService.updateSupervisor(req.params.id, req.body);
      return ApiResponse.success(res, 'Supervisor updated successfully', data);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.supervisorService.deleteSupervisor(req.params.id);
      return ApiResponse.success(res, 'Supervisor deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
