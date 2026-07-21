import { AppError } from '../../shared/errors/AppError';
import { ViolationTypeRepository } from './violation-type.repository';
import { ViolationTypeRow, CreateViolationTypeDTO, UpdateViolationTypeDTO } from './violation-type.types';

export class ViolationTypeService {
  private repository = new ViolationTypeRepository();

  async getPaginated(page: number, limit: number, filters?: { name?: string; severity?: string }): Promise<{ data: ViolationTypeRow[], meta: { total: number; page: number; limit: number; totalPages: number; } }> {
    const { data, total } = await this.repository.getPaginated(page, limit, filters);
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

  async getAll(): Promise<ViolationTypeRow[]> {
    return this.repository.getAll();
  }

  async getById(id: string): Promise<ViolationTypeRow> {
    const item = await this.repository.getById(id);
    if (!item) {
      throw new AppError('Violation type not found', 404);
    }
    return item;
  }

  async create(data: CreateViolationTypeDTO): Promise<ViolationTypeRow> {
    const existing = await this.repository.getByCode(data.code);
    if (existing) {
      throw new AppError('Violation type code already exists', 400);
    }
    const isActive = data.is_active !== undefined ? data.is_active : true;
    return this.repository.create(data.code, data.name, data.severity, isActive);
  }

  async update(id: string, data: UpdateViolationTypeDTO): Promise<ViolationTypeRow> {
    const item = await this.getById(id);

    if (data.code && data.code !== item.code) {
      const existing = await this.repository.getByCode(data.code);
      if (existing) {
        throw new AppError('Violation type code already exists', 400);
      }
    }

    const newCode = data.code || item.code;
    const newName = data.name || item.name;
    const newSeverity = data.severity || item.severity;
    const newIsActive = data.is_active !== undefined ? data.is_active : item.is_active;

    return this.repository.update(id, newCode, newName, newSeverity, newIsActive);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    // Violations might reference this. We assume ON DELETE RESTRICT in DB for violation_types referenced by violations.
    await this.repository.delete(id);
  }
}
