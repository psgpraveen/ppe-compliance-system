import { Request, Response, NextFunction } from 'express';
import { ViolationTypeService } from './violation-type.service';

export class ViolationTypeController {
  private service = new ViolationTypeService();

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const filters = {
        name: req.query.name as string | undefined,
        severity: req.query.severity as string | undefined,
      };

      const result = await this.service.getPaginated(page, limit, filters);
      res.status(200).json({
        success: true,
        data: result.data,
        meta: result.meta
      });
    } catch (error) {
      next(error);
    }
  };

  getAllOptions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getAll();
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getById(req.params.id);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Violation type created successfully',
        data
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.update(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Violation type updated successfully',
        data
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.delete(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Violation type deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}
