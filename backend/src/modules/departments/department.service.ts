import { AppError } from '../../shared/errors/AppError';
import { DepartmentRepository } from './department.repository';
import { DepartmentRow, CreateDepartmentDTO, UpdateDepartmentDTO } from './department.types';

export class DepartmentService {
  private departmentRepository = new DepartmentRepository();

  async getPaginated(page: number, limit: number, filters?: { name?: string; site?: string; supervisor?: string }): Promise<{ data: DepartmentRow[], meta: { total: number; page: number; limit: number; totalPages: number; } }> {
    const { data, total } = await this.departmentRepository.getPaginated(page, limit, filters);
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

  async getAllDepartments(): Promise<DepartmentRow[]> {
    return this.departmentRepository.getAll();
  }

  async getOptions(): Promise<{ id: string, name: string, supervisor_id: string | null, supervisor_name: string | null }[]> {
    return this.departmentRepository.getOptions();
  }

  async getDepartmentById(id: string): Promise<DepartmentRow> {
    const department = await this.departmentRepository.getById(id);
    if (!department) {
      throw new AppError('Department not found', 404);
    }
    return department;
  }

  async createDepartment(data: CreateDepartmentDTO): Promise<DepartmentRow> {
    const existing = await this.departmentRepository.getByName(data.name);
    if (existing) {
      throw new AppError('Department name already exists', 400);
    }

    return this.departmentRepository.create(data.siteId, data.name, data.supervisorId || null);
  }

  async updateDepartment(id: string, data: UpdateDepartmentDTO): Promise<DepartmentRow> {
    const department = await this.getDepartmentById(id);

    if (data.name && data.name !== department.name) {
      const existing = await this.departmentRepository.getByName(data.name);
      if (existing) {
        throw new AppError('Department name already exists', 400);
      }
    }

    const newSiteId = data.siteId || department.site_id;
    const newName = data.name || department.name;
    const newSupervisorId = data.supervisorId !== undefined ? data.supervisorId : department.supervisor_id;

    return this.departmentRepository.update(id, newSiteId, newName, newSupervisorId);
  }

  async deleteDepartment(id: string): Promise<void> {
    await this.getDepartmentById(id); // Check existence
    // Assuming DB has ON DELETE RESTRICT for employees in departments
    // The DB will throw a foreign key error if employees exist, which the global error handler should catch.
    await this.departmentRepository.delete(id);
  }
}
