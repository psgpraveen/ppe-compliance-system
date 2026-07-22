import { AppError } from '../../shared/errors/AppError';
import { EmployeeRepository } from './employee.repository';
import { DepartmentRepository } from '../departments/department.repository';
import { EmployeeRow, EmployeeWithDepartmentRow, CreateEmployeeDTO, UpdateEmployeeDTO, BulkImportEmployeeDTO } from './employee.types';

export class EmployeeService {
  private employeeRepository = new EmployeeRepository();
  private departmentRepository = new DepartmentRepository();

  async getPaginated(
    page: number, 
    limit: number, 
    filters?: { code?: string; name?: string; role?: string; department?: string; status?: string },
    userRole?: string,
    userId?: string
  ): Promise<{ data: EmployeeWithDepartmentRow[], meta: { total: number; page: number; limit: number; totalPages: number; } }> {
    const { data, total } = await this.employeeRepository.getPaginated(page, limit, filters, userRole, userId);
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

  async getAllEmployees(): Promise<EmployeeWithDepartmentRow[]> {
    return this.employeeRepository.getAll();
  }

  async getEmployeeById(id: string): Promise<EmployeeWithDepartmentRow> {
    const employee = await this.employeeRepository.getById(id);
    if (!employee) {
      throw new AppError('Employee not found', 404);
    }
    return employee;
  }

  async createEmployee(data: CreateEmployeeDTO, userRole?: string, userId?: string): Promise<EmployeeRow> {
    const existing = await this.employeeRepository.getByCode(data.employeeCode);
    if (existing) {
      throw new AppError('Employee code already exists', 400);
    }

    let targetSupervisorId = data.supervisorId || null;

    if (userRole === 'SUPERVISOR' && userId) {
      const dept = await this.departmentRepository.getById(data.departmentId);
      if (!dept || dept.supervisor_id !== userId) {
        throw new AppError('Supervisors can only add employees to their own managed department.', 403);
      }
      targetSupervisorId = userId;
    }

    return this.employeeRepository.create(
      data.employeeCode,
      data.firstName,
      data.lastName,
      data.departmentId,
      targetSupervisorId,
      data.jobProfile || null,
      data.mobileNumber || null,
      data.aadharNumber || null
    );
  }

  async updateEmployee(id: string, data: UpdateEmployeeDTO): Promise<EmployeeRow> {
    const employee = await this.getEmployeeById(id);

    if (data.employeeCode && data.employeeCode !== employee.employee_code) {
      const existing = await this.employeeRepository.getByCode(data.employeeCode);
      if (existing) {
        throw new AppError('Employee code already exists', 400);
      }
    }

    const newCode = data.employeeCode || employee.employee_code;
    const newFirstName = data.firstName || employee.first_name;
    const newLastName = data.lastName || employee.last_name;
    const newDepartmentId = data.departmentId || employee.department_id;
    const newSupervisorId = data.supervisorId !== undefined ? (data.supervisorId || null) : employee.supervisor_id;
    const newJobProfile = data.jobProfile !== undefined ? (data.jobProfile || null) : employee.job_profile;
    const newMobileNumber = data.mobileNumber !== undefined ? (data.mobileNumber || null) : employee.mobile_number;
    const newAadharNumber = data.aadharNumber !== undefined ? (data.aadharNumber || null) : employee.aadhar_number;
    const newIsActive = data.isActive !== undefined ? data.isActive : employee.is_active;

    return this.employeeRepository.update(
      id,
      newCode,
      newFirstName,
      newLastName,
      newDepartmentId,
      newSupervisorId,
      newJobProfile,
      newMobileNumber,
      newAadharNumber,
      newIsActive
    );
  }

  async deleteEmployee(id: string): Promise<void> {
    await this.getEmployeeById(id); // Ensure exists
    await this.employeeRepository.delete(id);
  }

  async processBulkImport(employeesData: BulkImportEmployeeDTO[]): Promise<{ imported: number, failed: number }> {
    const { SiteRepository } = await import('../sites/site.repository');
    const siteRepo = new SiteRepository();
    const sites = await siteRepo.getAll();
    if (sites.length === 0) {
      throw new AppError('Cannot import employees: No sites exist in the system to assign departments to.', 400);
    }
    const defaultSiteId = sites[0].id;

    const departments = await this.departmentRepository.getAll();
    const existingEmployees = await this.employeeRepository.getAll();
    const existingCodes = new Set(existingEmployees.map(e => e.employee_code));

    const validRows = [];
    let failed = 0;

    for (const row of employeesData) {
      if (existingCodes.has(row.employeeCode)) {
        failed++;
        continue;
      }

      // Match department by name (case-insensitive)
      let dept = departments.find(d => d.name.toLowerCase() === row.departmentName.toLowerCase());
      
      if (!dept) {
        // Auto-create department
        try {
          dept = await this.departmentRepository.create(defaultSiteId, row.departmentName, null);
          departments.push(dept); // Add to local cache so subsequent rows can use it
        } catch (err) {
          console.error(`Failed to auto-create department: ${row.departmentName}`, err);
          failed++;
          continue;
        }
      }

      validRows.push({
        employee_code: row.employeeCode,
        first_name: row.firstName,
        last_name: row.lastName,
        department_id: dept.id,
        supervisor_id: null,
        job_profile: row.jobProfile || null,
        mobile_number: row.mobileNumber || null,
        aadhar_number: row.aadharNumber || null,
      });

      // Add to set to prevent duplicates within the same batch
      existingCodes.add(row.employeeCode);
    }

    await this.employeeRepository.bulkCreate(validRows);
    return { imported: validRows.length, failed };
  }

  async getRoles(): Promise<string[]> {
    return this.employeeRepository.getRoles();
  }
}
