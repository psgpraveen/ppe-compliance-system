import { query } from '../../shared/database/db';
import { ViolationTypeRow } from './violation-type.types';

export class ViolationTypeRepository {
  async getPaginated(page: number, limit: number, filters?: { name?: string; severity?: string }): Promise<{ data: ViolationTypeRow[], total: number }> {
    const offset = (page - 1) * limit;
    
    let whereClause = '1=1';
    const filterParams: unknown[] = [];
    let paramIndex = 1;

    if (filters?.name) {
      whereClause += ` AND name ILIKE $${paramIndex}`;
      filterParams.push(`%${filters.name}%`);
      paramIndex++;
    }

    if (filters?.severity) {
      whereClause += ` AND severity = $${paramIndex}`;
      filterParams.push(filters.severity);
      paramIndex++;
    }

    const dataRes = await query(`
      SELECT * FROM violation_types
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...filterParams, limit, offset]);

    const countRes = await query(`
      SELECT COUNT(*) FROM violation_types
      WHERE ${whereClause}
    `, filterParams);
    
    return {
      data: dataRes.rows,
      total: parseInt(countRes.rows[0].count, 10),
    };
  }

  async getAll(): Promise<ViolationTypeRow[]> {
    const res = await query('SELECT * FROM violation_types ORDER BY created_at DESC');
    return res.rows;
  }

  async getById(id: string): Promise<ViolationTypeRow | null> {
    const res = await query('SELECT * FROM violation_types WHERE id = $1 LIMIT 1', [id]);
    return res.rows[0] || null;
  }

  async getByCode(code: string): Promise<ViolationTypeRow | null> {
    const res = await query('SELECT * FROM violation_types WHERE code = $1 LIMIT 1', [code]);
    return res.rows[0] || null;
  }

  async create(code: string, name: string, severity: string, is_active: boolean): Promise<ViolationTypeRow> {
    const res = await query(
      `INSERT INTO violation_types (code, name, severity, is_active) VALUES ($1, $2, $3, $4) RETURNING *`,
      [code, name, severity, is_active]
    );
    return res.rows[0];
  }

  async update(id: string, code: string, name: string, severity: string, is_active: boolean): Promise<ViolationTypeRow> {
    const res = await query(
      `UPDATE violation_types 
       SET code = $1, name = $2, severity = $3, is_active = $4, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $5 RETURNING *`,
      [code, name, severity, is_active, id]
    );
    return res.rows[0];
  }

  async delete(id: string): Promise<void> {
    await query('DELETE FROM violation_types WHERE id = $1', [id]);
  }
}
