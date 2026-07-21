import { query } from '../../shared/database/db';
import { EmployeeRow, EmployeeWithDepartmentRow } from './employee.types';

export class EmployeeRepository {
  async getPaginated(page: number, limit: number, filters?: { code?: string; name?: string; role?: string; department?: string; status?: string }): Promise<{ data: EmployeeWithDepartmentRow[], total: number }> {
    const offset = (page - 1) * limit;
    
    let whereClause = '1=1';
    const filterParams: unknown[] = [];
    let paramIndex = 1;

    if (filters?.code) {
      whereClause += ` AND e.employee_code ILIKE $${paramIndex}`;
      filterParams.push(`%${filters.code}%`);
      paramIndex++;
    }

    if (filters?.name) {
      whereClause += ` AND (e.first_name ILIKE $${paramIndex} OR e.last_name ILIKE $${paramIndex})`;
      filterParams.push(`%${filters.name}%`);
      paramIndex++;
    }

    if (filters?.role) {
      whereClause += ` AND e.job_profile ILIKE $${paramIndex}`;
      filterParams.push(`%${filters.role}%`);
      paramIndex++;
    }

    if (filters?.department) {
      whereClause += ` AND d.name ILIKE $${paramIndex}`;
      filterParams.push(`%${filters.department}%`);
      paramIndex++;
    }

    if (filters?.status !== undefined && filters?.status !== '') {
      whereClause += ` AND e.is_active = $${paramIndex}`;
      filterParams.push(filters.status === 'true');
      paramIndex++;
    }

    const dataRes = await query(`
      SELECT e.*, d.name as department_name 
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE ${whereClause}
      ORDER BY e.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...filterParams, limit, offset]);

    const countRes = await query(`
      SELECT COUNT(*) 
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE ${whereClause}
    `, filterParams);

    return {
      data: dataRes.rows,
      total: parseInt(countRes.rows[0].count, 10),
    };
  }

  async getAll(): Promise<EmployeeWithDepartmentRow[]> {
    const res = await query(`
      SELECT e.*, d.name as department_name 
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      ORDER BY e.created_at DESC
    `);
    return res.rows;
  }

  async getById(id: string): Promise<EmployeeWithDepartmentRow | null> {
    const res = await query(`
      SELECT e.*, d.name as department_name 
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.id = $1 LIMIT 1
    `, [id]);
    return res.rows[0] || null;
  }

  async getByCode(code: string): Promise<EmployeeRow | null> {
    const res = await query('SELECT * FROM employees WHERE employee_code = $1 LIMIT 1', [code]);
    return res.rows[0] || null;
  }

  async create(employeeCode: string, firstName: string, lastName: string, departmentId: string, supervisorId: string | null, jobProfile: string | null, mobileNumber: string | null, aadharNumber: string | null): Promise<EmployeeRow> {
    const res = await query(
      `INSERT INTO employees (employee_code, first_name, last_name, department_id, supervisor_id, job_profile, mobile_number, aadhar_number) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [employeeCode, firstName, lastName, departmentId, supervisorId, jobProfile, mobileNumber, aadharNumber]
    );
    return res.rows[0];
  }

  async update(id: string, employeeCode: string, firstName: string, lastName: string, departmentId: string, supervisorId: string | null, jobProfile: string | null, mobileNumber: string | null, aadharNumber: string | null, isActive: boolean): Promise<EmployeeRow> {
    const res = await query(
      `UPDATE employees 
       SET employee_code = $1, first_name = $2, last_name = $3, department_id = $4, supervisor_id = $5, job_profile = $6, mobile_number = $7, aadhar_number = $8, is_active = $9, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $10 RETURNING *`,
      [employeeCode, firstName, lastName, departmentId, supervisorId, jobProfile, mobileNumber, aadharNumber, isActive, id]
    );
    return res.rows[0];
  }

  async delete(id: string): Promise<void> {
    await query('DELETE FROM employees WHERE id = $1', [id]);
  }

  async bulkCreate(employees: Record<string, unknown>[]): Promise<EmployeeRow[]> {
    if (employees.length === 0) return [];
    
    // We'll insert one by one for simplicity and safety, since we don't have pg-format set up.
    // In production with thousands of rows, a parameterized bulk insert query is better.
    const created = [];
    for (const emp of employees) {
      const res = await query(
        `INSERT INTO employees (employee_code, first_name, last_name, department_id, supervisor_id, job_profile, mobile_number, aadhar_number) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [emp.employee_code, emp.first_name, emp.last_name, emp.department_id, emp.supervisor_id, emp.job_profile, emp.mobile_number, emp.aadhar_number]
      );
      created.push(res.rows[0]);
    }
    return created;
  }

  async getRoles(): Promise<string[]> {
    const res = await query('SELECT DISTINCT job_profile FROM employees WHERE job_profile IS NOT NULL AND job_profile != \'\' ORDER BY job_profile', []);
    return res.rows.map(row => row.job_profile);
  }
}
