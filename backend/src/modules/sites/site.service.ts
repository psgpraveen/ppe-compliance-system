import { AppError } from '../../shared/errors/AppError';
import { SiteRepository } from './site.repository';
import { SiteRow, CreateSiteDTO, UpdateSiteDTO } from './site.types';

export class SiteService {
  private siteRepository = new SiteRepository();

  async getPaginated(page: number, limit: number, filters?: { site_name?: string; location?: string; status?: string }): Promise<{ data: SiteRow[], meta: { total: number; page: number; limit: number; totalPages: number; } }> {
    const { data, total } = await this.siteRepository.getPaginated(page, limit, filters);
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAllSites(): Promise<SiteRow[]> {
    return this.siteRepository.getAll();
  }

  async getOptions(): Promise<{ id: string, site_name: string }[]> {
    return this.siteRepository.getOptions();
  }

  async getSiteById(id: string): Promise<SiteRow> {
    const site = await this.siteRepository.getById(id);
    if (!site) {
      throw new AppError('Site not found', 404);
    }
    return site;
  }

  async createSite(data: CreateSiteDTO): Promise<SiteRow> {
    const existing = await this.siteRepository.getByName(data.siteName);
    if (existing) {
      throw new AppError('Site name already exists', 400);
    }
    return this.siteRepository.create(data.siteName, data.location || null);
  }

  async updateSite(id: string, data: UpdateSiteDTO): Promise<SiteRow> {
    const site = await this.getSiteById(id);

    if (data.siteName && data.siteName !== site.site_name) {
      const existing = await this.siteRepository.getByName(data.siteName);
      if (existing) {
        throw new AppError('Site name already exists', 400);
      }
    }

    const newName = data.siteName || site.site_name;
    const newLocation = data.location !== undefined ? (data.location || null) : site.location;
    const newIsActive = data.isActive !== undefined ? data.isActive : site.is_active;

    return this.siteRepository.update(id, newName, newLocation, newIsActive);
  }

  async deleteSite(id: string): Promise<void> {
    await this.getSiteById(id); // Check existence
    // The DB will throw a foreign key error if departments exist for this site (RESTRICT).
    await this.siteRepository.delete(id);
  }
}
