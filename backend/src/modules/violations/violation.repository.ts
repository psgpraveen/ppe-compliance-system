import { query } from '../../shared/database/db';

export class ViolationRepository {
  
  async getPaginated(
    page: number, 
    limit: number, 
    filters?: { status?: string; employee_code?: string; violation_type_code?: string; date_from?: string; date_to?: string },
    supervisorId?: string
  ): Promise<{ data: Record<string, unknown>[]; total: number }> {
    const offset = (page - 1) * limit;
    let whereClause = '1=1';
    const filterParams: unknown[] = [];
    let paramIndex = 1;

    // RBAC: Supervisors only see violations for employees in their department or directly supervised by them
    if (supervisorId) {
      whereClause += ` AND (e.supervisor_id = $${paramIndex} OR d.supervisor_id = $${paramIndex})`;
      filterParams.push(supervisorId);
      paramIndex++;
    }

    if (filters?.status) {
      whereClause += ` AND v.status = $${paramIndex}`;
      filterParams.push(filters.status);
      paramIndex++;
    }

    if (filters?.employee_code) {
      whereClause += ` AND e.employee_code ILIKE $${paramIndex}`;
      filterParams.push(`%${filters.employee_code}%`);
      paramIndex++;
    }

    if (filters?.violation_type_code) {
      whereClause += ` AND vt.code = $${paramIndex}`;
      filterParams.push(filters.violation_type_code);
      paramIndex++;
    }

    if (filters?.date_from) {
      whereClause += ` AND v.detected_at >= $${paramIndex}`;
      filterParams.push(filters.date_from);
      paramIndex++;
    }

    if (filters?.date_to) {
      whereClause += ` AND v.detected_at <= $${paramIndex}`;
      filterParams.push(filters.date_to);
      paramIndex++;
    }

    const [dataRes, countRes] = await Promise.all([
      query(`
        SELECT 
          v.id, v.detected_at, v.status, v.image_url, v.remarks,
          e.first_name, e.last_name, e.employee_code,
          vt.name as violation_type_name, vt.severity,
          s.first_name as supervisor_first_name, s.last_name as supervisor_last_name,
          d.name as department_name
        FROM violations v
        JOIN employees e ON v.employee_id = e.id
        JOIN violation_types vt ON v.violation_type_id = vt.id
        LEFT JOIN users s ON e.supervisor_id = s.id
        LEFT JOIN departments d ON e.department_id = d.id
        WHERE ${whereClause}
        ORDER BY v.detected_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `, [...filterParams, limit, offset]),
      query(`
        SELECT COUNT(*) 
        FROM violations v
        JOIN employees e ON v.employee_id = e.id
        JOIN violation_types vt ON v.violation_type_id = vt.id
        LEFT JOIN departments d ON e.department_id = d.id
        WHERE ${whereClause}
      `, filterParams)
    ]);

    return {
      data: dataRes.rows,
      total: parseInt(countRes.rows[0].count, 10),
    };
  }

  async createFromIoT(employeeId: string, violationTypeId: string, iotDeviceId: string | null, imageUrl: string): Promise<any> {
    const res = await query(
      `INSERT INTO violations (employee_id, violation_type_id, iot_device_id, image_url, detected_at, status) 
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, 'PENDING') 
       RETURNING *`,
      [employeeId, violationTypeId, iotDeviceId, imageUrl]
    );
    return res.rows[0];
  }

  async getById(id: string): Promise<any | null> {
    const res = await query(`
      SELECT v.*, e.employee_code, e.first_name, e.last_name, e.supervisor_id, e.department_id,
             d.supervisor_id as dept_supervisor_id,
             vt.name as violation_type_name 
      FROM violations v
      JOIN employees e ON v.employee_id = e.id
      LEFT JOIN departments d ON e.department_id = d.id
      JOIN violation_types vt ON v.violation_type_id = vt.id
      WHERE v.id = $1
    `, [id]);
    return res.rows[0] || null;
  }

  async updateStatus(id: string, status: string, remarks: string | null, userId: string): Promise<any> {
    let updateFields = `status = $2, updated_at = CURRENT_TIMESTAMP`;
    const params: unknown[] = [id, status];
    let paramIndex = 3;

    if (remarks !== null) {
      updateFields += `, remarks = $${paramIndex}`;
      params.push(remarks);
      paramIndex++;
    }

    if (status === 'ACKNOWLEDGED') {
      updateFields += `, acknowledged_at = CURRENT_TIMESTAMP, acknowledged_by = $${paramIndex}`;
      params.push(userId);
      paramIndex++;
    } else if (status === 'RESOLVED') {
      updateFields += `, resolved_at = CURRENT_TIMESTAMP, resolved_by = $${paramIndex}`;
      params.push(userId);
      paramIndex++;
    }

    const res = await query(`
      UPDATE violations 
      SET ${updateFields}
      WHERE id = $1
      RETURNING *
    `, params);
    
    return res.rows[0];
  }

  /**
   * Escalates violations that have been PENDING longer than the given timeout minutes.
   * Returns the array of escalated violation rows.
   */
  async escalateOverdueViolations(timeoutMinutes: number): Promise<any[]> {
    const res = await query(`
      WITH updated AS (
        UPDATE violations 
        SET 
          status = 'ESCALATED', 
          escalated_at = CURRENT_TIMESTAMP, 
          updated_at = CURRENT_TIMESTAMP
        WHERE 
          status = 'PENDING' 
          AND EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - detected_at))/60 > $1
        RETURNING *
      )
      SELECT 
        u.*,
        e.first_name, e.last_name, e.employee_code,
        COALESCE(d.name, 'Unassigned') as department_name,
        vt.name as violation_type_name, vt.severity
      FROM updated u
      JOIN employees e ON u.employee_id = e.id
      LEFT JOIN departments d ON e.department_id = d.id
      JOIN violation_types vt ON u.violation_type_id = vt.id
    `, [timeoutMinutes]);
    return res.rows;
  }
}
