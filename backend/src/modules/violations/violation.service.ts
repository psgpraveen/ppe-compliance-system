import { ViolationRepository } from './violation.repository';
import { EmployeeRepository } from '../employees/employee.repository';
import { ViolationTypeRepository } from '../violation-types/violation-type.repository';
import { AppError } from '../../shared/errors/AppError';

export class ViolationService {
  private violationRepository = new ViolationRepository();
  private employeeRepository = new EmployeeRepository();
  private violationTypeRepository = new ViolationTypeRepository();

  async getPaginated(
    page: number,
    limit: number,
    filters?: { status?: string; employee_code?: string; violation_type_code?: string; date_from?: string; date_to?: string },
    role?: string,
    userId?: string
  ) {
    // RBAC: Supervisors only see their own employees' violations
    const supervisorId = role === 'SUPERVISOR' ? userId : undefined;
    return this.violationRepository.getPaginated(page, limit, filters, supervisorId);
  }

  async createFromIoT(employeeCode: string, violationTypeCode: string, iotDeviceId: string | null, imageUrl: string) {
    const employee = await this.employeeRepository.getByCode(employeeCode);
    if (!employee) {
      throw new AppError(`Employee with code ${employeeCode} not found`, 404);
    }

    const violationType = await this.violationTypeRepository.getByCode(violationTypeCode);
    if (!violationType) {
      throw new AppError(`Violation type with code ${violationTypeCode} not found`, 404);
    }

    return this.violationRepository.createFromIoT(employee.id, violationType.id, iotDeviceId, imageUrl);
  }

  async acknowledgeViolation(id: string, userId: string, role: string, remarks?: string) {
    const violation = await this.violationRepository.getById(id);
    if (!violation) {
      throw new AppError('Violation not found', 404);
    }

    // RBAC: Supervisors can only act on violations for their own employees
    if (role === 'SUPERVISOR' && violation.supervisor_id !== userId) {
      throw new AppError('Forbidden: You do not have permission to act on this violation', 403);
    }

    if (violation.status !== 'PENDING' && violation.status !== 'ESCALATED') {
      throw new AppError(`Cannot acknowledge a violation in ${violation.status} state`, 400);
    }

    return this.violationRepository.updateStatus(id, 'ACKNOWLEDGED', remarks || null, userId);
  }

  async resolveViolation(id: string, userId: string, role: string, remarks?: string) {
    const violation = await this.violationRepository.getById(id);
    if (!violation) {
      throw new AppError('Violation not found', 404);
    }

    // RBAC: Supervisors can only act on violations for their own employees
    if (role === 'SUPERVISOR' && violation.supervisor_id !== userId) {
      throw new AppError('Forbidden: You do not have permission to act on this violation', 403);
    }

    if (violation.status === 'RESOLVED' || violation.status === 'CLOSED') {
      throw new AppError(`Violation is already resolved or closed`, 400);
    }

    return this.violationRepository.updateStatus(id, 'RESOLVED', remarks || null, userId);
  }
}
