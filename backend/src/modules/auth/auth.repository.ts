import { query } from '../../shared/database/db';
import { UserRow } from './auth.types';

export class AuthRepository {
  async getUserByEmail(email: string): Promise<UserRow | null> {
    const res = await query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
    return res.rows[0] || null;
  }

  async getUserById(id: string): Promise<UserRow | null> {
    const res = await query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
    return res.rows[0] || null;
  }

  async getAdmins(): Promise<UserRow[]> {
    const res = await query(`SELECT * FROM users WHERE role = 'admin' AND is_active = true`);
    return res.rows;
  }

  async createUser(data: Omit<UserRow, 'id' | 'is_active' | 'last_login' | 'created_at' | 'updated_at'>): Promise<UserRow> {
    const res = await query(
      `INSERT INTO users (first_name, last_name, email, password_hash, role) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [data.first_name, data.last_name, data.email, data.password_hash, data.role]
    );
    return res.rows[0];
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await query('UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [passwordHash, id]);
  }

  async updateLastLogin(id: string): Promise<void> {
    await query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [id]);
  }
}
