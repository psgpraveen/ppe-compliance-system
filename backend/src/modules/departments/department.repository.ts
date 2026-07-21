import { query } from '../../shared/database/db';
import { DepartmentRow } from './department.types';

export class DepartmentRepository {
  async getPaginated(page: number, limit: number, filters?: { name?: string; site?: string; supervisor?: string }): Promise<{ data: DepartmentRow[], total: number }> {
    const offset = (page - 1) * limit;
    
    let whereClause = '1=1';
    const filterParams: unknown[] = [];
    let paramIndex = 1;

    if (filters?.name) {
      whereClause += ` AND d.name ILIKE $${paramIndex}`;
      filterParams.push(`%${filters.name}%`);
      paramIndex++;
    }
    
    if (filters?.site) {
      whereClause += ` AND s.site_name ILIKE $${paramIndex}`;
      filterParams.push(`%${filters.site}%`);
      paramIndex++;
    }

    if (filters?.supervisor) {
      whereClause += ` AND (sup.first_name ILIKE $${paramIndex} OR sup.last_name ILIKE $${paramIndex})`;
      filterParams.push(`%${filters.supervisor}%`);
      paramIndex++;
    }

    const dataRes = await query(`
      SELECT d.*, s.site_name, sup.first_name as supervisor_first_name, sup.last_name as supervisor_last_name 
      FROM departments d
      LEFT JOIN sites s ON d.site_id = s.id
      LEFT JOIN users sup ON d.supervisor_id = sup.id
      WHERE ${whereClause}
      ORDER BY d.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...filterParams, limit, offset]);

    const countRes = await query(`
      SELECT COUNT(*) 
      FROM departments d
      LEFT JOIN sites s ON d.site_id = s.id
      LEFT JOIN users sup ON d.supervisor_id = sup.id
      WHERE ${whereClause}
    `, filterParams);
    
    return {
      data: dataRes.rows,
      total: parseInt(countRes.rows[0].count, 10),
    };
  }

  async getAll(): Promise<DepartmentRow[]> {
    const res = await query(`
      SELECT d.*, s.site_name, sup.first_name as supervisor_first_name, sup.last_name as supervisor_last_name 
      FROM departments d
      LEFT JOIN sites s ON d.site_id = s.id
      LEFT JOIN users sup ON d.supervisor_id = sup.id
      ORDER BY d.created_at DESC
    `);
    return res.rows;
  }

  async getById(id: string): Promise<DepartmentRow | null> {
    const res = await query('SELECT * FROM departments WHERE id = $1 LIMIT 1', [id]);
    return res.rows[0] || null;
  }

  async getByName(name: string): Promise<DepartmentRow | null> {
    const res = await query('SELECT * FROM departments WHERE name = $1 LIMIT 1', [name]);
    return res.rows[0] || null;
  }

  async create(siteId: string, name: string, supervisorId: string | null): Promise<DepartmentRow> {
    const res = await query(
      `INSERT INTO departments (site_id, name, supervisor_id) VALUES ($1, $2, $3) RETURNING *`,
      [siteId, name, supervisorId]
    );
    return res.rows[0];
  }

  async update(id: string, siteId: string, name: string, supervisorId: string | null): Promise<DepartmentRow> {
    const res = await query(
      `UPDATE departments 
       SET site_id = $1, name = $2, supervisor_id = $3, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $4 RETURNING *`,
      [siteId, name, supervisorId, id]
    );
    return res.rows[0];
  }

  async getOptions(): Promise<{ id: string, name: string, supervisor_id: string | null, supervisor_name: string | null }[]> {
    const res = await query(`
      SELECT 
        d.id, 
        d.name, 
        d.supervisor_id, 
        s.first_name, 
        s.last_name 
      FROM departments d 
      LEFT JOIN users s ON d.supervisor_id = s.id 
      ORDER BY d.name ASC
    `);
    return res.rows.map(row => ({
      id: row.id,
      name: row.name,
      supervisor_id: row.supervisor_id,
      supervisor_name: row.first_name ? `${row.first_name} ${row.last_name}` : null
    }));
  }

  async delete(id: string): Promise<void> {
    await query('DELETE FROM departments WHERE id = $1', [id]);
  }

  // Helper to fetch default site
  async getFirstSite(): Promise<{ id: string } | null> {
    const res = await query('SELECT id FROM sites ORDER BY created_at ASC LIMIT 1');
    return res.rows[0] || null;
  }
}
