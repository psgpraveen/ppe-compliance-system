import { AppError } from '../../shared/errors/AppError';
import { SupervisorRepository } from './supervisor.repository';
import { AuthRepository } from '../auth/auth.repository';
import { SupervisorRow, CreateSupervisorDTO, UpdateSupervisorDTO } from './supervisor.types';
import { hashPassword } from '../../shared/utils/password';
import { emailService } from '../../shared/services/email.service';

export class SupervisorService {
  private supervisorRepository = new SupervisorRepository();
  private authRepository = new AuthRepository();

  async getPaginated(page: number, limit: number, filters?: { name?: string; email?: string; status?: string }): Promise<{ data: SupervisorRow[], meta: { total: number; page: number; limit: number; totalPages: number; } }> {
    const { data, total } = await this.supervisorRepository.getPaginated(page, limit, filters);
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

  async getAllSupervisors(): Promise<SupervisorRow[]> {
    return this.supervisorRepository.getAll();
  }

  async getOptions(): Promise<{ id: string, first_name: string, last_name: string }[]> {
    return this.supervisorRepository.getOptions();
  }

  async getSupervisorById(id: string): Promise<SupervisorRow> {
    const supervisor = await this.supervisorRepository.getById(id);
    if (!supervisor) {
      throw new AppError('Supervisor not found', 404);
    }
    return supervisor;
  }

  async createSupervisor(data: CreateSupervisorDTO): Promise<SupervisorRow> {
    const existing = await this.authRepository.getUserByEmail(data.email);
    if (existing) {
      throw new AppError('Email is already registered', 400);
    }

    const rawPassword = data.password || 'ChangeMe123!';
    const hashed = await hashPassword(rawPassword);

    const supervisor = await this.supervisorRepository.create(
      data.firstName,
      data.lastName,
      data.email,
      hashed
    );

    // Send welcome email
    const subject = 'Welcome to PPE Compliance System - Supervisor Account';
    const text = `Hello ${data.firstName},\n\nAn admin has created a supervisor account for you in the PPE Compliance System.\n\nYou can log in using this email address.\nYour temporary password is: ${rawPassword}\n\nPlease log in and change your password as soon as possible.`;
    
    emailService.sendEmail(data.email, subject, text).catch(err => {
      console.error(`Failed to send welcome email to supervisor ${data.email}`, err);
    });

    return supervisor;
  }

  async updateSupervisor(id: string, data: UpdateSupervisorDTO): Promise<SupervisorRow> {
    const supervisor = await this.getSupervisorById(id);

    if (data.email && data.email !== supervisor.email) {
      const existing = await this.authRepository.getUserByEmail(data.email);
      if (existing) {
        throw new AppError('Email is already registered', 400);
      }
    }

    const newFirstName = data.firstName || supervisor.first_name;
    const newLastName = data.lastName || supervisor.last_name;
    const newEmail = data.email || supervisor.email;
    const newIsActive = data.isActive !== undefined ? data.isActive : supervisor.is_active;

    return this.supervisorRepository.update(id, newFirstName, newLastName, newEmail, newIsActive);
  }

  async deleteSupervisor(id: string): Promise<void> {
    await this.getSupervisorById(id); // Ensure exists
    await this.supervisorRepository.delete(id);
  }
}
