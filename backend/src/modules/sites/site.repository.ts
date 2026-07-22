import { query } from '../../shared/database/db';
import { SiteRow } from './site.types';

export class SiteRepository {
  async getPaginated(page: number, limit: number, filters?: { site_name?: string; location?: string; status?: string }): Promise<{ data: SiteRow[], total: number }> {
    const offset = (page - 1) * limit;
    
    let whereClause = '1=1';
    const filterParams: unknown[] = [];
    let paramIndex = 1;

    if (filters?.site_name) {
      whereClause += ` AND site_name ILIKE $${paramIndex}`;
      filterParams.push(`%${filters.site_name}%`);
      paramIndex++;
    }

    if (filters?.location) {
      whereClause += ` AND location ILIKE $${paramIndex}`;
      filterParams.push(`%${filters.location}%`);
      paramIndex++;
    }

    if (filters?.status !== undefined && filters?.status !== '') {
      whereClause += ` AND is_active = $${paramIndex}`;
      filterParams.push(filters.status === 'true');
      paramIndex++;
    }

    const [dataRes, countRes] = await Promise.all([
      query(`
        SELECT * FROM sites 
        WHERE ${whereClause} 
        ORDER BY created_at DESC 
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `, [...filterParams, limit, offset]),
      query(`
        SELECT COUNT(*) FROM sites 
        WHERE ${whereClause}
      `, filterParams)
    ]);

    return {
      data: dataRes.rows,
      total: parseInt(countRes.rows[0].count, 10),
    };
  }

  async getAll(): Promise<SiteRow[]> {
    const res = await query('SELECT * FROM sites ORDER BY created_at DESC');
    return res.rows;
  }

  async getOptions(): Promise<{ id: string, site_name: string, location: string }[]> {
    const res = await query('SELECT id, site_name, location FROM sites ORDER BY site_name ASC');
    return res.rows;
  }

  async getById(id: string): Promise<SiteRow | null> {
    const res = await query('SELECT * FROM sites WHERE id = $1 LIMIT 1', [id]);
    return res.rows[0] || null;
  }

  async getByName(name: string): Promise<SiteRow | null> {
    const res = await query('SELECT * FROM sites WHERE site_name = $1 LIMIT 1', [name]);
    return res.rows[0] || null;
  }

  async create(siteName: string, location: string | null): Promise<SiteRow> {
    const res = await query(
      `INSERT INTO sites (site_name, location) VALUES ($1, $2) RETURNING *`,
      [siteName, location]
    );
    return res.rows[0];
  }

  async update(id: string, siteName: string, location: string | null, isActive: boolean): Promise<SiteRow> {
    const res = await query(
      `UPDATE sites 
       SET site_name = $1, location = $2, is_active = $3, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $4 RETURNING *`,
      [siteName, location, isActive, id]
    );
    return res.rows[0];
  }

  async delete(id: string): Promise<void> {
    await query('DELETE FROM sites WHERE id = $1', [id]);
  }
}
