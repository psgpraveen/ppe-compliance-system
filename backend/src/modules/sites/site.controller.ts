import { Request, Response, NextFunction } from 'express';
import { SiteService } from './site.service';
import { ApiResponse } from '../../shared/response/ApiResponse';

export class SiteController {
  private siteService = new SiteService();

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const filters = {
        site_name: req.query.site_name as string | undefined,
        location: req.query.location as string | undefined,
        status: req.query.status as string | undefined,
      };

      const { data, meta } = await this.siteService.getPaginated(page, limit, filters);
      return ApiResponse.paginated(res, 'Sites retrieved successfully', data, meta);
    } catch (error) {
      next(error);
    }
  };

  getOptions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const options = await this.siteService.getOptions();
      return ApiResponse.success(res, 'Site options retrieved successfully', options);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.siteService.getSiteById(req.params.id);
      return ApiResponse.success(res, 'Site retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.siteService.createSite(req.body);
      return ApiResponse.success(res, 'Site created successfully', data, 201);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.siteService.updateSite(req.params.id, req.body);
      return ApiResponse.success(res, 'Site updated successfully', data);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.siteService.deleteSite(req.params.id);
      return ApiResponse.success(res, 'Site deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
