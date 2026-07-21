import { query } from '../../shared/database/db';
import { SupervisorRow } from './supervisor.types';

export class SupervisorRepository {
  async getPaginated(page: number, limit: number, filters?: { name?: string; email?: string; status?: string }): Promise<{ data: SupervisorRow[], total: number }> {
    const offset = (page - 1) * limit;
    
    let whereClause = "role = 'SUPERVISOR'";
    const filterParams: unknown[] = [];
    let paramIndex = 1;

    if (filters?.name) {
      whereClause += ` AND (first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex})`;
      filterParams.push(`%${filters.name}%`);
      paramIndex++;
    }

    if (filters?.email) {
      whereClause += ` AND email ILIKE $${paramIndex}`;
      filterParams.push(`%${filters.email}%`);
      paramIndex++;
    }

    if (filters?.status !== undefined && filters?.status !== '') {
      whereClause += ` AND is_active = $${paramIndex}`;
      filterParams.push(filters.status === 'true');
      paramIndex++;
    }

    const dataRes = await query(`
      SELECT id, first_name, last_name, email, role, is_active, created_at, updated_at 
      FROM users 
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...filterParams, limit, offset]);

    const countRes = await query(`
      SELECT COUNT(*) 
      FROM users 
      WHERE ${whereClause}
    `, filterParams);

    return {
      data: dataRes.rows,
      total: parseInt(countRes.rows[0].count, 10),
    };
  }

  async getAll(): Promise<SupervisorRow[]> {
    const res = await query(`
      SELECT id, first_name, last_name, email, role, is_active, created_at, updated_at 
      FROM users 
      WHERE role = 'SUPERVISOR' 
      ORDER BY created_at DESC
    `);
    return res.rows;
  }

  async getOptions(): Promise<{ id: string, first_name: string, last_name: string, email: string }[]> {
    const res = await query(`
      SELECT id, first_name, last_name, email 
      FROM users 
      WHERE role = 'SUPERVISOR' AND is_active = true
      ORDER BY first_name ASC
    `);
    return res.rows;
  }

  async getById(id: string): Promise<SupervisorRow | null> {
    const res = await query(`
      SELECT id, first_name, last_name, email, role, is_active, created_at, updated_at 
      FROM users 
      WHERE id = $1 AND role = 'SUPERVISOR' 
      LIMIT 1
    `, [id]);
    return res.rows[0] || null;
  }

  async create(firstName: string, lastName: string, email: string, passwordHash: string): Promise<SupervisorRow> {
    const res = await query(
      `INSERT INTO users (first_name, last_name, email, password_hash, role) 
       VALUES ($1, $2, $3, $4, 'SUPERVISOR') 
       RETURNING id, first_name, last_name, email, role, is_active, created_at, updated_at`,
      [firstName, lastName, email, passwordHash]
    );
    return res.rows[0];
  }

  async update(id: string, firstName: string, lastName: string, email: string, isActive: boolean): Promise<SupervisorRow> {
    const res = await query(
      `UPDATE users 
       SET first_name = $1, last_name = $2, email = $3, is_active = $4, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $5 AND role = 'SUPERVISOR' 
       RETURNING id, first_name, last_name, email, role, is_active, created_at, updated_at`,
      [firstName, lastName, email, isActive, id]
    );
    return res.rows[0];
  }

  async delete(id: string): Promise<void> {
    // If a supervisor is linked to departments, we shouldn't strictly delete, but 'ON DELETE SET NULL' is on the schema.
    await query(`DELETE FROM users WHERE id = $1 AND role = 'SUPERVISOR'`, [id]);
  }
}
