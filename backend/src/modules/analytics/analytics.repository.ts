import { query } from '../../shared/database/db';

export class AnalyticsRepository {
  async getAnalytics(role?: string, supervisorId?: string): Promise<any> {
    const isAdmin = role !== 'SUPERVISOR';
    const params: unknown[] = [];
    
    let scopeJoin = '';
    let scopeWhere = '';

    if (!isAdmin && supervisorId) {
      scopeJoin = 'JOIN employees e ON v.employee_id = e.id LEFT JOIN departments d ON e.department_id = d.id';
      scopeWhere = 'AND (e.supervisor_id = $1 OR d.supervisor_id = $1)';
      params.push(supervisorId);
    }

    const [
      violationsOverTime,
      byDepartment,
      bySeverity,
      byStatus,
      byViolationType,
      topViolators,
      resolutionStats,
    ] = await Promise.all([

      // Violations per day for last 30 days
      query(`
        SELECT 
          TO_CHAR(v.detected_at::date, 'MM/DD') as date,
          v.detected_at::date as raw_date,
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE v.status = 'RESOLVED') as resolved
        FROM violations v
        ${scopeJoin}
        WHERE v.detected_at >= CURRENT_DATE - INTERVAL '29 days'
        ${scopeWhere}
        GROUP BY v.detected_at::date
        ORDER BY v.detected_at::date ASC
      `, params),

      // Violations by department
      query(`
        SELECT 
          COALESCE(d.name, 'Unassigned') as department,
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE v.status = 'RESOLVED') as resolved,
          COUNT(*) FILTER (WHERE v.status IN ('PENDING','ESCALATED')) as open
        FROM violations v
        JOIN employees e ON v.employee_id = e.id
        LEFT JOIN departments d ON e.department_id = d.id
        WHERE 1=1 ${isAdmin ? '' : 'AND (e.supervisor_id = $1 OR d.supervisor_id = $1)'}
        GROUP BY d.name
        ORDER BY total DESC
        LIMIT 8
      `, params),

      // Violations by severity
      query(`
        SELECT 
          vt.severity,
          COUNT(*) as total
        FROM violations v
        JOIN violation_types vt ON v.violation_type_id = vt.id
        ${scopeJoin}
        WHERE 1=1 ${scopeWhere}
        GROUP BY vt.severity
        ORDER BY total DESC
      `, params),

      // Violations by status
      query(`
        SELECT 
          v.status,
          COUNT(*) as total
        FROM violations v
        ${scopeJoin}
        WHERE 1=1 ${scopeWhere}
        GROUP BY v.status
        ORDER BY total DESC
      `, params),

      // Violations by type
      query(`
        SELECT 
          vt.name as violation_type,
          COUNT(*) as total
        FROM violations v
        JOIN violation_types vt ON v.violation_type_id = vt.id
        ${scopeJoin}
        WHERE 1=1 ${scopeWhere}
        GROUP BY vt.name
        ORDER BY total DESC
        LIMIT 6
      `, params),

      // Top violators
      query(`
        SELECT 
          e.first_name, e.last_name, e.employee_code,
          COALESCE(d.name, 'Unassigned') as department,
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE v.status IN ('PENDING','ESCALATED')) as open_count
        FROM violations v
        JOIN employees e ON v.employee_id = e.id
        LEFT JOIN departments d ON e.department_id = d.id
        WHERE 1=1 ${isAdmin ? '' : 'AND (e.supervisor_id = $1 OR d.supervisor_id = $1)'}
        GROUP BY e.id, e.first_name, e.last_name, e.employee_code, d.name
        ORDER BY total DESC
        LIMIT 5
      `, params),

      // Avg resolution time (hours) & summary counts
      query(`
        SELECT 
          ROUND(AVG(EXTRACT(EPOCH FROM (resolved_at - detected_at))/3600)::numeric, 1) as avg_resolution_hours,
          COUNT(*) FILTER (WHERE resolved_at IS NOT NULL) as resolved_count,
          COUNT(*) as total_count
        FROM violations v
        ${scopeJoin}
        WHERE 1=1 ${scopeWhere}
      `, params),
    ]);

    return {
      violationsOverTime: violationsOverTime.rows,
      byDepartment: byDepartment.rows,
      bySeverity: bySeverity.rows,
      byStatus: byStatus.rows,
      byViolationType: byViolationType.rows,
      topViolators: topViolators.rows,
      resolutionStats: resolutionStats.rows[0],
    };
  }
}
