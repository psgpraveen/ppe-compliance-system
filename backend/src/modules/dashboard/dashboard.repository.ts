import { query } from '../../shared/database/db';

export class DashboardRepository {
  async getStats(role?: string, supervisorId?: string): Promise<any> {
    const isAdmin = role !== 'SUPERVISOR';

    // Use parameterized queries to prevent SQL injection
    const [
      totalSites,
      totalDepartments,
      totalEmployees,
      violationStats,
      recentViolations,
    ] = await Promise.all([
      isAdmin
        ? query(`SELECT COUNT(*) as count FROM sites WHERE is_active = true`)
        : query(`SELECT 0 as count`),
      isAdmin
        ? query(`SELECT COUNT(*) as count FROM departments`)
        : query(`SELECT 0 as count`),
      isAdmin
        ? query(`SELECT COUNT(*) as count FROM employees WHERE is_active = true`)
        : query(`
            SELECT COUNT(*) as count 
            FROM employees e
            LEFT JOIN departments d ON e.department_id = d.id
            WHERE e.is_active = true AND (e.supervisor_id = $1 OR d.supervisor_id = $1)
          `, [supervisorId]),
      isAdmin
        ? query(`
            SELECT
              COUNT(*) FILTER (WHERE status = 'PENDING') as pending,
              COUNT(*) FILTER (WHERE status = 'ESCALATED') as escalated,
              COUNT(*) FILTER (WHERE status = 'ACKNOWLEDGED') as acknowledged,
              COUNT(*) FILTER (WHERE status = 'RESOLVED') as resolved,
              COUNT(*) as total
            FROM violations
          `)
        : query(`
            SELECT
              COUNT(*) FILTER (WHERE v.status = 'PENDING') as pending,
              COUNT(*) FILTER (WHERE v.status = 'ESCALATED') as escalated,
              COUNT(*) FILTER (WHERE v.status = 'ACKNOWLEDGED') as acknowledged,
              COUNT(*) FILTER (WHERE v.status = 'RESOLVED') as resolved,
              COUNT(*) as total
            FROM violations v
            JOIN employees e ON v.employee_id = e.id
            LEFT JOIN departments d ON e.department_id = d.id
            WHERE (e.supervisor_id = $1 OR d.supervisor_id = $1)
          `, [supervisorId]),
      isAdmin
        ? query(`
            SELECT 
              v.id, v.detected_at, v.status,
              e.first_name, e.last_name, e.employee_code,
              vt.name as violation_type_name, vt.severity
            FROM violations v
            JOIN employees e ON v.employee_id = e.id
            JOIN violation_types vt ON v.violation_type_id = vt.id
            ORDER BY v.detected_at DESC
            LIMIT 5
          `)
        : query(`
            SELECT 
              v.id, v.detected_at, v.status,
              e.first_name, e.last_name, e.employee_code,
              vt.name as violation_type_name, vt.severity
            FROM violations v
            JOIN employees e ON v.employee_id = e.id
            LEFT JOIN departments d ON e.department_id = d.id
            JOIN violation_types vt ON v.violation_type_id = vt.id
            WHERE (e.supervisor_id = $1 OR d.supervisor_id = $1)
            ORDER BY v.detected_at DESC
            LIMIT 5
          `, [supervisorId]),
    ]);

    return {
      totalSites: parseInt(totalSites.rows[0].count, 10),
      totalDepartments: parseInt(totalDepartments.rows[0].count, 10),
      totalEmployees: parseInt(totalEmployees.rows[0].count, 10),
      violations: {
        pending: parseInt(violationStats.rows[0].pending, 10),
        escalated: parseInt(violationStats.rows[0].escalated, 10),
        acknowledged: parseInt(violationStats.rows[0].acknowledged, 10),
        resolved: parseInt(violationStats.rows[0].resolved, 10),
        total: parseInt(violationStats.rows[0].total, 10),
      },
      recentViolations: recentViolations.rows,
    };
  }
}
